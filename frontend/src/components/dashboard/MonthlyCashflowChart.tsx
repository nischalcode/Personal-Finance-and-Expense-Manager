import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import type { MonthlyDataPoint } from "@/types";
import { formatCurrency } from "@/utils/currency";
import Card from "@/components/common/Card";

/** Income vs. Expense chart — reusable, takes MonthlyDataPoint[] from analyticsService. */
export default function MonthlyCashflowChart({
  data,
}: {
  data: MonthlyDataPoint[];
}) {
  return (
    <Card title="Income vs Expenses">
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ left: 0, right: 0, top: 8, bottom: 0 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            className="stroke-gray-200 dark:stroke-gray-800"
          />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12 }}
            stroke="currentColor"
            className="text-gray-500"
          />
          <YAxis
            tick={{ fontSize: 12 }}
            stroke="currentColor"
            className="text-gray-500"
            width={40}
            tickFormatter={(v) => `${v / 1000}k`}
          />
          <Tooltip
            formatter={(value: number) => formatCurrency(value)}
            contentStyle={{ borderRadius: 8, fontSize: 13 }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar
            dataKey="income"
            name="Income"
            fill="#22a97b"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="expenses"
            name="Expenses"
            fill="#f97316"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
