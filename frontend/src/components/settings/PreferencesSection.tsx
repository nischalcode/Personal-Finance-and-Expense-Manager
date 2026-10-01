import { useState } from "react";
import type { User } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/common/Toast";
import Card from "@/components/common/Card";
import Select from "@/components/common/Select";
import Button from "@/components/common/Button";
import { SUPPORTED_CURRENCIES, getCurrencySymbol } from "@/utils/currency";

const DATE_FORMATS = ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"];

/** Currency, date format, and notification preferences (section 21 of the spec). */
export default function PreferencesSection({ user }: { user: User }) {
  const { refreshUser } = useAuth();
  const { showToast } = useToast();
  const [currency, setCurrency] = useState(user.currency);
  const [dateFormat, setDateFormat] = useState(user.dateFormat);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 300));
    refreshUser({ ...user, currency, dateFormat });
    showToast("Preferences saved.");
    setIsSaving(false);
  }

  return (
    <Card title="Preferences">
      <div className="space-y-4">
        <Select
          label="Currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          options={SUPPORTED_CURRENCIES.map((c) => ({
            value: c,
            label: `${c} (${getCurrencySymbol(c)})`,
          }))}
        />
        <Select
          label="Date format"
          value={dateFormat}
          onChange={(e) => setDateFormat(e.target.value)}
          options={DATE_FORMATS.map((f) => ({ value: f, label: f }))}
        />

        <label className="flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-800">
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
              Email notifications
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Budget alerts and monthly summaries.
            </p>
          </div>
          <input
            type="checkbox"
            checked={emailNotifications}
            onChange={(e) => setEmailNotifications(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
          />
        </label>

        <div className="flex justify-end">
          <Button onClick={handleSave} isLoading={isSaving}>
            Save preferences
          </Button>
        </div>
      </div>
    </Card>
  );
}
