"use client";

import Image from "next/image";
import { Menu, Crown } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function TopBar({ onMenuClick }) {

  const { data: session } = authClient.useSession();
  const user = session?.user;
  const firstName = user?.name ? user.name.split(" ")[0] : "Collector";
  const avatarImage =
    user?.image ||
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face";

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-art-border bg-white px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        {/* Hamburger - mobile only */}
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-art-text hover:bg-art-background lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        <div>
          <h1 className="font-display text-xl font-semibold tracking-tight text-art-text sm:text-[26px] lg:text-[28px]">
            Collector Dashboard
          </h1>
          <p className="mt-0.5 hidden text-sm text-art-secondary sm:block">
            Hello, {firstName}. Your collection is growing.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Pro badge */}
        <div className="hidden items-center gap-1.5 rounded-full bg-art-primary/10 px-3 py-1.5 sm:flex">
          <Crown size={14} className="text-art-primary" />
          <span className="text-xs font-semibold uppercase tracking-wider text-art-primary">
            Pro Tier
          </span>
        </div>

        {/* Mobile Pro badge (icon only) */}
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-art-primary/10 sm:hidden">
          <Crown size={14} className="text-art-primary" />
        </div>

        {/* User */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Avatar - image fully covers the circle */}
          <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-art-charcoal sm:h-9 sm:w-9">
            <Image
              src={avatarImage}
              alt={user?.name || "Collector"}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 32px, 36px"
              priority
            />
          </div>

          <span className="hidden text-sm font-medium text-art-text sm:block">
            {user?.name || "Collector"}
          </span>
        </div>
      </div>
    </header>
  );
}