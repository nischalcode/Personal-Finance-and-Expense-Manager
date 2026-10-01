import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import type { Transaction, Category } from "@/types";
import { formatSignedCurrency } from "@/utils/currency";
import { formatDate } from "@/utils/date";
import { getCategoryIcon } from "@/utils/icons";
import Badge from "@/components/common/Badge";

interface TransactionCardProps {
  transaction: Transaction;
  category?: Category;
  onDeleteClick: (transaction: Transaction) => void;
}

/** Mobile card view of a single transaction (section 14: "Mobile: Use transaction cards"). */
export default function TransactionCard({
  transaction,
  category,
  onDeleteClick,
}: TransactionCardProps) {
  const Icon = getCategoryIcon(category?.icon);

  return (
    <div className="flex items-start justify-between gap-3 border-b border-gray-100 py-3 last:border-0 dark:border-gray-800">
      <div className="flex min-w-0 items-center gap-3">
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
            {transaction.title}
          </p>
          <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <span>{category?.name ?? "Uncategorized"}</span>
            <span>&middot;</span>
            <span>{formatDate(transaction.date)}</span>
            <Badge color="gray">{transaction.paymentMethod}</Badge>
          </div>
        </div>
      </div>
      <div className="shrink-0 text-right">
        <p
          className={`text-sm font-semibold ${transaction.type === "income" ? "text-brand-600 dark:text-brand-400" : "text-gray-800 dark:text-gray-200"}`}
        >
          {formatSignedCurrency(transaction.amount, transaction.type)}
        </p>
        <div className="mt-1 flex justify-end gap-1">
          <Link
            to={`/transactions/${transaction.id}/edit`}
            aria-label={`Edit ${transaction.title}`}
            className="rounded-md p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Link>
          <button
            onClick={() => onDeleteClick(transaction)}
            aria-label={`Delete ${transaction.title}`}
            className="rounded-md p-1 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
