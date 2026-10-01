/**
 * api.ts
 *
 * Central HTTP helper for the Express backend.
 *
 * Components/pages should NOT call fetch() directly.
 * Services such as authService.ts and transactionService.ts use
 * the functions in this file.
 */

export const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA !== "false";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:9007/api";

const TOKEN_STORAGE_KEY = "expensewise_token";
export const AUTH_UNAUTHORIZED_EVENT = "expensewise:unauthorized";

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

export interface ApiErrorDetails {
  requiresVerification?: boolean;
  email?: string;
}

export class ApiError extends Error {
  status: number;
  requiresVerification?: boolean;
  email?: string;

  constructor(
    message: string,
    status: number,
    details: ApiErrorDetails = {},
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.requiresVerification = details.requiresVerification;
    this.email = details.email;
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
}

interface ApiEnvelope<T> {
  data: T;
  message?: string;
  meta?: Record<string, unknown>;

  // Used by authentication endpoints such as register/login.
  requiresVerification?: boolean;
  email?: string;
}

/**
 * Makes a request and returns the complete backend response envelope.
 *
 * This is useful for endpoints such as registration where the backend
 * returns additional top-level fields outside "data".
 */
export async function apiRequestRaw<T>(
  path: string,
  options: RequestOptions = {},
): Promise<ApiEnvelope<T>> {
  const token = getStoredToken();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body:
      options.body !== undefined
        ? JSON.stringify(options.body)
        : undefined,
  });

  const body = (await response.json().catch(() => ({}))) as Partial<
    ApiEnvelope<T>
  > & {
    message?: string;
    requiresVerification?: boolean;
    email?: string;
  };

  if (!response.ok) {
    if (response.status === 401) {
      clearStoredToken();
      window.dispatchEvent(new Event(AUTH_UNAUTHORIZED_EVENT));
    }

    throw new ApiError(
      body.message ?? response.statusText ?? "Request failed",
      response.status,
      {
        requiresVerification: body.requiresVerification,
        email: body.email,
      },
    );
  }

  return body as ApiEnvelope<T>;
}

/**
 * Makes a request and returns only the backend "data" value.
 *
 * Most backend endpoints use:
 * { data: ..., message?: ... }
 */
export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const response = await apiRequestRaw<T>(path, options);
  return response.data;
}

export function mockDelay(ms: number = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}