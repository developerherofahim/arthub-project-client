import Link from "next/link";

import {
  ArrowUpRight,
  Instagram,
  Facebook,
  Twitter,
  Mail,
  ArrowRight,
} from "lucide-react";
import { LogoAppStore, LogoFacebook, LogoGooglePlay } from "@gravity-ui/icons";

/* =========================================================
   FOOTER
========================================================= */

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-art-black text-white">

      {/* =====================================================
          NEWSLETTER / CTA
      ====================================================== */}

      <section className="border-b border-white/10">
        <div className="mx-auto max-w-[1320px] px-5 py-16 sm:px-8 md:py-20 lg:px-10 lg:py-24">

          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-end">

            {/* Editorial Statement */}

            <div>
              <div className="mb-5 flex items-center gap-3">
                <span className="text-art-gold">
                  ✦
                </span>

                <span className="font-art-body text-[10px] font-semibold uppercase tracking-[0.16em] text-art-primary-hover">
                  The ArtHub Journal
                </span>
              </div>

              <h2 className="max-w-[620px] font-art-display text-[42px] font-medium leading-[0.95] tracking-[-0.035em] text-white sm:text-[52px] lg:text-[64px]">
                Stay close to
                <span className="text-art-primary-hover">
                  {" "}the art.
                </span>
              </h2>

              <p className="mt-5 max-w-130 font-art-body text-sm leading-7 text-white/55 sm:text-base">
                Discover new artists, original works, curated
                collections, and stories from the creative world.
              </p>
            </div>

            {/* Newsletter */}

            <div className="lg:pl-12">

              <form className="group">

                <label
                  htmlFor="footer-email"
                  className="mb-3 block font-art-body text-[10px] font-semibold uppercase tracking-[0.14em] text-white/45"
                >
                  Join the ArtHub community
                </label>

                <div className="flex flex-col gap-3 sm:flex-row">

                  <div className="flex min-h-[54px] flex-1 items-center gap-3 rounded-xl border border-white/15 bg-white/[0.04] px-4 transition-colors duration-200 focus-within:border-art-primary">
                    <Mail
                      size={17}
                      strokeWidth={1.5}
                      className="shrink-0 text-white/40"
                    />

                    <input
                      id="footer-email"
                      type="email"
                      placeholder="Your email address"
                      aria-label="Your email address"
                      className="min-w-0 flex-1 bg-transparent font-art-body text-sm text-white outline-none placeholder:text-white/35"
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex min-h-[54px] items-center justify-center gap-3 rounded-xl bg-art-primary px-6 font-art-body text-[10px] font-semibold uppercase tracking-[0.12em] text-white transition-all duration-200 hover:bg-art-primary-hover hover:shadow-[0_10px_30px_rgba(228,87,79,0.18)]"
                  >
                    Subscribe

                    <ArrowRight
                      size={16}
                      strokeWidth={1.6}
                    />
                  </button>

                </div>

                <p className="mt-3 font-art-body text-[10px] leading-5 text-white/30">
                  By subscribing, you agree to receive occasional
                  ArtHub updates. No spam.
                </p>

              </form>

            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          MAIN FOOTER
      ====================================================== */}

      <section>
        <div className="mx-auto max-w-[1320px] px-5 py-14 sm:px-8 md:py-16 lg:px-10 lg:py-20">

          <div className="grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-12">

            {/* =================================================
                BRAND
            ================================================== */}

            <div className="col-span-2 lg:col-span-1">

              <Link
                href="/"
                aria-label="ArtHub Home"
                className="group inline-flex items-center gap-2"
              >

                <span
                  aria-hidden="true"
                  className="text-[15px] leading-none text-art-gold transition-transform duration-300 group-hover:rotate-45"
                >
                  ✦
                </span>

                <span className="font-art-display text-[34px] font-semibold leading-none tracking-[-0.04em]">
                  Art<span className="text-art-primary">
                    Hub
                  </span>
                </span>

              </Link>

              <p className="mt-6 max-w-[330px] font-art-body text-sm leading-7 text-white/45">
                A contemporary marketplace connecting art
                lovers with original work and the artists behind
                it.
              </p>

              {/* Social */}

              <div className="mt-7 flex items-center gap-2">

                <a
                  href="#"
                  aria-label="App Store"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/55 transition-all duration-200 hover:border-art-primary hover:bg-art-primary hover:text-white"
                >
                  <LogoAppStore
                    size={16}
                    strokeWidth={1.5}
                  />
                </a>

                <a
                  href="#"
                  aria-label="Facebook"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/55 transition-all duration-200 hover:border-art-primary hover:bg-art-primary hover:text-white"
                >
                  <LogoFacebook
                    size={16}
                    strokeWidth={1.5}
                  />
                </a>

                <a
                  href="#"
                  aria-label="Google Play"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/55 transition-all duration-200 hover:border-art-primary hover:bg-art-primary hover:text-white"
                >
                  <LogoGooglePlay
                    size={16}
                    strokeWidth={1.5}
                  />
                </a>

                <a
                  href="mailto:hello@arthub.com"
                  aria-label="Email ArtHub"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/55 transition-all duration-200 hover:border-art-primary hover:bg-art-primary hover:text-white"
                >
                  <Mail
                    size={16}
                    strokeWidth={1.5}
                  />
                </a>

              </div>

            </div>


            {/* =================================================
                EXPLORE
            ================================================== */}

            <FooterColumn
              title="Explore"
              links={[
                {
                  label: "Browse Artworks",
                  href: "/browse-artworks",
                },
                {
                  label: "Artists",
                  href: "/artists",
                },
                {
                  label: "Collections",
                  href: "/collections",
                },
                {
                  label: "Featured Art",
                  href: "/featured",
                },
              ]}
            />


            {/* =================================================
                FOR ARTISTS
            ================================================== */}

            <FooterColumn
              title="For Artists"
              links={[
                {
                  label: "Become an Artist",
                  href: "/sign-up",
                },
                {
                  label: "Sell Your Art",
                  href: "/dashboard/artist/artworks/new",
                },
                {
                  label: "Artist Dashboard",
                  href: "/dashboard/artist",
                },
                {
                  label: "Artist Guidelines",
                  href: "/artist-guidelines",
                },
              ]}
            />


            {/* =================================================
                SUPPORT
            ================================================== */}

            <FooterColumn
              title="Support"
              links={[
                {
                  label: "Help Center",
                  href: "/help",
                },
                {
                  label: "Contact Us",
                  href: "/contact",
                },
                {
                  label: "Privacy Policy",
                  href: "/privacy",
                },
                {
                  label: "Terms & Conditions",
                  href: "/terms",
                },
              ]}
            />

          </div>

        </div>
      </section>


      {/* =====================================================
          LARGE BRAND STATEMENT
      ====================================================== */}

      <section className="overflow-hidden border-t border-white/10">
        <div className="mx-auto max-w-[1320px] px-5 py-10 sm:px-8 md:py-14 lg:px-10">

          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

            <div>

              <span className="font-art-body text-[9px] font-semibold uppercase tracking-[0.18em] text-white/25">
                ArtHub / Since 2026
              </span>

              <h2 className="mt-3 font-art-display text-[clamp(58px,12vw,170px)] font-medium leading-[0.72] tracking-[-0.055em] text-white/[0.07]">
                ART<span className="text-art-primary/[0.18]">
                  HUB
                </span>
              </h2>

            </div>

            <div className="flex items-center gap-2 pb-1 text-white/30">

              <span className="text-art-gold">
                ✦
              </span>

              <span className="font-art-display text-xl italic">
                Art is a conversation.
              </span>

            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          BOTTOM BAR
      ====================================================== */}

      <section className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1320px] flex-col gap-4 px-5 py-6 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">

          <p className="font-art-body text-[10px] uppercase tracking-[0.08em] text-white/30" suppressHydrationWarning>
            © {currentYear} ArtHub. All rights reserved.
          </p>

          <div className="flex items-center gap-5">

            <Link
              href="/privacy"
              className="font-art-body text-[10px] uppercase tracking-[0.08em] text-white/30 transition-colors hover:text-white"
            >
              Privacy
            </Link>

            <Link
              href="/terms"
              className="font-art-body text-[10px] uppercase tracking-[0.08em] text-white/30 transition-colors hover:text-white"
            >
              Terms
            </Link>

            <Link
              href="/contact"
              className="group flex items-center gap-1 font-art-body text-[10px] uppercase tracking-[0.08em] text-white/30 transition-colors hover:text-white"
            >
              Contact

              <ArrowUpRight
                size={12}
                strokeWidth={1.5}
                className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>

          </div>

        </div>
      </section>

    </footer>
  );
}


/* =========================================================
   FOOTER COLUMN
========================================================= */

function FooterColumn({ title, links }) {
  return (
    <div>
      <h3 className="font-art-body text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
        {title}
      </h3>

      <ul className="mt-5 space-y-3.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="group inline-flex items-center gap-1 font-art-body text-sm text-white/40 transition-colors duration-200 hover:text-white"
            >
              {link.label}

              <ArrowUpRight
                size={12}
                strokeWidth={1.5}
                className="opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}