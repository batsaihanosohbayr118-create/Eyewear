import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import CollectionsGrid from "@/components/CollectionsGrid";
import { getProducts, getCategories } from "@/lib/db";

export const metadata: Metadata = {
  title: "Цуглуулга",
  description: "Happy Optical-ийн оптик хүрээ, нарны шил, линзний сонголтууд.",
};

export default async function CollectionsPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <div className="pt-20">
      <section className="max-w-content mx-auto px-6 md:px-10 pt-20 pb-16">
        <Reveal>
          <h1 className="font-display text-5xl md:text-6xl leading-[1.05] max-w-2xl text-balance">
            Оптик, наран шил, премиум ба шинэ ирц.
          </h1>
        </Reveal>
      </section>

      <section className="max-w-content mx-auto px-6 md:px-10 pb-28">
        <CollectionsGrid products={products} categories={categories} />
      </section>
    </div>
  );
}
