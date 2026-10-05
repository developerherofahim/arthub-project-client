export default function Loading() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-art-background px-4">
      <div className="relative flex items-center justify-center">
        {/* Outer glowing ripple */}
        <div className="absolute h-20 w-20 animate-ping rounded-full bg-art-primary/20" />
        {/* Spinning border ring */}
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-art-primary/20 border-t-art-primary" />
        {/* Center symbol */}
        <span className="absolute font-art-display text-xl font-bold text-art-primary">✦</span>
      </div>
      <p className="mt-6 font-art-display text-lg font-medium text-art-text">Curating Marketplace...</p>
      <p className="mt-1 font-art-body text-xs text-art-muted uppercase tracking-widest">ArtHub</p>
    </div>
  );
}
