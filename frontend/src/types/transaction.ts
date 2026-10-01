export type TransactionType = "income" | "expense";

export type PaymentMethod =
  | "Cash"
  | "Bank"
  | "Card"
  | "Mobile Wallet"
  | "Other";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  title: string;
  date: string;
  paymentMethod: PaymentMethod;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionInput {
  type: TransactionType;
  amount: number;
  categoryId: string;
  title: string;
  date: string;
  paymentMethod: PaymentMethod;
  notes?: string;
}

export interface TransactionFilters {
  search?: string;
  type?: TransactionType | "all";
  categoryId?: string | "all";
  paymentMethod?: PaymentMethod | "all";
  startDate?: string;
  endDate?: string;
  sortBy?: "date" | "amount";
  sortDirection?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}

export interface PaginatedTransactions {
  items: Transaction[];
  total: number;
  page: number;
  pageSize: number;
}