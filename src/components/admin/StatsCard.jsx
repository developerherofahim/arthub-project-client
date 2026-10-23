"use client";

import { useEffect, useState } from "react";
import { Users, Palette, Package, DollarSign, Loader2 } from "lucide-react";
import { getAdminAnalytics } from "@/lib/api";

export default function StatsCards() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    getAdminAnalytics()
      .then(setAnalytics)
      .catch((error) => console.error("Failed to fetch admin analytics:", error))
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    {
      label: "Total Users",
      value: loading ? "…" : (analytics?.totalUsers ?? 0).toLocaleString(),
      icon: Users,
    },
    {
      label: "Total Artists",
      value: loading ? "…" : (analytics?.totalArtists ?? 0).toLocaleString(),
      icon: Palette,
    },
    {
      label: "Artworks Sold",
      value: loading ? "…" : (analytics?.totalSold ?? 0).toLocaleString(),
      icon: Package,
    },
    {
      label: "Total Revenue",
      value: loading ? "…" : `$${Number(analytics?.totalRevenue ?? 0).toLocaleString()}`,
      icon: DollarSign,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-5">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="rounded-2xl border border-[var(--color-art-border)] bg-white p-4 shadow-sm sm:p-5"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-art-background)]">
                <Icon size={18} className="text-[var(--color-art-secondary)]" strokeWidth={1.8} />
              </div>
            </div>
            {loading ? (
              <div className="mt-3 flex items-center">
                <Loader2 size={18} className="animate-spin text-[var(--color-art-muted)]" />
              </div>
            ) : (
              <p className="mt-3 font-display text-2xl font-semibold tracking-tight text-[var(--color-art-text)] sm:text-3xl">
                {stat.value}
              </p>
            )}
            <p className="mt-1 text-xs font-medium text-[var(--color-art-muted)] sm:text-sm">
              {stat.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}