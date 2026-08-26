"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Settings } from "@/lib/db";

export default function Hero({ settings }: { settings: Settings }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-ink">
      <div className="absolute inset-0">
        <div
          className={`absolute inset-0 origin-left bg-ink transition-transform duration-[1400ms] ease-signature z-20 ${
            loaded ? "scale-x-0" : "scale-x-100"
          }`}
        />
        <Image
          src="https://images.unsplash.com/photo-1563136047-fb51e000144a?auto=format&fit=crop&w=2200&q=85"
          alt="Нүдний шил зүүсэн хүний ойрын зураг"
          fill
          priority
          sizes="100vw"
          className={`object-cover object-center transition-transform duration-[1800ms] ease-signature ${
            loaded ? "scale-100" : "scale-110"
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-ink/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/75 via-ink/20 to-transparent" />
      </div>

      <div className="relative z-10 h-full max-w-content mx-auto px-6 md:px-10 flex flex-col justify-end pb-20 md:pb-28">
        <p
          className={`font-mono text-[11px] tracking-[0.32em] uppercase text-gold-light mb-6 transition-all duration-700 ease-signature ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "500ms" }}
        >
          Хараа зүйн төв - {settings.founded} оноос хойш
        </p>

        <h1
          className={`font-display text-[13vw] leading-[0.95] sm:text-[8vw] md:text-[6vw] lg:text-[5.2vw] max-w-4xl text-balance transition-all duration-[900ms] ease-signature ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "620ms" }}
        >
          Тод хараа.
          <br />
          <span className="text-gold-light italic">Тохирсон шил.</span>
        </h1>

        <p
          className={`mt-6 max-w-md text-ivory/70 text-[15px] leading-relaxed transition-all duration-700 ease-signature ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "760ms" }}
        >
          {settings.tagline}. Мэргэжлийн хараа шалгалт, чанартай линз,
          танд зохих хүрээг нэг дор сонгоорой.
        </p>

        <div
          className={`mt-10 flex flex-wrap items-center gap-5 transition-all duration-700 ease-signature ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "900ms" }}
        >
          <Link
            href="/contact"
            className="group relative inline-flex items-center gap-3 bg-gold text-ink px-8 py-4 text-[13px] tracking-[0.14em] uppercase overflow-hidden"
          >
            <span className="relative z-10 transition-colors duration-300 group-hover:text-ivory">
              Хараагаа шалгуулах
            </span>
            <span className="absolute inset-0 bg-ink translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-signature" />
          </Link>
          <Link
            href="/collections"
            className="text-[13px] tracking-[0.14em] uppercase text-ivory/75 border-b border-ivory/30 pb-1 hover:text-ivory hover:border-ivory transition-colors duration-300"
          >
            Цуглуулга үзэх
          </Link>
        </div>
      </div>

      <div
        className={`absolute bottom-8 right-6 md:right-10 z-10 hidden sm:flex flex-col items-center gap-3 transition-opacity duration-700 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionDelay: "1100ms" }}
      >
        <span className="font-mono text-[10px] tracking-[0.24em] text-ivory/40 [writing-mode:vertical-rl]">
          SCROLL
        </span>
        <span className="w-px h-10 bg-ivory/25" />
      </div>
    </section>
  );
}