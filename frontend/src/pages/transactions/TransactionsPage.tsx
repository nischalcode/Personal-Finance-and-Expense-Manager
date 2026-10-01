import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Plus } from "lucide-react";
import type { Transaction, TransactionFilters } from "@/types";
import { useAsync } from "@/hooks/useAsync";
import { useDebounce } from "@/hooks/useDebounce";
import * as transactionService from "@/services/transactionService";
import * as categoryService from "@/services/categoryService";
import { useToast } from "@/components/common/Toast";

import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import LoadingState from "@/components/common/LoadingState";
import ErrorState from "@/components/common/ErrorState";
import TransactionFiltersBar from "@/components/transactions/TransactionFilters";
import TransactionList from "@/components/transactions/TransactionList";
import TransactionPagination from "@/components/transactions/TransactionPagination";
import DeleteTransactionDialog from "@/components/transactions/DeleteTransactionDialog";

const PAGE_SIZE = 8;

export default function TransactionsPage() {
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();

  const [filters, setFilters] = useState<TransactionFilters>({
    search: searchParams.get("search") ?? "",
    type: "all",
    categoryId: "all",
    paymentMethod: "all",
    sortBy: "date",
    sortDirection: "desc",
    page: 1,
    pageSize: PAGE_SIZE,
  });
  const debouncedSearch = useDebounce(filters.search, 300);

  const [transactionToDelete, setTransactionToDelete] =
    useState<Transaction | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data, isLoading, error, reload } = useAsync(
    () =>
      transactionService.getTransactions({
        ...filters,
        search: debouncedSearch,
      }),
    [
      debouncedSearch,
      filters.type,
      filters.categoryId,
      filters.paymentMethod,
      filters.sortBy,
      filters.sortDirection,
      filters.startDate,
      filters.endDate,
      filters.page,
    ],
  );

  const { data: categories } = useAsync(
    () => categoryService.getCategories(),
    [],
  );

  async function handleConfirmDelete() {
    if (!transactionToDelete) return;
    setIsDeleting(true);
    try {
      await transactionService.deleteTransaction(transactionToDelete.id);
      showToast("Transaction deleted.");
      setTransactionToDelete(null);
      reload();
    } catch {
      showToast("Failed to delete transaction.", "error");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Transactions
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Track and manage your income and expenses.
          </p>
        </div>
        <Link to="/transactions/new">
          <Button icon={<Plus className="h-4 w-4" />}>Add transaction</Button>
        </Link>
      </div>

      <Card>
        <TransactionFiltersBar
          filters={filters}
          categories={categories ?? []}
          onChange={setFilters}
        />

        <div className="mt-5">
          {isLoading ? (
            <LoadingState label="Loading transactions..." />
          ) : error || !data ? (
            <ErrorState
              message={error ?? "Could not load transactions."}
              onRetry={reload}
            />
          ) : (
            <>
              <TransactionList
                transactions={data.items}
                categories={categories ?? []}
                onDeleteClick={setTransactionToDelete}
              />
              {data.total > 0 && (
                <div className="mt-4">
                  <TransactionPagination
                    page={data.page}
                    pageSize={data.pageSize}
                    total={data.total}
                    onPageChange={(page) =>
                      setFilters((prev) => ({ ...prev, page }))
                    }
                  />
                </div>
              )}
            </>
          )}
        </div>
      </Card>

      <DeleteTransactionDialog
        transaction={transactionToDelete}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setTransactionToDelete(null)}
      />
    </div>
  );
}
