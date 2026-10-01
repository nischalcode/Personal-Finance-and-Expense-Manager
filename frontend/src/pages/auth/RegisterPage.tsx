import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { useAuth } from "@/contexts/AuthContext";
import { validateRegisterForm } from "@/utils/validation";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  function updateField(
    field: keyof typeof form,
    value: string,
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);

    const validation = validateRegisterForm(form);

    setErrors(validation.errors);

    if (!validation.valid) return;

    setIsSubmitting(true);

    try {
      const result = await register({
        name: form.name,
        email: form.email,
        password: form.password,
      });

      if (result.requiresVerification) {
        navigate("/verify-otp", {
          state: {
            email: result.email,
            maskedEmail: result.maskedEmail,
          },
        });

        return;
      }

      navigate("/login");
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start tracking your finances in a minute."
    >
      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-4"
      >
        <Input
          label="Full name"
          value={form.name}
          onChange={(e) =>
            updateField("name", e.target.value)
          }
          error={errors.name}
          autoComplete="name"
        />

        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) =>
            updateField("email", e.target.value)
          }
          error={errors.email}
          autoComplete="email"
        />

        <Input
          label="Password"
          type="password"
          value={form.password}
          onChange={(e) =>
            updateField("password", e.target.value)
          }
          error={errors.password}
          hint="At least 6 characters."
          autoComplete="new-password"
        />

        <Input
          label="Confirm password"
          type="password"
          value={form.confirmPassword}
          onChange={(e) =>
            updateField("confirmPassword", e.target.value)
          }
          error={errors.confirmPassword}
          autoComplete="new-password"
        />

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
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-medium text-brand-600 hover:underline dark:text-brand-400"
        >
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}