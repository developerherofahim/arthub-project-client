"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Sparkles, Heart } from "lucide-react";

export default function FeaturedArtworks() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${apiUrl}/artworks/featured`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setArtworks(data);
          }
        }
      } catch (err) {
        console.error("Error fetching featured artworks:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  return (
    <section className="py-20 bg-art-background relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-art-primary/30 bg-art-primary/10 px-3 py-1 font-art-body text-xs font-semibold uppercase tracking-wider text-art-primary mb-3">
              <Sparkles size={13} />
              Curated Selection
            </div>
            <h2 className="font-art-display text-4xl sm:text-5xl font-semibold tracking-tight text-art-text">
              Featured Artworks
            </h2>
            <p className="mt-2 font-art-body text-sm text-art-secondary max-w-xl">
              Hand-selected original masterpieces from visionary contemporary artists, updated dynamically with each visit.
            </p>
          </div>

          <Link
            href="/browse-artworks"
            className="mt-6 sm:mt-0 inline-flex items-center gap-2 font-art-body text-xs font-semibold uppercase tracking-wider text-art-primary hover:text-art-primary-hover group"
          >
            <span>Explore All Pieces</span>
            <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="rounded-2xl border border-art-border bg-white overflow-hidden shadow-sm animate-pulse">
                <div className="aspect-[4/3] bg-art-border/40" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-art-border/50 rounded w-3/4" />
                  <div className="h-3 bg-art-border/40 rounded w-1/2" />
                  <div className="h-5 bg-art-border/50 rounded w-1/3 pt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {artworks.map((art) => (
              <article
                key={art._id || art.id}
                className="group relative flex flex-col rounded-2xl border border-art-border bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-art-background">
                  <Image
                    src={art.imageUrl || art.image}
                    alt={art.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <span className="absolute bottom-3 left-3 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                    {art.category}
                  </span>

                  {art.status === "sold" && (
                    <span className="absolute top-3 left-3 rounded-full bg-art-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white shadow-md">
                      Sold
                    </span>
                  )}
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <div className="flex-1">
                    <h3 className="font-art-display text-2xl font-semibold text-art-text group-hover:text-art-primary transition-colors">
                      {art.title}
                    </h3>
                    <p className="mt-1 font-art-body text-xs text-art-muted">
                      by <span className="font-medium text-art-secondary">{art.artistName || art.artist}</span>
                    </p>
                    <p className="mt-2 text-xs text-art-muted line-clamp-2">
                      {art.medium} · {art.year}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-art-border flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-art-muted block">Value</span>
                      <span className="font-art-display text-2xl font-bold text-art-text">
                        ${Number(art.price).toLocaleString()}
                      </span>
                    </div>

                    <Link
                      href={`/artworks/${art._id || art.id}`}
                      className="rounded-full bg-art-primary px-4 py-2 font-art-body text-xs font-semibold text-white shadow-sm hover:bg-art-primary-hover transition"
                    >
                      View Piece
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
