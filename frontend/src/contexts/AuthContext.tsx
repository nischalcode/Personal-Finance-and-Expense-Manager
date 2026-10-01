/**
 * AuthContext — the single source of truth for the current user.
 *
 * Pages/components use useAuth() instead of calling authService.ts directly.
 *
 * Real authentication flow:
 *   Register → Verify OTP → Login
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type {
  User,
  LoginCredentials,
  RegisterData,
  RegistrationResponse,
  VerifyOtpData,
  ResendOtpData,
} from "@/types";

import * as authService from "@/services/authService";
import { AUTH_UNAUTHORIZED_EVENT } from "@/services/api";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sessionError: string | null;
  retrySessionCheck: () => void;

  login: (credentials: LoginCredentials) => Promise<void>;

  register: (data: RegisterData) => Promise<RegistrationResponse>;

  verifyOtp: (data: VerifyOtpData) => Promise<void>;

  resendOtp: (data: ResendOtpData) => Promise<void>;

  logout: () => Promise<void>;

  refreshUser: (updated: User) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [sessionCheckKey, setSessionCheckKey] = useState(0);

  useEffect(() => {
    let isActive = true;
    authService
      .getCurrentUser()
      .then((currentUser) => {
        if (isActive) setUser(currentUser);
      })
      .catch((error: unknown) => {
        if (isActive) {
          setSessionError(
            error instanceof Error
              ? error.message
              : "Could not verify your session.",
          );
        }
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [sessionCheckKey]);

  useEffect(() => {
    const handleUnauthorized = () => setUser(null);
    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    return () =>
      window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
  }, []);

  async function login(credentials: LoginCredentials) {
    const { user: loggedInUser } =
      await authService.login(credentials);

    setSessionError(null);
    setUser(loggedInUser);
  }

  async function register(
    data: RegisterData,
  ): Promise<RegistrationResponse> {
    return authService.register(data);
  }

  async function verifyOtp(data: VerifyOtpData) {
    await authService.verifyOtp(data);
  }

  async function resendOtp(data: ResendOtpData) {
    await authService.resendOtp(data);
  }

  async function logout() {
    await authService.logout();
    setUser(null);
  }

  function retrySessionCheck() {
    setIsLoading(true);
    setSessionError(null);
    setSessionCheckKey((key) => key + 1);
  }

  function refreshUser(updated: User) {
    setUser(updated);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        sessionError,
        retrySessionCheck,
        login,
        register,
        verifyOtp,
        resendOtp,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within an AuthProvider",
    );
  }

  return context;
}