import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { useAuth } from "@/contexts/AuthContext";
import { validateLoginForm } from "@/utils/validation";
import { isVerificationRequiredError } from "@/services/authService";

interface LoginLocationState {
  email?: string;
  message?: string;
}

export default function LoginPage() {
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const locationState = location.state as LoginLocationState | null;

  const [email, setEmail] = useState(locationState?.email ?? "");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(
    null,
  );

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);

    const validation = validateLoginForm({
      email,
      password,
    });

    setErrors(validation.errors);

    if (!validation.valid) return;

    setIsSubmitting(true);

    try {
      await login({
        email,
        password,
      });

      navigate("/dashboard");
    } catch (err) {
      if (isVerificationRequiredError(err)) {
        navigate("/verify-otp", {
          state: {
            email,
            maskedEmail: err.email,
          },
        });

        return;
      }

      setFormError(
        err instanceof Error
          ? err.message
          : "Login failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to continue to your dashboard."
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
          error={errors.email}
          autoComplete="email"
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          autoComplete="current-password"
        />

        <div className="flex justify-end">
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-brand-600 hover:underline dark:text-brand-400"
          >
            Forgot password?
          </Link>
        </div>

        {locationState?.message && (
          <p
            role="status"
            className="text-sm text-green-600 dark:text-green-400"
          >
            {locationState.message}
          </p>
        )}

        {formError && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {formError}
          </p>
        )}

        <Button
          type="submit"
          className="w-full"
          isLoading={isSubmitting}
        >
          Log in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="font-medium text-brand-600 hover:underline dark:text-brand-400"
        >
          Sign up
        </Link>
      </p>
    </AuthLayout>
  );
}