import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { TransactionInput } from "@/types";
import { useAsync } from "@/hooks/useAsync";
import * as transactionService from "@/services/transactionService";
import * as categoryService from "@/services/categoryService";
import { useToast } from "@/components/common/Toast";

import Card from "@/components/common/Card";
import LoadingState from "@/components/common/LoadingState";
import ErrorState from "@/components/common/ErrorState";
import TransactionForm from "@/components/transactions/TransactionForm";

/**
 * One page handles both "Add Transaction" (/transactions/new) and
 * "Edit Transaction" (/transactions/:id/edit) — the only difference is
 * whether `id` is present, which determines whether we fetch an existing
 * transaction and whether we call createTransaction or updateTransaction.
 */
export default function TransactionFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
    reload: reloadCategories,
  } = useAsync(
    () => categoryService.getCategories(),
    [],
  );
  const {
    data: existingTransaction,
    isLoading: transactionLoading,
    error,
    reload: reloadTransaction,
  } = useAsync(
    () =>
      isEditing
        ? transactionService.getTransaction(id!)
        : Promise.resolve(undefined),
    [id],
  );

  async function handleSubmit(input: TransactionInput) {
    setIsSubmitting(true);
    try {
      if (isEditing) {
        await transactionService.updateTransaction(id!, input);
        showToast("Transaction updated.");
      } else {
        await transactionService.createTransaction(input);
        showToast("Transaction added.");
      }
      navigate("/transactions");
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
        "error",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (categoriesLoading || transactionLoading) return <LoadingState />;
  if (categoriesError)
    return <ErrorState message={categoriesError} onRetry={reloadCategories} />;
  if (error) return <ErrorState message={error} onRetry={reloadTransaction} />;
  if (isEditing && !existingTransaction)
    return <ErrorState message="Transaction not found." />;

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          {isEditing ? "Edit Transaction" : "Add Transaction"}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {isEditing
            ? "Update the details below."
            : "Log a new income or expense."}
        </p>
      </div>

      <Card>
        <TransactionForm
          categories={categories ?? []}
          initialTransaction={existingTransaction ?? undefined}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/transactions")}
        />
      </Card>
    </div>
  );
}
