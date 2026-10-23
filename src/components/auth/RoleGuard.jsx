"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home, ShieldAlert } from "lucide-react";
import { authClient } from "@/lib/auth-client";

const DASHBOARD_BY_ROLE = {
  admin: "/dashboard/admin",
  artist: "/dashboard/artist",
  user: "/dashboard/user",
};

const ROLE_LABELS = {
  admin: "Administrator",
  artist: "Artist",
  user: "Collector",
};

export default function RoleGuard({ allowedRoles, children }) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const role = session?.user?.role || "user";
  const isAllowed = allowedRoles.includes(role);

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) {
      router.replace("/log-in");
    }
  }, [isPending, router, session?.user]);

  if (isPending || !session?.user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-art-secondary">
        Checking your access…
      </div>
    );
  }

  if (!isAllowed) {
    const requiredRoles = allowedRoles
      .map((allowedRole) => ROLE_LABELS[allowedRole] || allowedRole)
      .join(" or ");

    return (
      <main className="flex min-h-screen items-center justify-center bg-art-background px-4 py-16">
        <section
          aria-labelledby="access-denied-title"
          className="w-full max-w-lg rounded-3xl border border-art-border bg-white p-8 text-center shadow-sm sm:p-10"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-art-primary/10 text-art-primary">
            <ShieldAlert size={30} strokeWidth={1.7} aria-hidden="true" />
          </div>

          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-art-primary">
            Access restricted
          </p>
          <h1
            id="access-denied-title"
            className="mt-2 font-art-display text-3xl font-semibold tracking-tight text-art-text"
          >
            You can’t access this dashboard
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-art-secondary">
            You’re signed in as a{" "}
            <span className="font-semibold text-art-text">
              {ROLE_LABELS[role] || role}
            </span>
            . This page is only available to{" "}
            <span className="font-semibold text-art-text">{requiredRoles}</span>
            .
          </p>
          <p className="mt-2 break-all text-xs text-art-muted">
            Signed in as {session.user.email}
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href={DASHBOARD_BY_ROLE[role] || "/"}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-art-primary px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-art-primary-hover"
            >
              <ArrowLeft size={15} aria-hidden="true" />
              Go to my dashboard
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-art-border bg-white px-6 py-3 text-xs font-semibold uppercase tracking-wider text-art-text transition hover:bg-art-background"
            >
              <Home size={15} aria-hidden="true" />
              Return home
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return children;
}
