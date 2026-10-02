import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import GalleryGrid from "@/components/GalleryGrid";

export const metadata: Metadata = {
  title: "Галерей",
  description: "HEX Luxury Eyewear-ийн цуглуулга, бутикийн уур амьсгалын зураглал.",
};

export default function GalleryPage() {
  return (
    <div className="pt-20">
      <section className="max-w-content mx-auto px-5 sm:px-6 md:px-8 lg:px-10 pt-16 md:pt-20 pb-12 md:pb-16">
        <Reveal>
          <p className="text-[11px] md:text-[12px] tracking-[0.32em] uppercase text-ivory/80 mb-5">
            Галерей
          </p>
          <h1 className="font-display font-medium text-[2.75rem] sm:text-5xl md:text-[3.5rem] lg:text-6xl leading-[1.08] max-w-3xl">
            Тансаг загвар,
            <br className="sm:hidden" /> тод харц
            <br />
            {/* Non-breaking hyphen keeps "HEX‑ийн" from splitting across lines */}
            <span className="italic text-gold-light whitespace-nowrap">HEX‑ийн ертөнц</span>
          </h1>
        </Reveal>
      </section>

      <section className="max-w-content mx-auto px-5 sm:px-6 md:px-8 lg:px-10 pb-20 md:pb-24 lg:pb-28">
        <GalleryGrid />
      </section>
    </div>
  );
}
