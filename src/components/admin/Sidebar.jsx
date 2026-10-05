"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    BarChart3,
    Users,
    Image,
    CreditCard,
    Settings,
    HelpCircle,
    LogOut,
    X,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

const menuItems = [
    { label: "Analytics", href: "/dashboard/admin", icon: BarChart3 },
    { label: "Users", href: "/dashboard/admin/users", icon: Users },
    { label: "Artworks", href: "/dashboard/admin/artworks", icon: Image },
    { label: "Transactions", href: "/dashboard/admin/transactions", icon: CreditCard },
    { label: "Settings", href: "/dashboard/admin/settings", icon: Settings },
];

const supportItems = [
    { label: "Help Center", href: "/dashboard/admin/settings", icon: HelpCircle },
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
                className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 lg:hidden ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"
                    }`}
                onClick={onClose}
            />

            <aside
                className={`
          fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-[var(--color-art-border)] bg-white
          transition-transform duration-300 ease-in-out
          lg:static lg:w-64 lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
            >
                {/* Logo */}
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
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-[var(--color-art-muted)] hover:bg-[var(--color-art-background)] lg:hidden"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Menu */}
                <p className="px-5 pb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-art-muted)] lg:px-6">
                    Menu
                </p>
                <nav className="flex flex-col gap-1 px-3">
                    {menuItems.map((item) => {
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
                                        ? "bg-[var(--color-art-primary)]/10 text-[var(--color-art-primary)]"
                                        : "text-[var(--color-art-secondary)] hover:bg-[var(--color-art-background)] hover:text-[var(--color-art-text)]"
                                    }
                `}
                            >
                                {isActive && (
                                    <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-[var(--color-art-primary)]" />
                                )}
                                <Icon
                                    size={18}
                                    strokeWidth={isActive ? 2.2 : 1.8}
                                    className={isActive ? "text-[var(--color-art-primary)]" : "text-[var(--color-art-muted)]"}
                                />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Support */}
                <div className="mt-auto">
                    <p className="px-5 pb-3 pt-6 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-art-muted)] lg:px-6">
                        Support
                    </p>
                    <nav className="flex flex-col gap-1 px-3 pb-2">
                        {supportItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={onClose}
                                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--color-art-secondary)] transition-colors hover:bg-[var(--color-art-background)] hover:text-[var(--color-art-text)]"
                                >
                                    <Icon size={18} strokeWidth={1.8} className="text-[var(--color-art-muted)]" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="border-t border-[var(--color-art-border)] px-3 py-4">
                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--color-art-secondary)] transition-colors hover:bg-[var(--color-art-background)] hover:text-[var(--color-art-text)]"
                        >
                            <LogOut size={18} strokeWidth={1.8} className="text-[var(--color-art-muted)]" />
                            Log Out
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}