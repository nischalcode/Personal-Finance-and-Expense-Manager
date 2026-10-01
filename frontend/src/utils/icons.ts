/**
 * Maps the icon name strings we store on a Category (see mockData.ts,
 * e.g. "Utensils", "Car") to an actual lucide-react component.
 *
 * Kept in one place so CategoryForm's icon picker and every place that
 * renders a category icon (RecentTransactions, TransactionList, Budget
 * cards, etc.) stay in sync.
 */
import {
  Utensils,
  Car,
  ShoppingBag,
  Receipt,
  HeartPulse,
  GraduationCap,
  Film,
  Home,
  Plane,
  MoreHorizontal,
  Wallet,
  Laptop,
  Briefcase,
  TrendingUp,
  Gift,
  Tag,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Utensils,
  Car,
  ShoppingBag,
  Receipt,
  HeartPulse,
  GraduationCap,
  Film,
  Home,
  Plane,
  MoreHorizontal,
  Wallet,
  Laptop,
  Briefcase,
  TrendingUp,
  Gift,
};

/** Selectable icons for the "add/edit category" form. */
export const AVAILABLE_CATEGORY_ICONS = Object.keys(ICON_MAP);

export function getCategoryIcon(iconName?: string): LucideIcon {
  if (!iconName) return Tag;
  return ICON_MAP[iconName] ?? Tag;
}
