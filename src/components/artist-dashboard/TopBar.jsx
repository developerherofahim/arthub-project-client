'use client';

import { Menu, Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { authClient } from '@/lib/auth-client';
import ThemeToggle from '@/components/ThemeToggle';

const TopBar = ({onMenuClick}) => {
    const { data: session } = authClient.useSession();
    const user = session?.user;
    const avatarImage =
      user?.image ||
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face";

    return (
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[var(--color-art-border)] bg-white px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
                <button
                    onClick={onMenuClick}
                    className="rounded-lg p-2 text-art-text hover:bg-[var(--color-art-background)] lg:hidden"
                    aria-label="Open menu"
                >
                    <Menu size={22} />
                </button>

                <div>
                    <h1 className="font-display text-xl font-semibold tracking-tight text-[var(--color-art-text)] sm:text-[26px] lg:text-[28px]">
                        Manage Artworks
                    </h1>
                    <p className="mt-0.5 hidden text-sm text-[var(--color-art-secondary)] sm:block">
                        Showcasing your creative vision.
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
                <ThemeToggle />

                {/* Add New Artwork button */}
                <Link href="/dashboard/artist/artworks/new" className="flex items-center cursor-pointer gap-1.5 rounded-full bg-[var(--color-art-primary)] px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-art-primary-hover)] sm:px-4">
                    <Plus size={16} strokeWidth={2.5} />
                    <span className="hidden sm:inline">Add New Artwork</span>
                    <span className="sm:hidden">Add</span>
                </Link>

                {/* User */}
                <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-[var(--color-art-charcoal)] sm:h-9 sm:w-9">
                        <Image
                            src={avatarImage}
                            alt={user?.name || "Artist"}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 32px, 36px"
                            priority
                        />
                    </div>
                    <span className="hidden text-sm font-medium text-[var(--color-art-text)] sm:block">
                        {user?.name || "Artist"}
                    </span>
                </div>
            </div>
        </header>
    );
};

export default TopBar;