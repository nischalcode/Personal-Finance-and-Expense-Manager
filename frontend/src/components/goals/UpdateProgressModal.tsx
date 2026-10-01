import { useState, type FormEvent } from "react";
import type { Goal } from "@/types";
import Modal from "@/components/common/Modal";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";

interface UpdateProgressModalProps {
  goal: Goal | null;
  isSubmitting: boolean;
  onSubmit: (newCurrentAmount: number) => void;
  onClose: () => void;
}

/**
 * Small modal for the "update progress" action on a goal card — just edits
 * currentAmount. The parent should render this with `key={goal?.id}` so
 * React remounts it (resetting the amount field) when a different goal
 * is opened.
 */
export default function UpdateProgressModal({
  goal,
  isSubmitting,
  onSubmit,
  onClose,
}: UpdateProgressModalProps) {
  const [amount, setAmount] = useState(goal ? String(goal.currentAmount) : "0");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const value = Number(amount);
    if (Number.isNaN(value) || value < 0) {
      setError("Enter a valid, non-negative amount.");
      return;
    }
    setError(null);
    onSubmit(value);
  }

  return (
    <Modal
      isOpen={!!goal}
      onClose={onClose}
      title={`Update progress: ${goal?.name ?? ""}`}
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Input
          label="Current amount saved"
          type="number"
          min="0"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          error={error ?? undefined}
        />
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
}
