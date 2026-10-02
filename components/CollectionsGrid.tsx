"use client";

import { useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import type { Product, Category } from "@/lib/db";

export default function CollectionsGrid({
  products,
  categories,
  initialCategory,
}: {
  products: Product[];
  categories: Category[];
  initialCategory?: string;
}) {
  const [active, setActive] = useState<string>(
    categories.some((c) => c.slug === initialCategory) ? initialCategory! : "all"
  );

  const filtered = useMemo(() => {
    if (active === "all") return products;
    return products.filter((p) => p.category === active);
  }, [active, products]);

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-10 md:mb-12">
        <button
          onClick={() => setActive("all")}
          className={`h-10 px-5 text-[13px] border transition-colors duration-300 ${
            active === "all"
              ? "bg-gold border-gold text-ink"
              : "border-ivory/20 text-ivory/70 hover:border-gold hover:text-gold-light"
          }`}
        >
          Бүгд
        </button>
        {categories.map((c) => (
          <button
            key={c.slug}
            onClick={() => setActive(c.slug)}
            className={`h-10 px-5 text-[13px] border transition-colors duration-300 ${
              active === c.slug
                ? "bg-gold border-gold text-ink"
                : "border-ivory/20 text-ivory/70 hover:border-gold hover:text-gold-light"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-ivory/50 py-16 text-center">
          Энэ ангилалд одоогоор бүтээгдэхүүн алга.
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6">
          {filtered.map((product, i) => (
            <ProductCard key={product.id} product={product} categories={categories} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
