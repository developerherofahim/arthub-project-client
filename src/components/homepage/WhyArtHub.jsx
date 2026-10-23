import Link from "next/link";
import { ShieldCheck, Truck, Sparkles, HeartHandshake } from "lucide-react";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Verified Authenticity",
    description: "Every artwork is authenticated directly by the creator and issued with a cryptographic certificate.",
  },
  {
    icon: Truck,
    title: "White-Glove Delivery",
    description: "Museum-standard crating and climate-managed express international shipping right to your door.",
  },
  {
    icon: Sparkles,
    title: "Emerging & Master Talents",
    description: "Curated portfolio spanning established contemporary pioneers and high-potential emerging voices.",
  },
  {
    icon: HeartHandshake,
    title: "Direct Artist Support",
    description: "ArtHub delivers up to 85% net payouts directly to artists, democratizing art commerce globally.",
  },
];

export default function WhyArtHub() {
  return (
    <section className="py-24 bg-art-black text-white relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-art-gold text-xs font-semibold uppercase tracking-widest">
            The ArtHub Difference
          </span>
          <h2 className="font-art-display text-4xl sm:text-5xl font-medium tracking-tight text-white mt-3">
            Democratizing Original Art for Collectors Worldwide
          </h2>
          <p className="pt-4 font-art-body text-sm sm:text-base text-white/60">
            A secure, streamlined, and transparent bridge between visionary artists and passionate collectors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm hover:border-art-primary/50 transition-colors"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-art-primary/20 text-art-primary mb-5">
                  <Icon size={24} />
                </div>
                <h3 className="font-art-display text-xl font-semibold text-white">
                  {feat.title}
                </h3>
                <p className="pt-2 font-art-body text-xs text-white/60 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Join as artist CTA */}
        <div className="mt-20 rounded-3xl border border-white/10 bg-gradient-to-r from-art-primary/20 via-white/5 to-transparent p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-art-display text-3xl font-semibold text-white">
              Are you an artist looking to share your voice?
            </h3>
            <p className="pt-2 font-art-body text-sm text-white/70 max-w-xl">
              Join our global creator community, manage your portfolio, and sell directly to collectors with low platform fees.
            </p>
          </div>
          <Link
            href="/sign-up"
            className="shrink-0 rounded-full bg-art-primary px-8 py-3.5 font-art-body text-xs font-semibold uppercase tracking-wider text-white shadow-lg hover:bg-art-primary-hover transition"
          >
            Apply to Exhibit
          </Link>
        </div>
      </div>
    </section>
  );
}
