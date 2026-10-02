"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Settings } from "@/lib/db";
import { imageSrc } from "@/lib/image-src";
import Arrow from "./Arrow";

export default function Hero({ settings }: { settings: Settings }) {
  const [loaded, setLoaded] = useState(false);
  const heroImageSrc = imageSrc(settings.heroImage);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  const fade = (delay: number) => ({
    className: `transition-all duration-700 ease-signature ${
      loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
    }`,
    style: { transitionDelay: `${delay}ms` },
  });

  return (
    <section className="relative w-full overflow-hidden bg-ink min-h-[640px] h-[100svh] max-h-[860px] lg:h-[92svh]">
      {/* Image — full-bleed on mobile, right side on desktop */}
      <div className="absolute inset-0">
        <Image
          src={heroImageSrc}
          alt="Нар жаргах үеийн далайн эрэг дээрх тунгалаг хүрээтэй нарны шил"
          fill
          priority
          sizes="100vw"
          className={`object-cover object-[72%_center] lg:object-center transition-transform duration-[1800ms] ease-signature ${
            loaded ? "scale-100" : "scale-[1.06]"
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/45 to-transparent lg:via-ink/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-ink/40" />
        <div className="absolute inset-0 bg-ink/45 lg:bg-transparent" />
      </div>

      <div className="relative z-10 h-full max-w-content mx-auto px-5 sm:px-6 md:px-8 lg:px-10 flex flex-col justify-end pb-16 pt-28 lg:justify-center lg:pb-0 lg:pl-28 xl:pl-36">
        <h1
          className={`font-display font-medium text-[3.25rem] leading-[1.02] sm:text-6xl md:text-7xl xl:text-[5.5rem] max-w-3xl text-balance transition-all duration-[900ms] ease-signature ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "520ms" }}
        >
          Тансаг загвар,
          <br />
          <span className="italic text-gold-light">тод</span>{" "}
          <span className="text-gold-light">харц</span>
        </h1>

        <p
          style={fade(680).style}
          className={`${fade(680).className} mt-7 max-w-md text-ivory/75 text-[15px] md:text-base leading-relaxed`}
        >
          {settings.tagline}. Дизайнер хүрээ, нарийн хийцтэй линз, хувийн
          зөвлөгөө — таны дүр төрхийг тодотгох бүхэн нэг дор.
        </p>

        <div style={fade(820).style} className={`${fade(820).className} mt-10 flex flex-wrap items-center gap-4`}>
          <Link
            href="/collections"
            className="group btn-sweep btn-sweep-gold inline-flex h-12 items-center gap-4 bg-gold px-8 text-[14px] text-ink"
          >
            Цуглуулга үзэх
            <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link
            href="#contact"
            className="btn-sweep btn-sweep-outline inline-flex h-12 items-center border border-ivory/40 px-8 text-[14px] text-ivory"
          >
            Холбоо барих
          </Link>
        </div>
      </div>

      {/* Vertical scroll hint */}
      <div
        className={`absolute left-6 xl:left-10 top-1/2 z-10 hidden lg:flex -translate-y-1/2 flex-col items-center gap-4 transition-opacity duration-700 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionDelay: "1100ms" }}
      >
        <span className="text-[10px] tracking-[0.3em] text-ivory/60 [writing-mode:vertical-rl] rotate-180">
          SCROLL
        </span>
        <span className="relative w-px h-24 bg-ivory/30">
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 border-r border-b border-ivory/50 rotate-45" />
        </span>
      </div>

      {/* Right-side tagline */}
      <div
        className={`absolute right-0 top-[30%] z-10 hidden lg:flex -translate-y-1/2 items-center gap-5 transition-opacity duration-700 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionDelay: "1200ms" }}
      >
        <div className="text-right text-[11px] tracking-[0.3em] uppercase text-ivory/75 leading-[2.2]">
          <p>Тансаг хийц</p>
          <p>Мөнхийн загвар</p>
        </div>
        <span className="w-16 xl:w-24 h-px bg-ivory/40" />
      </div>
    </section>
  );
}
