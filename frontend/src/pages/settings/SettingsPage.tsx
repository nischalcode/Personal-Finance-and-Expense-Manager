import { useAuth } from "@/contexts/AuthContext";
import LoadingState from "@/components/common/LoadingState";
import ProfileSection from "@/components/settings/ProfileSection";
import SecuritySection from "@/components/settings/SecuritySection";
import AppearanceSection from "@/components/settings/AppearanceSection";
import PreferencesSection from "@/components/settings/PreferencesSection";

/** Settings page: Profile, Security, Appearance, Preferences (section 21 of the spec). */
export default function SettingsPage() {
  const { user } = useAuth();

  if (!user) return <LoadingState />;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Settings
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage your profile, security, and app preferences.
        </p>
      </div>

      <ProfileSection user={user} />
      <SecuritySection />
      <AppearanceSection />
      <PreferencesSection user={user} />
    </div>
  );
}
