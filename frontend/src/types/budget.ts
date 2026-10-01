export type BudgetStatus = "normal" | "approaching" | "exceeded";

export interface Budget {
  id: string;
  categoryId: string;
  monthlyLimit: number;
  month: string; // "YYYY-MM" — which month this budget applies to
}

export interface BudgetInput {
  categoryId: string;
  monthlyLimit: number;
  month: string;
}

// Computed at render time (see src/utils/budgetCalculations.ts) by combining
// a Budget with the transactions in that category/month. Never stored as-is.
export interface BudgetWithProgress extends Budget {
  spent: number;
  remaining: number;
  percentUsed: number;
  status: BudgetStatus;
}
