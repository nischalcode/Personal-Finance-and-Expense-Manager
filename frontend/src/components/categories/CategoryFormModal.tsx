import { useState, type FormEvent } from "react";
import type { Category, CategoryInput, CategoryKind } from "@/types";
import Modal from "@/components/common/Modal";
import Input from "@/components/common/Input";
import Select from "@/components/common/Select";
import Button from "@/components/common/Button";
import { AVAILABLE_CATEGORY_ICONS, getCategoryIcon } from "@/utils/icons";

const SWATCHES = [
  "#f97316",
  "#3b82f6",
  "#ec4899",
  "#eab308",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#6366f1",
  "#14b8a6",
  "#22a97b",
  "#0ea5e9",
  "#84cc16",
];

interface CategoryFormModalProps {
  isOpen: boolean;
  initialCategory?: Category; // present when editing
  isSubmitting: boolean;
  onSubmit: (input: CategoryInput) => void;
  onClose: () => void;
}

/** Add/Edit category form, shown inside a Modal (section 16 of the spec). */
export default function CategoryFormModal({
  isOpen,
  initialCategory,
  isSubmitting,
  onSubmit,
  onClose,
}: CategoryFormModalProps) {
  const [name, setName] = useState(initialCategory?.name ?? "");
  const [kind, setKind] = useState<CategoryKind>(
    initialCategory?.kind ?? "expense",
  );
  const [color, setColor] = useState(initialCategory?.color ?? SWATCHES[0]);
  const [icon, setIcon] = useState(
    initialCategory?.icon ?? AVAILABLE_CATEGORY_ICONS[0],
  );
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }
    setError(null);
    onSubmit({ name: name.trim(), kind, color, icon });
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialCategory ? "Edit Category" : "Add Category"}
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Input
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={error ?? undefined}
          placeholder="e.g. Subscriptions"
        />

        <Select
          label="Type"
          value={kind}
          onChange={(e) => setKind(e.target.value as CategoryKind)}
          options={[
            { value: "expense", label: "Expense" },
            { value: "income", label: "Income" },
          ]}
        />

        <div>
          <span className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Color
          </span>
          <div className="flex flex-wrap gap-2">
            {SWATCHES.map((swatch) => (
              <button
                key={swatch}
                type="button"
                aria-label={`Choose color ${swatch}`}
                onClick={() => setColor(swatch)}
                className={`h-7 w-7 rounded-full border-2 ${color === swatch ? "border-gray-900 dark:border-white" : "border-transparent"}`}
                style={{ backgroundColor: swatch }}
              />
            ))}
          </div>
        </div>

        <div>
          <span className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Icon
          </span>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_CATEGORY_ICONS.map((iconName) => {
              const Icon = getCategoryIcon(iconName);
              return (
                <button
                  key={iconName}
                  type="button"
                  aria-label={`Choose icon ${iconName}`}
                  onClick={() => setIcon(iconName)}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg border ${
                    icon === iconName
                      ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300"
                      : "border-gray-300 text-gray-500 dark:border-gray-700"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {initialCategory ? "Save changes" : "Add category"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
