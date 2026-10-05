"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { MoreHorizontal, Loader2, User, Trash2, ShieldCheck, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const tabs = ["Users", "Artworks", "Transactions"];

const ROLE_COLORS = {
  admin:  "bg-art-primary/10 text-art-primary",
  artist: "bg-blue-50 text-blue-700",
  user:   "bg-[var(--color-art-background)] text-[var(--color-art-secondary)]",
};

const STATUS_COLORS = {
  available: "bg-emerald-50 text-emerald-600",
  sold:      "bg-art-primary/10 text-art-primary",
  draft:     "bg-amber-50 text-amber-600",
  completed: "bg-emerald-50 text-emerald-600",
  pending:   "bg-amber-50 text-amber-600",
};

export default function ManageCollections() {
  const [activeTab, setActiveTab] = useState("Users");
  const [users, setUsers]               = useState([]);
  const [artworks, setArtworks]         = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading]           = useState(false);
  const [actionLoading, setActionLoading] = useState({});

  const fetchData = useCallback(async (tab) => {
    setLoading(true);
    try {
      if (tab === "Users") {
        const r = await fetch(`${API}/users`);
        setUsers(await r.json());
      } else if (tab === "Artworks") {
        const r = await fetch(`${API}/artworks?limit=50`);
        const d = await r.json();
        setArtworks(Array.isArray(d.artworks) ? d.artworks : []);
      } else {
        const r = await fetch(`${API}/transactions`);
        setTransactions(await r.json());
      }
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(activeTab); }, [activeTab, fetchData]);

  const changeRole = async (userId, newRole) => {
    setActionLoading(prev => ({ ...prev, [userId]: true }));
    try {
      const r = await fetch(`${API}/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (!r.ok) throw new Error((await r.json()).error);
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
      toast.success(`Role updated to ${newRole}`);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  const deleteArtwork = async (id) => {
    if (!confirm("Delete this artwork permanently?")) return;
    setActionLoading(prev => ({ ...prev, [id]: true }));
    try {
      const r = await fetch(`${API}/artworks/${id}`, { method: "DELETE" });
      if (!r.ok) throw new Error((await r.json()).error);
      setArtworks(prev => prev.filter(a => a._id !== id));
      toast.success("Artwork deleted");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--color-art-border)] bg-white shadow-sm sm:mt-8">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-[var(--color-art-border)] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <h2 className="font-display text-lg font-semibold text-[var(--color-art-text)]">Manage Collections</h2>
        <div className="flex items-center gap-3">
          <button onClick={() => fetchData(activeTab)} className="flex items-center gap-1 rounded-lg border border-[var(--color-art-border)] p-2 text-[var(--color-art-muted)] hover:bg-[var(--color-art-background)] transition">
            <RefreshCw size={15} />
          </button>
          <div className="flex rounded-full border border-[var(--color-art-border)] bg-[var(--color-art-background)] p-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "bg-white text-[var(--color-art-text)] shadow-sm"
                    : "text-[var(--color-art-muted)] hover:text-[var(--color-art-secondary)]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--color-art-primary)]" />
        </div>
      ) : (
        <>
          {/* Users Table */}
          {activeTab === "Users" && (
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="border-b border-[var(--color-art-border)] text-left text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-art-muted)]">
                    <th className="px-6 py-3.5">Name</th>
                    <th className="px-4 py-3.5">Email</th>
                    <th className="px-4 py-3.5">Role</th>
                    <th className="px-4 py-3.5">Tier</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="border-b border-[var(--color-art-border)] last:border-0 hover:bg-[var(--color-art-background)]/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-[var(--color-art-border)]">
                            {user.image ? (
                              <Image src={user.image} alt={user.name || ""} fill className="object-cover" sizes="36px" />
                            ) : (
                              <div className="flex h-full items-center justify-center">
                                <User size={14} className="text-[var(--color-art-muted)]" />
                              </div>
                            )}
                          </div>
                          <span className="font-medium text-[var(--color-art-text)]">{user.name || "—"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-[var(--color-art-secondary)]">{user.email}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${ROLE_COLORS[user.role] || ""}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-xs capitalize text-[var(--color-art-muted)]">
                        {user.subscriptionTier || "free"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {actionLoading[user._id] ? (
                            <Loader2 size={15} className="animate-spin text-[var(--color-art-muted)]" />
                          ) : (
                            <select
                              value={user.role}
                              onChange={e => changeRole(user._id, e.target.value)}
                              className="rounded-lg border border-[var(--color-art-border)] bg-white px-2 py-1 text-xs text-[var(--color-art-secondary)] focus:outline-none"
                            >
                              <option value="user">User</option>
                              <option value="artist">Artist</option>
                              <option value="admin">Admin</option>
                            </select>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Artworks Table */}
          {activeTab === "Artworks" && (
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="border-b border-[var(--color-art-border)] text-left text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-art-muted)]">
                    <th className="px-6 py-3.5">Artwork</th>
                    <th className="px-4 py-3.5">Artist</th>
                    <th className="px-4 py-3.5">Category</th>
                    <th className="px-4 py-3.5">Price</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {artworks.map((art) => (
                    <tr key={art._id} className="border-b border-[var(--color-art-border)] last:border-0 hover:bg-[var(--color-art-background)]/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-[var(--color-art-border)]">
                            {art.imageUrl && <Image src={art.imageUrl} alt={art.title} fill className="object-cover" sizes="40px" />}
                          </div>
                          <p className="font-medium text-[var(--color-art-text)]">{art.title}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-[var(--color-art-secondary)]">{art.artistName || "—"}</td>
                      <td className="px-4 py-4 text-sm text-[var(--color-art-secondary)]">{art.category}</td>
                      <td className="px-4 py-4 text-sm font-medium text-[var(--color-art-text)]">${Number(art.price).toLocaleString()}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${STATUS_COLORS[art.status] || ""}`}>
                          {art.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {actionLoading[art._id] ? (
                          <Loader2 size={15} className="animate-spin text-[var(--color-art-muted)]" />
                        ) : (
                          <button onClick={() => deleteArtwork(art._id)} className="rounded-lg p-1.5 text-[var(--color-art-muted)] hover:bg-red-50 hover:text-red-500 transition">
                            <Trash2 size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Transactions Table */}
          {activeTab === "Transactions" && (
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="border-b border-[var(--color-art-border)] text-left text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-art-muted)]">
                    <th className="px-6 py-3.5">Reference ID</th>
                    <th className="px-4 py-3.5">Buyer</th>
                    <th className="px-4 py-3.5">Artwork</th>
                    <th className="px-4 py-3.5">Date</th>
                    <th className="px-4 py-3.5">Amount</th>
                    <th className="px-4 py-3.5">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((txn) => (
                    <tr key={txn._id || txn.transactionId} className="border-b border-[var(--color-art-border)] last:border-0 hover:bg-[var(--color-art-background)]/50">
                      <td className="px-6 py-4 font-mono text-sm text-[var(--color-art-text)]">{txn.transactionId}</td>
                      <td className="px-4 py-4 text-sm font-medium text-[var(--color-art-text)]">{txn.buyerName || txn.buyerEmail}</td>
                      <td className="px-4 py-4 text-sm text-[var(--color-art-secondary)]">{txn.artworkTitle || txn.tier || "—"}</td>
                      <td className="px-4 py-4 text-sm text-[var(--color-art-muted)]">
                        {txn.createdAt ? new Date(txn.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-[var(--color-art-text)]">${Number(txn.amount || 0).toLocaleString()}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${STATUS_COLORS[txn.status] || ""}`}>
                          {txn.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Mobile Cards */}
          <div className="space-y-3 p-4 md:hidden">
            {activeTab === "Users" && users.map((user) => (
              <div key={user._id} className="flex items-center gap-3 rounded-xl border border-[var(--color-art-border)] p-3">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[var(--color-art-border)]">
                  {user.image ? (
                    <Image src={user.image} alt={user.name || ""} fill className="object-cover" sizes="40px" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <User size={14} className="text-[var(--color-art-muted)]" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-[var(--color-art-text)]">{user.name}</p>
                  <p className="truncate text-xs text-[var(--color-art-muted)]">{user.email}</p>
                  <span className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${ROLE_COLORS[user.role] || ""}`}>{user.role}</span>
                </div>
                <select value={user.role} onChange={e => changeRole(user._id, e.target.value)} className="rounded-lg border border-[var(--color-art-border)] bg-white px-2 py-1 text-xs text-[var(--color-art-secondary)] focus:outline-none">
                  <option value="user">User</option>
                  <option value="artist">Artist</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            ))}
            {activeTab === "Artworks" && artworks.map((art) => (
              <div key={art._id} className="flex items-center gap-3 rounded-xl border border-[var(--color-art-border)] p-3">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-[var(--color-art-border)]">
                  {art.imageUrl && <Image src={art.imageUrl} alt={art.title} fill className="object-cover" sizes="40px" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-[var(--color-art-text)]">{art.title}</p>
                  <p className="truncate text-xs text-[var(--color-art-muted)]">{art.artistName} · ${Number(art.price).toLocaleString()}</p>
                  <span className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${STATUS_COLORS[art.status] || ""}`}>{art.status}</span>
                </div>
                <button onClick={() => deleteArtwork(art._id)} className="rounded-lg p-1.5 text-[var(--color-art-muted)] hover:text-red-500 transition">
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
            {activeTab === "Transactions" && transactions.map((txn) => (
              <div key={txn._id} className="flex items-center justify-between rounded-xl border border-[var(--color-art-border)] p-3">
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-xs font-semibold text-[var(--color-art-text)]">{txn.transactionId}</p>
                  <p className="text-xs text-[var(--color-art-secondary)]">{txn.buyerName || txn.buyerEmail}</p>
                  <span className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${STATUS_COLORS[txn.status] || ""}`}>{txn.status}</span>
                </div>
                <p className="text-sm font-semibold text-[var(--color-art-text)]">${Number(txn.amount || 0).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}