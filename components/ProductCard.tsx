import Image from "next/image";
import Reveal from "@/components/Reveal";
import type { Product, Category } from "@/lib/db";
import { imageSrc } from "@/lib/image-src";

function formatPrice(value: number) {
  return new Intl.NumberFormat("mn-MN").format(value) + "₮";
}

export default function ProductCard({
  product,
  categories,
  index = 0,
}: {
  product: Product;
  categories: Category[];
  index?: number;
}) {
  const categoryLabel =
    categories.find((c) => c.slug === product.category)?.label ?? product.category;
  const productImageSrc = imageSrc(product.image);

  return (
    <Reveal delay={(index % 4) * 100}>
      <article className="group">
        <div className="relative aspect-[4/5] overflow-hidden bg-charcoal">
          <Image
            src={productImageSrc}
            alt={product.name}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-[900ms] ease-signature group-hover:scale-[1.06]"
          />
          <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/10 transition-colors duration-500" />
          <span className="absolute top-4 left-4 font-mono text-[10px] tracking-[0.16em] uppercase bg-ink/70 backdrop-blur-sm text-gold-light px-3 py-1.5 transition-transform duration-500 group-hover:-translate-y-1">
            {categoryLabel}
          </span>
          {product.featured && (
            <span className="absolute top-4 right-4 font-mono text-[10px] tracking-[0.16em] uppercase text-ivory/80 transition-transform duration-500 group-hover:scale-125">
              ★
            </span>
          )}
          <div className="absolute inset-x-0 bottom-0 h-px bg-gold scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-signature" />
        </div>

        <div className="pt-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
          <div className="min-w-0">
            <h3 className="font-display text-lg transition-colors duration-300 group-hover:text-gold-light">
              {product.name}
            </h3>
            <p className="mt-1 text-[13px] text-ivory/55 leading-relaxed line-clamp-2">
              {product.description}
            </p>
          </div>
          <span className="font-mono text-[13px] text-gold-light whitespace-nowrap sm:pt-1">
            {formatPrice(product.price)}
          </span>
        </div>
      </article>
    </Reveal>
  );
}
