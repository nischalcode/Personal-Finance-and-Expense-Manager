import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { CategoryBreakdown } from "@/types";
import { formatCurrency } from "@/utils/currency";
import Card from "@/components/common/Card";
import EmptyState from "@/components/common/EmptyState";

/** Expense category breakdown pie chart — reusable across Dashboard and Reports. */
export default function CategoryExpenseChart({
  data,
}: {
  data: CategoryBreakdown[];
}) {
  if (data.length === 0) {
    return (
      <Card title="Expense Breakdown">
        <EmptyState
          title="No expenses yet"
          description="Add a transaction to see your spending by category."
        />
      </Card>
    );
  }

  return (
    <Card title="Expense Breakdown">
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            dataKey="amount"
            nameKey="categoryName"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={2}
          >
            {data.map((entry) => (
              <Cell key={entry.categoryId} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => formatCurrency(value)}
            contentStyle={{ borderRadius: 8, fontSize: 13 }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}
