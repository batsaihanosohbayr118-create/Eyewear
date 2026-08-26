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
      <div className="flex flex-wrap gap-x-8 gap-y-3 border-b border-line/50 pb-6 mb-12">
        <button
          onClick={() => setActive("all")}
          className={`text-[13px] tracking-[0.14em] uppercase pb-1 border-b transition-colors duration-300 ${
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
            className={`text-[13px] tracking-[0.14em] uppercase pb-1 border-b transition-colors duration-300 ${
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} categories={categories} />
          ))}
        </div>
      )}
    </div>
  );
}
