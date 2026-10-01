// Types returned by the future GET /api/analytics/* endpoints.
// In mock mode these are computed from mockData.ts by analyticsService.ts.

export interface DashboardSummary {
  currentBalance: number;
  totalIncome: number;
  totalExpenses: number;
  totalSavings: number;
  periodLabel: string; // e.g. "This Month"
}

export interface MonthlyDataPoint {
  month: string; // e.g. "Jan", "Feb"
  income: number;
  expenses: number;
}

export interface CategoryBreakdown {
  categoryId: string;
  categoryName: string;
  amount: number;
  color: string;
  percentage: number;
}

export type AnalyticsPeriod =
  | "current-month"
  | "previous-month"
  | "last-3-months"
  | "last-6-months"
  | "current-year"
  | "custom";

export interface AnalyticsDateRange {
  period: AnalyticsPeriod;
  startDate?: string; // used when period === 'custom'
  endDate?: string;
}
