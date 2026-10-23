"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { History, ArrowUpRight, Loader2, Package } from "lucide-react";
import Link from "next/link";
import { getUserTransactions } from "@/lib/api";

export default function PurchaseHistoryPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;
    getUserTransactions(user.email)
      .then(data => setTransactions(Array.isArray(data) ? data : []))
      .catch((error) => console.error("Failed to fetch purchase history:", error))
      .finally(() => setLoading(false));
  }, [user?.email]);

  const fmt = (date) => date
    ? new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "—";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-art-display text-2xl font-semibold text-art-text sm:text-3xl">Purchase History</h2>
          <p className="mt-1 text-sm text-art-secondary">
            Verified provenance and certificates of authenticity for your collected works.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-art-primary" />
        </div>
      ) : transactions.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-art-border bg-white py-16 text-center">
          <Package className="h-12 w-12 text-art-muted" />
          <h3 className="mt-4 font-art-display text-2xl font-semibold text-art-text">No purchases yet</h3>
          <p className="mt-1 text-sm text-art-secondary">Your purchase history will appear here once you acquire your first artwork.</p>
          <Link href="/browse-artworks">
            <button className="mt-6 rounded-full bg-art-primary px-6 py-2.5 font-art-body text-xs font-semibold text-white transition hover:bg-art-primary-hover">
              Browse Gallery
            </button>
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-art-border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px]">
              <thead>
                <tr className="border-b border-art-border text-left text-[11px] font-semibold uppercase tracking-wider text-art-muted">
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-4 py-4">Artwork</th>
                  <th className="px-4 py-4">Date</th>
                  <th className="px-4 py-4">Price</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-6 py-4 text-right">View</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn) => (
                  <tr key={txn._id} className="border-b border-art-border last:border-0 hover:bg-art-background/40">
                    <td className="px-6 py-4 font-mono text-xs font-semibold text-art-text">{txn.transactionId}</td>
                    <td className="px-4 py-4">
                      <p className="font-medium text-art-text">{txn.artworkTitle || "—"}</p>
                      <p className="text-xs text-art-muted">by {txn.artistName || "—"}</p>
                    </td>
                    <td className="px-4 py-4 text-sm text-art-secondary">{fmt(txn.createdAt)}</td>
                    <td className="px-4 py-4 text-sm font-semibold text-art-text">${Number(txn.amount || 0).toLocaleString()}</td>
                    <td className="px-4 py-4">
                      <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600 capitalize">
                        {txn.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {txn.artworkId && (
                        <Link href={`/artworks/${txn.artworkId}`} className="inline-flex items-center gap-1 font-art-body text-xs font-semibold text-art-primary hover:underline">
                          View <ArrowUpRight size={13} />
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
