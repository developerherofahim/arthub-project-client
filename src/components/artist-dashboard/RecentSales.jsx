"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function RecentSales() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSales() {
      if (!user?.email) {
        setLoading(false);
        return;
      }
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${apiUrl}/transactions/artist/${encodeURIComponent(user.email)}`);
        if (res.ok) {
          const data = await res.json();
          setSales(data);
        }
      } catch (err) {
        console.error("Failed to fetch artist sales:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchSales();
  }, [user?.email]);

  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--color-art-border)] bg-white shadow-sm sm:mt-8">
      <div className="border-b border-[var(--color-art-border)] px-4 py-4 sm:px-6 flex items-center justify-between">
        <div>
          <h2 className="font-art-display text-lg font-semibold text-[var(--color-art-text)]">
            Sales History
          </h2>
          <p className="text-xs text-art-muted mt-0.5">
            Verified collector purchases of your original works
          </p>
        </div>
        <span className="rounded-full bg-art-background px-3 py-1 text-xs font-semibold text-art-secondary">
          {sales.length} {sales.length === 1 ? "Sale" : "Sales"}
        </span>
      </div>

      {loading ? (
        <div className="p-8 text-center">
          <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-art-primary border-t-transparent" />
          <p className="mt-2 text-xs text-art-muted">Loading transaction records...</p>
        </div>
      ) : sales.length === 0 ? (
        <div className="p-12 text-center">
          <p className="font-art-display text-lg font-medium text-art-text">No Sales Recorded Yet</p>
          <p className="mt-1 text-xs text-art-muted max-w-sm mx-auto">
            When collectors purchase your original artworks via Stripe Checkout, your completed transactions will appear here.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[560px]">
              <thead>
                <tr className="border-b border-[var(--color-art-border)] text-left text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-art-muted)] bg-art-background/40">
                  <th className="px-6 py-3.5">Artwork Title</th>
                  <th className="px-4 py-3.5">Buyer</th>
                  <th className="px-4 py-3.5">Transaction ID</th>
                  <th className="px-4 py-3.5">Date</th>
                  <th className="px-6 py-3.5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((sale) => (
                  <tr
                    key={sale._id || sale.transactionId}
                    className="border-b border-[var(--color-art-border)] last:border-0 hover:bg-[var(--color-art-background)]/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-[var(--color-art-text)]">
                      {sale.artworkTitle || "Artwork Purchase"}
                    </td>
                    <td className="px-4 py-4 text-sm text-[var(--color-art-secondary)]">
                      <div>
                        <p className="font-medium text-art-text">{sale.buyerName || "Private Collector"}</p>
                        <p className="text-xs text-art-muted">{sale.buyerEmail}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-mono text-xs text-[var(--color-art-muted)]">
                      {sale.transactionId || "—"}
                    </td>
                    <td className="px-4 py-4 text-sm text-[var(--color-art-secondary)]">
                      {new Date(sale.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-semibold text-[var(--color-art-primary)]">
                      ${Number(sale.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="space-y-3 p-4 md:hidden">
            {sales.map((sale) => (
              <div
                key={sale._id || sale.transactionId}
                className="rounded-xl border border-[var(--color-art-border)] p-4 bg-white shadow-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-[var(--color-art-text)]">
                      {sale.artworkTitle || "Artwork"}
                    </p>
                    <p className="mt-0.5 text-sm text-[var(--color-art-secondary)]">
                      Buyer: {sale.buyerName || sale.buyerEmail || "Collector"}
                    </p>
                    <p className="mt-1 text-xs text-[var(--color-art-muted)]">
                      {new Date(sale.createdAt).toLocaleDateString()} • {sale.transactionId}
                    </p>
                  </div>
                  <p className="shrink-0 text-base font-semibold text-[var(--color-art-primary)]">
                    ${Number(sale.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}