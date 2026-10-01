import { useState } from "react";
import { Plus, Target } from "lucide-react";
import type { Goal, GoalInput, GoalWithProgress } from "@/types";
import { useAsync } from "@/hooks/useAsync";
import * as goalService from "@/services/goalService";
import { useToast } from "@/components/common/Toast";

import Button from "@/components/common/Button";
import LoadingState from "@/components/common/LoadingState";
import ErrorState from "@/components/common/ErrorState";
import EmptyState from "@/components/common/EmptyState";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import GoalCard from "@/components/goals/GoalCard";
import GoalFormModal from "@/components/goals/GoalFormModal";
import UpdateProgressModal from "@/components/goals/UpdateProgressModal";

/** Adds the derived percentComplete/remaining fields — kept out of the service layer, see budgetCalculations.ts for the equivalent pattern. */
function withProgress(goal: Goal): GoalWithProgress {
  const percentComplete =
    goal.targetAmount > 0
      ? Math.round((goal.currentAmount / goal.targetAmount) * 100)
      : 0;
  return {
    ...goal,
    percentComplete,
    remaining: goal.targetAmount - goal.currentAmount,
  };
}

export default function GoalsPage() {
  const {
    data: goals,
    isLoading,
    error,
    reload,
  } = useAsync(() => goalService.getGoals(), []);
  const { showToast } = useToast();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | undefined>(undefined);
  const [goalToDelete, setGoalToDelete] = useState<Goal | null>(null);
  const [goalToUpdate, setGoalToUpdate] = useState<Goal | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function openAddForm() {
    setEditingGoal(undefined);
    setIsFormOpen(true);
  }

  function openEditForm(goal: Goal) {
    setEditingGoal(goal);
    setIsFormOpen(true);
  }

  async function handleSubmit(input: GoalInput) {
    setIsSubmitting(true);
    try {
      if (editingGoal) {
        await goalService.updateGoal(editingGoal.id, input);
        showToast("Goal updated.");
      } else {
        await goalService.createGoal(input);
        showToast("Goal created.");
      }
      setIsFormOpen(false);
      reload();
    } catch {
      showToast("Something went wrong. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUpdateProgress(newCurrentAmount: number) {
    if (!goalToUpdate) return;
    setIsSubmitting(true);
    try {
      await goalService.updateGoal(goalToUpdate.id, {
        name: goalToUpdate.name,
        targetAmount: goalToUpdate.targetAmount,
        currentAmount: newCurrentAmount,
        deadline: goalToUpdate.deadline,
        description: goalToUpdate.description,
      });
      showToast("Progress updated.");
      setGoalToUpdate(null);
      reload();
    } catch {
      showToast("Failed to update progress.", "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleConfirmDelete() {
    if (!goalToDelete) return;
    setIsSubmitting(true);
    try {
      await goalService.deleteGoal(goalToDelete.id);
      showToast("Goal deleted.");
      setGoalToDelete(null);
      reload();
    } catch {
      showToast("Failed to delete goal.", "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) return <LoadingState label="Loading goals..." />;
  if (error || !goals)
    return (
      <ErrorState message={error ?? "Could not load goals."} onRetry={reload} />
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Goals
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Track your progress toward what matters to you.
          </p>
        </div>
        <Button icon={<Plus className="h-4 w-4" />} onClick={openAddForm}>
          Add goal
        </Button>
      </div>

      {goals.length === 0 ? (
        <EmptyState
          icon={<Target className="h-10 w-10" />}
          title="No goals yet"
          description="Set a savings goal to start tracking your progress."
          action={
            <Button icon={<Plus className="h-4 w-4" />} onClick={openAddForm}>
              Add goal
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={withProgress(goal)}
              onEdit={() => openEditForm(goal)}
              onDelete={() => setGoalToDelete(goal)}
              onUpdateProgress={() => setGoalToUpdate(goal)}
            />
          ))}
        </div>
      )}

      <GoalFormModal
        isOpen={isFormOpen}
        initialGoal={editingGoal}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        onClose={() => setIsFormOpen(false)}
      />

      <UpdateProgressModal
        key={goalToUpdate?.id}
        goal={goalToUpdate}
        isSubmitting={isSubmitting}
        onSubmit={handleUpdateProgress}
        onClose={() => setGoalToUpdate(null)}
      />

      <ConfirmDialog
        isOpen={!!goalToDelete}
        title="Delete goal?"
        message={
          goalToDelete
            ? `This will permanently delete "${goalToDelete.name}". This cannot be undone.`
            : ""
        }
        isLoading={isSubmitting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setGoalToDelete(null)}
      />
    </div>
  );
}
