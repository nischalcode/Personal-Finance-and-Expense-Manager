/**
 * analyticsService.ts
 *
 * Future backend endpoints:
 *   GET /api/analytics/summary
 *   GET /api/analytics/monthly
 *   GET /api/analytics/categories
 *   GET /api/analytics/cashflow
 *
 * In mock mode, all of these are computed on the fly from
 * transactionService.getAllTransactions() + categoryService.getCategories().
 * That calculation logic will move to the backend eventually; the shape
 * of the data returned to the UI (DashboardSummary, MonthlyDataPoint[],
 * CategoryBreakdown[]) is designed to stay the same either way.
 */
import type {
  DashboardSummary,
  MonthlyDataPoint,
  CategoryBreakdown,
  AnalyticsDateRange,
} from "@/types";
import { apiRequest, USE_MOCK_DATA, mockDelay } from "./api";
import { getAllTransactions } from "./transactionService";
import { getCategories } from "./categoryService";
import { getCurrentMonthKey } from "@/utils/date";

function resolveDateRange(range: AnalyticsDateRange): {
  start: string;
  end: string;
} {
  const now = new Date();
  const end = now.toISOString().slice(0, 10);

  switch (range.period) {
    case "previous-month": {
      const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth(), 0);
      return {
        start: prevMonth.toISOString().slice(0, 10),
        end: lastDay.toISOString().slice(0, 10),
      };
    }
    case "last-3-months": {
      const start = new Date(now.getFullYear(), now.getMonth() - 2, 1);
      return { start: start.toISOString().slice(0, 10), end };
    }
    case "last-6-months": {
      const start = new Date(now.getFullYear(), now.getMonth() - 5, 1);
      return { start: start.toISOString().slice(0, 10), end };
    }
    case "current-year": {
      const start = new Date(now.getFullYear(), 0, 1);
      return { start: start.toISOString().slice(0, 10), end };
    }
    case "custom":
      return { start: range.startDate ?? end, end: range.endDate ?? end };
    case "current-month":
    default: {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      return { start: start.toISOString().slice(0, 10), end };
    }
  }
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  if (USE_MOCK_DATA) {
    await mockDelay();
    const transactions = await getAllTransactions();
    const currentMonth = getCurrentMonthKey();
    const thisMonth = transactions.filter((t) =>
      t.date.startsWith(currentMonth),
    );

    const totalIncome = thisMonth
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + t.amount, 0);
    const totalExpenses = thisMonth
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);
    const allTimeBalance = transactions.reduce(
      (s, t) => s + (t.type === "income" ? t.amount : -t.amount),
      0,
    );

    return {
      currentBalance: allTimeBalance,
      totalIncome,
      totalExpenses,
      totalSavings: totalIncome - totalExpenses,
      periodLabel: "This Month",
    };
  }
  return apiRequest<DashboardSummary>("/analytics/summary");
}

export async function getMonthlyAnalytics(
  monthsBack: number = 6,
): Promise<MonthlyDataPoint[]> {
  if (USE_MOCK_DATA) {
    await mockDelay();
    const transactions = await getAllTransactions();
    const points: MonthlyDataPoint[] = [];
    const now = new Date();

    for (let i = monthsBack - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const monthTxns = transactions.filter((t) => t.date.startsWith(key));
      points.push({
        month: d.toLocaleDateString("en-US", { month: "short" }),
        income: monthTxns
          .filter((t) => t.type === "income")
          .reduce((s, t) => s + t.amount, 0),
        expenses: monthTxns
          .filter((t) => t.type === "expense")
          .reduce((s, t) => s + t.amount, 0),
      });
    }
    return points;
  }
  return apiRequest<MonthlyDataPoint[]>(
    `/analytics/monthly?months=${monthsBack}`,
  );
}

export async function getCategoryBreakdown(
  range: AnalyticsDateRange = { period: "current-month" },
): Promise<CategoryBreakdown[]> {
  if (USE_MOCK_DATA) {
    await mockDelay();
    const [transactions, categories] = await Promise.all([
      getAllTransactions(),
      getCategories(),
    ]);
    const { start, end } = resolveDateRange(range);

    const expenses = transactions.filter(
      (t) => t.type === "expense" && t.date >= start && t.date <= end,
    );
    const total = expenses.reduce((s, t) => s + t.amount, 0);

    const byCategory = new Map<string, number>();
    expenses.forEach((t) =>
      byCategory.set(
        t.categoryId,
        (byCategory.get(t.categoryId) ?? 0) + t.amount,
      ),
    );

    return Array.from(byCategory.entries())
      .map(([categoryId, amount]) => {
        const category = categories.find((c) => c.id === categoryId);
        return {
          categoryId,
          categoryName: category?.name ?? "Unknown",
          amount,
          color: category?.color ?? "#94a3b8",
          percentage: total > 0 ? Math.round((amount / total) * 100) : 0,
        };
      })
      .sort((a, b) => b.amount - a.amount);
  }

  const params = new URLSearchParams(
    range as unknown as Record<string, string>,
  ).toString();
  return apiRequest<CategoryBreakdown[]>(`/analytics/categories?${params}`);
}

export async function getCashflow(
  range: AnalyticsDateRange = { period: "last-6-months" },
): Promise<MonthlyDataPoint[]> {
  if (USE_MOCK_DATA) {
    await mockDelay();
    const monthsMap: Record<string, number> = {
      "current-month": 1,
      "previous-month": 2,
      "last-3-months": 3,
      "last-6-months": 6,
      "current-year": 12,
      custom: 6,
    };
    return getMonthlyAnalytics(monthsMap[range.period] ?? 6);
  }
  return apiRequest<MonthlyDataPoint[]>("/analytics/cashflow");
}
