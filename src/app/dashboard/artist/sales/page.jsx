"use client";

import { useEffect, useState } from "react";
import RecentSales from "@/components/artist-dashboard/RecentSales";
import { authClient } from "@/lib/auth-client";

export default function ArtistSalesPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [stats, setStats] = useState({
    totalArtworks: 0,
    activeListings: 0,
    itemsSold: 0,
    totalEarnings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      if (!user?.email) {
        setLoading(false);
        return;
      }
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${apiUrl}/analytics/artist/${encodeURIComponent(user.email)}`);
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Failed to fetch artist sales stats:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [user?.email]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-art-display text-2xl font-semibold text-art-text sm:text-3xl">
          Sales & Earnings History
        </h2>
        <p className="mt-1 text-sm text-art-secondary">
          Track completed artwork acquisitions, verified sales disbursements, and collector orders.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-art-border bg-white p-5 shadow-sm">
          <p className="text-xs uppercase font-semibold tracking-wider text-art-muted">
            Total Revenue
          </p>
          <p className="mt-2 font-art-display text-3xl font-bold text-art-primary">
            ${loading ? "..." : Number(stats.totalEarnings || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <p className="mt-1 text-[11px] text-art-secondary">Direct artwork sales proceeds</p>
        </div>
        <div className="rounded-2xl border border-art-border bg-white p-5 shadow-sm">
          <p className="text-xs uppercase font-semibold tracking-wider text-art-muted">
            Works Sold
          </p>
          <p className="mt-2 font-art-display text-3xl font-bold text-art-text">
            {loading ? "..." : stats.itemsSold || 0}
          </p>
          <p className="mt-1 text-[11px] text-art-secondary">Completed collector purchases</p>
        </div>
        <div className="rounded-2xl border border-art-border bg-white p-5 shadow-sm">
          <p className="text-xs uppercase font-semibold tracking-wider text-art-muted">
            Active Catalog
          </p>
          <p className="mt-2 font-art-display text-3xl font-bold text-art-text">
            {loading ? "..." : stats.activeListings || 0}
          </p>
          <p className="mt-1 text-[11px] text-art-secondary">Original pieces currently listed</p>
        </div>
      </div>

      <RecentSales />
    </div>
  );
}
