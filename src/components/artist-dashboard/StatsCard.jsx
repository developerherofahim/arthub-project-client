"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import { getArtistAnalytics } from "@/lib/api";

export default function StatsCard() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;
    getArtistAnalytics(user.email)
      .then(setStats)
      .catch((error) => console.error("Failed to fetch artist analytics:", error))
      .finally(() => setLoading(false));
  }, [user?.email]);

  const items = [
    {
      label: "Total Artworks",
      value: loading ? "…" : (stats?.totalArtworks ?? 0).toString(),
    },
    {
      label: "Active Listings",
      value: loading ? "…" : (stats?.activeListings ?? 0).toString(),
    },
    {
      label: "Items Sold",
      value: loading ? "…" : (stats?.itemsSold ?? 0).toString(),
    },
    {
      label: "Total Earnings",
      value: loading ? "…" : `$${Number(stats?.totalEarnings ?? 0).toLocaleString()}`,
      highlight: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-5">
      {items.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-[var(--color-art-border)] bg-white p-4 sm:p-5 shadow-sm"
        >
          {loading ? (
            <div className="flex h-10 items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-[var(--color-art-muted)]" />
            </div>
          ) : (
            <p
              className={`font-display text-2xl font-semibold tracking-tight sm:text-3xl ${
                stat.highlight
                  ? "text-[var(--color-art-primary)]"
                  : "text-[var(--color-art-text)]"
              }`}
            >
              {stat.value}
            </p>
          )}
          <p className="mt-1 text-xs font-medium text-[var(--color-art-muted)] sm:text-sm">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}