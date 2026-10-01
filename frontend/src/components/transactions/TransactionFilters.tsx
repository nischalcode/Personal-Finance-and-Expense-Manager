import { Search } from "lucide-react";
import type {
  Category,
  TransactionFilters as Filters,
  PaymentMethod,
} from "@/types";
import Input from "@/components/common/Input";
import Select from "@/components/common/Select";

const PAYMENT_METHODS: PaymentMethod[] = [
  "Cash",
  "Bank",
  "Card",
  "Mobile Wallet",
  "Other",
];

interface TransactionFiltersProps {
  filters: Filters;
  categories: Category[];
  onChange: (filters: Filters) => void;
}

/** Filter bar above the transaction list: search, type, category, payment method, date range, sort. */
export default function TransactionFiltersBar({
  filters,
  categories,
  onChange,
}: TransactionFiltersProps) {
  function update<K extends keyof Filters>(key: K, value: Filters[K]) {
    onChange({ ...filters, [key]: value, page: 1 });
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
      <div className="relative sm:col-span-2 xl:col-span-2">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search transactions..."
          value={filters.search ?? ""}
          onChange={(e) => update("search", e.target.value)}
          className="pl-9"
          aria-label="Search transactions"
        />
      </div>

      <Select
        aria-label="Filter by type"
        value={filters.type ?? "all"}
        onChange={(e) => update("type", e.target.value as Filters["type"])}
        options={[
          { value: "all", label: "All types" },
          { value: "income", label: "Income" },
          { value: "expense", label: "Expense" },
        ]}
      />

      <Select
        aria-label="Filter by category"
        value={filters.categoryId ?? "all"}
        onChange={(e) => update("categoryId", e.target.value)}
        options={[
          { value: "all", label: "All categories" },
          ...categories.map((c) => ({ value: c.id, label: c.name })),
        ]}
      />

      <Select
        aria-label="Filter by payment method"
        value={filters.paymentMethod ?? "all"}
        onChange={(e) =>
          update("paymentMethod", e.target.value as Filters["paymentMethod"])
        }
        options={[
          { value: "all", label: "All payment methods" },
          ...PAYMENT_METHODS.map((m) => ({ value: m, label: m })),
        ]}
      />

      <Select
        aria-label="Sort by"
        value={`${filters.sortBy ?? "date"}-${filters.sortDirection ?? "desc"}`}
        onChange={(e) => {
          const [sortBy, sortDirection] = e.target.value.split("-") as [
            Filters["sortBy"],
            Filters["sortDirection"],
          ];
          onChange({ ...filters, sortBy, sortDirection, page: 1 });
        }}
        options={[
          { value: "date-desc", label: "Newest first" },
          { value: "date-asc", label: "Oldest first" },
          { value: "amount-desc", label: "Amount: high to low" },
          { value: "amount-asc", label: "Amount: low to high" },
        ]}
      />

      <Input
        label="From date"
        type="date"
        value={filters.startDate ?? ""}
        onChange={(e) => update("startDate", e.target.value)}
      />

      <Input
        label="To date"
        type="date"
        value={filters.endDate ?? ""}
        onChange={(e) => update("endDate", e.target.value)}
      />
    </div>
  );
}
