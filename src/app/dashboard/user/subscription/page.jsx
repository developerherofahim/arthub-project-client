"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Check, Crown, Loader2, Sparkles, Star } from "lucide-react";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import {
  createCheckoutSession,
  getUserProfile,
  verifyPayment,
} from "@/lib/api";
import { redirectToCheckout } from "@/lib/stripe-checkout";

const TIERS = [
  {
    id: "free",
    name: "Free Collector",
    price: "$0",
    period: "/mo",
    description: "Start your art journey with limited access to the marketplace.",
    perks: ["Up to 3 artwork purchases", "Basic gallery browsing", "Comment on owned artworks"],
    color: "border-art-border",
    badge: "",
  },
  {
    id: "pro",
    name: "Pro Collector",
    price: "$9.99",
    period: "/mo",
    description: "Direct artist inquiries, 48-hour early access to new collections, and more.",
    perks: ["Up to 9 artwork purchases", "48-hour early access to new drops", "Dedicated fine art shipping liaison", "Private collector gallery"],
    color: "border-art-primary",
    badge: "Most Popular",
  },
  {
    id: "premium",
    name: "Patron of the Arts",
    price: "$19.99",
    period: "/mo",
    description: "Studio visits, bespoke commissions, and international art fair VIP access.",
    perks: ["Unlimited artwork purchases", "All Pro Collector benefits", "Direct artist studio visits", "VIP tickets to partner art fairs"],
    color: "border-art-charcoal",
    badge: "Premium",
  },
];

function SubscriptionContent() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const router = useRouter();
  const searchParams = useSearchParams();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(null);

  // Verify subscription on success redirect
  useEffect(() => {
    const success = searchParams.get("success");
    const sessionId = searchParams.get("session_id");
    const tier = searchParams.get("tier");
    if (success === "true" && sessionId && user?.email && tier) {
      (async () => {
        try {
          const data = await verifyPayment({
            sessionId,
            type: "subscription",
            tier,
            buyerEmail: user.email,
            buyerName: user.name,
          });
          if (data.success) {
            setProfile(prev => prev ? { ...prev, subscriptionTier: data.tier } : { subscriptionTier: data.tier });
            toast.success(`🎉 Welcome to ${data.tier.charAt(0).toUpperCase() + data.tier.slice(1)}!`);
            router.replace("/dashboard/user/subscription");
          }
        } catch (error) {
          console.error("Failed to verify subscription payment:", error);
        }
      })();
    }
  }, [searchParams, user, router]);

  useEffect(() => {
    if (!user?.email) return;
    getUserProfile(user.email)
      .then(setProfile)
      .catch((error) => console.error("Failed to load subscription profile:", error))
      .finally(() => setLoading(false));
  }, [user?.email]);

  const handleUpgrade = async (tierId) => {
    if (!user?.email) { toast.info("Please sign in first"); return; }
    setUpgrading(tierId);
    try {
      const data = await createCheckoutSession({
        type: "subscription",
        tier: tierId,
        buyerEmail: user.email,
        buyerName: user.name,
      });
      redirectToCheckout(data.url);
    } catch (e) {
      toast.error(e.message || "Upgrade failed");
    } finally {
      setUpgrading(null);
    }
  };

  const currentTier = profile?.subscriptionTier || "free";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-art-display text-2xl font-semibold text-art-text sm:text-3xl">Collector Membership</h2>
        <p className="mt-1 text-sm text-art-secondary">
          Manage your membership tier, gallery access benefits, and private advisory privileges.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-art-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {TIERS.map((tier) => {
            const isCurrent = currentTier === tier.id;
            const isHigher = TIERS.findIndex(t => t.id === tier.id) > TIERS.findIndex(t => t.id === currentTier);
            return (
              <div
                key={tier.id}
                className={`flex flex-col justify-between rounded-2xl border-2 bg-white p-6 shadow-sm transition-all duration-300 sm:p-7 ${
                  isCurrent ? "border-art-primary shadow-md shadow-art-primary/10" : tier.color
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    {isCurrent ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-art-primary/10 px-3 py-1 font-art-body text-xs font-semibold uppercase tracking-wider text-art-primary">
                        <Crown size={14} /> Active Plan
                      </span>
                    ) : tier.badge ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-art-background px-3 py-1 font-art-body text-xs font-semibold uppercase tracking-wider text-art-muted">
                        <Star size={12} /> {tier.badge}
                      </span>
                    ) : <span />}
                    <span className="font-art-display text-2xl font-bold text-art-text">
                      {tier.price}<span className="text-sm font-normal text-art-muted">{tier.period}</span>
                    </span>
                  </div>

                  <h3 className="mt-4 font-art-display text-2xl font-semibold text-art-text">{tier.name}</h3>
                  <p className="mt-1 text-sm text-art-secondary">{tier.description}</p>

                  <ul className="mt-6 space-y-3 font-art-body text-sm text-art-secondary">
                    {tier.perks.map((perk) => (
                      <li key={perk} className="flex items-center gap-2">
                        <Check size={16} className="text-emerald-500 shrink-0" />
                        {perk}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 border-t border-art-border pt-6">
                  {isCurrent ? (
                    <button className="w-full rounded-full border border-art-border bg-art-background py-2.5 font-art-body text-xs font-semibold uppercase tracking-wider text-art-text cursor-default">
                      Current Plan
                    </button>
                  ) : isHigher ? (
                    <button
                      onClick={() => handleUpgrade(tier.id)}
                      disabled={!!upgrading}
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-art-primary py-2.5 font-art-body text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition hover:bg-art-primary-hover disabled:opacity-60"
                    >
                      {upgrading === tier.id ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                      {upgrading === tier.id ? "Processing…" : `Upgrade to ${tier.name}`}
                    </button>
                  ) : (
                    <button className="w-full rounded-full border border-art-border bg-art-background py-2.5 font-art-body text-xs font-semibold uppercase tracking-wider text-art-muted cursor-not-allowed opacity-60">
                      Downgrade Unavailable
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function SubscriptionPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-art-primary" /></div>}>
      <SubscriptionContent />
    </Suspense>
  );
}
