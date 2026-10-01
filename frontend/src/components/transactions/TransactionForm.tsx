import { useState, type FormEvent } from "react";
import type {
  Category,
  PaymentMethod,
  Transaction,
  TransactionInput,
  TransactionType,
} from "@/types";
import Input from "@/components/common/Input";
import Select from "@/components/common/Select";
import Button from "@/components/common/Button";
import { validateTransactionForm } from "@/utils/validation";

const PAYMENT_METHODS: PaymentMethod[] = [
  "Cash",
  "Bank",
  "Card",
  "Mobile Wallet",
  "Other",
];

interface TransactionFormProps {
  categories: Category[];
  initialTransaction?: Transaction; // present when editing, absent when adding
  isSubmitting: boolean;
  onSubmit: (input: TransactionInput) => void;
  onCancel: () => void;
}

/**
 * Reusable form for both "Add Transaction" and "Edit Transaction" (section 15
 * of the spec). We use plain controlled state here rather than a form
 * library — the form is simple enough that react-hook-form/formik would
 * be an unnecessary dependency.
 */
export default function TransactionForm({
  categories,
  initialTransaction,
  isSubmitting,
  onSubmit,
  onCancel,
}: TransactionFormProps) {
  const [type, setType] = useState<TransactionType>(
    initialTransaction?.type ?? "expense",
  );
  const [amount, setAmount] = useState(
    initialTransaction ? String(initialTransaction.amount) : "",
  );
  const [categoryId, setCategoryId] = useState(
    initialTransaction?.categoryId ?? "",
  );
  const [title, setTitle] = useState(initialTransaction?.title ?? "");
  const [date, setDate] = useState(
    initialTransaction?.date ?? new Date().toISOString().slice(0, 10),
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    initialTransaction?.paymentMethod ?? "Cash",
  );
  const [notes, setNotes] = useState(initialTransaction?.notes ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categoriesForType = categories.filter((c) => c.kind === type);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validation = validateTransactionForm({
      amount,
      type,
      categoryId,
      date,
      title,
    });
    setErrors(validation.errors);
    if (!validation.valid) return;

    onSubmit({
      type,
      amount: Number(amount),
      categoryId,
      title: title.trim(),
      date,
      paymentMethod,
      notes: notes.trim() || undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {/* Income / Expense toggle */}
      <div>
        <span className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Type
        </span>
        <div
          className="grid grid-cols-2 gap-2"
          role="radiogroup"
          aria-label="Transaction type"
        >
          {(["expense", "income"] as TransactionType[]).map((t) => (
            <button
              key={t}
              type="button"
              role="radio"
              aria-checked={type === t}
              onClick={() => {
                setType(t);
                setCategoryId(""); // category list depends on type, so reset it
              }}
              className={`rounded-lg border px-4 py-2 text-sm font-medium capitalize transition-colors
                ${
                  type === t
                    ? t === "income"
                      ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300"
                      : "border-red-400 bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
                    : "border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <Input
        label="Title / Description"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={errors.title}
        placeholder="e.g. Lunch at cafe"
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Amount"
          type="number"
          min="0"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          error={errors.amount}
          placeholder="0.00"
        />
        <Input
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          error={errors.date}
        />
      </div>

      <Select
        label="Category"
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        error={errors.categoryId}
        placeholder="Select a category"
        options={categoriesForType.map((c) => ({ value: c.id, label: c.name }))}
      />

      <Select
        label="Payment Method"
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
        options={PAYMENT_METHODS.map((m) => ({ value: m, label: m }))}
      />

      <div>
        <label
          htmlFor="notes"
          className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Notes <span className="font-normal text-gray-400">(optional)</span>
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {initialTransaction ? "Save changes" : "Add transaction"}
        </Button>
      </div>
    </form>
  );
}
