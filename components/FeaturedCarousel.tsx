"use client";

import { useRef } from "react";
import ProductCard from "./ProductCard";
import Arrow from "./Arrow";
import type { Product, Category } from "@/lib/db";

export default function FeaturedCarousel({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const track = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const step = card ? card.offsetWidth + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <div className="relative min-w-0">
      <div
        ref={track}
        className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {products.map((product, i) => (
          <div
            key={product.id}
            className="snap-start shrink-0 w-[78%] sm:w-[calc((100%-20px)/2)] xl:w-[calc((100%-40px)/3)]"
          >
            <ProductCard product={product} categories={categories} index={i} showDescription={false} />
          </div>
        ))}
      </div>

      {products.length > 1 && (
        <div className="mt-6 flex gap-3 justify-end lg:mt-0 lg:absolute lg:-right-16 lg:top-1/2 lg:-translate-y-1/2 lg:flex-col">
          <button
            type="button"
            onClick={() => scroll(1)}
            className="grid h-11 w-11 place-items-center rounded-full border border-ivory/50 text-ivory transition-colors hover:border-gold hover:text-gold-light"
            aria-label="Дараагийн"
          >
            <Arrow />
          </button>
          <button
            type="button"
            onClick={() => scroll(-1)}
            className="grid h-11 w-11 place-items-center rounded-full border border-ivory/15 text-ivory/50 transition-colors hover:border-gold hover:text-gold-light lg:order-last"
            aria-label="Өмнөх"
          >
            <Arrow className="rotate-180" />
          </button>
        </div>
      )}
    </div>
  );
}
