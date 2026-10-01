// Small, explicit validation helpers used by forms. Deliberately not a
// generic "schema validation" library — for a project this size, plain
// functions are easier to read and debug.

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export function validateTransactionForm(input: {
  amount: string;
  type: string;
  categoryId: string;
  date: string;
  title: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!input.title.trim()) errors.title = "Title is required.";

  const amountNum = Number(input.amount);
  if (!input.amount) {
    errors.amount = "Amount is required.";
  } else if (Number.isNaN(amountNum) || amountNum <= 0) {
    errors.amount = "Amount must be a positive number.";
  }

  if (!input.type) errors.type = "Type is required.";
  if (!input.categoryId) errors.categoryId = "Category is required.";
  if (!input.date) errors.date = "Date is required.";

  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateLoginForm(input: {
  email: string;
  password: string;
}): ValidationResult {
  const errors: Record<string, string> = {};
  if (!input.email) errors.email = "Email is required.";
  else if (!validateEmail(input.email))
    errors.email = "Enter a valid email address.";
  if (!input.password) errors.password = "Password is required.";
  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateRegisterForm(input: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}): ValidationResult {
  const errors: Record<string, string> = {};
  if (!input.name.trim()) errors.name = "Name is required.";
  if (!input.email) errors.email = "Email is required.";
  else if (!validateEmail(input.email))
    errors.email = "Enter a valid email address.";
  if (!input.password) errors.password = "Password is required.";
  else if (input.password.length < 6)
    errors.password = "Password must be at least 6 characters.";
  if (input.confirmPassword !== input.password)
    errors.confirmPassword = "Passwords do not match.";
  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateBudgetForm(input: {
  categoryId: string;
  monthlyLimit: string;
}): ValidationResult {
  const errors: Record<string, string> = {};
  if (!input.categoryId) errors.categoryId = "Category is required.";
  const limit = Number(input.monthlyLimit);
  if (!input.monthlyLimit) errors.monthlyLimit = "Monthly limit is required.";
  else if (Number.isNaN(limit) || limit <= 0)
    errors.monthlyLimit = "Monthly limit must be a positive number.";
  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateGoalForm(input: {
  name: string;
  targetAmount: string;
  currentAmount: string;
  deadline: string;
}): ValidationResult {
  const errors: Record<string, string> = {};
  if (!input.name.trim()) errors.name = "Goal name is required.";
  const target = Number(input.targetAmount);
  if (!input.targetAmount) errors.targetAmount = "Target amount is required.";
  else if (Number.isNaN(target) || target <= 0)
    errors.targetAmount = "Target amount must be positive.";
  const current = Number(input.currentAmount);
  if (input.currentAmount && (Number.isNaN(current) || current < 0))
    errors.currentAmount = "Current amount cannot be negative.";
  if (!input.deadline) errors.deadline = "Deadline is required.";
  return { valid: Object.keys(errors).length === 0, errors };
}
