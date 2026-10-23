"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Pencil,
  Trash2,
  Plus,
  Loader2,
  X,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import {
  deleteArtwork,
  getArtistArtworks,
  updateArtwork,
} from "@/lib/api";

const STATUS_COLORS = {
  available: "bg-emerald-50 text-emerald-700",
  sold: "bg-art-primary/10 text-art-primary",
  draft: "bg-amber-50 text-amber-700",
};

function EditModal({ artwork, onClose, onSaved }) {
  const [title, setTitle] = useState(artwork.title || "");
  const [price, setPrice] = useState(artwork.price || "");
  const [status, setStatus] = useState(artwork.status || "available");
  const [description, setDesc] = useState(artwork.description || "");
  const [saving, setSaving] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = await updateArtwork(artwork._id, {
        title: title.trim(),
        price: Number(price),
        status,
        description: description.trim(),
      });
      onSaved(data.artwork);
      toast.success("Artwork updated!");
      onClose();
    } catch (e) {
      toast.error(e.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-[var(--color-art-border)] bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-[var(--color-art-border)] px-6 py-4">
          <h2 className="font-display text-lg font-semibold text-[var(--color-art-text)]">
            Edit Artwork
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[var(--color-art-muted)] hover:bg-[var(--color-art-background)]"
          >
            <X size={18} />
          </button>
        </div>
        <form onSubmit={save} className="space-y-4 p-6">
          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-[var(--color-art-muted)]">
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-[var(--color-art-border)] bg-[var(--color-art-background)] px-4 py-2.5 text-sm text-[var(--color-art-text)] outline-none focus:border-[var(--color-art-primary)]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-[var(--color-art-muted)]">
              Price (USD)
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="1"
              className="w-full rounded-xl border border-[var(--color-art-border)] bg-[var(--color-art-background)] px-4 py-2.5 text-sm text-[var(--color-art-text)] outline-none focus:border-[var(--color-art-primary)]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-[var(--color-art-muted)]">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-xl border border-[var(--color-art-border)] bg-[var(--color-art-background)] px-4 py-2.5 text-sm text-[var(--color-art-text)] outline-none focus:border-[var(--color-art-primary)]"
            >
              <option value="available">Available for Sale</option>
              <option value="draft">Save as Draft</option>
              <option value="sold">Mark as Sold</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-[var(--color-art-muted)]">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDesc(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-xl border border-[var(--color-art-border)] bg-[var(--color-art-background)] px-4 py-2.5 text-sm text-[var(--color-art-text)] outline-none focus:border-[var(--color-art-primary)]"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-full border border-[var(--color-art-border)] py-2.5 text-sm font-medium text-[var(--color-art-secondary)] transition hover:bg-[var(--color-art-background)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[var(--color-art-primary)] py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-art-primary-hover)] disabled:opacity-60"
            >
              {saving ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <CheckCircle2 size={14} />
              )}
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function GalleryTable() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const email = user?.email;

  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editTarget, setEditTarget] = useState(null);
  const [deleting, setDeleting] = useState({});

  useEffect(() => {
    if (!email) {;
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const data = await getArtistArtworks(email);
        if (!cancelled) {
          setArtworks(Array.isArray(data.artworks) ? data.artworks : []);
        }
      } catch {
        if (!cancelled) {
          setArtworks([]);
          toast.error("Failed to load artist artworks");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [email]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this artwork permanently?")) return;
    setDeleting((prev) => ({ ...prev, [id]: true }));
    try {
      await deleteArtwork(id);
      setArtworks((prev) => prev.filter((a) => a._id !== id));
      toast.success("Artwork deleted");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setDeleting((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleSaved = (updated) => {
    setArtworks((prev) =>
      prev.map((a) => (a._id === updated._id ? updated : a))
    );
  };

  const filtered = artworks.filter(
    (a) =>
      !searchQuery.trim() ||
      a.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {editTarget && (
        <EditModal
          artwork={editTarget}
          onClose={() => setEditTarget(null)}
          onSaved={handleSaved}
        />
      )}

      <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--color-art-border)] bg-white shadow-sm sm:mt-8">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-[var(--color-art-border)] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="font-display text-lg font-semibold text-[var(--color-art-text)]">
              My Gallery
            </h2>
            {!loading && (
              <p className="text-xs text-[var(--color-art-muted)]">
                {artworks.length} artwork{artworks.length !== 1 ? "s" : ""} listed
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-56">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-art-muted)]"
              />
              <input
                type="text"
                placeholder="Search artworks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-[var(--color-art-border)] bg-[var(--color-art-background)] py-2 pl-9 pr-4 text-sm text-[var(--color-art-text)] placeholder:text-[var(--color-art-muted)] focus:border-[var(--color-art-primary)] focus:outline-none"
              />
            </div>
            <Link href="/dashboard/artist/artworks/new">
              <button className="flex shrink-0 items-center gap-1.5 rounded-full bg-[var(--color-art-primary)] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[var(--color-art-primary-hover)]">
                <Plus size={14} /> Add New
              </button>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--color-art-primary)]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <AlertCircle className="mx-auto h-10 w-10 text-[var(--color-art-muted)]" />
            <p className="mt-3 font-display text-lg font-semibold text-[var(--color-art-text)]">
              {artworks.length === 0 ? "No artworks yet" : "No results"}
            </p>
            <p className="mt-1 text-sm text-[var(--color-art-muted)]">
              {artworks.length === 0
                ? "Start by adding your first artwork."
                : "Try a different search term."}
            </p>
            {artworks.length === 0 && (
              <Link href="/dashboard/artist/artworks/new">
                <button className="mt-5 rounded-full bg-[var(--color-art-primary)] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[var(--color-art-primary-hover)]">
                  Add Your First Artwork
                </button>
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="border-b border-[var(--color-art-border)] text-left text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-art-muted)]">
                    <th className="px-6 py-3.5">Artwork</th>
                    <th className="px-4 py-3.5">Category</th>
                    <th className="px-4 py-3.5">Price</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((art) => (
                    <tr
                      key={art._id}
                      className="border-b border-[var(--color-art-border)] last:border-0 hover:bg-[var(--color-art-background)]/50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-[var(--color-art-border)]">
                            {art.imageUrl && (
                              <Image
                                src={art.imageUrl}
                                alt={art.title}
                                fill
                                className="object-cover"
                                sizes="44px"
                              />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-[var(--color-art-text)]">
                              {art.title}
                            </p>
                            <p className="text-xs text-[var(--color-art-muted)]">
                              {art.medium}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-[var(--color-art-secondary)]">
                        {art.category}
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-[var(--color-art-text)]">
                        ${Number(art.price).toLocaleString()}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                            STATUS_COLORS[art.status] ||
                            "bg-[var(--color-art-border)] text-[var(--color-art-secondary)]"
                          }`}
                        >
                          {art.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditTarget(art)}
                            className="rounded-lg p-1.5 text-[var(--color-art-muted)] transition hover:bg-[var(--color-art-background)] hover:text-[var(--color-art-text)]"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(art._id)}
                            disabled={!!deleting[art._id]}
                            className="rounded-lg p-1.5 text-[var(--color-art-muted)] transition hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                          >
                            {deleting[art._id] ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="space-y-3 p-4 md:hidden">
              {filtered.map((art) => (
                <div
                  key={art._id}
                  className="rounded-xl border border-[var(--color-art-border)] p-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-[var(--color-art-border)]">
                      {art.imageUrl && (
                        <Image
                          src={art.imageUrl}
                          alt={art.title}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-[var(--color-art-text)]">
                        {art.title}
                      </p>
                      <p className="text-xs text-[var(--color-art-muted)]">
                        {art.category}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="text-xs font-medium text-[var(--color-art-text)]">
                          ${Number(art.price).toLocaleString()}
                        </span>
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${
                            STATUS_COLORS[art.status] || ""
                          }`}
                        >
                          {art.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => setEditTarget(art)}
                        className="rounded-lg p-1.5 text-[var(--color-art-muted)] transition hover:bg-[var(--color-art-background)]"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(art._id)}
                        disabled={!!deleting[art._id]}
                        className="rounded-lg p-1.5 text-[var(--color-art-muted)] transition hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                      >
                        {deleting[art._id] ? (
                          <Loader2 size={15} className="animate-spin" />
                        ) : (
                          <Trash2 size={15} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}