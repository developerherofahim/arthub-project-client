"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Heart, Trash2, ArrowUpRight, ShoppingBag } from "lucide-react";
import { toast } from "react-toastify";
import { getUserWishlist, toggleUserWishlist } from "@/lib/api";

export default function WishlistPage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWishlist() {
      if (!user?.email) {
        setLoading(false);
        return;
      }
      try {
        const data = await getUserWishlist(user.email);
        setItems(data);
      } catch (err) {
        console.error("Failed to load wishlist:", err);
      } finally {
        setLoading(false);
      }
    }
    if (!isPending) {
      loadWishlist();
    }
  }, [user?.email, isPending]);

  const handleRemove = async (artworkId) => {
    if (!user?.email) return;
    try {
      await toggleUserWishlist({ email: user.email, artworkId });
      setItems((prev) => prev.filter((item) => (item._id || item.id) !== artworkId));
      toast.info("Removed from your wishlist");
    } catch (err) {
      toast.error("Failed to update wishlist");
    }
  };

  return (
    <div className="min-h-screen bg-art-background py-10 sm:py-16">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-art-border bg-white px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-art-secondary">
            <Heart size={13} className="fill-art-primary text-art-primary" />
            Curated Collection
          </div>
          <h1 className="pt-3 font-art-display text-3xl font-semibold tracking-tight text-art-text sm:text-5xl">
            My Saved Artworks
          </h1>
          <p className="pt-2 text-sm text-art-secondary sm:text-base">
            Original pieces you have bookmarked for your personal collection.
          </p>
        </div>

        {/* Content */}
        {!user && !isPending ? (
          <div className="flex flex-col items-center rounded-3xl border border-art-border bg-white p-12 text-center shadow-xs">
            <Heart size={40} className="mx-auto text-art-muted" />
            <h2 className="mt-4 font-art-display text-2xl font-semibold text-art-text">
              Sign In to View Your Wishlist
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-art-secondary">
              Keep track of original paintings, sculptures, and digital editions across sessions.
            </p>
            <Link
              href="/log-in"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-art-primary px-6 py-3 font-art-body text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition hover:bg-art-primary-hover"
            >
              Sign In Now
            </Link>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse rounded-2xl border border-art-border bg-white p-4">
                <div className="h-64 w-full rounded-xl bg-gray-200" />
                <div className="mt-4 h-5 w-3/4 rounded-sm bg-gray-200" />
                <div className="mt-2 h-4 w-1/2 rounded-sm bg-gray-200" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center rounded-3xl border border-art-border bg-white p-12 text-center shadow-xs">
            <ShoppingBag size={42} className="mx-auto text-art-muted" strokeWidth={1.5} />
            <h2 className="mt-4 font-art-display text-2xl font-semibold text-art-text">
              Your Wishlist is Empty
            </h2>
            <p className="mx-auto mt-1 max-w-md text-sm text-art-secondary">
              Explore our curated marketplace to discover museum-grade paintings, digital editions, and sculptures.
            </p>
            <Link
              href="/browse-artworks"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-art-primary px-6 py-3 font-art-body text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition hover:bg-art-primary-hover"
            >
              Browse Artworks
              <ArrowUpRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((art) => {
              const artId = art._id || art.id;
              const isSold = art.status === "sold";
              return (
                <div
                  key={artId}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-art-border bg-white shadow-xs transition hover:shadow-md"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-art-charcoal/5">
                    <Image
                      src={art.image || "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80"}
                      alt={art.title || "Artwork"}
                      fill
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />
                    {isSold && (
                      <div className="absolute top-3 left-3 rounded-full bg-black/80 px-2.5 py-0.5 text-[11px] font-semibold tracking-wider uppercase text-white backdrop-blur-xs">
                        Sold
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemove(artId)}
                      className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-art-muted shadow-sm transition hover:bg-white hover:text-red-500"
                      title="Remove from wishlist"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center justify-between text-xs text-art-muted">
                      <span>{art.category || "Fine Art"}</span>
                      {art.year && <span>{art.year}</span>}
                    </div>

                    <h3 className="mt-1 font-art-display text-lg font-semibold text-art-text line-clamp-1">
                      {art.title}
                    </h3>
                    <p className="text-xs text-art-secondary mt-0.5 line-clamp-1">
                      by {art.artistName || "Independent Artist"}
                    </p>

                    <div className="mt-4 pt-4 border-t border-art-border flex items-center justify-between mt-auto">
                      <div>
                        <p className="text-[10px] uppercase font-semibold text-art-muted">Price</p>
                        <p className="font-art-display text-lg font-bold text-art-text">
                          ${Number(art.price).toLocaleString()}
                        </p>
                      </div>

                      <Link
                        href={`/artworks/${artId}`}
                        className="inline-flex items-center gap-1 rounded-full bg-art-primary px-3.5 py-1.5 font-art-body text-xs font-semibold text-white shadow-xs transition hover:bg-art-primary-hover"
                      >
                        {isSold ? "View Details" : "Acquire"}
                        <ArrowUpRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
