import Link from "next/link";
import Image from "next/image";
import AdminShell from "@/components/admin/AdminShell";
import DeleteButton from "@/components/admin/DeleteButton";
import { getProducts, getCategories } from "@/lib/db";

export default async function AdminDashboardPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <AdminShell>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl">Бүтээгдэхүүн</h1>
          <p className="text-ink/50 text-sm mt-1">{products.length} нийт бараа</p>
        </div>
        <Link
          href="/admin/products/new"
          aria-label="Бүтээгдэхүүн нэмэх"
          className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gold text-xl leading-none text-ivory hover:bg-gold-dark transition-colors"
        >
          +
        </Link>
      </div>

      <div className="bg-white border border-ink/10 rounded-2xl shadow-sm divide-y divide-ink/10 overflow-hidden">
        {products.length === 0 && (
          <p className="py-16 text-center text-ink/40">
            Одоогоор бүтээгдэхүүн байхгүй байна.
          </p>
        )}
        {products.map((product) => (
          <div key={product.id} className="flex items-center gap-5 px-5 py-4">
            <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-ink/5">
              {product.image && (
                <Image src={product.image} alt="" fill className="object-cover" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display text-lg truncate">{product.name}</p>
              <p className="text-[12px] text-ink/45 truncate">
                {categories.find((c) => c.slug === product.category)?.label ?? product.category}
                {product.featured ? " · Онцлох" : ""}
              </p>
            </div>
            <p className="font-mono text-[13px] text-ink/60 hidden sm:block">
              {new Intl.NumberFormat("mn-MN").format(product.price)}₮
            </p>
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/products/${product.id}/edit`}
                className="text-[12px] tracking-[0.06em] border border-gold/50 text-gold-dark px-4 py-2 rounded-lg hover:bg-gold hover:text-ivory hover:border-gold transition-colors"
              >
                Засах
              </Link>
              <DeleteButton id={product.id} name={product.name} />
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
