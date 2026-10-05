"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error("Runtime Application Error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-art-background px-4 py-16 text-center">
      <div className="mx-auto max-w-md">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-art-primary ring-8 ring-red-50/50">
          <AlertCircle size={40} strokeWidth={1.5} />
        </div>

        <p className="font-art-body text-xs font-semibold uppercase tracking-[0.2em] text-art-primary">
          Exhibition Interrupted
        </p>

        <h1 className="mt-2 font-art-display text-3xl font-semibold tracking-tight text-art-text sm:text-4xl">
          Something went wrong.
        </h1>

        <p className="mt-3 font-art-body text-sm leading-relaxed text-art-secondary">
          We encountered an unexpected error while rendering this page. You can reload or return to the marketplace home.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            onClick={() => reset()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-art-primary px-6 py-3 font-art-body text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition hover:bg-art-primary-hover sm:w-auto"
          >
            <RefreshCw size={14} />
            Reload
          </button>
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-art-border bg-white px-6 py-3 font-art-body text-xs font-semibold uppercase tracking-wider text-art-text transition hover:bg-art-background sm:w-auto"
          >
            <Home size={14} />
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
