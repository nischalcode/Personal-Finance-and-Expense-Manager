import { useEffect, useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { useAuth } from "@/contexts/AuthContext";

interface VerificationState {
  email?: string;
  maskedEmail?: string;
}

export default function VerifyOtpPage() {
  const { verifyOtp, resendOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const state = (location.state ?? {}) as VerificationState;

  const [email, setEmail] = useState(state.email ?? "");
  const [otp, setOtp] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const [formError, setFormError] = useState<string | null>(
    null,
  );

  const [successMessage, setSuccessMessage] = useState<
    string | null
  >(null);

  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = window.setInterval(() => {
      setResendCooldown((current) =>
        current > 0 ? current - 1 : 0,
      );
    }, 1000);

    return () => window.clearInterval(timer);
  }, [resendCooldown]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    setFormError(null);
    setSuccessMessage(null);

    const trimmedEmail = email.trim();
    const trimmedOtp = otp.trim();

    if (!trimmedEmail) {
      setFormError("Email is required.");
      return;
    }

    if (!/^\d{6}$/.test(trimmedOtp)) {
      setFormError("Please enter the 6-digit verification code.");
      return;
    }

    setIsSubmitting(true);

    try {
      await verifyOtp({
        email: trimmedEmail,
        otp: trimmedOtp,
      });

      navigate("/login", {
        replace: true,
        state: {
          email: trimmedEmail,
          message:
            "Email verified successfully. You can now log in.",
        },
      });
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : "Verification failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResend() {
    setFormError(null);
    setSuccessMessage(null);

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setFormError("Email is required.");
      return;
    }

    if (resendCooldown > 0) return;

    setIsResending(true);

    try {
      await resendOtp({
        email: trimmedEmail,
      });

      setSuccessMessage(
        "A new verification code has been sent to your email.",
      );

      setResendCooldown(60);
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : "Could not resend the verification code.",
      );
    } finally {
      setIsResending(false);
    }
  }

  return (
    <AuthLayout
      title="Verify your email"
      subtitle={
        state.maskedEmail
          ? `Enter the 6-digit code sent to ${state.maskedEmail}.`
          : "Enter the 6-digit verification code sent to your email."
      }
    >
      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-4"
      >
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />

        <Input
          label="Verification code"
          value={otp}
          onChange={(e) =>
            setOtp(
              e.target.value
                .replace(/\D/g, "")
                .slice(0, 6),
            )
          }
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          placeholder="000000"
        />

        {formError && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {formError}
          </p>
        )}

        {successMessage && (
          <p className="text-sm text-green-600 dark:text-green-400">
            {successMessage}
          </p>
        )}

        <Button
          type="submit"
          className="w-full"
          isLoading={isSubmitting}
        >
          Verify email
        </Button>
      </form>

      <div className="mt-6 space-y-3 text-center">
        <button
          type="button"
          onClick={handleResend}
          disabled={isResending || resendCooldown > 0}
          className="text-sm font-medium text-brand-600 hover:underline disabled:cursor-not-allowed disabled:opacity-50 dark:text-brand-400"
        >
          {isResending
            ? "Sending..."
            : resendCooldown > 0
              ? `Resend code in ${resendCooldown}s`
              : "Resend verification code"}
        </button>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Already verified?{" "}
          <Link
            to="/login"
            className="font-medium text-brand-600 hover:underline dark:text-brand-400"
          >
            Log in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}