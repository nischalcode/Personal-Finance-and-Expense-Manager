import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme, type ThemeMode } from "@/contexts/ThemeContext";
import Card from "@/components/common/Card";

const OPTIONS: { value: ThemeMode; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

/** Theme picker (section 21/23 of the spec). Persists via ThemeContext -> localStorage. */
export default function AppearanceSection() {
  const { theme, setTheme } = useTheme();

  return (
    <Card title="Appearance">
      <div className="grid grid-cols-3 gap-3">
        {OPTIONS.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => setTheme(value)}
            aria-pressed={theme === value}
            className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-sm font-medium transition-colors
              ${
                theme === value
                  ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}
          >
            <Icon className="h-5 w-5" />
            {label}
          </button>
        ))}
      </div>
    </Card>
  );
}
