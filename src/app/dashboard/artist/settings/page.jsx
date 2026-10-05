"use client";

import { toast } from "react-toastify";

export default function ArtistSettingsPage() {
  const handleSave = (e) => {
    e.preventDefault();
    toast.success("Preferences saved successfully!");
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="font-art-display text-2xl font-semibold text-art-text sm:text-3xl">
          Artist Studio Settings
        </h2>
        <p className="mt-1 text-sm text-art-secondary">
          Configure payout destination, sales notifications, and packaging preferences.
        </p>
      </div>

      <form
        onSubmit={handleSave}
        className="space-y-6 rounded-2xl border border-art-border bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="space-y-4">
          <h3 className="font-art-display text-lg font-semibold text-art-text">
            Payout Account
          </h3>
          <div>
            <label className="mb-1.5 block font-art-body text-xs font-semibold uppercase tracking-wider text-art-secondary">
              Bank / Stripe Connect Account
            </label>
            <input
              type="text"
              defaultValue="Stripe Connect · Verified (ending in 8923)"
              disabled
              className="w-full rounded-xl border border-art-border bg-art-background px-4 py-2.5 font-art-body text-sm text-art-muted outline-none"
            />
          </div>

          <h3 className="pt-4 font-art-display text-lg font-semibold text-art-text">
            Notifications
          </h3>
          <div className="space-y-3 font-art-body text-sm text-art-secondary">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 rounded border-art-border text-art-primary focus:ring-art-primary"
              />
              Notify me immediately when an artwork is acquired
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 rounded border-art-border text-art-primary focus:ring-art-primary"
              />
              Weekly collector views and impression summary
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="rounded-full bg-art-primary px-6 py-2.5 font-art-body text-xs font-semibold text-white shadow-sm transition hover:bg-art-primary-hover"
          >
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
}
