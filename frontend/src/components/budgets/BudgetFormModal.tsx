import { useState, type FormEvent } from "react";
import type { Budget, BudgetInput, Category } from "@/types";
import Modal from "@/components/common/Modal";
import Input from "@/components/common/Input";
import Select from "@/components/common/Select";
import Button from "@/components/common/Button";
import { validateBudgetForm } from "@/utils/validation";
import { getCurrentMonthKey } from "@/utils/date";

interface BudgetFormModalProps {
  isOpen: boolean;
  categories: Category[]; // expense categories only, filtered by the caller
  initialBudget?: Budget;
  isSubmitting: boolean;
  onSubmit: (input: BudgetInput) => void;
  onClose: () => void;
}

/** Add/Edit budget form (section 17 of the spec). One budget = one category per month. */
export default function BudgetFormModal({
  isOpen,
  categories,
  initialBudget,
  isSubmitting,
  onSubmit,
  onClose,
}: BudgetFormModalProps) {
  const [categoryId, setCategoryId] = useState(initialBudget?.categoryId ?? "");
  const [monthlyLimit, setMonthlyLimit] = useState(
    initialBudget ? String(initialBudget.monthlyLimit) : "",
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validation = validateBudgetForm({ categoryId, monthlyLimit });
    setErrors(validation.errors);
    if (!validation.valid) return;

    onSubmit({
      categoryId,
      monthlyLimit: Number(monthlyLimit),
      month: initialBudget?.month ?? getCurrentMonthKey(),
    });
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialBudget ? "Edit Budget" : "Add Budget"}
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Select
          label="Category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          error={errors.categoryId}
          placeholder="Select a category"
          options={categories.map((c) => ({ value: c.id, label: c.name }))}
          disabled={!!initialBudget}
        />
        <Input
          label="Monthly Limit"
          type="number"
          min="0"
          step="0.01"
          value={monthlyLimit}
          onChange={(e) => setMonthlyLimit(e.target.value)}
          error={errors.monthlyLimit}
          placeholder="e.g. 10000"
        />
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {initialBudget ? "Save changes" : "Create budget"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
