import type { ReactNode } from "react";
import { formatCurrency } from "@/utils/currency";

interface SummaryCardProps {
  label: string;
  amount: number;
  icon: ReactNode;
  tone?: "default" | "positive" | "negative";
}

const TONE_CLASSES: Record<string, string> = {
  default: "bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300",
  positive:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  negative: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
};

/** One of the four top summary cards on the dashboard (Balance, Income, Expenses, Savings). */
export default function SummaryCard({
  label,
  amount,
  icon,
  tone = "default",
}: SummaryCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {label}
        </p>
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${TONE_CLASSES[tone]}`}
        >
          {icon}
        </div>
      </div>
      <p className="mt-3 text-2xl font-bold text-gray-900 dark:text-gray-100">
        {formatCurrency(amount)}
      </p>
    </div>
  );
}
