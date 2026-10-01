# ExpenseWise — Personal Finance & Expense Manager (Frontend)

A frontend-only Personal Finance & Expense Management System, built with
React + TypeScript + Vite + Tailwind CSS. This repository contains **only
the frontend** — there is no backend yet. It's designed to be plugged into
a separate Express + MongoDB REST API later without restructuring the app.

> **Status:** UI is complete and fully functional against realistic mock
> data. Authentication is a mock layer (see [Environment variables](#environment-variables)
> below) — there is no real password hashing or JWT verification yet.
> Financial data shown is fake, generated in `src/data/mockData.ts`.

---

## 1. Project purpose

This app helps a user track income and expenses, organize spending into
categories, set monthly budgets, work toward savings goals, and review
reports/analytics — similar to apps like Mint or YNAB, scoped down to a
learning-sized project.

## 2. Technology stack

| Layer          | Choice                                                                |
| -------------- | --------------------------------------------------------------------- |
| Framework      | React 18 + TypeScript                                                 |
| Build tool     | Vite                                                                  |
| Routing        | React Router v6                                                       |
| Styling        | Tailwind CSS (with a `dark:` class-based dark mode)                   |
| Icons          | lucide-react                                                          |
| Charts         | Recharts                                                              |
| State          | React Context (`AuthContext`, `ThemeContext`) + local component state |
| Data (for now) | Mock data in `src/data/mockData.ts`, served through a service layer   |

No Next.js, no backend-as-a-service (Firebase/Supabase/Appwrite), no
GraphQL, no state management library (Redux/Zustand) — deliberately, to
keep the codebase small and easy to reason about end-to-end.

## 3. Folder structure

```
frontend/
├── src/
│   ├── components/     # Reusable UI, grouped by feature area
│   │   ├── common/     # Button, Input, Modal, Card, Toast, etc. — used everywhere
│   │   ├── layout/     # Sidebar, Navbar, MainLayout
│   │   ├── dashboard/  # Dashboard-only components (charts, summary cards)
│   │   ├── transactions/
│   │   ├── categories/
│   │   ├── budgets/
│   │   ├── goals/
│   │   ├── analytics/  # Reports page components
│   │   └── notifications/
│   ├── pages/           # One folder per route area; each file = one screen
│   ├── services/        # ALL data access goes through here (see section 9)
│   ├── contexts/        # AuthContext, ThemeContext
│   ├── hooks/            # useAsync, useDebounce — the only custom hooks
│   ├── routes/           # AppRoutes.tsx (the site map), ProtectedRoute.tsx
│   ├── types/             # TypeScript interfaces, one file per domain
│   ├── utils/              # currency/date formatting, validation, budget math
│   ├── data/                # mockData.ts — the ONLY place fake data lives
│   ├── App.tsx
│   └── main.tsx
├── docs/
│   └── FRONTEND-GUIDE.md   # Deeper architecture walkthrough with a worked example
├── .env.example
└── package.json
```

## 4. How React Router works here

`src/routes/AppRoutes.tsx` is the single place listing every URL in the
app (the "site map"). It uses `<Routes>` and `<Route>` from
`react-router-dom`. Public pages (landing, login, register, forgot/reset
password) render on their own. Every other page is nested inside one
`<Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>`, so
they all automatically get the sidebar/navbar and require login.

- `ProtectedRoute.tsx` redirects to `/login` if nobody is logged in.
- `PublicOnlyRoute` (same file) redirects logged-in users away from
  `/login` and `/register` to `/dashboard`.

## 5. How pages work

Each file in `src/pages/**` is one screen, matched 1:1 to a route in
`AppRoutes.tsx`. A page's job is to:

1. Fetch whatever data it needs, using `useAsync` + a service function.
2. Handle loading/error/empty states.
3. Render feature components, passing them data and callbacks.

Pages don't contain markup for buttons/cards/modals themselves — they
compose components from `src/components/**`.

## 6. How components work

Split into two kinds:

- **`components/common/`** — generic, reusable, no domain knowledge
  (`Button`, `Input`, `Modal`, `Card`, `Badge`, `Toast`, etc.). These
  don't import from `services/` or `types/` beyond generic shapes.
- **Feature folders** (`components/transactions/`, `components/budgets/`,
  etc.) — components specific to one part of the app, e.g.
  `TransactionForm.tsx`, `BudgetCard.tsx`. These _can_ import types like
  `Transaction` or `Budget`, but still receive their data as props from a
  page — they don't call services directly (with the small exception of
  `Navbar.tsx`, which fetches notification counts for the bell icon).

## 7. How state works

- **Server-ish data** (transactions, categories, budgets, goals,
  analytics, notifications): fetched via `useAsync` in each page. No
  global cache — every page fetches what it needs when it mounts. This
  keeps the mental model simple: "this page's data = what the service
  returned when the page loaded," at the cost of re-fetching when you
  navigate back to a page. That's a fine trade-off at this project's
  size.
- **Auth state**: `AuthContext` (`src/contexts/AuthContext.tsx`) — who's
  logged in, available everywhere via `useAuth()`.
- **Theme**: `ThemeContext` (`src/contexts/ThemeContext.tsx`) — light/
  dark/system, persisted to `localStorage`.
- **Form state**: plain `useState` in each form component. No form
  library — see `TransactionForm.tsx` for the pattern used everywhere.

## 8. How mock data works

All fake data lives in **one file**: `src/data/mockData.ts`. It exports
arrays like `mockTransactions`, `mockCategories`, `mockBudgets`, etc.

Nothing outside `src/services/**` imports from `mockData.ts` directly.
Services keep an in-memory copy (e.g. `let mockStore = [...mockTransactions]`)
and mutate that copy on create/update/delete, so the app feels real
within a browser session — it resets on page reload, which is expected
for mock mode.

## 9. How API services work

Every domain has one file in `src/services/`:

```
authService.ts          transactionService.ts     categoryService.ts
budgetService.ts         goalService.ts             analyticsService.ts
notificationService.ts
```

Each exported function (e.g. `getTransactions()`, `createTransaction()`)
has **one job** and an **if/else on `USE_MOCK_DATA`** (from `services/api.ts`):

```ts
export async function getTransactions(filters) {
  if (USE_MOCK_DATA) {
    // read/filter/paginate the in-memory mock array
  }
  return apiRequest("/transactions?..."); // real backend call
}
```

Pages and components only ever call these functions — never `fetch()`,
never `axios`, never `mockData.ts` directly. This is the seam where mock
data becomes a real backend later (see section 10).

## 10. How the future backend will connect

1. Build the Express/MongoDB API described in the "Future API contract"
   the project was scoped against (`POST /api/auth/login`,
   `GET /api/transactions`, etc.).
2. Set `VITE_USE_MOCK_DATA=false` and `VITE_API_URL=http://localhost:9007/api`
   in `.env` (copy from `.env.example`).
3. That's it — every service function's `else` branch (the
   `apiRequest(...)` call) starts being used instead of the mock branch.
   **No page or component needs to change**, because they only ever
   talked to the service functions, not to mock data or `fetch` directly.

See `src/services/api.ts` for the shared `apiRequest()` helper (adds the
JWT `Authorization` header, handles errors) and `docs/FRONTEND-GUIDE.md`
for a full worked example.

## 11. Environment variables

Copy `.env.example` to `.env`:

```
VITE_USE_MOCK_DATA=true
VITE_API_URL=http://localhost:9007/api
```

- `VITE_USE_MOCK_DATA` — `true` (default) uses `src/data/mockData.ts`
  through the service layer. Set to `false` once your Express backend is
  running.
- `VITE_API_URL` — base URL of that backend. Only used when
  `VITE_USE_MOCK_DATA=false`.

**Never** put secrets here (JWT secret, DB password, etc.) — anything in
a `VITE_*` variable is bundled into the browser JS and is public. Those
belong only on the backend.

## 12. How to run

```bash
cd frontend
npm install
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`). Log in
with **any** email/password — auth is mocked (see section 7 of the spec
notes / section 32 "Security boundary" below).

## 13. How to build

```bash
npm run build      # type-checks with tsc, then builds with Vite -> dist/
npm run preview    # serve the production build locally
```

## 14. How to add a new page

1. Create `src/pages/<area>/MyNewPage.tsx`.
2. Add a `<Route path="/my-new-page" element={<MyNewPage />} />` inside
   `AppRoutes.tsx` (inside the protected `<Route>` block if it needs
   login).
3. If it should appear in navigation, add an entry to `NAV_ITEMS` in
   `src/components/layout/Sidebar.tsx`.

## 15. How to add a new component

Decide where it belongs:

- Generic, no domain knowledge → `src/components/common/`.
- Specific to one feature → that feature's folder, e.g.
  `src/components/budgets/`.

Keep it a plain function component with an explicit `Props` interface —
see any existing component for the pattern.

## 16. How to add a new API service

1. Add a type in `src/types/` if needed.
2. Create `src/services/myThingService.ts`, following the pattern in
   `categoryService.ts` (simplest example): mock branch + `apiRequest`
   branch for each function.
3. Add mock data to `src/data/mockData.ts` if the mock branch needs it.
4. Call it from a page via `useAsync`.

## 17. How to modify transaction fields

1. Update `Transaction` and `TransactionInput` in `src/types/transaction.ts`.
2. Update `src/utils/validation.ts` → `validateTransactionForm` if the
   new field needs validation.
3. Add the field to `TransactionForm.tsx` (the form UI).
4. Add it to `mockTransactions` in `src/data/mockData.ts` and to display
   in `TransactionTable.tsx` / `TransactionCard.tsx` if it should be
   visible in the list.

## 18. How to modify dashboard cards

The four top cards are rendered by `SummaryCard.tsx`, driven by
`DashboardSummary` (see `src/types/analytics.ts`), which comes from
`analyticsService.getDashboardSummary()`. To change what a card shows,
edit that type + the calculation in `analyticsService.ts`, then update
`DashboardPage.tsx` where the `<SummaryCard />` elements are rendered.

## 19. How to add a new feature (general pattern)

1. **Type** — define it in `src/types/`.
2. **Mock data** — add sample records to `src/data/mockData.ts`.
3. **Service** — add a service file with mock + real branches.
4. **Components** — build the UI pieces in a new `src/components/<feature>/` folder.
5. **Page** — compose them in `src/pages/<feature>/`.
6. **Route** — register it in `AppRoutes.tsx` (and `Sidebar.tsx` if it's
   a main nav item).

---

## Notes on the current state

- **Backend is separate.** This repo intentionally contains no Express/
  MongoDB code. See section 10 above for how to connect one later.
- **Authentication is mock until a backend exists.** Any email/password
  "logs in" successfully in mock mode — there is no real verification.
  Don't treat this as a secure login system.
- **Financial data is mock** until `VITE_USE_MOCK_DATA=false` and a real
  API is connected.
- This project is **not** production-ready just because the UI is
  polished — it still needs a real backend, real auth, and a security
  review before handling real financial data.

For a deeper architectural walkthrough (with one feature traced end to
end), see [`docs/FRONTEND-GUIDE.md`](./docs/FRONTEND-GUIDE.md).
