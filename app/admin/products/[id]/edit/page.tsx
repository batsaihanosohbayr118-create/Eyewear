import { notFound } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import ProductForm from "@/components/admin/ProductForm";
import { getProduct, getCategories } from "@/lib/db";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const [product, categories] = await Promise.all([
    getProduct(params.id),
    getCategories(),
  ]);
  if (!product) notFound();

  return (
    <AdminShell>
      <h1 className="font-display text-3xl mb-8">Бүтээгдэхүүн засах</h1>
      <ProductForm product={product} categories={categories} />
    </AdminShell>
  );
}
