/**
 * budgetService.ts
 *
 * Future backend endpoints:
 *   GET    /api/budgets
 *   POST   /api/budgets
 *   PUT    /api/budgets/:id
 *   DELETE /api/budgets/:id
 *
 * Note: this service only returns raw Budget records. Combining a budget
 * with "how much has actually been spent" happens in
 * src/utils/budgetCalculations.ts, using data from transactionService —
 * that calculation isn't something a REST endpoint needs to own.
 */
import type { Budget, BudgetInput } from "@/types";
import { mockBudgets } from "@/data/mockData";
import { apiRequest, USE_MOCK_DATA, mockDelay } from "./api";

let mockStore: Budget[] = [...mockBudgets];

export async function getBudgets(month?: string): Promise<Budget[]> {
  if (USE_MOCK_DATA) {
    await mockDelay();
    return month ? mockStore.filter((b) => b.month === month) : [...mockStore];
  }
  const query = month ? `?month=${month}` : "";
  return apiRequest<Budget[]>(`/budgets${query}`);
}

export async function createBudget(input: BudgetInput): Promise<Budget> {
  if (USE_MOCK_DATA) {
    await mockDelay();
    const newBudget: Budget = { ...input, id: `bud-${Date.now()}` };
    mockStore = [...mockStore, newBudget];
    return newBudget;
  }
  return apiRequest<Budget>("/budgets", { method: "POST", body: input });
}

export async function updateBudget(
  id: string,
  input: BudgetInput,
): Promise<Budget> {
  if (USE_MOCK_DATA) {
    await mockDelay();
    const index = mockStore.findIndex((b) => b.id === id);
    if (index === -1) throw new Error("Budget not found.");
    const updated: Budget = { ...mockStore[index], ...input };
    mockStore[index] = updated;
    return updated;
  }
  return apiRequest<Budget>(`/budgets/${id}`, { method: "PUT", body: input });
}

export async function deleteBudget(id: string): Promise<void> {
  if (USE_MOCK_DATA) {
    await mockDelay();
    mockStore = mockStore.filter((b) => b.id !== id);
    return;
  }
  await apiRequest<void>(`/budgets/${id}`, { method: "DELETE" });
}
