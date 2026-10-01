import { Link } from "react-router-dom";
import {
  Wallet,
  ArrowRight,
  PieChart,
  PiggyBank,
  Target,
  TrendingUp,
  ShieldCheck,
  Smartphone,
  Sun,
  Moon,
} from "lucide-react";
import Button from "@/components/common/Button";
import { useTheme } from "@/contexts/ThemeContext";

/**
 * Public marketing/landing page (section 9 of the spec). Not authenticated,
 * not connected to any service — this page is pure static content plus
 * navigation links into /login and /register.
 */
export default function LandingPage() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Nav */}
      <header className="border-b border-gray-100 dark:border-gray-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
              <Wallet className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
              ExpenseWise
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
              aria-label={
                resolvedTheme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
              title={
                resolvedTheme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
              className="rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="h-5 w-5" aria-hidden />
              ) : (
                <Moon className="h-5 w-5" aria-hidden />
              )}
            </button>
            <Link
              to="/login"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              Log in
            </Link>
            <Link to="/register">
              <Button size="sm">Get started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-24">
        <h1 className="mx-auto max-w-2xl text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-5xl">
          Understand where your money goes.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-gray-600 dark:text-gray-400">
          Track income and expenses, set budgets that actually stick, and work
          toward your savings goals — all in one clear, simple dashboard.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link to="/register">
            <Button size="lg" icon={<ArrowRight className="h-4 w-4" />}>
              Create free account
            </Button>
          </Link>
          <Link to="/login">
            <Button size="lg" variant="secondary">
              I already have an account
            </Button>
          </Link>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-y border-gray-100 bg-gray-50 py-16 dark:border-gray-900 dark:bg-gray-900/40">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 sm:grid-cols-3 sm:px-6">
          {[
            {
              icon: PieChart,
              title: "Clear insights",
              desc: "See exactly where your income is going, by category and by month.",
            },
            {
              icon: PiggyBank,
              title: "Realistic budgets",
              desc: "Set monthly limits per category and get warned before you overspend.",
            },
            {
              icon: Target,
              title: "Goals that stick",
              desc: "Track savings goals with a clear target, deadline, and progress bar.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                {title}
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature previews */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-10 sm:grid-cols-2">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400">
              Analytics
            </span>
            <h2 className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
              Reports that actually explain your spending
            </h2>
            <p className="mt-3 text-gray-600 dark:text-gray-400">
              Monthly cashflow, category breakdowns, and trends over time —
              filterable by month, quarter, or a custom date range.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900">
            <TrendingUp
              className="h-full w-full text-brand-200 dark:text-brand-900"
              aria-hidden
            />
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 items-center gap-10 sm:grid-cols-2">
          <div className="order-2 rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900 sm:order-1">
            <PiggyBank
              className="h-full w-full text-brand-200 dark:text-brand-900"
              aria-hidden
            />
          </div>
          <div className="order-1 sm:order-2">
            <span className="text-sm font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400">
              Budgets
            </span>
            <h2 className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
              Know the moment you're close to a limit
            </h2>
            <p className="mt-3 text-gray-600 dark:text-gray-400">
              Every budget shows spent, remaining, and percentage used at a
              glance — with a clear warning as you approach or exceed it.
            </p>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 items-center gap-10 sm:grid-cols-2">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400">
              Goals
            </span>
            <h2 className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
              Save for what actually matters to you
            </h2>
            <p className="mt-3 text-gray-600 dark:text-gray-400">
              Set a target amount and deadline, log progress as you save, and
              watch the goal fill in — whether it's a laptop, an emergency fund,
              or a trip.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900">
            <Target
              className="h-full w-full text-brand-200 dark:text-brand-900"
              aria-hidden
            />
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-t border-gray-100 bg-gray-50 py-10 dark:border-gray-900 dark:bg-gray-900/40">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-6 px-4 text-sm text-gray-500 dark:text-gray-400 sm:flex-row sm:gap-12 sm:px-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" /> Your data stays yours
          </div>
          <div className="flex items-center gap-2">
            <Smartphone className="h-4 w-4" /> Works on any device
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">
          Start tracking your finances today
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          It takes less than a minute to get set up.
        </p>
        <Link to="/register" className="mt-6 inline-block">
          <Button size="lg" icon={<ArrowRight className="h-4 w-4" />}>
            Create free account
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 dark:border-gray-900">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-gray-500 dark:text-gray-400 sm:flex-row sm:px-6">
          <span>
            © 2026 ExpenseWise. A student project frontend — not a real
            financial product.
          </span>
          <div className="flex gap-4">
            <Link
              to="/login"
              className="hover:text-gray-900 dark:hover:text-white"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="hover:text-gray-900 dark:hover:text-white"
            >
              Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
