"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Heart,
  History,
  Crown,
  User,
  LogOut,
  X,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

const navItems = [
  { label: "My Gallery", href: "/dashboard/user", icon: Heart },
  { label: "Purchase History", href: "/dashboard/user/history", icon: History },
  { label: "Subscription", href: "/dashboard/user/subscription", icon: Crown },
  { label: "Profile", href: "/dashboard/user/profile", icon: User },
];

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/log-in");
    router.refresh();
  };

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 lg:hidden ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-art-border bg-white
          transition-transform duration-300 ease-in-out
          lg:static lg:translate-x-0 lg:w-64
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo + close button */}
        <div className="flex items-center justify-between px-5 py-5 lg:px-6 lg:py-6">
          <Link
            href="/"
            aria-label="ArtHub Home"
            className="group flex shrink-0 items-center gap-2"
          >

            <span className="font-art-display text-3xl font-semibold leading-none tracking-[-0.04em] text-art-text sm:text-4xl">
              Art<span className="text-art-primary">Hub</span>
            </span>
          </Link>


          {/* Close button - mobile only */}
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-art-muted hover:bg-art-background lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Section label */}
        <p className="px-5 pb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-art-muted lg:px-6">
          My Collection
        </p>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col gap-1 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`
                  relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
                  ${isActive
                    ? "bg-art-primary/10 text-art-primary"
                    : "text-art-secondary hover:bg-art-background hover:text-art-text"
                  }
                `}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-art-primary" />
                )}
                <Icon
                  size={18}
                  strokeWidth={isActive ? 2.2 : 1.8}
                  className={
                    isActive
                      ? "text-art-primary"
                      : "text-art-muted"
                  }
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-art-border px-3 py-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-art-secondary transition-colors hover:bg-art-background hover:text-art-text"
          >
            <LogOut size={18} strokeWidth={1.8} className="text-art-muted" />
            Log Out
          </button>
        </div>
      </aside>
    </>
  );
}