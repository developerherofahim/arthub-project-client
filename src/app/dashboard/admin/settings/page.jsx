"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  Check,
  CircleHelp,
  LockKeyhole,
  Mail,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import { updateUserProfile } from "@/lib/api";

const PREFERENCES_KEY = "arthub-admin-notification-preferences";
const DEFAULT_PREFERENCES = {
  newUsers: true,
  completedPayments: true,
  artworkReports: false,
};

function PreferenceToggle({ checked, onChange, label, description }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 py-4">
      <span>
        <span className="block text-sm font-medium text-art-text">{label}</span>
        <span className="mt-0.5 block text-xs leading-relaxed text-art-muted">
          {description}
        </span>
      </span>
      <span className="relative inline-flex shrink-0 items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="peer sr-only"
        />
        <span className="h-6 w-11 rounded-full bg-art-border transition peer-checked:bg-art-primary peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-art-primary" />
        <span className="absolute left-1 h-4 w-4 rounded-full bg-white shadow-sm transition peer-checked:translate-x-5" />
      </span>
    </label>
  );
}

export default function AdminSettingsPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const [name, setName] = useState(null);
  const [image, setImage] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
  const [preferencesSaved, setPreferencesSaved] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const savedPreferences = window.localStorage.getItem(PREFERENCES_KEY);
        if (savedPreferences) {
          setPreferences({
            ...DEFAULT_PREFERENCES,
            ...JSON.parse(savedPreferences),
          });
        }
      } catch (error) {
        console.error("Could not load admin notification preferences:", error);
      }
    });
  }, []);

  const handleProfileSave = async (event) => {
    event.preventDefault();
    if (!user?.email) {
      toast.error("Your account information is not available. Please reload and try again.");
      return;
    }

    setSavingProfile(true);
    try {
      await updateUserProfile({
        name: (name ?? user.name ?? "").trim(),
        image: (image ?? user.image ?? "").trim(),
      });
      await authClient.getSession();
      toast.success("Admin profile updated.");
    } catch (error) {
      toast.error(error.message || "Could not update your profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const updatePreference = (key) => {
    setPreferences((current) => ({ ...current, [key]: !current[key] }));
    setPreferencesSaved(false);
  };

  const savePreferences = () => {
    try {
      window.localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
      setPreferencesSaved(true);
      toast.success("Notification preferences saved on this device.");
    } catch (error) {
      console.error("Could not save admin notification preferences:", error);
      toast.error("Could not save preferences in this browser.");
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-art-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-art-primary">
          <ShieldCheck size={14} aria-hidden="true" />
          Administrator
        </div>
        <h2 className="font-art-display text-2xl font-semibold text-art-text sm:text-3xl">
          Settings
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-art-secondary">
          Manage your administrator profile, account details, and dashboard preferences.
        </p>
      </div>

      <section className="overflow-hidden rounded-2xl border border-art-border bg-white shadow-sm">
        <div className="border-b border-art-border px-5 py-5 sm:px-7">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-art-primary/10 text-art-primary">
              <UserRound size={19} aria-hidden="true" />
            </span>
            <div>
              <h3 className="font-art-display text-lg font-semibold text-art-text">
                Administrator profile
              </h3>
              <p className="text-xs text-art-muted">
                Update the name and profile photo shown in your dashboard.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleProfileSave} className="space-y-5 p-5 sm:p-7">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-art-secondary">
                Display name
              </span>
              <input
                type="text"
                value={name ?? user?.name ?? ""}
                onChange={(event) => setName(event.target.value)}
                required
                maxLength={100}
                autoComplete="name"
                className="w-full rounded-xl border border-art-border bg-white px-4 py-3 text-sm text-art-text outline-none transition placeholder:text-art-muted focus:border-art-primary"
                placeholder="Your name"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-art-secondary">
                Profile image URL
              </span>
              <input
                type="url"
                value={image ?? user?.image ?? ""}
                onChange={(event) => setImage(event.target.value)}
                maxLength={2000}
                className="w-full rounded-xl border border-art-border bg-white px-4 py-3 text-sm text-art-text outline-none transition placeholder:text-art-muted focus:border-art-primary"
                placeholder="https://example.com/photo.jpg"
              />
            </label>
          </div>

          <div className="grid gap-4 rounded-xl bg-art-background/70 p-4 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <Mail size={17} className="mt-0.5 shrink-0 text-art-muted" aria-hidden="true" />
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-art-muted">
                  Account email
                </p>
                <p className="mt-1 truncate text-sm text-art-text">{user?.email || "Loading…"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <LockKeyhole size={17} className="mt-0.5 shrink-0 text-art-muted" aria-hidden="true" />
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-art-muted">
                  Account role
                </p>
                <p className="mt-1 inline-flex items-center gap-1.5 text-sm capitalize text-art-text">
                  <ShieldCheck size={14} className="text-emerald-600" aria-hidden="true" />
                  {user?.role || "admin"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end border-t border-art-border pt-5">
            <button
              type="submit"
              disabled={savingProfile || !user}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-art-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-art-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={15} aria-hidden="true" />
              {savingProfile ? "Saving…" : "Save profile"}
            </button>
          </div>
        </form>
      </section>

      <section className="overflow-hidden rounded-2xl border border-art-border bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-art-border px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
              <Bell size={19} aria-hidden="true" />
            </span>
            <div>
              <h3 className="font-art-display text-lg font-semibold text-art-text">
                Dashboard notifications
              </h3>
              <p className="text-xs text-art-muted">
                Choose which activity updates you want to keep enabled.
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-art-background px-3 py-1.5 text-[11px] text-art-muted sm:self-auto">
            <CircleHelp size={13} aria-hidden="true" />
            Saved on this device
          </span>
        </div>

        <div className="divide-y divide-art-border px-5 sm:px-7">
          <PreferenceToggle
            label="New account activity"
            description="Keep administrator notifications enabled for newly registered accounts."
            checked={preferences.newUsers}
            onChange={() => updatePreference("newUsers")}
          />
          <PreferenceToggle
            label="Completed payments"
            description="Keep administrator notifications enabled when a payment is completed."
            checked={preferences.completedPayments}
            onChange={() => updatePreference("completedPayments")}
          />
          <PreferenceToggle
            label="Artwork reports"
            description="Keep administrator notifications enabled for artwork moderation reports."
            checked={preferences.artworkReports}
            onChange={() => updatePreference("artworkReports")}
          />
        </div>

        <div className="flex flex-col gap-3 border-t border-art-border px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <p className="text-xs text-art-muted">
            These preferences are stored in this browser and do not change email delivery.
          </p>
          <button
            type="button"
            onClick={savePreferences}
            className="inline-flex items-center justify-center gap-2 self-start rounded-full border border-art-border bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-art-text transition hover:bg-art-background sm:self-auto"
          >
            {preferencesSaved ? (
              <Check size={15} aria-hidden="true" />
            ) : (
              <Save size={15} aria-hidden="true" />
            )}
            {preferencesSaved ? "Preferences saved" : "Save preferences"}
          </button>
        </div>
      </section>

      <aside className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
        <ShieldCheck size={18} className="mt-0.5 shrink-0 text-blue-700" aria-hidden="true" />
        <p className="text-xs leading-relaxed text-blue-900">
          Administrator access is managed by the platform and cannot be changed from this page.
          Contact another administrator if your access needs to be reviewed.
        </p>
      </aside>
    </div>
  );
}
