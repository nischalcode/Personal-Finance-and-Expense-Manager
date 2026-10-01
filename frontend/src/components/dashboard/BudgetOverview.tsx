import { Link } from "react-router-dom";
import type { BudgetWithProgress, Category } from "@/types";
import { formatCurrency } from "@/utils/currency";
import { getBudgetStatusStyles } from "@/utils/budgetCalculations";
import Card from "@/components/common/Card";
import EmptyState from "@/components/common/EmptyState";

interface BudgetOverviewProps {
  budgets: BudgetWithProgress[];
  categories: Category[];
}

/** Compact budget progress list shown on the dashboard (full detail lives on the Budgets page). */
export default function BudgetOverview({
  budgets,
  categories,
}: BudgetOverviewProps) {
  if (budgets.length === 0) {
    return (
      <Card title="Budget Progress">
        <EmptyState
          title="No budgets set"
          description="Create a budget to track your spending limits."
        />
      </Card>
    );
  }

  return (
    <Card
      title="Budget Progress"
      action={
        <Link
          to="/budgets"
          className="text-sm font-medium text-brand-600 hover:underline dark:text-brand-400"
        >
          View all
        </Link>
      }
    >
      <div className="space-y-4">
        {budgets.slice(0, 4).map((budget) => {
          const category = categories.find((c) => c.id === budget.categoryId);
          const styles = getBudgetStatusStyles(budget.status);
          return (
            <div key={budget.id}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {category?.name ?? "Unknown"}
                </span>
                <span className={styles.text}>
                  {formatCurrency(budget.spent)} /{" "}
                  {formatCurrency(budget.monthlyLimit)}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                <div
                  className={`h-full rounded-full ${styles.bar}`}
                  style={{ width: `${Math.min(budget.percentUsed, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
