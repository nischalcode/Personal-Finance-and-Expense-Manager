import { Pencil, Trash2, Lock } from "lucide-react";
import type { Category } from "@/types";
import { getCategoryIcon } from "@/utils/icons";
import EmptyState from "@/components/common/EmptyState";

interface CategoryListProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

/** Grid of category cards, split into Expense/Income sections. */
export default function CategoryList({
  categories,
  onEdit,
  onDelete,
}: CategoryListProps) {
  if (categories.length === 0) {
    return (
      <EmptyState
        title="No categories yet"
        description="Add a category to start organizing your transactions."
      />
    );
  }

  const expenseCategories = categories.filter((c) => c.kind === "expense");
  const incomeCategories = categories.filter((c) => c.kind === "income");

  return (
    <div className="space-y-8">
      <CategoryGroup
        title="Expense Categories"
        categories={expenseCategories}
        onEdit={onEdit}
        onDelete={onDelete}
      />
      <CategoryGroup
        title="Income Categories"
        categories={incomeCategories}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
}

function CategoryGroup({
  title,
  categories,
  onEdit,
  onDelete,
}: {
  title: string;
  categories: Category[];
  onEdit: (c: Category) => void;
  onDelete: (c: Category) => void;
}) {
  if (categories.length === 0) return null;
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-gray-500 dark:text-gray-400">
        {title}
      </h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {categories.map((category) => {
          const Icon = getCategoryIcon(category.icon);
          return (
            <div
              key={category.id}
              className="flex items-center justify-between gap-2 rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: `${category.color}22`,
                    color: category.color,
                  }}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <span className="truncate text-sm font-medium text-gray-800 dark:text-gray-200">
                  {category.name}
                </span>
              </div>
              {category.isDefault ? (
                <Lock
                  className="h-3.5 w-3.5 shrink-0 text-gray-300 dark:text-gray-600"
                  aria-label="Default category"
                />
              ) : (
                <div className="flex shrink-0 gap-0.5">
                  <button
                    onClick={() => onEdit(category)}
                    aria-label={`Edit ${category.name}`}
                    className="rounded-md p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => onDelete(category)}
                    aria-label={`Delete ${category.name}`}
                    className="rounded-md p-1 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
