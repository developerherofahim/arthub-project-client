"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { toast } from "react-toastify";
import { getUserProfile, updateUserProfile } from "@/lib/api";

export default function UserProfilePage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      if (!user?.email) {
        setLoading(false);
        return;
      }
      try {
        const data = await getUserProfile(user.email);
        setName(data.name || user.name || "");
        setBio(data.bio || "Passionate art collector interested in original paintings and sculptural forms.");
        setAvatar(data.image || user.image || "");
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user?.email) return;
    setSaving(true);
    try {
      await updateUserProfile({
        email: user.email,
        name,
        bio,
        image: avatar,
      });
      toast.success("Collector profile updated successfully!");
    } catch (err) {
      toast.error(err.message || "Network error updating profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="font-art-display text-2xl font-semibold text-art-text sm:text-3xl">
          Collector Profile
        </h2>
        <p className="mt-1 text-sm text-art-secondary">
          Manage your personal details, public bio, and preferences.
        </p>
      </div>

      <form
        onSubmit={handleSave}
        className="space-y-6 rounded-2xl border border-art-border bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="flex items-center gap-4 border-b border-art-border pb-6">
          <div className="relative h-16 w-16 overflow-hidden rounded-full bg-art-charcoal border border-art-border">
            <Image
              src={
                avatar ||
                user?.image ||
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face"
              }
              alt={name || "Collector"}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="font-art-display text-lg font-semibold text-art-text">
              {name || user?.name || "Collector"}
            </h3>
            <p className="text-xs text-art-muted">{user?.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block font-art-body text-xs font-semibold uppercase tracking-wider text-art-secondary">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-art-border bg-white px-4 py-2.5 font-art-body text-sm text-art-text outline-none focus:border-art-primary"
              placeholder="Your full name"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block font-art-body text-xs font-semibold uppercase tracking-wider text-art-secondary">
              Email Address (Account ID)
            </label>
            <input
              type="email"
              disabled
              value={user?.email || ""}
              className="w-full rounded-xl border border-art-border bg-art-background px-4 py-2.5 font-art-body text-sm text-art-muted outline-none cursor-not-allowed"
            />
          </div>

          <div>
            <label className="mb-1.5 block font-art-body text-xs font-semibold uppercase tracking-wider text-art-secondary">
              Profile Photo URL
            </label>
            <input
              type="url"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="w-full rounded-xl border border-art-border bg-white px-4 py-2.5 font-art-body text-sm text-art-text outline-none focus:border-art-primary"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="mb-1.5 block font-art-body text-xs font-semibold uppercase tracking-wider text-art-secondary">
              Collector Bio & Curation Interests
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full rounded-xl border border-art-border bg-white p-4 font-art-body text-sm text-art-text outline-none focus:border-art-primary"
              placeholder="Tell artists and curators about the art styles you collect..."
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-art-primary px-6 py-2.5 font-art-body text-xs font-semibold text-white shadow-sm transition hover:bg-art-primary-hover disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
