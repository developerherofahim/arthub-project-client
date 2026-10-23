"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Palette, DollarSign, ShoppingBag, Crown, Loader2 } from "lucide-react";
import { getUserProfile, getUserTransactions } from "@/lib/api";

const TIER_LIMITS = { free: 3, pro: 9, premium: 999 };

export default function StatsCards() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [profile, setProfile]   = useState(null);
  const [txns, setTxns]         = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    if (!user?.email) return;
    Promise.all([
      getUserProfile(user.email),
      getUserTransactions(user.email),
    ])
      .then(([profileData, txnData]) => {
        setProfile(profileData);
        setTxns(Array.isArray(txnData) ? txnData : []);
      })
      .catch((error) => console.error("Failed to fetch collector statistics:", error))
      .finally(() => setLoading(false));
  }, [user?.email]);

  const tier = profile?.subscriptionTier || "free";
  const maxAllowed = TIER_LIMITS[tier] ?? 3;
  const purchased = txns.length;
  const totalValue = txns.reduce((s, t) => s + Number(t.amount || 0), 0);

  const stats = [
    {
      label: "Acquired Art",
      value: loading ? "…" : `${purchased} / ${maxAllowed === 999 ? "∞" : maxAllowed}`,
      icon: Palette,
      iconBg: "bg-art-primary/10",
      iconColor: "text-art-primary",
    },
    {
      label: "Total Value",
      value: loading ? "…" : `$${totalValue.toLocaleString()}`,
      icon: DollarSign,
      iconBg: "bg-[var(--color-art-gold)]/15",
      iconColor: "text-[var(--color-art-gold)]",
    },
    {
      label: "Membership",
      value: loading ? "…" : tier.charAt(0).toUpperCase() + tier.slice(1),
      icon: Crown,
      iconBg: "bg-art-charcoal/8",
      iconColor: "text-art-charcoal",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="flex items-center justify-between rounded-2xl border border-art-border bg-white p-4 sm:p-5 shadow-sm">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-art-muted">{stat.label}</p>
              {loading ? (
                <Loader2 size={18} className="mt-2 animate-spin text-art-muted" />
              ) : (
                <p className="mt-1 font-display text-2xl font-semibold tracking-tight text-art-text sm:text-3xl">{stat.value}</p>
              )}
            </div>
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl sm:h-11 sm:w-11 ${stat.iconBg}`}>
              <Icon size={18} className={`sm:size-5 ${stat.iconColor}`} strokeWidth={1.8} />
            </div>
          </div>
        );
      })}
    </div>
  );
}