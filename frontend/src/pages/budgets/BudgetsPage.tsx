import { useState } from "react";
import { Plus } from "lucide-react";
import type { Budget, BudgetInput } from "@/types";
import { useAsync } from "@/hooks/useAsync";
import * as budgetService from "@/services/budgetService";
import * as categoryService from "@/services/categoryService";
import * as transactionService from "@/services/transactionService";
import { calculateBudgetProgress } from "@/utils/budgetCalculations";
import { getCurrentMonthKey, getMonthLabel } from "@/utils/date";
import { useToast } from "@/components/common/Toast";

import Button from "@/components/common/Button";
import LoadingState from "@/components/common/LoadingState";
import ErrorState from "@/components/common/ErrorState";
import EmptyState from "@/components/common/EmptyState";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import BudgetCard from "@/components/budgets/BudgetCard";
import BudgetFormModal from "@/components/budgets/BudgetFormModal";
import { PiggyBank } from "lucide-react";

const currentMonth = getCurrentMonthKey();

export default function BudgetsPage() {
  const { showToast } = useToast();
  const { data, isLoading, error, reload } = useAsync(async () => {
    const [budgets, categories, transactions] = await Promise.all([
      budgetService.getBudgets(currentMonth),
      categoryService.getCategories(),
      transactionService.getAllTransactions(),
    ]);
    return { budgets, categories, transactions };
  }, []);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | undefined>(
    undefined,
  );
  const [budgetToDelete, setBudgetToDelete] = useState<Budget | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isLoading) return <LoadingState label="Loading budgets..." />;
  if (error || !data)
    return (
      <ErrorState
        message={error ?? "Could not load budgets."}
        onRetry={reload}
      />
    );

  const { budgets, categories, transactions } = data;
  const expenseCategories = categories.filter((c) => c.kind === "expense");
  // Only offer categories that don't already have a budget this month, unless editing.
  const availableCategories = expenseCategories.filter(
    (c) =>
      editingBudget?.categoryId === c.id ||
      !budgets.some((b) => b.categoryId === c.id),
  );
  const budgetsWithProgress = budgets.map((b) =>
    calculateBudgetProgress(b, transactions),
  );

  function openAddForm() {
    setEditingBudget(undefined);
    setIsFormOpen(true);
  }

  function openEditForm(budget: Budget) {
    setEditingBudget(budget);
    setIsFormOpen(true);
  }

  async function handleSubmit(input: BudgetInput) {
    setIsSubmitting(true);
    try {
      if (editingBudget) {
        await budgetService.updateBudget(editingBudget.id, input);
        showToast("Budget updated.");
      } else {
        await budgetService.createBudget(input);
        showToast("Budget created.");
      }
      setIsFormOpen(false);
      reload();
    } catch {
      showToast("Something went wrong. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleConfirmDelete() {
    if (!budgetToDelete) return;
    setIsSubmitting(true);
    try {
      await budgetService.deleteBudget(budgetToDelete.id);
      showToast("Budget deleted.");
      setBudgetToDelete(null);
      reload();
    } catch {
      showToast("Failed to delete budget.", "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Budgets
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Monthly spending limits for {getMonthLabel(currentMonth)}.
          </p>
        </div>
        <Button
          icon={<Plus className="h-4 w-4" />}
          onClick={openAddForm}
          disabled={availableCategories.length === 0}
        >
          Add budget
        </Button>
      </div>

      {budgetsWithProgress.length === 0 ? (
        <EmptyState
          icon={<PiggyBank className="h-10 w-10" />}
          title="No budgets created"
          description="Create a budget to start tracking your spending limits by category."
          action={
            <Button icon={<Plus className="h-4 w-4" />} onClick={openAddForm}>
              Add budget
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {budgetsWithProgress.map((budget) => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              category={categories.find((c) => c.id === budget.categoryId)}
              onEdit={() => openEditForm(budget)}
              onDelete={() => setBudgetToDelete(budget)}
            />
          ))}
        </div>
      )}

      <BudgetFormModal
        isOpen={isFormOpen}
        categories={availableCategories}
        initialBudget={editingBudget}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        onClose={() => setIsFormOpen(false)}
      />

      <ConfirmDialog
        isOpen={!!budgetToDelete}
        title="Delete budget?"
        message="This will remove this budget's spending limit for the month. This cannot be undone."
        isLoading={isSubmitting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setBudgetToDelete(null)}
      />
    </div>
  );
}
