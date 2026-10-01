import { useState } from "react";
import type { AnalyticsDateRange } from "@/types";
import { useAsync } from "@/hooks/useAsync";
import * as analyticsService from "@/services/analyticsService";
import * as categoryService from "@/services/categoryService";
import * as budgetService from "@/services/budgetService";
import * as transactionService from "@/services/transactionService";
import { calculateBudgetProgress } from "@/utils/budgetCalculations";
import { formatCurrency } from "@/utils/currency";
import { getCurrentMonthKey } from "@/utils/date";

import Card from "@/components/common/Card";
import LoadingState from "@/components/common/LoadingState";
import ErrorState from "@/components/common/ErrorState";
import PeriodFilter from "@/components/analytics/PeriodFilter";
import BudgetPerformanceList from "@/components/analytics/BudgetPerformanceList";
import MonthlyCashflowChart from "@/components/dashboard/MonthlyCashflowChart";
import CategoryExpenseChart from "@/components/dashboard/CategoryExpenseChart";

/**
 * Reports/Analytics page (section 19 of the spec). All values are computed
 * from mock data via analyticsService for now; the shape of this page
 * won't need to change once the future GET /api/analytics/* endpoints are
 * connected — only analyticsService.ts changes (see docs/FRONTEND-GUIDE.md).
 */
export default function ReportsPage() {
  const [range, setRange] = useState<AnalyticsDateRange>({
    period: "current-month",
  });

  const { data, isLoading, error, reload } = useAsync(async () => {
    const [
      summary,
      cashflow,
      categoryBreakdown,
      budgets,
      categories,
      transactions,
    ] = await Promise.all([
      analyticsService.getDashboardSummary(),
      analyticsService.getCashflow(range),
      analyticsService.getCategoryBreakdown(range),
      budgetService.getBudgets(getCurrentMonthKey()),
      categoryService.getCategories(),
      transactionService.getAllTransactions(),
    ]);
    return {
      summary,
      cashflow,
      categoryBreakdown,
      budgets,
      categories,
      transactions,
    };
  }, [range.period, range.startDate, range.endDate]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Reports
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          A deeper look at your income, spending, and budget performance.
        </p>
      </div>

      <Card>
        <PeriodFilter range={range} onChange={setRange} />
      </Card>

      {isLoading ? (
        <LoadingState label="Crunching the numbers..." />
      ) : error || !data ? (
        <ErrorState
          message={error ?? "Could not load report data."}
          onRetry={reload}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <SummaryStat label="Income" value={data.summary.totalIncome} />
            <SummaryStat label="Expenses" value={data.summary.totalExpenses} />
            <SummaryStat label="Savings" value={data.summary.totalSavings} />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <MonthlyCashflowChart data={data.cashflow} />
            <CategoryExpenseChart data={data.categoryBreakdown} />
          </div>

          <BudgetPerformanceList
            budgets={data.budgets.map((b) =>
              calculateBudgetProgress(b, data.transactions),
            )}
            categories={data.categories}
          />
        </>
      )}
    </div>
  );
}

function SummaryStat({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-1 text-xl font-bold text-gray-900 dark:text-gray-100">
        {formatCurrency(value)}
      </p>
    </Card>
  );
}
