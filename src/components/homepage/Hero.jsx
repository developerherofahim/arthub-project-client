"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Pause,
  Play,
} from "lucide-react";
import { heroSlides as slides, AUTOPLAY_DELAY } from "@/data/heroSlides";

export default function Hero() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const autoplayOptions = useMemo(
    () => ({
      delay: AUTOPLAY_DELAY,
      stopOnInteraction: false,
      stopOnMouseEnter: false,
    }),
    []
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      containScroll: "trimSnaps",
    },
    [Autoplay(autoplayOptions)]
  );

  const currentSlide = slides[selectedIndex];

  const scrollTo = useCallback(
    (index) => {
      if (!emblaApi) return;

      emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const scrollPrev = useCallback(() => {
    if (!emblaApi) return;

    emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (!emblaApi) return;

    emblaApi.scrollNext();
  }, [emblaApi]);

  const toggleAutoplay = useCallback(() => {
    if (!emblaApi) return;

    const autoplay = emblaApi.plugins().autoplay;

    if (!autoplay) return;

    if (autoplay.isPlaying()) {
      autoplay.stop();
      setIsPaused(true);
    } else {
      autoplay.play();
      setIsPaused(false);
    }
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    onSelect();

    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    const handleKeyboard = (event) => {
      if (event.key === "ArrowLeft") {
        scrollPrev();
      }

      if (event.key === "ArrowRight") {
        scrollNext();
      }

      if (event.key === " ") {
        event.preventDefault();
        toggleAutoplay();
      }
    };

    window.addEventListener("keydown", handleKeyboard);

    return () => {
      window.removeEventListener("keydown", handleKeyboard);
    };
  }, [scrollNext, scrollPrev, toggleAutoplay]);

  return (
    <section
      aria-label="Featured artworks"
      className="
        relative
        overflow-hidden
        bg-art-background/95
        text-art-text
      "
    >
      {/* =====================================================
          BACKGROUND EDITORIAL GRID
      ===================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.045]
          bg-[linear-linear(to_right,rgba(255,255,255,0.55)_1px,transparent_1px),linear-linear(to_bottom,rgba(255,255,255,0.55)_1px,transparent_1px)]
          bg-size-[10%_100%,100%_20%]
        "
      />

      {/* =====================================================
          HERO CONTAINER
      ===================================================== */}

      <div
        className="
          relative
          mx-auto
          min-h-[800px]
          max-w-[1440px]
          px-5
          sm:px-8
          lg:min-h-[calc(100svh-80px)]
          lg:px-12
          xl:px-16
        "
      >
        {/* ===================================================
            TOP BRAND ROW
        =================================================== */}

        {/* ===================================================
            MAIN HERO
        =================================================== */}

        <div
          className="
            grid
            min-h-[730px]
            grid-cols-1
            items-center
            gap-12
            py-14

            md:min-h-[740px]

            lg:grid-cols-[0.85fr_1.15fr]
            lg:gap-14
            lg:py-16

            xl:grid-cols-[0.82fr_1.18fr]
            xl:gap-20
          "
        >
          {/* =================================================
              LEFT — DYNAMIC EDITORIAL CONTENT
          ================================================= */}

          <div
            className="
    relative
    z-20
    flex
    flex-col
    justify-center
    lg:pr-4
    xl:pr-8
  "
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-art-primary" />

              <span
                className="
        font-art-body
        text-[9px]
        font-semibold
        uppercase
        tracking-[0.2em]
        text-art-texts/55
      "
              >
                {currentSlide.eyebrow}
              </span>
            </div>

            {/* Dynamic category */}
            <p
              key={`category-${currentSlide.id}`}
              className="
      pt-7
      animate-[heroContentIn_700ms_ease-out]
      font-art-body
      text-[10px]
      font-semibold
      uppercase
      tracking-[0.18em]
      text-art-text
    "
            >
              {currentSlide.category}
            </p>

            {/* Dynamic headline */}
            <h1
              key={`title-${currentSlide.id}`}
              className="
      pt-3
      max-w-162.5
      animate-[heroContentIn_700ms_ease-out]
      font-art-display
      text-[58px]
      font-medium
      leading-[0.88]
      tracking-[-0.055em]
      text-art-text

      sm:text-[72px]

      md:text-[82px]

      lg:text-[clamp(64px,6vw,100px)]

      xl:text-[106px]
    "
            >
              {currentSlide.title}
            </h1>

            {/* Dynamic description */}
            <p
              key={`description-${currentSlide.id}`}
              className="
      pt-8
      max-w-[500px]
      animate-[heroContentIn_700ms_100ms_ease-out_both]
      font-art-body
      text-sm
      leading-7
      text-art-text/60

      sm:text-base
    "
            >
              {currentSlide.description}
            </p>

            {/* Artist */}
            <div
              key={`artist-${currentSlide.id}`}
              className="
      mt-6
      flex
      animate-[heroContentIn_700ms_150ms_ease-out_both]
      items-center
      gap-3
    "
            >
              <span
                className="
        font-art-body
        text-xs
        font-semibold
        text-art-text
      "
              >
                {currentSlide.artist}
              </span>

              <span className="size-1 rounded-full bg-white/30" />

              <span
                className="
        font-art-body
        text-[10px]
        text-art-text/40
      "
              >
                {currentSlide.artistRole}
              </span>
            </div>

            {/* Dynamic CTA */}
            <div
              className="
      mt-8
      flex
      animate-[heroContentIn_700ms_200ms_ease-out_both]
      flex-col
      gap-5

      sm:flex-row
      sm:items-center
      sm:gap-8
    "
            >
              <Link
                href="/browse-artworks"
                className="
        group
        flex
        min-h-13.5
        items-center
        justify-center
        gap-3
        rounded-xl
        bg-art-primary
        px-6
        font-art-body
        text-[10px]
        font-semibold
        uppercase
        tracking-[0.12em]
        text-white
        transition-all
        duration-200
        hover:bg-art-primary-hover
        hover:shadow-[0_10px_30px_rgba(228,87,79,0.18)]
      "
              >
                Explore Artworks

                <ArrowUpRight
                  size={15}
                  className="
          transition-transform
          duration-200
          group-hover:translate-x-0.5
          group-hover:-translate-y-0.5
        "
                />
              </Link>

              <Link
                href="#"
                className="
        inline-flex
        min-h-13.5
        items-center
        justify-center
        border-b
        border-white/20
        px-1
        font-art-body
        text-[10px]
        font-semibold
        uppercase
        tracking-[0.12em]
        text-art-text/75
        transition-all
        duration-200
        hover:border-art-primary
        hover:text-art-text
      "
              >
                Meet Artist
              </Link>
            </div>

            {/* Small editorial statement */}
            <div
              className="
      mt-12
      hidden
      items-center
      gap-4
      lg:flex
    "
            >
              <span
                className="
        font-art-display
        text-4xl
        leading-none
        text-white/10
      "
              >
                0{selectedIndex + 1}
              </span>

              <span className="h-px w-12 bg-white/15" />

              <span
                className="
        font-art-body
        text-[9px]
        font-semibold
        uppercase
        tracking-[0.18em]
        text-white/30
      "
              >
                Art worth discovering
              </span>
            </div>
          </div>

          {/* =================================================
              RIGHT — EDITORIAL CAROUSEL
          ================================================= */}

          <div
            className="
              relative
              min-w-0
              self-center
            "
          >
            {/* Decorative vertical line */}

            <div
              aria-hidden="true"
              className="
                absolute
                -left-7
                top-0
                hidden
                h-full
                w-px
                bg-white/10
                lg:block
              "
            />

            {/* Carousel */}

            <div
              className="
                relative
                overflow-visible
              "
            >
              <div
                ref={emblaRef}
                className="
                  overflow-hidden
                "
              >
                <div className="flex">
                  {slides.map((slide, index) => (
                    <div
                      key={slide.id}
                      className="
                        min-w-0
                        flex-[0_0_100%]
                        pl-0
                      "
                    >
                      <article
                        className="
                          relative
                          ml-auto
                          aspect-[0.82]
                          w-full
                          max-w-[700px]
                          overflow-hidden
                          rounded-[7px]
                          bg-art-charcoal

                          sm:aspect-[0.9]

                          lg:aspect-[0.86]
                        "
                      >
                        {/* Artwork */}

                        <Image
                          src={slide.image}
                          alt={`${slide.title} by ${slide.artist}`}
                          fill
                          priority={index === 0}
                          sizes="
                            (max-width: 640px) 100vw,
                            (max-width: 1024px) 80vw,
                            55vw
                          "
                          className="
                            object-cover
                            brightness-[0.9]
                            saturate-[0.88]
                            transition-transform
                            duration-[1200ms]
                            ease-out
                            group-hover:scale-[1.03]
                          "
                          style={{
                            objectPosition:
                              slide.position || "center",
                          }}
                        />

                        {/* Artwork overlay */}

                        <div
                          className="
                            absolute
                            inset-0
                            bg-linear-to-t
                            from-black/60
                            via-transparent
                            to-black/5
                          "
                        />

                        {/* Editorial frame */}

                        <div
                          className="
                            pointer-events-none
                            absolute
                            inset-4
                            border
                            border-white/15
                            sm:inset-5
                          "
                        />

                        {/* Collection marker */}

                        <div
                          className="
                            absolute
                            left-5
                            top-5
                            flex
                            items-center
                            gap-2
                            sm:left-6
                            sm:top-6
                          "
                        >
                          <span
                            className="
                              size-1.5
                              rounded-full
                              bg-art-primary
                            "
                          />

                          <span
                            className="
                              font-art-body
                              text-[8px]
                              font-semibold
                              uppercase
                              tracking-[0.18em]
                              text-white/65
                            "
                          >
                            ArtHub Collection
                          </span>
                        </div>

                        {/* Artwork metadata card */}

                        <div
                          className="
                            absolute
                            bottom-5
                            left-5
                            max-w-[230px]
                            rounded-[5px]
                            border
                            border-white/15
                            bg-black/65
                            p-4
                            backdrop-blur-xl

                            sm:bottom-6
                            sm:left-6
                          "
                        >
                          <p
                            className="
                              font-art-body
                              text-[8px]
                              font-semibold
                              uppercase
                              tracking-[0.17em]
                              text-art-gold
                            "
                          >
                            {slide.category}
                          </p>

                          <h2
                            className="
                              mt-1
                              font-art-display
                              text-2xl
                              font-medium
                              leading-none
                              tracking-[-0.03em]
                              text-white
                            "
                          >
                            {slide.title}
                          </h2>

                          <div className="mt-2 flex items-center gap-2">
                            <span
                              className="
                                font-art-body
                                text-[9px]
                                text-white/65
                              "
                            >
                              {slide.artist}
                            </span>

                            <span className="size-1 rounded-full bg-white/30" />

                            <span
                              className="
                                font-art-body
                                text-[8px]
                                uppercase
                                tracking-widest
                                text-white/40
                              "
                            >
                              {String(slide.id).padStart(2, "0")}
                            </span>
                          </div>
                        </div>
                      </article>
                    </div>
                  ))}
                </div>
              </div>

              {/* =============================================
                  CAROUSEL CONTROLS
              ============================================= */}

              <div
                className="
                  mt-5
                  flex
                  items-center
                  justify-between
                  gap-5
                  sm:mt-6
                "
              >
                {/* Slide indicators */}

                <div
                  className="
                    flex
                    min-w-0
                    flex-1
                    items-center
                    gap-1.5
                  "
                >
                  {slides.map((slide, index) => {
                    const active =
                      index === selectedIndex;

                    return (
                      <button
                        key={slide.id}
                        type="button"
                        onClick={() => scrollTo(index)}
                        aria-label={`Go to ${slide.title}`}
                        aria-current={
                          active ? "true" : undefined
                        }
                        className="
                          group
                          relative
                          h-8
                          flex-1
                          cursor-pointer
                        "
                      >
                        <span
                          className={`
                            absolute
                            left-0
                            top-1/2
                            h-px
                            w-full
                            -translate-y-1/2
                            transition-all
                            duration-300

                            ${active
                              ? "bg-art-primary"
                              : "bg-white/20 group-hover:bg-white/45"
                            }
                          `}
                        />

                        {active && !isPaused && (
                          <span
                            className="
                              absolute
                              left-0
                              top-1/2
                              h-[2px]
                              -translate-y-1/2
                              bg-art-primary
                              animate-[heroProgress_8s_linear_forwards]
                            "
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Navigation */}

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleAutoplay}
                    aria-label={
                      isPaused
                        ? "Resume carousel"
                        : "Pause carousel"
                    }
                    className="
                      flex
                      size-9
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-white/15
                      bg-white/[0.03]
                      text-white/60
                      transition-all
                      duration-200
                      hover:border-white/40
                      hover:text-white
                      sm:size-10
                    "
                  >
                    {isPaused ? (
                      <Play size={13} />
                    ) : (
                      <Pause size={13} />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={scrollPrev}
                    aria-label="Previous artwork"
                    className="
                      flex
                      size-9
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-white/15
                      bg-white/[0.03]
                      text-white/60
                      transition-all
                      duration-200
                      hover:border-white/40
                      hover:text-white
                      sm:size-10
                    "
                  >
                    <ArrowLeft size={14} />
                  </button>

                  <button
                    type="button"
                    onClick={scrollNext}
                    aria-label="Next artwork"
                    className="
                      flex
                      size-9
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-white/15
                      bg-white/[0.03]
                      text-white/60
                      transition-all
                      duration-200
                      hover:border-white/40
                      hover:text-white
                      sm:size-10
                    "
                  >
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              {/* Slide counter */}

              <div
                className="
                  absolute
                  -right-1
                  -top-10
                  hidden
                  items-center
                  gap-2
                  lg:flex
                "
              >
                <span
                  className="
                    font-art-display
                    text-3xl
                    leading-none
                    text-art-black
                  "
                >
                  {String(selectedIndex + 1).padStart(2, "0")}
                </span>

                <span
                  className="
                    font-art-body
                    text-[9px]
                    text-white/30
                  "
                >
                  / {String(slides.length).padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================
            BOTTOM EDITORIAL LINE
        =================================================== */}

        <div
          className="
            absolute
            bottom-5
            left-5
            right-5
            hidden
            items-center
            justify-between
            border-t
            border-white/10
            pt-4

            lg:left-12
            lg:right-12
            lg:flex

            xl:left-16
            xl:right-16
          "
        >
          <span
            className="
              font-art-body
              text-[8px]
              font-semibold
              uppercase
              tracking-[0.2em]
              text-white/25
            "
          >
            Discover · Collect · Connect
          </span>

          <span
            className="
              font-art-body
              text-[8px]
              font-semibold
              uppercase
              tracking-[0.2em]
              text-white/25
            "
          >
            Scroll to explore
          </span>
        </div>
      </div>
    </section>
  );
}