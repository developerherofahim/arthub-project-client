import Image from "next/image";

// ArtworkCard.jsx
export default function ArtworkCard({ artwork }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-art-border bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={artwork.image}
          alt={artwork.title}
          fill
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-art-muted">
          {artwork.type}
        </p>
        <h3 className="mt-1 font-display text-base font-semibold tracking-tight text-art-text sm:text-lg">
          {artwork.title}
        </h3>
        <p className="mt-0.5 text-sm text-art-secondary">
          by {artwork.artist}
        </p>
      </div>
    </article>
  );
}