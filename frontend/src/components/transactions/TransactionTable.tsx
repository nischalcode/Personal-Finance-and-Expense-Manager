import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import type { Transaction, Category } from "@/types";
import { formatSignedCurrency } from "@/utils/currency";
import { formatDate } from "@/utils/date";
import { getCategoryIcon } from "@/utils/icons";
import Badge from "@/components/common/Badge";

interface TransactionTableProps {
  transactions: Transaction[];
  categories: Category[];
  onDeleteClick: (transaction: Transaction) => void;
}

/** Desktop table view of transactions (section 14: "Desktop: Use a table"). */
export default function TransactionTable({
  transactions,
  categories,
  onDeleteClick,
}: TransactionTableProps) {
  return (
    <div className="hidden overflow-x-auto scrollbar-thin sm:block">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-gray-500 dark:border-gray-800 dark:text-gray-400">
            <th className="whitespace-nowrap py-2.5 pr-4 font-medium">Title</th>
            <th className="whitespace-nowrap py-2.5 pr-4 font-medium">
              Category
            </th>
            <th className="whitespace-nowrap py-2.5 pr-4 font-medium">Date</th>
            <th className="whitespace-nowrap py-2.5 pr-4 font-medium">
              Payment
            </th>
            <th className="whitespace-nowrap py-2.5 pr-4 text-right font-medium">
              Amount
            </th>
            <th className="whitespace-nowrap py-2.5 pl-4 text-right font-medium">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {transactions.map((t) => {
            const category = categories.find((c) => c.id === t.categoryId);
            const Icon = getCategoryIcon(category?.icon);
            return (
              <tr key={t.id} className="text-gray-700 dark:text-gray-300">
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                      style={{
                        backgroundColor: `${category?.color ?? "#94a3b8"}22`,
                        color: category?.color ?? "#94a3b8",
                      }}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {t.title}
                    </span>
                  </div>
                </td>
                <td className="py-3 pr-4">
                  {category?.name ?? "Uncategorized"}
                </td>
                <td className="py-3 pr-4 whitespace-nowrap">
                  {formatDate(t.date)}
                </td>
                <td className="py-3 pr-4">
                  <Badge color="gray">{t.paymentMethod}</Badge>
                </td>
                <td
                  className={`py-3 pr-4 text-right font-semibold whitespace-nowrap ${t.type === "income" ? "text-brand-600 dark:text-brand-400" : "text-gray-800 dark:text-gray-200"}`}
                >
                  {formatSignedCurrency(t.amount, t.type)}
                </td>
                <td className="py-3 pl-4">
                  <div className="flex justify-end gap-1">
                    <Link
                      to={`/transactions/${t.id}/edit`}
                      aria-label={`Edit ${t.title}`}
                      className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => onDeleteClick(t)}
                      aria-label={`Delete ${t.title}`}
                      className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
