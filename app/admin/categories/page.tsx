import AdminShell from "@/components/admin/AdminShell";
import CategoryManager from "@/components/admin/CategoryManager";
import { getCategories, getProducts } from "@/lib/db";

export default async function AdminCategoriesPage() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  const productCounts: Record<string, number> = {};
  for (const p of products) {
    productCounts[p.category] = (productCounts[p.category] ?? 0) + 1;
  }

  return (
    <AdminShell>
      <div className="mb-8">
        <h1 className="font-display text-3xl">Ангилал</h1>
        <p className="text-ink/50 text-sm mt-1">
          Бүтээгдэхүүний ангиллуудыг энд удирдана.
        </p>
      </div>
      <CategoryManager categories={categories} productCounts={productCounts} />
    </AdminShell>
  );
}
