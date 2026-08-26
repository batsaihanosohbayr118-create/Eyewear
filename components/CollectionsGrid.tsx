"use client";

import { useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import type { Product, Category } from "@/lib/db";

export default function CollectionsGrid({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const [active, setActive] = useState<string>("all");

  const filtered = useMemo(() => {
    if (active === "all") return products;
    return products.filter((p) => p.category === active);
  }, [active, products]);

  return (
    <div>
      <div className="flex flex-wrap gap-x-6 gap-y-3 border-b border-line/50 pb-6 mb-10 md:mb-12 lg:gap-x-8">
        <button
          onClick={() => setActive("all")}
          className={`text-[12px] tracking-[0.12em] uppercase pb-1 border-b transition-colors duration-300 md:text-[13px] md:tracking-[0.14em] ${
            active === "all"
              ? "text-ivory border-gold"
              : "text-ivory/45 border-transparent hover:text-ivory/80"
          }`}
        >
          Бүгд
        </button>
        {categories.map((c) => (
          <button
            key={c.slug}
            onClick={() => setActive(c.slug)}
            className={`text-[12px] tracking-[0.12em] uppercase pb-1 border-b transition-colors duration-300 md:text-[13px] md:tracking-[0.14em] ${
              active === c.slug
                ? "text-ivory border-gold"
                : "text-ivory/45 border-transparent hover:text-ivory/80"
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
        <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-x-6 md:gap-y-12">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} categories={categories} />
          ))}
        </div>
      )}
    </div>
  );
}
