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
  showDescription = true,
}: {
  product: Product;
  categories: Category[];
  index?: number;
  showDescription?: boolean;
}) {
  const categoryLabel =
    categories.find((c) => c.slug === product.category)?.label ?? product.category;
  const productImageSrc = imageSrc(product.image);

  return (
    <Reveal delay={(index % 4) * 100} className="h-full">
      <article className="group flex h-full flex-col bg-parchment text-ink overflow-hidden transition-shadow duration-500 hover:shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
        <div className="relative aspect-[4/3] overflow-hidden bg-[#e2dcd2]">
          <Image
            src={productImageSrc}
            alt={product.name}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-[900ms] ease-signature group-hover:scale-[1.05]"
          />
          <span className="absolute top-4 left-4 text-[10px] font-semibold tracking-[0.12em] uppercase bg-ink/85 text-ivory px-2.5 py-1">
            {product.featured ? "Онцлох" : categoryLabel}
          </span>
        </div>

        <div className="flex flex-1 flex-col px-5 pt-4 pb-5">
          <h3 className="text-[15px] font-semibold">{product.name}</h3>
          <p className="mt-0.5 text-[12px] text-ink/50">{categoryLabel}</p>
          {showDescription && (
            <p className="mt-3 text-[13px] text-ink/65 leading-relaxed line-clamp-2">
              {product.description}
            </p>
          )}
          <div className="mt-auto pt-4 flex items-center justify-between">
            <span className="text-[14px] font-semibold">{formatPrice(product.price)}</span>
            <span className="h-px w-8 bg-gold transition-all duration-500 ease-signature group-hover:w-14" />
          </div>
        </div>
      </article>
    </Reveal>
  );
}
