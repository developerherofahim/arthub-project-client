"use client";

import { useState, useEffect, useMemo, useCallback, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, SlidersHorizontal, Heart, ArrowUpDown, Sparkles, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const categories = ["All", "Painting", "Sculpture", "Photography", "Digital Art", "Abstract", "Mixed Media", "Drawing", "Print", "Fine Art", "Contemporary", "Minimal"];

function BrowseArtworksContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const initialCategory = searchParams.get("category") || "All";
  const [selectedCategory, setSelectedCategory] = useState(
    categories.includes(initialCategory) ? initialCategory : "All"
  );
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [likedArtworks, setLikedArtworks] = useState({});

  const fetchArtworks = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== "All") params.set("category", selectedCategory);
      if (searchQuery.trim()) params.set("search", searchQuery.trim());
      if (minPrice) params.set("minPrice", minPrice);
      if (maxPrice) params.set("maxPrice", maxPrice);
      if (sortBy === "price-low") params.set("sort", "price-low");
      else if (sortBy === "price-high") params.set("sort", "price-high");
      else if (sortBy === "newest") params.set("sort", "newest");
      else params.set("sort", "featured");

      params.set("page", page.toString());
      params.set("limit", "8");

      const r = await fetch(`${API}/artworks?${params}`);
      if (!r.ok) throw new Error();
      const data = await r.json();
      setArtworks(Array.isArray(data.artworks) ? data.artworks : []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch {
      setArtworks([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchQuery, minPrice, maxPrice, sortBy, page]);

  useEffect(() => {
    const t = setTimeout(fetchArtworks, 300);
    return () => clearTimeout(t);
  }, [fetchArtworks]);

  // Load wishlist for logged in user
  useEffect(() => {
    async function loadUserWishlist() {
      if (!user?.email) return;
      try {
        const res = await fetch(`${API}/users/profile?email=${encodeURIComponent(user.email)}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.wishlist)) {
            const map = {};
            data.wishlist.forEach((id) => {
              map[id] = true;
            });
            setLikedArtworks(map);
          }
        }
      } catch { /* silent */ }
    }
    loadUserWishlist();
  }, [user?.email]);

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setPage(1);
  };

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    setPage(1);
  };

  const handleSortChange = (val) => {
    setSortBy(val);
    setPage(1);
  };

  const toggleLike = async (artworkId) => {
    if (!user?.email) {
      toast.info("Please log in to save artworks to your wishlist.");
      return;
    }
    const isCurrentlyLiked = !!likedArtworks[artworkId];
    setLikedArtworks((prev) => ({ ...prev, [artworkId]: !isCurrentlyLiked }));

    try {
      const res = await fetch(`${API}/users/wishlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, artworkId }),
      });
      if (res.ok) {
        toast.success(isCurrentlyLiked ? "Removed from wishlist" : "Saved to wishlist!");
      }
    } catch {
      toast.error("Failed to update wishlist");
    }
  };

  return (
    <div className="min-h-screen bg-art-background pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center sm:text-left sm:flex sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-art-primary/20 bg-art-primary/10 px-3 py-1 font-art-body text-xs font-semibold uppercase tracking-wider text-art-primary">
              <Sparkles size={13} />
              Original Collections
            </div>
            <h1 className="mt-3 font-art-display text-4xl font-semibold tracking-tight text-art-text sm:text-5xl lg:text-6xl">
              Browse Artworks
            </h1>
            <p className="mt-2 max-w-2xl font-art-body text-sm text-art-secondary sm:text-base">
              Discover unique original pieces from independent creators worldwide.
              Every purchase directly supports living artists.
            </p>
          </div>
          <p className="mt-4 text-xs font-medium text-art-muted sm:mt-0">
            {loading ? (
              <span className="inline-flex items-center gap-1"><Loader2 size={12} className="animate-spin" /> Loading…</span>
            ) : (
              <>Showing <span className="font-semibold text-art-text">{artworks.length}</span> of <span className="font-semibold text-art-text">{total}</span> pieces</>
            )}
          </p>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-art-border bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-art-muted" />
            <input
              type="text"
              placeholder="Search by title, artist, or medium..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full rounded-xl border border-art-border bg-art-background py-2.5 pl-10 pr-4 font-art-body text-sm text-art-text outline-none focus:border-art-primary"
            />
          </div>

          {/* Price Range Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-art-muted shrink-0">Price ($)</span>
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
              className="w-20 rounded-xl border border-art-border bg-art-background px-2.5 py-2 font-art-body text-xs text-art-text outline-none focus:border-art-primary"
            />
            <span className="text-art-muted text-xs">-</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
              className="w-20 rounded-xl border border-art-border bg-art-background px-2.5 py-2 font-art-body text-xs text-art-text outline-none focus:border-art-primary"
            />
          </div>

          {/* Sort Selection */}
          <div className="flex items-center gap-2">
            <ArrowUpDown size={16} className="text-art-muted shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="rounded-xl border border-art-border bg-art-background px-3 py-2.5 font-art-body text-xs font-medium text-art-text outline-none focus:border-art-primary"
            >
              <option value="featured">Featured First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`shrink-0 rounded-full px-4 py-2 font-art-body text-xs font-semibold uppercase tracking-wider transition ${
                selectedCategory === cat
                  ? "bg-art-primary text-white shadow-sm"
                  : "border border-art-border bg-white text-art-secondary hover:border-art-text hover:text-art-text"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Artworks Grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-2xl border border-art-border bg-white overflow-hidden shadow-sm animate-pulse">
                <div className="aspect-[4/3] bg-art-border/40" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-art-border/50 rounded w-3/4" />
                  <div className="h-3 bg-art-border/40 rounded w-1/2" />
                  <div className="h-5 bg-art-border/50 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : artworks.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {artworks.map((art) => {
                const artId = art._id || art.id;
                const isLiked = !!likedArtworks[artId];
                return (
                  <article
                    key={artId}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-art-border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-art-background">
                      <Image
                        src={art.imageUrl || art.image || "https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=800&q=80"}
                        alt={art.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />

                      {/* Like button */}
                      <button
                        onClick={() => toggleLike(artId)}
                        aria-label="Add to favorites"
                        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/85 backdrop-blur-md transition hover:scale-110 active:scale-95"
                      >
                        <Heart size={17} className={isLiked ? "fill-art-primary text-art-primary" : "text-art-secondary"} />
                      </button>

                      {/* Category pill */}
                      <span className="absolute bottom-3 left-3 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                        {art.category}
                      </span>

                      {/* Sold badge */}
                      {art.status === "sold" && (
                        <span className="absolute top-3 left-3 rounded-full bg-art-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white shadow-md">
                          Sold
                        </span>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex-1">
                        <h3 className="font-art-display text-xl font-semibold tracking-tight text-art-text group-hover:text-art-primary transition-colors">
                          {art.title}
                        </h3>
                        <p className="mt-1 font-art-body text-xs text-art-muted">
                          by <span className="font-medium text-art-secondary">{art.artistName || art.artist}</span>
                        </p>
                        <p className="mt-2 text-xs text-art-muted">
                          {art.medium} {art.year && `· ${art.year}`}
                        </p>
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-art-border pt-4">
                        <div>
                          <span className="text-[10px] uppercase font-semibold tracking-wider text-art-muted block">Price</span>
                          <span className="font-art-display text-xl font-bold text-art-text">
                            ${Number(art.price).toLocaleString()}
                          </span>
                        </div>
                        <Link
                          href={`/artworks/${artId}`}
                          className="rounded-full bg-art-background px-4 py-2 font-art-body text-xs font-semibold text-art-text transition hover:bg-art-primary hover:text-white"
                        >
                          View Piece
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="inline-flex h-10 items-center gap-1 rounded-full border border-art-border bg-white px-4 font-art-body text-xs font-semibold uppercase tracking-wider text-art-text shadow-xs transition hover:bg-art-background disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                  Prev
                </button>

                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, idx) => {
                    const pNum = idx + 1;
                    return (
                      <button
                        key={pNum}
                        onClick={() => setPage(pNum)}
                        className={`h-10 w-10 rounded-full font-art-body text-xs font-semibold transition ${
                          page === pNum
                            ? "bg-art-primary text-white shadow-sm"
                            : "border border-art-border bg-white text-art-secondary hover:border-art-text"
                        }`}
                      >
                        {pNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="inline-flex h-10 items-center gap-1 rounded-full border border-art-border bg-white px-4 font-art-body text-xs font-semibold uppercase tracking-wider text-art-text shadow-xs transition hover:bg-art-background disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-art-border bg-white p-16 text-center">
            <SlidersHorizontal className="mx-auto h-10 w-10 text-art-muted" />
            <h3 className="mt-4 font-art-display text-2xl font-semibold text-art-text">No artworks found</h3>
            <p className="mt-1 text-sm text-art-secondary">Try adjusting your filters or search query to find matching pieces.</p>
            <button
              onClick={() => { setSelectedCategory("All"); setSearchQuery(""); setMinPrice(""); setMaxPrice(""); setPage(1); }}
              className="mt-6 rounded-full bg-art-primary px-5 py-2.5 font-art-body text-xs font-semibold text-white transition hover:bg-art-primary-hover"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BrowseArtworksPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-art-background">
        <Loader2 className="h-8 w-8 animate-spin text-art-primary" />
      </div>
    }>
      <BrowseArtworksContent />
    </Suspense>
  );
}
