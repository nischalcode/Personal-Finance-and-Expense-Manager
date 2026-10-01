import { useState } from "react";
import { Plus } from "lucide-react";
import type { Category, CategoryInput } from "@/types";
import { useAsync } from "@/hooks/useAsync";
import * as categoryService from "@/services/categoryService";
import { useToast } from "@/components/common/Toast";

import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import LoadingState from "@/components/common/LoadingState";
import ErrorState from "@/components/common/ErrorState";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import CategoryList from "@/components/categories/CategoryList";
import CategoryFormModal from "@/components/categories/CategoryFormModal";

export default function CategoriesPage() {
  const {
    data: categories,
    isLoading,
    error,
    reload,
  } = useAsync(() => categoryService.getCategories(), []);
  const { showToast } = useToast();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>(
    undefined,
  );
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  function openAddForm() {
    setEditingCategory(undefined);
    setIsFormOpen(true);
  }

  function openEditForm(category: Category) {
    setEditingCategory(category);
    setIsFormOpen(true);
  }

  async function handleSubmit(input: CategoryInput) {
    setIsSubmitting(true);
    try {
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory.id, input);
        showToast("Category updated.");
      } else {
        await categoryService.createCategory(input);
        showToast("Category added.");
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
    if (!categoryToDelete) return;
    setIsSubmitting(true);
    try {
      await categoryService.deleteCategory(categoryToDelete.id);
      showToast("Category deleted.");
      setCategoryToDelete(null);
      reload();
    } catch {
      showToast("Failed to delete category.", "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Categories
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Organize your income and expenses. Default categories can't be
            edited or removed.
          </p>
        </div>
        <Button icon={<Plus className="h-4 w-4" />} onClick={openAddForm}>
          Add category
        </Button>
      </div>

      <Card>
        {isLoading ? (
          <LoadingState label="Loading categories..." />
        ) : error || !categories ? (
          <ErrorState
            message={error ?? "Could not load categories."}
            onRetry={reload}
          />
        ) : (
          <CategoryList
            categories={categories}
            onEdit={openEditForm}
            onDelete={setCategoryToDelete}
          />
        )}
      </Card>

      <CategoryFormModal
        isOpen={isFormOpen}
        initialCategory={editingCategory}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        onClose={() => setIsFormOpen(false)}
      />

      <ConfirmDialog
        isOpen={!!categoryToDelete}
        title="Delete category?"
        message={
          categoryToDelete
            ? `This will permanently delete "${categoryToDelete.name}". Existing transactions in this category will keep it as a label.`
            : ""
        }
        isLoading={isSubmitting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setCategoryToDelete(null)}
      />
    </div>
  );
}
