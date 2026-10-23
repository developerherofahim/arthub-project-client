"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import {
  Menu,
  X,
  ChevronDown,
  UserRound,
  LogOut,
  ArrowUpRight,
  LayoutDashboard,
  Heart,
  Moon,
  Sun,
} from "lucide-react";

import {
  Button,
  Dropdown,
} from "@heroui/react";

import { authClient } from "@/lib/auth-client";
import { useTheme } from "@/components/ThemeProvider";
import ThemeToggle from "@/components/ThemeToggle";

/* =========================================================
   NAVIGATION CONFIG
========================================================= */

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Browse Artworks", href: "/browse-artworks" },
];

const dashboardLinks = {
  user: {
    label: "User Dashboard",
    href: "/dashboard/user",
  },
  artist: {
    label: "Artist Dashboard",
    href: "/dashboard/artist",
  },
  admin: {
    label: "Admin Dashboard",
    href: "/dashboard/admin",
  },
};

/* =========================================================
   NAVBAR
========================================================= */

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { mounted, isDark, toggleTheme } = useTheme();

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const userRole = user?.role?.toLowerCase();
  const dashboard =
    userRole && dashboardLinks[userRole]
      ? dashboardLinks[userRole]
      : null;

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50">
        <nav className="relative mx-auto flex h-17.5 w-full items-center justify-between gap-3 border border-art-border bg-art-background/95 px-6 shadow-[0_10px_40px_rgba(16,16,16,0.06)] backdrop-blur-xl sm:px-10 lg:gap-5 lg:px-16">
          {/* ========== LOGO ========== */}
          <Link
            href="/"
            aria-label="ArtHub Home"
            className="group flex shrink-0 items-center gap-2 transition-transform duration-200 active:scale-[0.98]"
          >
            <span className="font-art-display text-3xl font-semibold leading-none tracking-[-0.04em] text-art-text sm:text-4xl">
              Art
              <span className="text-art-primary transition-colors duration-200 group-hover:text-art-primary-hover">
                Hub
              </span>
            </span>
          </Link>

          {/* ========== DESKTOP NAV LINKS ========== */}
          <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1.5 md:flex">
            {navLinks.map((link) => {
              const active = isActive(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex h-[42px] items-center rounded-full px-5 font-art-body text-[10px] font-semibold uppercase tracking-[0.12em] transition-all duration-200 ${active
                      ? "bg-art-primary/10 text-art-primary border border-art-primary/30"
                      : "text-art-secondary hover:bg-white hover:text-art-text"
                    }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* ========== RIGHT ACTIONS (Desktop) ========== */}
          <div className="ml-auto hidden items-center gap-2.5 md:flex">
            {/* Dark Mode Toggle */}
            <ThemeToggle />

            {/* Wishlist Link */}
            {user && (
              <Link
                href="/wishlist"
                aria-label="View Wishlist"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-art-border bg-white text-art-secondary transition-all hover:border-art-primary/60 hover:text-art-primary"
              >
                <Heart size={16} />
              </Link>
            )}

            {isPending ? (
              <div className="h-10.5 w-24 rounded-full bg-art-border/40"></div>
            ) : user && dashboard ? (
              <Dropdown>
                <Dropdown.Trigger
                  aria-label="Open profile menu"
                  className="group flex h-11 items-center gap-2.5 rounded-full border border-art-border bg-white px-1.5 pr-3.5 transition-all duration-200 hover:border-art-primary/60 hover:shadow-[0_4px_16px_rgba(16,16,16,0.06)]"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-art-primary-soft font-art-body text-xs font-semibold text-art-text ring-1 ring-art-primary/10">
                    {user?.name?.charAt(0)?.toUpperCase() || (
                      <UserRound size={15} strokeWidth={1.6} />
                    )}
                  </span>

                  <span className="hidden max-w-27.5 truncate font-art-body text-[11px] font-medium text-art-text xl:block">
                    {user?.name || "Profile"}
                  </span>

                  <ChevronDown
                    size={13}
                    strokeWidth={1.8}
                    className="text-art-secondary transition-transform duration-200 group-data-[open=true]:rotate-180"
                  />
                </Dropdown.Trigger>

                <Dropdown.Popover className="mt-3 min-w-60 overflow-hidden rounded-2xl border border-art-border bg-white p-1.5 shadow-[0_20px_50px_rgba(16,16,16,0.12)]">
                  <Dropdown.Menu
                    aria-label="Profile menu"
                    className="font-art-body"
                    onAction={(key) => {
                      if (key === "logout") handleLogout();
                    }}
                  >
                    <Dropdown.Item
                      id="dashboard"
                      textValue={dashboard.label}
                      href={dashboard.href}
                      className="rounded-xl px-3 py-2.5 data-[hover=true]:bg-art-primary/5"
                    >
                      <LayoutDashboard
                        size={16}
                        strokeWidth={1.5}
                        className="mr-2.5 text-art-secondary"
                      />
                      <span className="text-[13px] font-medium text-art-text">
                        {dashboard.label}
                      </span>
                    </Dropdown.Item>

                    <Dropdown.Item
                      id="logout"
                      textValue="Logout"
                      variant="danger"
                      className="rounded-xl px-3 py-2.5 data-[hover=true]:bg-red-50"
                    >
                      <LogOut
                        size={15}
                        strokeWidth={1.5}
                        className="mr-2.5"
                      />
                      <span className="text-[13px] font-medium">Logout</span>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown.Popover>
              </Dropdown>
            ) : (
              <>
                <Link href="/log-in">
                  <Button
                    variant="outline"
                    className="h-[42px] rounded-full border-art-border bg-transparent px-5 font-art-body text-[10px] font-semibold uppercase tracking-[0.11em] text-art-text transition-all duration-200 hover:border-art-text hover:bg-art-black hover:text-white"
                  >
                    Login
                  </Button>
                </Link>

                <Link href="/sign-up">
                  <Button className="h-[42px] rounded-full bg-art-primary px-5 font-art-body text-[10px] font-semibold uppercase tracking-[0.11em] text-white shadow-[0_4px_14px_rgba(228,87,79,0.25)] transition-all duration-200 hover:bg-art-primary-hover hover:shadow-[0_8px_24px_rgba(228,87,79,0.3)]">
                    Join ArtHub
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* ========== MOBILE MENU BUTTON ========== */}
          <Button
            aria-label={
              mobileOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={mobileOpen}
            onPress={() => setMobileOpen((prev) => !prev)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-art-black text-white transition-all duration-200 active:scale-95 md:hidden"
            isIconOnly
          >
            {mobileOpen ? (
              <X size={18} strokeWidth={1.7} />
            ) : (
              <Menu size={18} strokeWidth={1.7} />
            )}
          </Button>
        </nav>

        {/* =====================================================
            MOBILE MENU
        ====================================================== */}
        <div
          className={`mx-auto mt-2 max-w-[1320px] overflow-hidden rounded-[28px] bg-art-black transition-all duration-300 ease-out md:hidden ${mobileOpen
              ? "max-h-[680px] opacity-100"
              : "pointer-events-none max-h-0 opacity-0"
            }`}
        >
          <div className="p-6 pb-8">
            {/* Mobile Links */}
            <div className="flex flex-col">
              {navLinks.map((link, index) => {
                const active = isActive(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMobileMenu}
                    className={`group flex min-h-[68px] items-center justify-between border-b border-white/10 font-art-body text-sm font-semibold uppercase tracking-[0.08em] transition-colors duration-200 ${active ? "text-art-primary-hover" : "text-white"
                      }`}
                  >
                    <span className="flex items-center gap-4">
                      <span className="font-art-display text-lg font-medium text-art-gold/90">
                        0{index + 1}
                      </span>
                      <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                        {link.name}
                      </span>
                    </span>
                    <ArrowUpRight
                      size={18}
                      strokeWidth={1.5}
                      className="opacity-60 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </Link>
                );
              })}

              {user && dashboard && (
                <Link
                  href={dashboard.href}
                  onClick={closeMobileMenu}
                  className={`group flex min-h-[68px] items-center justify-between border-b border-white/10 font-art-body text-sm font-semibold uppercase tracking-[0.08em] transition-colors duration-200 ${pathname.startsWith("/dashboard")
                      ? "text-art-primary-hover"
                      : "text-white"
                    }`}
                >
                  <span className="flex items-center gap-4">
                    <span className="font-art-display text-lg text-art-gold/90">
                      03
                    </span>
                    <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                      Dashboard
                    </span>
                  </span>
                  <ArrowUpRight
                    size={18}
                    strokeWidth={1.5}
                    className="opacity-60 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
              )}

              {user && (
                <Link
                  href="/wishlist"
                  onClick={closeMobileMenu}
                  className="group flex min-h-[68px] items-center justify-between border-b border-white/10 font-art-body text-sm font-semibold uppercase tracking-[0.08em] text-white"
                >
                  <span className="flex items-center gap-4">
                    <Heart size={18} className="text-art-primary" />
                    <span>My Wishlist</span>
                  </span>
                  <ArrowUpRight size={18} className="opacity-60" />
                </Link>
              )}

              {/* Mobile theme toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                disabled={!mounted}
                aria-pressed={mounted && isDark}
                className="flex min-h-[60px] w-full items-center justify-between border-b border-white/10 font-art-body text-sm font-semibold uppercase tracking-[0.08em] text-white"
              >
                <span className="flex items-center gap-3">
                  {mounted && isDark ? (
                    <Sun size={18} className="text-amber-400" />
                  ) : (
                    <Moon size={18} />
                  )}
                  <span>{mounted && isDark ? "Light Mode" : "Dark Mode"}</span>
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] text-white/80">Toggle</span>
              </button>
            </div>

            {/* Mobile Auth */}
            <div className="mt-7 flex flex-col gap-3">
              {user ? (
                <Button
                  onPress={handleLogout}
                  className="flex min-h-[52px] w-full items-center justify-between rounded-2xl bg-art-primary px-5 font-art-body text-xs font-semibold uppercase tracking-widest text-white shadow-[0_6px_20px_rgba(228,87,79,0.3)] transition-all duration-200 active:scale-[0.98]"
                >
                  Logout
                  <LogOut size={17} strokeWidth={1.5} />
                </Button>
              ) : (
                <>
                  <Link href="/sign-up" onClick={closeMobileMenu}
                    className="flex min-h-[52px] w-full items-center justify-between rounded-2xl bg-art-primary px-5 font-art-body text-xs font-semibold uppercase tracking-widest text-white shadow-[0_6px_20px_rgba(228,87,79,0.3)] transition-all duration-200 active:scale-[0.98]"
                  >

                    Join ArtHub
                    <ArrowUpRight size={18} strokeWidth={1.5} />
                  </Link>

                  <Link href="/log-in" onClick={closeMobileMenu}
                    className="flex min-h-[52px] w-full items-center justify-between rounded-2xl border border-white/20 bg-transparent px-5 font-art-body text-xs font-semibold uppercase tracking-widest text-white transition-all duration-200 hover:border-white/40 hover:bg-white/5 active:scale-[0.98]"
                  >

                    Login
                    <ArrowUpRight size={18} strokeWidth={1.5} />
                  </Link>
                </>
              )}
            </div>

            {/* Brand statement */}
            <div className="mt-9 text-center">
              <div className="flex items-center justify-center gap-2.5">
                <span className="text-art-gold text-sm">✦</span>
                <span className="font-art-display text-lg tracking-tight text-white/90">
                  Art is a conversation.
                </span>
                <span className="text-art-gold text-sm">✦</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer */}
      <div className="h-[86px]" />
    </>
  );
}