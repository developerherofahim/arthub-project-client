import Link from "next/link";
import { Compass, Home, ArrowLeft } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-art-background px-4 py-16 text-center">
      <div className="fixed right-4 top-4 z-50 sm:right-6 sm:top-6">
        <ThemeToggle />
      </div>
      <div className="mx-auto max-w-md">
        {/* Artistic Illustration Icon */}
        <div className="relative mx-auto mb-8 flex h-28 w-28 items-center justify-center rounded-3xl border border-art-border bg-white shadow-md">
          <div className="absolute inset-0 rounded-3xl bg-art-primary/5 blur-md" />
          <Compass size={56} className="text-art-primary" strokeWidth={1.4} />
          <span className="absolute -top-2 -right-2 rounded-full bg-art-primary px-2 py-0.5 font-mono text-[10px] font-bold text-white shadow-xs">
            404
          </span>
        </div>

        <p className="font-art-body text-xs font-semibold uppercase tracking-[0.2em] text-art-primary">
          Canvas Not Found
        </p>

        <h1 className="mt-2 font-art-display text-4xl font-semibold tracking-tight text-art-text sm:text-5xl">
          Page Not Found
        </h1>

        <p className="mt-3 font-art-body text-sm leading-relaxed text-art-secondary">
          The artwork, exhibition, or page you are searching for might have been moved, sold out, or never existed in our catalog.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-art-primary px-6 py-3 font-art-body text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition hover:bg-art-primary-hover sm:w-auto"
          >
            <Home size={15} />
            Back to Home
          </Link>
          <Link
            href="/browse-artworks"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-art-border bg-white px-6 py-3 font-art-body text-xs font-semibold uppercase tracking-wider text-art-text transition hover:bg-art-background sm:w-auto"
          >
            <Compass size={15} />
            Browse Artworks
          </Link>
        </div>
      </div>
    </div>
  );
}
