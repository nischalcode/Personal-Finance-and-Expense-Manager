/**
 * categoryService.ts
 *
 * Future backend endpoints:
 *   GET    /api/categories
 *   POST   /api/categories
 *   PUT    /api/categories/:id
 *   DELETE /api/categories/:id
 */
import type { Category, CategoryInput } from "@/types";
import { mockCategories } from "@/data/mockData";
import { apiRequest, USE_MOCK_DATA, mockDelay } from "./api";

let mockStore: Category[] = [...mockCategories];

export async function getCategories(): Promise<Category[]> {
  if (USE_MOCK_DATA) {
    await mockDelay();
    return [...mockStore];
  }
  return apiRequest<Category[]>("/categories");
}

export async function createCategory(input: CategoryInput): Promise<Category> {
  if (USE_MOCK_DATA) {
    await mockDelay();
    const newCategory: Category = {
      ...input,
      id: `cat-${Date.now()}`,
      isDefault: false,
    };
    mockStore = [...mockStore, newCategory];
    return newCategory;
  }
  return apiRequest<Category>("/categories", { method: "POST", body: input });
}

export async function updateCategory(
  id: string,
  input: CategoryInput,
): Promise<Category> {
  if (USE_MOCK_DATA) {
    await mockDelay();
    const index = mockStore.findIndex((c) => c.id === id);
    if (index === -1) throw new Error("Category not found.");
    const updated: Category = { ...mockStore[index], ...input };
    mockStore[index] = updated;
    return updated;
  }
  return apiRequest<Category>(`/categories/${id}`, {
    method: "PUT",
    body: input,
  });
}

export async function deleteCategory(id: string): Promise<void> {
  if (USE_MOCK_DATA) {
    await mockDelay();
    mockStore = mockStore.filter((c) => c.id !== id);
    return;
  }
  await apiRequest<void>(`/categories/${id}`, { method: "DELETE" });
}
