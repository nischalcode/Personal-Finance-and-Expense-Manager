import { useState, type FormEvent } from "react";
import type { User } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/common/Toast";
import Card from "@/components/common/Card";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";

/** Profile fields: name, email, phone, avatar (section 21 of the spec). */
export default function ProfileSection({ user }: { user: User }) {
  const { refreshUser } = useAuth();
  const { showToast } = useToast();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone ?? "");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 400)); // placeholder for future PUT /api/auth/me
    refreshUser({ ...user, name, email, phone });
    showToast("Profile updated.");
    setIsSaving(false);
  }

  return (
    <Card title="Profile">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-xl font-semibold text-brand-700 dark:bg-brand-950 dark:text-brand-300">
            {name.charAt(0).toUpperCase()}
          </div>
          <Button type="button" variant="secondary" size="sm" disabled>
            Change photo (coming soon)
          </Button>
        </div>
        <Input
          label="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+977 98XXXXXXXX"
        />
        <div className="flex justify-end">
          <Button type="submit" isLoading={isSaving}>
            Save changes
          </Button>
        </div>
      </form>
    </Card>
  );
}
