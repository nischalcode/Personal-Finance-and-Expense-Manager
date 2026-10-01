import type { SelectHTMLAttributes } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

let selectIdCounter = 0;

export default function Select({
  label,
  error,
  options,
  placeholder,
  id,
  className = "",
  ...rest
}: SelectProps) {
  const selectId = id ?? `select-${++selectIdCounter}`;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        aria-invalid={!!error}
        className={`w-full rounded-lg border px-3 py-2 text-sm text-gray-900 shadow-sm
          bg-white dark:bg-gray-800 dark:text-gray-100
          focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
          ${error ? "border-red-400 dark:border-red-500" : "border-gray-300 dark:border-gray-700"} ${className}`}
        {...rest}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
