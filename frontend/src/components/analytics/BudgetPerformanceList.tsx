import type { BudgetWithProgress, Category } from "@/types";
import { formatCurrency } from "@/utils/currency";
import { getBudgetStatusStyles } from "@/utils/budgetCalculations";
import Card from "@/components/common/Card";
import Badge from "@/components/common/Badge";
import EmptyState from "@/components/common/EmptyState";

interface BudgetPerformanceListProps {
  budgets: BudgetWithProgress[];
  categories: Category[];
}

const STATUS_LABEL: Record<string, string> = {
  normal: "On track",
  approaching: "Approaching",
  exceeded: "Exceeded",
};

/** Budget performance table on the Reports page (section 19 of the spec). */
export default function BudgetPerformanceList({
  budgets,
  categories,
}: BudgetPerformanceListProps) {
  if (budgets.length === 0) {
    return (
      <Card title="Budget Performance">
        <EmptyState title="No budgets this period" />
      </Card>
    );
  }

  return (
    <Card title="Budget Performance">
      <div className="space-y-3">
        {budgets.map((budget) => {
          const category = categories.find((c) => c.id === budget.categoryId);
          const styles = getBudgetStatusStyles(budget.status);
          const badgeColor =
            budget.status === "exceeded"
              ? "red"
              : budget.status === "approaching"
                ? "amber"
                : "green";
          return (
            <div
              key={budget.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 p-3 dark:border-gray-800"
            >
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {category?.name ?? "Unknown"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatCurrency(budget.spent)} of{" "}
                  {formatCurrency(budget.monthlyLimit)}
                </p>
              </div>
              <Badge color={badgeColor}>{STATUS_LABEL[budget.status]}</Badge>
              <span
                className={`w-12 text-right text-sm font-semibold ${styles.text}`}
              >
                {budget.percentUsed}%
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
