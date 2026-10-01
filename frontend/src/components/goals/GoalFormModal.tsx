import { useState, type FormEvent } from "react";
import type { Goal, GoalInput } from "@/types";
import Modal from "@/components/common/Modal";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { validateGoalForm } from "@/utils/validation";

interface GoalFormModalProps {
  isOpen: boolean;
  initialGoal?: Goal;
  isSubmitting: boolean;
  onSubmit: (input: GoalInput) => void;
  onClose: () => void;
}

/** Add/Edit goal form (section 18 of the spec). */
export default function GoalFormModal({
  isOpen,
  initialGoal,
  isSubmitting,
  onSubmit,
  onClose,
}: GoalFormModalProps) {
  const [name, setName] = useState(initialGoal?.name ?? "");
  const [targetAmount, setTargetAmount] = useState(
    initialGoal ? String(initialGoal.targetAmount) : "",
  );
  const [currentAmount, setCurrentAmount] = useState(
    initialGoal ? String(initialGoal.currentAmount) : "0",
  );
  const [deadline, setDeadline] = useState(initialGoal?.deadline ?? "");
  const [description, setDescription] = useState(
    initialGoal?.description ?? "",
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validation = validateGoalForm({
      name,
      targetAmount,
      currentAmount,
      deadline,
    });
    setErrors(validation.errors);
    if (!validation.valid) return;

    onSubmit({
      name: name.trim(),
      targetAmount: Number(targetAmount),
      currentAmount: Number(currentAmount || 0),
      deadline,
      description: description.trim() || undefined,
    });
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialGoal ? "Edit Goal" : "Add Goal"}
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Input
          label="Goal name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          placeholder="e.g. Buy Laptop"
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Target amount"
            type="number"
            min="0"
            step="0.01"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            error={errors.targetAmount}
          />
          <Input
            label="Current amount"
            type="number"
            min="0"
            step="0.01"
            value={currentAmount}
            onChange={(e) => setCurrentAmount(e.target.value)}
            error={errors.currentAmount}
          />
        </div>
        <Input
          label="Deadline"
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          error={errors.deadline}
        />
        <div>
          <label
            htmlFor="goal-description"
            className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Description{" "}
            <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <textarea
            id="goal-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {initialGoal ? "Save changes" : "Create goal"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
