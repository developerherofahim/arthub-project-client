"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Award, ArrowUpRight, Palette } from "lucide-react";

export default function TopArtists() {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTopArtists() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${apiUrl}/users/top-artists`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setArtists(data);
          }
        }
      } catch (err) {
        console.error("Error fetching top artists:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTopArtists();
  }, []);

  return (
    <section className="py-20 bg-white border-y border-art-border relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-art-gold/30 bg-amber-500/10 px-3 py-1 font-art-body text-xs font-semibold uppercase tracking-wider text-amber-700 mb-3">
            <Award size={13} />
            Collector Favorites
          </div>
          <h2 className="font-art-display text-4xl sm:text-5xl font-semibold tracking-tight text-art-text">
            Top Selling Artists
          </h2>
          <p className="mt-3 font-art-body text-sm text-art-secondary">
            Meet the most celebrated creators on ArtHub whose works are treasured in private collections across the globe.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {artists.map((artist, idx) => (
            <div
              key={artist.email || idx}
              className="group relative rounded-3xl border border-art-border bg-art-background/40 p-8 text-center transition-all duration-300 hover:bg-white hover:shadow-xl hover:border-art-primary/30"
            >
              <div className="relative mx-auto mb-6 h-28 w-28 overflow-hidden rounded-full ring-4 ring-art-primary/10 group-hover:ring-art-primary/30 transition-all duration-300">
                <Image
                  src={artist.avatar}
                  alt={artist.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="112px"
                />
              </div>

              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 border border-art-border text-[11px] font-semibold text-art-muted">
                <Palette size={12} className="text-art-primary" />
                <span>{artist.salesCount} Works Sold</span>
              </div>

              <h3 className="font-art-display text-2xl font-semibold text-art-text mt-2">
                {artist.name}
              </h3>
              <p className="mt-2 font-art-body text-xs text-art-secondary leading-relaxed line-clamp-2">
                {artist.bio}
              </p>

              <div className="mt-6 pt-6 border-t border-art-border">
                <Link
                  href={`/browse-artworks?search=${encodeURIComponent(artist.name)}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-art-primary hover:text-art-primary-hover transition"
                >
                  <span>Explore Artworks</span>
                  <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
