import { Pencil, Trash2 } from "lucide-react";
import type { BudgetWithProgress, Category } from "@/types";
import { formatCurrency } from "@/utils/currency";
import { getBudgetStatusStyles } from "@/utils/budgetCalculations";
import { getCategoryIcon } from "@/utils/icons";
import Card from "@/components/common/Card";
import Badge from "@/components/common/Badge";

interface BudgetCardProps {
  budget: BudgetWithProgress;
  category?: Category;
  onEdit: () => void;
  onDelete: () => void;
}

const STATUS_LABEL: Record<string, string> = {
  normal: "On track",
  approaching: "Approaching limit",
  exceeded: "Exceeded",
};

/** One budget card, shown on the Budgets page (section 17 of the spec). */
export default function BudgetCard({
  budget,
  category,
  onEdit,
  onDelete,
}: BudgetCardProps) {
  const Icon = getCategoryIcon(category?.icon);
  const styles = getBudgetStatusStyles(budget.status);
  const badgeColor =
    budget.status === "exceeded"
      ? "red"
      : budget.status === "approaching"
        ? "amber"
        : "green";

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{
              backgroundColor: `${category?.color ?? "#94a3b8"}22`,
              color: category?.color ?? "#94a3b8",
            }}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-gray-100">
              {category?.name ?? "Unknown"}
            </p>
            <Badge color={badgeColor}>{STATUS_LABEL[budget.status]}</Badge>
          </div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={onEdit}
            aria-label="Edit budget"
            className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            aria-label="Delete budget"
            className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
        <div
          className={`h-full rounded-full ${styles.bar}`}
          style={{ width: `${Math.min(budget.percentUsed, 100)}%` }}
        />
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-sm">
        <div>
          <p className="text-gray-500 dark:text-gray-400">Budget</p>
          <p className="font-semibold text-gray-800 dark:text-gray-200">
            {formatCurrency(budget.monthlyLimit)}
          </p>
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400">Spent</p>
          <p className={`font-semibold ${styles.text}`}>
            {formatCurrency(budget.spent)}
          </p>
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400">
            {budget.remaining >= 0 ? "Remaining" : "Over by"}
          </p>
          <p className="font-semibold text-gray-800 dark:text-gray-200">
            {formatCurrency(Math.abs(budget.remaining))}
          </p>
        </div>
      </div>
      <p className={`mt-2 text-right text-xs font-medium ${styles.text}`}>
        {budget.percentUsed}% used
      </p>
    </Card>
  );
}
