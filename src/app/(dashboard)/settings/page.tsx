"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { updateProfile } from "@/app/auth/actions";
import { useTheme } from "@/components/ThemeProvider";

export default function SettingsPage() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [saved, setSaved] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setEmail(user.email ?? "");
        setDisplayName(user.user_metadata?.name ?? "");
      }
    });
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName) return;

    setIsPending(true);
    const formData = new FormData();
    formData.append("name", displayName);

    const result = await updateProfile(null, formData);
    if (result.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
    setIsPending(false);
  };

  const handleDeleteAccount = () => {
    const confirmed = prompt("Type your email to confirm deletion:");
    if (confirmed === email) {
      // Delete account logic
    }
  };

  return (
    <div className="p-8 max-w-[720px]">
      <h1 className="font-display font-semibold text-[32px] text-primary-text mb-12">
        Settings
      </h1>

      {/* Profile Section */}
      <section className="mb-12">
        <h2 className="font-display font-semibold text-[20px] text-primary-text mb-1">
          Profile
        </h2>
        <p className="text-sm text-secondary-text mb-6">
          Your personal account details.
        </p>
        <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-[13px] text-secondary-text">
              Email
            </label>
            <input
              type="email"
              readOnly
              className="border border-border-custom px-3 py-2 text-sm bg-surface-custom text-secondary-text rounded-md cursor-not-allowed"
              value={email}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-[13px] text-secondary-text">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="border border-border-custom px-3 py-2 text-sm bg-background text-primary-text rounded-md focus:outline-none focus:border-foreground transition-colors placeholder:text-muted-text"
              placeholder="Your name"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isPending}
              className="bg-foreground text-background text-sm font-semibold rounded-md py-2 px-4 hover:opacity-90 active:scale-[0.98] transition-all shadow-subtle disabled:opacity-50"
            >
              {saved ? "Saved" : isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </section>

      {/* Appearance Section */}
      <section className="mb-12">
        <h2 className="font-display font-semibold text-[20px] text-primary-text mb-1">
          Appearance
        </h2>
        <p className="text-sm text-secondary-text mb-6">
          Choose your preferred color scheme.
        </p>
        <div className="inline-flex border border-border-custom rounded-md overflow-hidden">
          {(["light", "dark"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => {
                if (mode !== theme) toggleTheme();
              }}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                theme === mode
                  ? "bg-foreground text-background"
                  : "bg-background text-secondary-text hover:text-primary-text hover:bg-surface-hover"
              } ${mode === "light" ? "border-r border-border-custom" : ""}`}
            >
              {mode === "light" ? "☀  Light" : "☾  Dark"}
            </button>
          ))}
        </div>
      </section>

      {/* Danger Zone Section */}
      <section>
        <h2 className="font-display font-semibold text-[20px] text-primary-text mb-1">
          Danger zone
        </h2>
        <p className="text-sm text-secondary-text mb-6">
          Irreversible actions that affect your account.
        </p>
        <div className="border border-error-custom rounded-lg p-6">
          <h3 className="font-semibold text-sm text-error-custom mb-2">
            Delete account
          </h3>
          <p className="text-sm text-secondary-text mb-4">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <button
            onClick={handleDeleteAccount}
            className="border border-error-custom text-error-custom text-sm font-semibold rounded-md py-2 px-4 hover:bg-error-soft transition-colors"
          >
            Delete account
          </button>
        </div>
      </section>
    </div>
  );
}