# Frontend Architecture Guide

This document explains **how data moves through the app**, using one
complete example: adding a transaction. If you understand this one flow,
you understand the pattern used by every other feature (categories,
budgets, goals, notifications).

## The layers, top to bottom

```
Page              (src/pages/**)
  → Components     (src/components/**)
    → Hook          (src/hooks/useAsync.ts)
      → Service       (src/services/**)
        → Mock data OR future API   (src/data/mockData.ts | src/services/api.ts)
```

Each arrow is a one-way dependency: a page can import components and
services; a component can be used by a page; a service never imports a
component or a page. This keeps the "backend" swap (mock → real API)
isolated to the services layer.

---

## Worked example: "Add a transaction"

### 1. The user clicks "Add transaction"

`TransactionsPage.tsx` renders a `<Link to="/transactions/new">`. React
Router (configured in `src/routes/AppRoutes.tsx`) matches that URL to
`TransactionFormPage.tsx`.

### 2. TransactionFormPage loads what it needs

```tsx
// src/pages/transactions/TransactionFormPage.tsx
const { data: categories } = useAsync(
  () => categoryService.getCategories(),
  [],
);
```

`useAsync` (src/hooks/useAsync.ts) is a small hook that runs an async
function, and tracks `data` / `isLoading` / `error` for you. Every
data-fetching page in this app uses it the same way — that's why there's
only one custom hook for this instead of a different pattern per page.

### 3. The form renders

`TransactionFormPage` passes `categories` into `<TransactionForm />`
(src/components/transactions/TransactionForm.tsx). This component is
pure UI + local `useState` for each field — it doesn't know or care
whether categories came from mock data or a real API.

### 4. The user submits

`TransactionForm` validates with `validateTransactionForm()`
(src/utils/validation.ts) and, if valid, calls the `onSubmit` prop it
was given — it doesn't call any service directly. That callback lives in
`TransactionFormPage`:

```tsx
async function handleSubmit(input: TransactionInput) {
  await transactionService.createTransaction(input);
  navigate("/transactions");
}
```

### 5. The service decides: mock or real

```ts
// src/services/transactionService.ts
export async function createTransaction(input: TransactionInput) {
  if (USE_MOCK_DATA) {
    // push into the in-memory mockStore array and return it
  }
  return apiRequest("/transactions", { method: "POST", body: input }); // future POST /api/transactions
}
```

`USE_MOCK_DATA` comes from `src/services/api.ts`, driven by the
`VITE_USE_MOCK_DATA` environment variable. **This is the only file that
needs to change behavior** when a real backend is connected — the mock
branch simply stops being taken once `VITE_USE_MOCK_DATA=false`.

### 6. Back on the transactions list

`navigate('/transactions')` sends the user back, `TransactionsPage`
re-fetches via `useAsync`, and the new transaction shows up.

---

## Why it's built this way

- **Pages never import mock data.** Only `services/**` files import from
  `src/data/mockData.ts`. This means deleting `mockData.ts` and flipping
  `VITE_USE_MOCK_DATA=false` is the _entire_ migration to a real backend
  — no page or component needs to be touched.
- **Components don't fetch data** (except `Navbar.tsx`, for the
  notification bell — a deliberate small exception since it needs live
  data everywhere it renders). Every other component receives data as
  props. This makes components easy to test and reuse.
- **One hook, not ten.** `useAsync` covers "fetch on mount, track
  loading/error, allow reload" for every page. We didn't build
  `useTransactions()`, `useBudgets()`, etc. as separate hooks — that
  would be one more layer of indirection for the same behavior.
- **Validation lives in `utils/validation.ts`, not inside components.**
  So `TransactionForm.tsx` (the UI) and `validateTransactionForm()` (the
  rules) can be read and changed independently.
- **Derived numbers (budget %, goal %) are computed, not stored.** See
  `src/utils/budgetCalculations.ts` — a `Budget` record only stores the
  limit; "how much spent / remaining / % used" is calculated from
  transactions at render time. This avoids the bug class where a stored
  "amount spent" field silently goes stale.

---

## Where to look for each concern

| I want to...                                    | Look at                                                       |
| ----------------------------------------------- | ------------------------------------------------------------- |
| Change what a page shows                        | `src/pages/**`                                                |
| Change how something looks                      | `src/components/**`                                           |
| Change validation rules                         | `src/utils/validation.ts`                                     |
| Change currency/date formatting                 | `src/utils/currency.ts`, `src/utils/date.ts`                  |
| Change budget "exceeded/approaching" thresholds | `src/utils/budgetCalculations.ts`                             |
| Add a field to a domain object                  | `src/types/**`, then the matching mock data + form            |
| Change mock data                                | `src/data/mockData.ts`                                        |
| Point the app at a real backend                 | `.env` (`VITE_USE_MOCK_DATA=false`, `VITE_API_URL=...`)       |
| Change how a request is authenticated           | `src/services/api.ts` (`apiRequest`)                          |
| Change what happens on login/logout             | `src/contexts/AuthContext.tsx`, `src/services/authService.ts` |
