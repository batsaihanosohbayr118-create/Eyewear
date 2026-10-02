import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";
import Arrow from "./Arrow";
import type { Product, Category } from "@/lib/db";
import { imageSrc } from "@/lib/image-src";

export default function CategoryTiles({
  categories,
  products,
}: {
  categories: Category[];
  products: Product[];
}) {
  // Pick a distinct product photo per category so tiles never repeat an image.
  const used = new Set<string>();
  const tiles = categories
    .map((c) => {
      const image = products.find(
        (p) => p.category === c.slug && p.image && !used.has(p.image)
      )?.image;
      if (image) used.add(image);
      return { ...c, image };
    })
    .filter((c) => c.image)
    .slice(0, 3);

  if (tiles.length === 0) return null;

  return (
    <section className="bg-ink pb-20 md:pb-24 lg:pb-28">
      <div className="max-w-content mx-auto px-5 sm:px-6 md:px-8 lg:px-10 grid gap-5 md:grid-cols-3">
        {tiles.map((tile, i) => (
          <Reveal key={tile.slug} delay={i * 120}>
            <Link
              href={`/collections?category=${tile.slug}`}
              className="group relative block aspect-[16/10] overflow-hidden bg-charcoal"
            >
              <Image
                src={imageSrc(tile.image)}
                alt={tile.label}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover transition-transform duration-[1200ms] ease-signature group-hover:scale-[1.06]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#2a2017]/95 via-[#2a2017]/65 to-[#2a2017]/10" />
              <div className="absolute left-8 top-1/2 -translate-y-1/2">
                <h3 className="font-display text-4xl text-ivory">{tile.label}</h3>
                <span className="mt-4 inline-flex items-center gap-3 text-[13px] text-ivory/85 transition-colors group-hover:text-gold-light">
                  Үзэх
                  <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
