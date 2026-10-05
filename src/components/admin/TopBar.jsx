"use client";

import Image from "next/image";
import { Menu, Bell, ChevronDown } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function TopBar({ onMenuClick }) {
    const { data: session } = authClient.useSession();
    const user = session?.user;
    const displayName = user?.name ? user.name.split(" ")[0] : "Admin";
    const avatarImage =
      user?.image ||
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face";

    return (
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[var(--color-art-border)] bg-white px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
                <button
                    onClick={onMenuClick}
                    className="rounded-lg p-2 text-[var(--color-art-text)] hover:bg-[var(--color-art-background)] lg:hidden"
                    aria-label="Open menu"
                >
                    <Menu size={22} />
                </button>

                <div>
                    <h1 className="font-display text-xl font-semibold tracking-tight text-[var(--color-art-text)] sm:text-[26px] lg:text-[28px]">
                        Dashboard
                    </h1>
                    <p className="mt-0.5 hidden text-sm text-[var(--color-art-secondary)] sm:block">
                        Welcome back, {displayName}.
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
                {/* Notification */}
                <button className="relative rounded-full p-2 text-[var(--color-art-secondary)] hover:bg-[var(--color-art-background)]">
                    <Bell size={20} />
                    <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[var(--color-art-primary)]" />
                </button>

                {/* User */}
                <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-[var(--color-art-charcoal)] sm:h-9 sm:w-9">
                        <Image
                            src={avatarImage}
                            alt={user?.name || "Admin"}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 32px, 36px"
                            priority
                        />
                    </div>
                    <div className="hidden items-center gap-1 sm:flex">
                        <span className="text-sm font-medium text-[var(--color-art-text)]">
                            {user?.name || "Administrator"}
                        </span>
                        <ChevronDown size={16} className="text-[var(--color-art-muted)]" />
                    </div>
                </div>
            </div>
        </header>
    );
}