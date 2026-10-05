"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import {
  ArrowLeft,
  Heart,
  ShoppingBag,
  Loader2,
  MessageCircle,
  User,
  Pencil,
  Trash2,
  CheckCircle2,
  Sparkles,
  Calendar,
  Palette,
  Package,
  Send,
  Star,
  AlertCircle,
  Crown,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/* ── helpers ───────────────────────────────────────── */
function fmt(n) {
  return Number(n).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}
function timeAgo(date) {
  const s = (Date.now() - new Date(date)) / 1000;
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/* ── StatusBadge ───────────────────────────────────── */
function StatusBadge({ status }) {
  const cfg = {
    available: { bg: "bg-emerald-50 text-emerald-700 border-emerald-200", label: "Available" },
    sold:      { bg: "bg-art-primary/10 text-art-primary border-art-primary/20", label: "Sold" },
    draft:     { bg: "bg-amber-50 text-amber-700 border-amber-200", label: "Draft" },
  }[status] || { bg: "bg-art-background text-art-secondary border-art-border", label: status };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ${cfg.bg}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {cfg.label}
    </span>
  );
}

/* ── CommentItem ───────────────────────────────────── */
function CommentItem({ comment, currentUserEmail, isAdmin, onDelete, onEdit }) {
  const [editMode, setEditMode] = useState(false);
  const [editText, setEditText] = useState(comment.comment);
  const [saving, setSaving] = useState(false);
  const canAct = isAdmin || comment.userEmail === currentUserEmail;

  const saveEdit = async () => {
    if (!editText.trim()) return;
    setSaving(true);
    try {
      const r = await fetch(`${API}/artworks/comments/${comment._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment: editText.trim(), userEmail: currentUserEmail }),
      });
      if (!r.ok) throw new Error((await r.json()).error || "Failed");
      onEdit({ ...comment, comment: editText.trim() });
      setEditMode(false);
      toast.success("Comment updated");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex gap-3 group">
      <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-art-border">
        {comment.userImage ? (
          <Image src={comment.userImage} alt={comment.userName} fill className="object-cover" sizes="36px" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <User size={16} className="text-art-muted" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-art-body text-sm font-semibold text-art-text">{comment.userName}</span>
            <span className="font-art-body text-xs text-art-muted">{timeAgo(comment.createdAt)}</span>
          </div>
          {canAct && (
            <div className="hidden group-hover:flex items-center gap-1">
              {comment.userEmail === currentUserEmail && (
                <button onClick={() => setEditMode(true)} className="rounded-md p-1 text-art-muted hover:bg-art-background hover:text-art-text transition">
                  <Pencil size={13} />
                </button>
              )}
              <button onClick={() => onDelete(comment._id)} className="rounded-md p-1 text-art-muted hover:bg-red-50 hover:text-red-500 transition">
                <Trash2 size={13} />
              </button>
            </div>
          )}
        </div>
        {editMode ? (
          <div className="mt-2 flex gap-2">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={2}
              className="flex-1 resize-none rounded-xl border border-art-border bg-art-background px-3 py-2 text-sm text-art-text outline-none focus:border-art-primary"
            />
            <div className="flex flex-col gap-1">
              <button onClick={saveEdit} disabled={saving} className="rounded-lg bg-art-primary px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-art-primary-hover disabled:opacity-60 transition">
                {saving ? <Loader2 size={12} className="animate-spin" /> : "Save"}
              </button>
              <button onClick={() => { setEditMode(false); setEditText(comment.comment); }} className="rounded-lg border border-art-border px-3 py-1.5 text-[11px] font-medium text-art-secondary hover:bg-art-background transition">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-1 font-art-body text-sm leading-relaxed text-art-secondary">{comment.comment}</p>
        )}
      </div>
    </div>
  );
}

/* ── Main Page ─────────────────────────────────────── */
export default function ArtworkDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [artwork, setArtwork] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);

  /* verify payment on success redirect */
  useEffect(() => {
    const success = searchParams.get("success");
    const sessionId = searchParams.get("session_id");
    const artworkId = searchParams.get("artworkId");

    if (success === "true" && sessionId && user?.email) {
      (async () => {
        try {
          const r = await fetch(`${API}/payments/verify-payment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sessionId,
              type: "purchase",
              artworkId: artworkId || id,
              buyerEmail: user.email,
              buyerName: user.name,
            }),
          });
          const data = await r.json();
          if (data.success) {
            setPurchaseSuccess(true);
            setHasPurchased(true);
            toast.success("🎉 Purchase confirmed! The artwork is yours.");
            router.replace(`/artworks/${id}`);
          }
        } catch (_) { /* silent */ }
      })();
    }
  }, [searchParams, user, id, router]);

  /* fetch artwork */
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const r = await fetch(`${API}/artworks/${id}`);
        if (!r.ok) throw new Error("Not found");
        const data = await r.json();
        setArtwork(data);
        setComments(data.comments || []);
      } catch {
        toast.error("Artwork not found");
        router.push("/browse-artworks");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, router]);

  /* check if user has purchased */
  useEffect(() => {
    if (!user?.email || !id) return;
    fetch(`${API}/transactions/user/${encodeURIComponent(user.email)}`)
      .then(r => r.json())
      .then(txns => {
        if (Array.isArray(txns)) {
          setHasPurchased(txns.some(t => t.artworkId === id && t.status === "completed"));
        }
      })
      .catch(() => {});
  }, [user, id]);

  /* wishlist toggle */
  const toggleWishlist = async () => {
    if (!user?.email) { toast.info("Please sign in to save artworks"); return; }
    setIsLiked(prev => !prev);
    try {
      await fetch(`${API}/users/wishlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, artworkId: id }),
      });
    } catch { setIsLiked(prev => !prev); }
  };

  /* purchase */
  const handlePurchase = async () => {
    if (!user?.email) { toast.info("Please sign in to purchase"); router.push("/log-in"); return; }
    if (!artwork) return;
    setIsPurchasing(true);
    try {
      const r = await fetch(`${API}/payments/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "purchase",
          artworkId: artwork._id || id,
          buyerEmail: user.email,
          buyerName: user.name || "Collector",
        }),
      });
      const data = await r.json();
      if (!r.ok) {
        if (data.upgradeRequired) {
          toast.error(data.error);
          router.push("/dashboard/user/subscription");
        } else {
          toast.error(data.error || "Payment failed");
        }
        return;
      }
      // Simulated checkout: redirect to success URL
      router.push(data.url);
    } catch (e) {
      toast.error("Failed to initiate purchase");
    } finally {
      setIsPurchasing(false);
    }
  };

  /* add comment */
  const handleComment = async (e) => {
    e.preventDefault();
    if (!user?.email) { toast.info("Please sign in to comment"); return; }
    if (!commentText.trim()) return;
    setSubmittingComment(true);
    try {
      const r = await fetch(`${API}/artworks/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          userEmail: user.email,
          userName: user.name || "Collector",
          userImage: user.image,
          comment: commentText.trim(),
        }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Failed");
      setComments(prev => [data.comment, ...prev]);
      setCommentText("");
      toast.success("Comment posted!");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSubmittingComment(false);
    }
  };

  /* delete comment */
  const handleDeleteComment = async (commentId) => {
    try {
      const r = await fetch(`${API}/artworks/comments/${commentId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail: user?.email }),
      });
      if (!r.ok) throw new Error((await r.json()).error);
      setComments(prev => prev.filter(c => c._id !== commentId));
      toast.success("Comment removed");
    } catch (e) {
      toast.error(e.message);
    }
  };

  /* edit comment */
  const handleEditComment = useCallback((updated) => {
    setComments(prev => prev.map(c => c._id === updated._id ? updated : c));
  }, []);

  const isAdmin = user?.role === "admin";
  const isOwnArtwork = user?.email && artwork?.artistEmail === user.email;
  const alreadySold = artwork?.status === "sold";

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-art-background pt-20">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-art-primary" />
          <p className="font-art-body text-sm text-art-muted">Loading artwork…</p>
        </div>
      </div>
    );
  }

  if (!artwork) return null;

  return (
    <div className="min-h-screen bg-art-background pt-20 pb-16">
      {/* Purchase Success Banner */}
      {purchaseSuccess && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-6">
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-600" />
            <div>
              <p className="font-art-body text-sm font-semibold text-emerald-800">Purchase Confirmed!</p>
              <p className="font-art-body text-xs text-emerald-700 mt-0.5">
                Congratulations on acquiring <strong>{artwork.title}</strong>. A confirmation has been sent to your email.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2">
          <Link href="/browse-artworks" className="inline-flex items-center gap-1.5 font-art-body text-xs text-art-muted hover:text-art-text transition">
            <ArrowLeft size={14} />
            Back to Gallery
          </Link>
          <span className="text-art-border">·</span>
          <span className="font-art-body text-xs text-art-muted line-clamp-1">{artwork.title}</span>
        </div>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          {/* LEFT: Image */}
          <div className="space-y-4">
            <div className="group relative overflow-hidden rounded-3xl border border-art-border bg-white shadow-sm">
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src={artwork.imageUrl || artwork.image}
                  alt={artwork.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                {/* Status overlay */}
                {alreadySold && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="rounded-2xl border border-white/20 bg-white/10 px-8 py-5 text-center backdrop-blur-md">
                      <p className="font-art-display text-3xl font-semibold text-white">Sold</p>
                      <p className="mt-1 font-art-body text-sm text-white/80">This piece has found its collector.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Meta info pills */}
            <div className="flex flex-wrap gap-2">
              {[
                { icon: Palette, label: artwork.medium || "Mixed Media" },
                { icon: Calendar, label: artwork.year || "2026" },
                { icon: Package, label: artwork.category },
              ].map(({ icon: Icon, label }) => (
                <span key={label} className="inline-flex items-center gap-1.5 rounded-full border border-art-border bg-white px-3 py-1.5 font-art-body text-xs text-art-secondary">
                  <Icon size={12} className="text-art-primary" />
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* RIGHT: Details */}
          <div className="flex flex-col gap-6">
            {/* Status + Wish */}
            <div className="flex items-center justify-between">
              <StatusBadge status={artwork.status} />
              <button
                onClick={toggleWishlist}
                aria-label="Save to wishlist"
                className="flex items-center gap-1.5 rounded-full border border-art-border bg-white px-3 py-1.5 font-art-body text-xs font-medium text-art-secondary transition hover:border-art-primary/40 hover:text-art-primary"
              >
                <Heart size={14} className={isLiked ? "fill-art-primary text-art-primary" : ""} />
                {isLiked ? "Saved" : "Save"}
              </button>
            </div>

            {/* Title + Artist */}
            <div>
              <h1 className="font-art-display text-4xl font-semibold leading-tight tracking-tight text-art-text sm:text-5xl">
                {artwork.title}
              </h1>
              <p className="mt-2 font-art-body text-sm text-art-secondary">
                by <span className="font-semibold text-art-text">{artwork.artistName || "Featured Artist"}</span>
              </p>
            </div>

            {/* Price */}
            <div className="rounded-2xl border border-art-border bg-white p-5">
              <p className="font-art-body text-[10px] font-semibold uppercase tracking-widest text-art-muted">Acquisition Value</p>
              <p className="mt-1 font-art-display text-5xl font-semibold tracking-tight text-art-text">
                ${fmt(artwork.price)}
              </p>
              <p className="mt-1.5 font-art-body text-xs text-art-muted">
                All sales include certificate of authenticity and secure shipping insurance.
              </p>
            </div>

            {/* Description */}
            {artwork.description && (
              <div>
                <h2 className="mb-2 font-art-body text-[10px] font-semibold uppercase tracking-widest text-art-muted">About This Work</h2>
                <p className="font-art-body text-sm leading-relaxed text-art-secondary">{artwork.description}</p>
              </div>
            )}

            {/* CTA */}
            {!isOwnArtwork && !isAdmin && (
              <div className="space-y-3">
                {hasPurchased ? (
                  <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                    <p className="font-art-body text-sm font-medium text-emerald-800">You own this artwork. Thank you for your support!</p>
                  </div>
                ) : alreadySold ? (
                  <div className="flex items-center gap-2 rounded-2xl border border-art-border bg-art-background p-4">
                    <AlertCircle className="h-5 w-5 shrink-0 text-art-muted" />
                    <p className="font-art-body text-sm text-art-secondary">This artwork has been acquired. Explore similar works in our gallery.</p>
                  </div>
                ) : (
                  <button
                    onClick={handlePurchase}
                    disabled={isPurchasing}
                    className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-art-primary py-4 font-art-body text-sm font-semibold text-white shadow-[0_8px_24px_rgba(228,87,79,0.3)] transition-all duration-200 hover:bg-art-primary-hover hover:shadow-[0_12px_32px_rgba(228,87,79,0.35)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isPurchasing ? (
                      <><Loader2 size={18} className="animate-spin" /> Processing…</>
                    ) : (
                      <><ShoppingBag size={18} /> Acquire This Piece · ${fmt(artwork.price)}</>
                    )}
                  </button>
                )}
                {!user && (
                  <p className="text-center font-art-body text-xs text-art-muted">
                    <Link href="/log-in" className="text-art-primary hover:underline">Sign in</Link> to purchase this artwork
                  </p>
                )}
              </div>
            )}

            {isOwnArtwork && (
              <div className="flex gap-2">
                <Link href={`/dashboard/artist`} className="flex-1">
                  <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-art-border bg-white py-3 font-art-body text-sm font-medium text-art-secondary transition hover:bg-art-background">
                    <Sparkles size={15} /> Manage in Dashboard
                  </button>
                </Link>
              </div>
            )}

            {/* Artist Info Card */}
            <div className="rounded-2xl border border-art-border bg-white p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-art-primary/10">
                  <User size={20} className="text-art-primary" />
                </div>
                <div>
                  <p className="font-art-body text-xs font-semibold uppercase tracking-wider text-art-muted">Artist</p>
                  <p className="font-art-display text-xl font-semibold text-art-text">{artwork.artistName || "Featured Artist"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <section className="mt-16">
          <div className="mb-8">
            <h2 className="font-art-display text-3xl font-semibold text-art-text">Collector Reviews</h2>
            <p className="mt-1 font-art-body text-sm text-art-secondary">
              {comments.length > 0
                ? `${comments.length} verified collector${comments.length > 1 ? "s" : ""} have shared their experience.`
                : "Be the first verified collector to share your experience with this piece."}
            </p>
          </div>

          {/* Comment Form */}
          {(hasPurchased || isAdmin) ? (
            <form onSubmit={handleComment} className="mb-10">
              <div className="rounded-2xl border border-art-border bg-white p-5">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 size={15} className="text-emerald-500" />
                  <span className="font-art-body text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                    {isAdmin ? "Admin review" : "Verified purchase"}
                  </span>
                </div>
                <textarea
                  rows={3}
                  placeholder="Share your experience with this artwork…"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full resize-none rounded-xl border border-art-border bg-art-background px-4 py-3 font-art-body text-sm text-art-text outline-none transition focus:border-art-primary focus:ring-2 focus:ring-art-primary/10 placeholder:text-art-muted"
                />
                <div className="mt-3 flex justify-end">
                  <button
                    type="submit"
                    disabled={submittingComment || !commentText.trim()}
                    className="flex items-center gap-2 rounded-full bg-art-primary px-5 py-2.5 font-art-body text-xs font-semibold text-white transition hover:bg-art-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submittingComment ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
                    Post Review
                  </button>
                </div>
              </div>
            </form>
          ) : user && !isOwnArtwork ? (
            <div className="mb-10 flex items-center gap-3 rounded-2xl border border-dashed border-art-border bg-white p-5">
              <Crown size={18} className="text-art-muted shrink-0" />
              <p className="font-art-body text-sm text-art-secondary">
                Only verified buyers of this artwork can leave a review.{" "}
                {artwork.status !== "sold" && (
                  <button onClick={handlePurchase} className="font-semibold text-art-primary hover:underline">
                    Acquire this piece
                  </button>
                )}{" "}
                to share your experience.
              </p>
            </div>
          ) : !user ? (
            <div className="mb-10 flex items-center gap-3 rounded-2xl border border-dashed border-art-border bg-white p-5">
              <MessageCircle size={18} className="text-art-muted shrink-0" />
              <p className="font-art-body text-sm text-art-secondary">
                <Link href="/log-in" className="font-semibold text-art-primary hover:underline">Sign in</Link> to leave a review.
              </p>
            </div>
          ) : null}

          {/* Comments list */}
          {comments.length > 0 ? (
            <div className="space-y-6">
              {comments.map((c) => (
                <CommentItem
                  key={c._id}
                  comment={c}
                  currentUserEmail={user?.email}
                  isAdmin={isAdmin}
                  onDelete={handleDeleteComment}
                  onEdit={handleEditComment}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-art-border bg-white p-12 text-center">
              <Star className="mx-auto h-10 w-10 text-art-muted" />
              <p className="mt-4 font-art-display text-xl font-semibold text-art-text">No reviews yet</p>
              <p className="mt-1 font-art-body text-sm text-art-secondary">Verified buyers can share their experience with this piece.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
