import { Wallet, TrendingUp, TrendingDown, PiggyBank } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAsync } from "@/hooks/useAsync";
import * as analyticsService from "@/services/analyticsService";
import * as transactionService from "@/services/transactionService";
import * as categoryService from "@/services/categoryService";
import * as budgetService from "@/services/budgetService";
import { calculateBudgetProgress } from "@/utils/budgetCalculations";
import { getCurrentMonthKey } from "@/utils/date";

import SummaryCard from "@/components/dashboard/SummaryCard";
import MonthlyCashflowChart from "@/components/dashboard/MonthlyCashflowChart";
import CategoryExpenseChart from "@/components/dashboard/CategoryExpenseChart";
import BudgetOverview from "@/components/dashboard/BudgetOverview";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import LoadingState from "@/components/common/LoadingState";
import ErrorState from "@/components/common/ErrorState";

/**
 * The dashboard combines four services (analytics, transactions,
 * categories, budgets). We fetch them together with Promise.all inside
 * one useAsync call, since the page doesn't make sense showing partial
 * data — see docs/FRONTEND-GUIDE.md for why this page isn't split into
 * four separate loading states.
 */
export default function DashboardPage() {
  const { user } = useAuth();

  const { data, isLoading, error, reload } = useAsync(async () => {
    const [
      summary,
      monthly,
      categoryBreakdown,
      recentTransactions,
      categories,
      budgets,
    ] = await Promise.all([
      analyticsService.getDashboardSummary(),
      analyticsService.getMonthlyAnalytics(6),
      analyticsService.getCategoryBreakdown({ period: "current-month" }),
      transactionService.getRecentTransactions(5),
      categoryService.getCategories(),
      budgetService.getBudgets(getCurrentMonthKey()),
    ]);
    return {
      summary,
      monthly,
      categoryBreakdown,
      recentTransactions,
      categories,
      budgets,
    };
  }, []);

  if (isLoading) return <LoadingState label="Loading your dashboard..." />;
  if (error || !data)
    return (
      <ErrorState
        message={error ?? "Could not load dashboard."}
        onRetry={reload}
      />
    );

  const {
    summary,
    monthly,
    categoryBreakdown,
    recentTransactions,
    categories,
    budgets,
  } = data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Welcome back{user ? `, ${user.name.split(" ")[0]}` : ""}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Here's your financial overview for {summary.periodLabel.toLowerCase()}
          .
        </p>
      </div>

      {/* Top summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          label="Current Balance"
          amount={summary.currentBalance}
          icon={<Wallet className="h-4.5 w-4.5" />}
        />
        <SummaryCard
          label="Income"
          amount={summary.totalIncome}
          icon={<TrendingUp className="h-4.5 w-4.5" />}
          tone="positive"
        />
        <SummaryCard
          label="Expenses"
          amount={summary.totalExpenses}
          icon={<TrendingDown className="h-4.5 w-4.5" />}
          tone="negative"
        />
        <SummaryCard
          label="Savings"
          amount={summary.totalSavings}
          icon={<PiggyBank className="h-4.5 w-4.5" />}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <MonthlyCashflowChart data={monthly} />
        <CategoryExpenseChart data={categoryBreakdown} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <BudgetOverviewWithTransactions
          budgets={budgets}
          categories={categories}
        />
        <RecentTransactions
          transactions={recentTransactions}
          categories={categories}
        />
      </div>
    </div>
  );
}

/**
 * Small wrapper that fetches transactions to compute real budget progress.
 * Split out so DashboardPage's main useAsync doesn't need to know about
 * budget math directly — keeps that page's data-loading block readable.
 */
function BudgetOverviewWithTransactions({
  budgets,
  categories,
}: {
  budgets: Awaited<ReturnType<typeof budgetService.getBudgets>>;
  categories: Awaited<ReturnType<typeof categoryService.getCategories>>;
}) {
  const { data: transactions, isLoading } = useAsync(
    () => transactionService.getAllTransactions(),
    [],
  );

  if (isLoading || !transactions)
    return <LoadingState label="Loading budgets..." />;

  const budgetsWithProgress = budgets.map((b) =>
    calculateBudgetProgress(b, transactions),
  );
  return (
    <BudgetOverview budgets={budgetsWithProgress} categories={categories} />
  );
}
