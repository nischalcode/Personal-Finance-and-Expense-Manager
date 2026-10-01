export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  profileImageUrl?: string;
  currency: string;
  dateFormat: string;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface RegistrationResponse {
  requiresVerification: boolean;

  // Original email entered by the user.
  // This is needed when calling /auth/verify-otp.
  email: string;

  // Masked email returned by the backend for display.
  // Example: n***@gmail.com
  maskedEmail?: string;
}

export interface VerifyOtpData {
  email: string;
  otp: string;
}

export interface ResendOtpData {
  email: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}