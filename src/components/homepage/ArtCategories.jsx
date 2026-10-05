"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const CATEGORIES = [
  {
    name: "Painting",
    tagline: "Oil, Acrylic & Gouache",
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80",
    count: "120+ Pieces",
  },
  {
    name: "Digital Art",
    tagline: "Generative & 3D Media",
    image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=600&q=80",
    count: "85+ Pieces",
  },
  {
    name: "Sculpture",
    tagline: "Bronze, Ceramic & Stone",
    image: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=600&q=80",
    count: "45+ Pieces",
  },
  {
    name: "Abstract",
    tagline: "Expressive Forms & Hues",
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=600&q=80",
    count: "95+ Pieces",
  },
  {
    name: "Fine Art",
    tagline: "Museum Grade Works",
    image: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=600&q=80",
    count: "60+ Pieces",
  },
  {
    name: "Minimal",
    tagline: "Architectural & Clean",
    image: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=600&q=80",
    count: "40+ Pieces",
  },
];

export default function ArtCategories() {
  return (
    <section className="py-20 bg-art-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12">
          <div>
            <span className="font-art-body text-xs font-semibold uppercase tracking-wider text-art-primary">
              Disciplines & Media
            </span>
            <h2 className="font-art-display text-4xl sm:text-5xl font-semibold tracking-tight text-art-text mt-2">
              Explore by Category
            </h2>
            <p className="mt-2 font-art-body text-sm text-art-secondary max-w-lg">
              Find works that resonate with your interior aesthetics, architectural spaces, and visual preferences.
            </p>
          </div>
          <Link
            href="/browse-artworks"
            className="mt-4 sm:mt-0 text-xs font-semibold uppercase tracking-wider text-art-primary hover:underline"
          >
            All Mediums →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={`/browse-artworks?category=${encodeURIComponent(cat.name)}`}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-art-border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-art-background">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-0 p-4 flex flex-col justify-end text-white">
                  <span className="text-[10px] uppercase font-semibold text-art-gold/90 tracking-wider">
                    {cat.count}
                  </span>
                  <h3 className="font-art-display text-lg font-semibold tracking-tight leading-tight mt-1">
                    {cat.name}
                  </h3>
                  <div className="mt-1 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] text-white/80">Browse</span>
                    <ArrowUpRight size={12} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
