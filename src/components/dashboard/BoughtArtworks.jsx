"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { getUserTransactions } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { Loader2, ShoppingBag, ArrowUpRight } from "lucide-react";

export default function BoughtArtworks() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    if (!user?.email) return;
    getUserTransactions(user.email)
      .then(txns => {
        if (Array.isArray(txns)) {
          // Deduplicate by artworkId
          const unique = Object.values(
            txns.reduce((acc, t) => {
              if (!acc[t.artworkId]) acc[t.artworkId] = t;
              return acc;
            }, {})
          );
          setArtworks(unique);
        }
      })
      .catch((error) => console.error("Failed to fetch purchased artworks:", error))
      .finally(() => setLoading(false));
  }, [user?.email]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-art-primary" />
      </div>
    );
  }

  if (artworks.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-dashed border-art-border bg-white py-16 text-center">
        <ShoppingBag className="h-12 w-12 text-art-muted" />
        <h3 className="mt-4 font-art-display text-2xl font-semibold text-art-text">No artworks yet</h3>
        <p className="mt-1 text-sm text-art-secondary">Start your collection by browsing our curated gallery.</p>
        <Link href="/browse-artworks">
          <button className="mt-6 rounded-full bg-art-primary px-6 py-2.5 font-art-body text-xs font-semibold text-white transition hover:bg-art-primary-hover">
            Explore Gallery
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
      {artworks.map((txn) => (
        <article key={txn._id} className="group overflow-hidden rounded-2xl border border-art-border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-art-background">
            {txn.artworkImage ? (
              <Image
                src={txn.artworkImage}
                alt={txn.artworkTitle || "Artwork"}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-art-border/20">
                <ShoppingBag className="h-10 w-10 text-art-muted" />
              </div>
            )}
            <span className="absolute bottom-3 left-3 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
              {txn.category || "Art"}
            </span>
            <span className="absolute top-3 right-3 rounded-full bg-emerald-500/90 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
              Owned
            </span>
          </div>
          <div className="p-5">
            <h3 className="font-art-display text-xl font-semibold text-art-text group-hover:text-art-primary transition-colors">
              {txn.artworkTitle}
            </h3>
            <p className="mt-1 text-xs text-art-muted">by <span className="font-medium text-art-secondary">{txn.artistName}</span></p>
            <div className="mt-4 flex items-center justify-between border-t border-art-border pt-4">
              <span className="font-art-display text-lg font-bold text-art-text">${Number(txn.amount).toLocaleString()}</span>
              <Link href={`/artworks/${txn.artworkId}`} className="inline-flex items-center gap-1 font-art-body text-xs font-semibold text-art-primary hover:underline">
                View <ArrowUpRight size={13} />
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}