import AdminShell from "@/components/admin/AdminShell";
import ProductForm from "@/components/admin/ProductForm";
import { getCategories } from "@/lib/db";

export default async function NewProductPage() {
  const categories = await getCategories();
  return (
    <AdminShell>
      <h1 className="font-display text-3xl mb-8">Шинэ бүтээгдэхүүн</h1>
      <ProductForm categories={categories} />
    </AdminShell>
  );
}
