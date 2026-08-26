import Image from "next/image";
import type { Product, Category } from "@/lib/db";

function formatPrice(value: number) {
  return new Intl.NumberFormat("mn-MN").format(value) + "₮";
}

export default function ProductCard({
  product,
  categories,
}: {
  product: Product;
  categories: Category[];
}) {
  const categoryLabel =
    categories.find((c) => c.slug === product.category)?.label ?? product.category;

  return (
    <article className="group">
      <div className="relative aspect-[4/5] overflow-hidden bg-charcoal">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-[900ms] ease-signature group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/10 transition-colors duration-500" />
        <span className="absolute top-4 left-4 font-mono text-[10px] tracking-[0.16em] uppercase bg-ink/70 backdrop-blur-sm text-gold-light px-3 py-1.5">
          {categoryLabel}
        </span>
        {product.featured && (
          <span className="absolute top-4 right-4 font-mono text-[10px] tracking-[0.16em] uppercase text-ivory/80">
            ★
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 h-px bg-gold scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-signature" />
      </div>

      <div className="pt-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg">{product.name}</h3>
          <p className="mt-1 text-[13px] text-ivory/55 leading-relaxed line-clamp-2">
            {product.description}
          </p>
        </div>
        <span className="font-mono text-[13px] text-gold-light whitespace-nowrap pt-1">
          {formatPrice(product.price)}
        </span>
      </div>
    </article>
  );
}
