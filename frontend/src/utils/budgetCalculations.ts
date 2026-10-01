import type {
  Budget,
  BudgetWithProgress,
  BudgetStatus,
  Transaction,
} from "@/types";

/**
 * Turns a raw Budget into a BudgetWithProgress by combining it with the
 * relevant transactions. Kept out of the UI so BudgetCard.tsx and the
 * Budgets page don't duplicate this math.
 */
export function calculateBudgetProgress(
  budget: Budget,
  transactions: Transaction[],
): BudgetWithProgress {
  const spent = transactions
    .filter(
      (t) =>
        t.type === "expense" &&
        t.categoryId === budget.categoryId &&
        t.date.startsWith(budget.month),
    )
    .reduce((sum, t) => sum + t.amount, 0);

  const remaining = budget.monthlyLimit - spent;
  const percentUsed =
    budget.monthlyLimit > 0
      ? Math.round((spent / budget.monthlyLimit) * 100)
      : 0;

  return {
    ...budget,
    spent,
    remaining,
    percentUsed,
    status: getBudgetStatus(percentUsed),
  };
}

export function getBudgetStatus(percentUsed: number): BudgetStatus {
  if (percentUsed >= 100) return "exceeded";
  if (percentUsed >= 80) return "approaching";
  return "normal";
}

/** Tailwind classes for each status, kept in one place so colors stay consistent. */
export function getBudgetStatusStyles(status: BudgetStatus): {
  bar: string;
  text: string;
  badge: string;
} {
  switch (status) {
    case "exceeded":
      return {
        bar: "bg-red-500",
        text: "text-red-600 dark:text-red-400",
        badge: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
      };
    case "approaching":
      return {
        bar: "bg-amber-500",
        text: "text-amber-600 dark:text-amber-400",
        badge:
          "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
      };
    case "normal":
    default:
      return {
        bar: "bg-brand-500",
        text: "text-brand-600 dark:text-brand-400",
        badge:
          "bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300",
      };
  }
}
