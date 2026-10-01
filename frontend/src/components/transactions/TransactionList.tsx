import type { Transaction, Category } from "@/types";
import TransactionTable from "./TransactionTable";
import TransactionCard from "./TransactionCard";
import EmptyState from "@/components/common/EmptyState";
import { ArrowLeftRight } from "lucide-react";

interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
  onDeleteClick: (transaction: Transaction) => void;
}

/**
 * Combines the desktop table and mobile card layouts. Only one renders at
 * a time via Tailwind's `sm:` breakpoint (see TransactionTable/TransactionCard).
 */
export default function TransactionList({
  transactions,
  categories,
  onDeleteClick,
}: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <EmptyState
        icon={<ArrowLeftRight className="h-10 w-10" />}
        title="No transactions found"
        description="Try adjusting your filters, or add a new transaction."
      />
    );
  }

  return (
    <>
      <TransactionTable
        transactions={transactions}
        categories={categories}
        onDeleteClick={onDeleteClick}
      />
      <div className="sm:hidden">
        {transactions.map((t) => (
          <TransactionCard
            key={t.id}
            transaction={t}
            category={categories.find((c) => c.id === t.categoryId)}
            onDeleteClick={onDeleteClick}
          />
        ))}
      </div>
    </>
  );
}
