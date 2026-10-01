export type CategoryKind = "income" | "expense";

export interface Category {
  id: string;
  name: string;
  kind: CategoryKind;
  color: string; // hex color used for charts and badges
  icon?: string; // lucide-react icon name, see src/utils/icons.ts
  isDefault: boolean; // true for the built-in categories, false for user-created ones
}

export interface CategoryInput {
  name: string;
  kind: CategoryKind;
  color: string;
  icon?: string;
}
