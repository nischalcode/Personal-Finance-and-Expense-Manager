/**
 * authService.ts
 *
 * Handles authentication-related API calls.
 *
 * Real backend flow:
 *   register → verify OTP → login
 *
 * When VITE_USE_MOCK_DATA=true, the existing mock authentication
 * is used instead.
 */

import type {
  User,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  RegistrationResponse,
  VerifyOtpData,
  ResendOtpData,
  ChangePasswordData,
} from "@/types";

import { mockUser } from "@/data/mockData";

import {
  apiRequest,
  apiRequestRaw,
  ApiError,
  USE_MOCK_DATA,
  mockDelay,
  setStoredToken,
  clearStoredToken,
  getStoredToken,
} from "./api";

const MOCK_TOKEN = "mock-jwt-token";

let mockLoggedInUser: User | null = null;

/**
 * Login with email and password.
 */
export async function login(
  credentials: LoginCredentials,
): Promise<AuthResponse> {
  if (USE_MOCK_DATA) {
    await mockDelay();

    if (!credentials.email || !credentials.password) {
      throw new Error("Email and password are required.");
    }

    mockLoggedInUser = {
      ...mockUser,
      email: credentials.email,
    };

    setStoredToken(MOCK_TOKEN);

    return {
      user: mockLoggedInUser,
      token: MOCK_TOKEN,
    };
  }

  const result = await apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: credentials,
  });

  setStoredToken(result.token);

  return result;
}

/**
 * Register a new account.
 *
 * The backend does NOT log the user in after registration.
 * It creates the account and requires email OTP verification.
 */
export async function register(
  data: RegisterData,
): Promise<RegistrationResponse> {
  if (USE_MOCK_DATA) {
    await mockDelay();

    return {
      requiresVerification: true,
      email: data.email,
    };
  }

  const result = await apiRequestRaw<null>("/auth/register", {
    method: "POST",
    body: data,
  });

  return {
    requiresVerification: result.requiresVerification ?? true,

    // Keep the original email because /verify-otp requires
    // the actual email address, not the masked email.
    email: data.email,

    // Backend returns a masked email for display purposes.
    maskedEmail: result.email,
  };
}

/**
 * Verify the email OTP sent after registration.
 */
export async function verifyOtp(
  data: VerifyOtpData,
): Promise<void> {
  if (USE_MOCK_DATA) {
    await mockDelay();

    if (!data.email || !data.otp) {
      throw new Error("Email and OTP are required.");
    }

    return;
  }

  await apiRequest<null>("/auth/verify-otp", {
    method: "POST",
    body: data,
  });
}

export async function resendOtp(
  data: ResendOtpData,
): Promise<void> {
  if (USE_MOCK_DATA) {
    await mockDelay();

    if (!data.email) {
      throw new Error("Email is required.");
    }

    return;
  }

  await apiRequest<null>("/auth/resend-otp", {
    method: "POST",
    body: data,
  });
}

/**
 * Log the current user out.
 */
export async function logout(): Promise<void> {
  if (USE_MOCK_DATA) {
    await mockDelay(100);

    mockLoggedInUser = null;
    clearStoredToken();

    return;
  }

  try {
    await apiRequest<null>("/auth/logout", {
      method: "POST",
    });
  } finally {
    // Clear the token even if the backend request fails.
    clearStoredToken();
  }
}

/**
 * Get the currently authenticated user.
 */
export async function getCurrentUser(): Promise<User | null> {
  const token = getStoredToken();

  if (!token) {
    return null;
  }

  if (USE_MOCK_DATA) {
    await mockDelay(150);

    return mockLoggedInUser ?? {
      ...mockUser,
    };
  }

  try {
    return await apiRequest<User>("/auth/me");
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return null;
    }
    throw error;
  }
}

/**
 * Change the authenticated user's password.
 */
export async function changePassword(
  data: ChangePasswordData,
): Promise<void> {
  if (USE_MOCK_DATA) {
    await mockDelay();

    if (data.newPassword.length < 6) {
      throw new Error(
        "New password must be at least 6 characters.",
      );
    }

    return;
  }

  await apiRequest<null>("/auth/change-password", {
    method: "PUT",
    body: data,
  });
}

/**
 * Helper for UI code that wants to specifically detect
 * the backend's "email verification required" response.
 */
export function isVerificationRequiredError(
  error: unknown,
): error is ApiError {
  return (
    error instanceof ApiError &&
    error.requiresVerification === true
  );
}