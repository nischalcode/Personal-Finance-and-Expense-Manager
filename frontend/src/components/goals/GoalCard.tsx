import { Pencil, Trash2, Target } from "lucide-react";
import type { GoalWithProgress } from "@/types";
import { formatCurrency } from "@/utils/currency";
import { formatDate } from "@/utils/date";
import Card from "@/components/common/Card";

interface GoalCardProps {
  goal: GoalWithProgress;
  onEdit: () => void;
  onDelete: () => void;
  onUpdateProgress: () => void;
}

/** One savings goal card (section 18 of the spec). */
export default function GoalCard({
  goal,
  onEdit,
  onDelete,
  onUpdateProgress,
}: GoalCardProps) {
  const isComplete = goal.percentComplete >= 100;

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-gray-100">
              {goal.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Target date: {formatDate(goal.deadline)}
            </p>
          </div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={onEdit}
            aria-label={`Edit ${goal.name}`}
            className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            aria-label={`Delete ${goal.name}`}
            className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {goal.description && (
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
          {goal.description}
        </p>
      )}

      <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
        <div
          className={`h-full rounded-full ${isComplete ? "bg-brand-500" : "bg-brand-400"}`}
          style={{ width: `${Math.min(goal.percentComplete, 100)}%` }}
        />
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-sm">
        <div>
          <p className="text-gray-500 dark:text-gray-400">Target</p>
          <p className="font-semibold text-gray-800 dark:text-gray-200">
            {formatCurrency(goal.targetAmount)}
          </p>
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400">Current</p>
          <p className="font-semibold text-brand-600 dark:text-brand-400">
            {formatCurrency(goal.currentAmount)}
          </p>
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400">Remaining</p>
          <p className="font-semibold text-gray-800 dark:text-gray-200">
            {formatCurrency(Math.max(goal.remaining, 0))}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs font-medium text-brand-600 dark:text-brand-400">
          {goal.percentComplete}% complete
        </p>
        <button
          onClick={onUpdateProgress}
          className="text-xs font-medium text-brand-600 hover:underline dark:text-brand-400"
        >
          Update progress
        </button>
      </div>
    </Card>
  );
}
