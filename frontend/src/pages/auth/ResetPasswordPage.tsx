import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";

/**
 * UI-only "reset password" page. In a real flow, the link emailed from
 * ForgotPasswordPage would include a token as a query param (?token=...),
 * which this page would send to the future PUT /api/auth/reset-password.
 */
export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError(null);
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 500)); // simulate request
    setIsSubmitting(false);
    navigate("/login");
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle={
        token
          ? undefined
          : "This is a placeholder page — no reset token was found in the URL."
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Input
          label="New password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          hint="At least 6 characters."
        />
        <Input
          label="Confirm new password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Reset password
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        <Link
          to="/login"
          className="font-medium text-brand-600 hover:underline dark:text-brand-400"
        >
          Back to log in
        </Link>
      </p>
    </AuthLayout>
  );
}
