import { Link } from "react-router-dom";
import type { Transaction, Category } from "@/types";
import { formatSignedCurrency } from "@/utils/currency";
import { formatRelativeDate } from "@/utils/date";
import Card from "@/components/common/Card";
import EmptyState from "@/components/common/EmptyState";
import { getCategoryIcon } from "@/utils/icons";

interface RecentTransactionsProps {
  transactions: Transaction[];
  categories: Category[];
}

/** Recent transactions list on the dashboard (section 13 of the spec). */
export default function RecentTransactions({
  transactions,
  categories,
}: RecentTransactionsProps) {
  return (
    <Card
      title="Recent Transactions"
      action={
        <Link
          to="/transactions"
          className="text-sm font-medium text-brand-600 hover:underline dark:text-brand-400"
        >
          View all transactions
        </Link>
      }
    >
      {transactions.length === 0 ? (
        <EmptyState
          title="No transactions yet"
          description="Add your first transaction to get started."
        />
      ) : (
        <ul className="divide-y divide-gray-100 dark:divide-gray-800">
          {transactions.map((t) => {
            const category = categories.find((c) => c.id === t.categoryId);
            const Icon = getCategoryIcon(category?.icon);
            return (
              <li
                key={t.id}
                className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                    style={{
                      backgroundColor: `${category?.color ?? "#94a3b8"}22`,
                      color: category?.color ?? "#94a3b8",
                    }}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-800 dark:text-gray-200">
                      {t.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {category?.name ?? "Uncategorized"}
                    </p>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p
                    className={`text-sm font-semibold ${t.type === "income" ? "text-brand-600 dark:text-brand-400" : "text-gray-800 dark:text-gray-200"}`}
                  >
                    {formatSignedCurrency(t.amount, t.type)}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {formatRelativeDate(t.date)}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
