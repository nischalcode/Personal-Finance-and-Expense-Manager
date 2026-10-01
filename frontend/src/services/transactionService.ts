/**
 * transactionService.ts
 *
 * Handles transaction CRUD operations.
 *
 * In mock mode, operations use local mock data.
 * In API mode, all requests go through apiRequest().
 */

import type {
  Transaction,
  TransactionInput,
  TransactionFilters,
  PaginatedTransactions,
} from "@/types";

import { mockTransactions } from "@/data/mockData";

import {
  apiRequest,
  USE_MOCK_DATA,
  mockDelay,
} from "./api";

// Mutable copy used only in mock mode.
let mockStore: Transaction[] = [...mockTransactions];

function applyFilters(
  items: Transaction[],
  filters: TransactionFilters,
): Transaction[] {
  let result = [...items];

  // Search
  if (filters.search) {
    const query = filters.search.toLowerCase();

    result = result.filter(
      (transaction) =>
        transaction.title.toLowerCase().includes(query) ||
        (transaction.notes ?? "").toLowerCase().includes(query),
    );
  }

  // Type
  if (filters.type && filters.type !== "all") {
    result = result.filter(
      (transaction) => transaction.type === filters.type,
    );
  }

  // Category
  if (filters.categoryId && filters.categoryId !== "all") {
    result = result.filter(
      (transaction) =>
        transaction.categoryId === filters.categoryId,
    );
  }

  // Payment method
  if (
    filters.paymentMethod &&
    filters.paymentMethod !== "all"
  ) {
    result = result.filter(
      (transaction) =>
        transaction.paymentMethod === filters.paymentMethod,
    );
  }

  // Date range
  if (filters.startDate) {
    result = result.filter(
      (transaction) => transaction.date >= filters.startDate!,
    );
  }

  if (filters.endDate) {
    result = result.filter(
      (transaction) => transaction.date <= filters.endDate!,
    );
  }

  // Sorting
  const sortBy = filters.sortBy ?? "date";
  const direction = filters.sortDirection ?? "desc";

  result.sort((a, b) => {
    const comparison =
      sortBy === "amount"
        ? a.amount - b.amount
        : a.date.localeCompare(b.date);

    return direction === "asc"
      ? comparison
      : -comparison;
  });

  return result;
}

function buildTransactionQuery(
  filters: TransactionFilters,
): string {
  const params = new URLSearchParams();

  if (filters.search) {
    params.set("search", filters.search);
  }

  if (filters.type && filters.type !== "all") {
    params.set("type", filters.type);
  }

  if (filters.categoryId && filters.categoryId !== "all") {
    params.set("categoryId", filters.categoryId);
  }

  if (
    filters.paymentMethod &&
    filters.paymentMethod !== "all"
  ) {
    params.set("paymentMethod", filters.paymentMethod);
  }

  if (filters.startDate) {
    params.set("startDate", filters.startDate);
  }

  if (filters.endDate) {
    params.set("endDate", filters.endDate);
  }

  if (filters.sortBy) {
    params.set("sortBy", filters.sortBy);
  }

  if (filters.sortDirection) {
    params.set("sortDirection", filters.sortDirection);
  }

  if (filters.page !== undefined) {
    params.set("page", String(filters.page));
  }

  if (filters.pageSize !== undefined) {
    params.set("pageSize", String(filters.pageSize));
  }

  const query = params.toString();

  return query ? `?${query}` : "";
}

export async function getTransactions(
  filters: TransactionFilters = {},
): Promise<PaginatedTransactions> {
  if (USE_MOCK_DATA) {
    await mockDelay();

    const filtered = applyFilters(mockStore, filters);

    const page = filters.page ?? 1;
    const pageSize = filters.pageSize ?? 10;

    const start = (page - 1) * pageSize;

    return {
      items: filtered.slice(start, start + pageSize),
      total: filtered.length,
      page,
      pageSize,
    };
  }

  return apiRequest<PaginatedTransactions>(
    `/transactions${buildTransactionQuery(filters)}`,
  );
}

export async function getTransaction(
  id: string,
): Promise<Transaction> {
  if (USE_MOCK_DATA) {
    await mockDelay(150);

    const transaction = mockStore.find(
      (item) => item.id === id,
    );

    if (!transaction) {
      throw new Error("Transaction not found.");
    }

    return transaction;
  }

  return apiRequest<Transaction>(
    `/transactions/${id}`,
  );
}

export async function createTransaction(
  input: TransactionInput,
): Promise<Transaction> {
  if (USE_MOCK_DATA) {
    await mockDelay();

    const now = new Date().toISOString();

    const newTransaction: Transaction = {
      ...input,
      id: `txn-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };

    mockStore = [
      newTransaction,
      ...mockStore,
    ];

    return newTransaction;
  }

  return apiRequest<Transaction>(
    "/transactions",
    {
      method: "POST",
      body: input,
    },
  );
}

export async function updateTransaction(
  id: string,
  input: TransactionInput,
): Promise<Transaction> {
  if (USE_MOCK_DATA) {
    await mockDelay();

    const index = mockStore.findIndex(
      (item) => item.id === id,
    );

    if (index === -1) {
      throw new Error("Transaction not found.");
    }

    const updatedTransaction: Transaction = {
      ...mockStore[index],
      ...input,
      updatedAt: new Date().toISOString(),
    };

    mockStore[index] = updatedTransaction;

    return updatedTransaction;
  }

  return apiRequest<Transaction>(
    `/transactions/${id}`,
    {
      method: "PUT",
      body: input,
    },
  );
}

export async function deleteTransaction(
  id: string,
): Promise<void> {
  if (USE_MOCK_DATA) {
    await mockDelay();

    const exists = mockStore.some(
      (item) => item.id === id,
    );

    if (!exists) {
      throw new Error("Transaction not found.");
    }

    mockStore = mockStore.filter(
      (item) => item.id !== id,
    );

    return;
  }

  await apiRequest<void>(
    `/transactions/${id}`,
    {
      method: "DELETE",
    },
  );
}

/**
 * Used by the dashboard's recent transactions list.
 */
export async function getRecentTransactions(
  limit: number = 5,
): Promise<Transaction[]> {
  const { items } = await getTransactions({
    sortBy: "date",
    sortDirection: "desc",
    page: 1,
    pageSize: limit,
  });

  return items;
}

/**
 * Returns transactions for analytics.
 *
 * Note: the backend currently limits pageSize to 100.
 * Therefore we cannot request 10,000 records from the API
 * and expect all transactions.
 */
export async function getAllTransactions(): Promise<Transaction[]> {
  if (USE_MOCK_DATA) {
    await mockDelay();
    return [...mockStore];
  }

  const allTransactions: Transaction[] = [];
  let page = 1;
  const pageSize = 100;

  while (true) {
    const result = await getTransactions({
      page,
      pageSize,
      sortBy: "date",
      sortDirection: "desc",
    });

    allTransactions.push(...result.items);

    if (
      allTransactions.length >= result.total ||
      result.items.length === 0
    ) {
      break;
    }

    page += 1;
  }

  return allTransactions;
}