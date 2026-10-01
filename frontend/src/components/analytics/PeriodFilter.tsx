import type { AnalyticsDateRange, AnalyticsPeriod } from "@/types";
import Select from "@/components/common/Select";
import Input from "@/components/common/Input";

const PERIOD_OPTIONS: { value: AnalyticsPeriod; label: string }[] = [
  { value: "current-month", label: "Current month" },
  { value: "previous-month", label: "Previous month" },
  { value: "last-3-months", label: "Last 3 months" },
  { value: "last-6-months", label: "Last 6 months" },
  { value: "current-year", label: "Current year" },
  { value: "custom", label: "Custom range" },
];

interface PeriodFilterProps {
  range: AnalyticsDateRange;
  onChange: (range: AnalyticsDateRange) => void;
}

/** Period selector used at the top of the Reports page (section 19 of the spec). */
export default function PeriodFilter({ range, onChange }: PeriodFilterProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="w-full sm:w-56">
        <Select
          label="Period"
          value={range.period}
          onChange={(e) =>
            onChange({ ...range, period: e.target.value as AnalyticsPeriod })
          }
          options={PERIOD_OPTIONS}
        />
      </div>
      {range.period === "custom" && (
        <>
          <Input
            label="Start date"
            type="date"
            value={range.startDate ?? ""}
            onChange={(e) => onChange({ ...range, startDate: e.target.value })}
          />
          <Input
            label="End date"
            type="date"
            value={range.endDate ?? ""}
            onChange={(e) => onChange({ ...range, endDate: e.target.value })}
          />
        </>
      )}
    </div>
  );
}
