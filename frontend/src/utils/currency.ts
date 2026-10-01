/**
 * Centralized currency formatting.
 *
 * Every place in the app that shows a money value should call
 * formatCurrency() instead of writing "Rs." by hand. That way, changing
 * the app's currency later (see Settings > Preferences) only means
 * changing this one file.
 */

export const DEFAULT_CURRENCY = "NPR";

const CURRENCY_SYMBOLS: Record<string, string> = {
  NPR: "Rs.",
  USD: "$",
  EUR: "€",
  INR: "₹",
  GBP: "£",
};

export function formatCurrency(
  amount: number,
  currency: string = DEFAULT_CURRENCY,
): string {
  const symbol = CURRENCY_SYMBOLS[currency] ?? currency;
  const formatted = Math.abs(amount).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  const sign = amount < 0 ? "-" : "";
  return `${sign}${symbol} ${formatted}`;
}

/** Same as formatCurrency but prefixes a +/- sign, used for transaction rows. */
export function formatSignedCurrency(
  amount: number,
  type: "income" | "expense",
  currency?: string,
): string {
  const sign = type === "income" ? "+" : "-";
  return `${sign} ${formatCurrency(Math.abs(amount), currency)}`;
}

export function getCurrencySymbol(currency: string = DEFAULT_CURRENCY): string {
  return CURRENCY_SYMBOLS[currency] ?? currency;
}

export const SUPPORTED_CURRENCIES = Object.keys(CURRENCY_SYMBOLS);
