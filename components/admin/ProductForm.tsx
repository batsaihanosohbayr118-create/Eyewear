"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Product, Category } from "@/lib/db";

const field =
  "w-full rounded-lg border border-ink/15 bg-white px-4 py-3 text-[15px] text-ink placeholder:text-ink/30 outline-none transition-colors focus:border-gold focus:ring-2 focus:ring-gold/15";
const label =
  "block text-[11px] font-mono tracking-[0.14em] uppercase text-ink/45 mb-2";

export default function ProductForm({
  product,
  categories,
}: {
  product?: Product;
  categories: Category[];
}) {
  const router = useRouter();
  const isEdit = Boolean(product);

  const [values, setValues] = useState({
    name: product?.name ?? "",
    category: product?.category ?? categories[0]?.slug ?? "",
    description: product?.description ?? "",
    price: product?.price?.toString() ?? "",
    image: product?.image ?? "",
    featured: product?.featured ?? false,
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleImageUpload(file: File) {
    setUploading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    setUploading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Зураг байршуулахад алдаа гарлаа.");
      return;
    }
    const data = await res.json();
    setValues((v) => ({ ...v, image: data.url }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const url = isEdit ? `/api/products/${product!.id}` : "/api/products";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Хадгалахад алдаа гарлаа.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl">
      <div className="grid md:grid-cols-[320px_1fr] gap-10 bg-white border border-ink/10 rounded-2xl shadow-sm p-6 md:p-10">
        <div>
          <p className={label}>Бүтээгдэхүүний зураг</p>
          <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-ink/[0.03] border border-dashed border-ink/15">
            {values.image ? (
              <>
                <Image src={values.image} alt="" fill className="object-cover" />
                <label className="absolute inset-x-3 bottom-3 flex items-center justify-center gap-2 rounded-lg bg-ink/70 backdrop-blur-sm text-ivory text-[12px] tracking-[0.1em] uppercase py-2.5 cursor-pointer hover:bg-ink/85 transition-colors">
                  {uploading ? "Байршуулж байна…" : "Зураг солих"}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file);
                    }}
                  />
                </label>
              </>
            ) : (
              <label className="absolute inset-0 flex flex-col items-center justify-center gap-3 cursor-pointer text-ink/35 hover:text-gold-dark hover:bg-gold/5 transition-colors">
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
                <span className="text-[13px]">
                  {uploading ? "Байршуулж байна…" : "Зураг сонгох"}
                </span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                />
              </label>
            )}
          </div>
          <p className="mt-3 text-[12px] text-ink/40">
            Эсвэл доор шууд зурган URL оруулж болно
          </p>
          <input
            value={values.image}
            onChange={(e) => setValues((v) => ({ ...v, image: e.target.value }))}
            placeholder="https://…"
            className={`${field} mt-2 text-[13px] py-2.5`}
          />
        </div>

        <div className="space-y-6">
          <div>
            <label className={label}>Нэр</label>
            <input
              required
              value={values.name}
              onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
              placeholder="Жишээ нь: Daily Clear"
              className={field}
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className={label}>Ангилал</label>
              <select
                value={values.category}
                onChange={(e) => setValues((v) => ({ ...v, category: e.target.value }))}
                className={`${field} appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 20 20%22 fill=%22%23061826%22 opacity=%220.4%22><path d=%22M5.5 7.5l4.5 4.5 4.5-4.5%22 stroke=%22%23061826%22 stroke-opacity=%220.4%22 stroke-width=%221.4%22 fill=%22none%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/></svg>')] bg-no-repeat bg-[right_1rem_center]`}
              >
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={label}>Үнэ</label>
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  required
                  value={values.price}
                  onChange={(e) => setValues((v) => ({ ...v, price: e.target.value }))}
                  placeholder="0"
                  className={`${field} pr-10`}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/35 text-[14px]">
                  ₮
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className={label}>Тайлбар</label>
            <textarea
              required
              rows={4}
              value={values.description}
              onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))}
              placeholder="Бүтээгдэхүүний товч тайлбар…"
              className={`${field} resize-none`}
            />
          </div>

          <label className="flex items-center gap-3 rounded-lg border border-ink/10 bg-ink/[0.02] px-4 py-3 cursor-pointer">
            <input
              type="checkbox"
              checked={values.featured}
              onChange={(e) => setValues((v) => ({ ...v, featured: e.target.checked }))}
              className="w-4 h-4 accent-gold cursor-pointer"
            />
            <span className="text-[14px] text-ink/75">Нүүр хуудсанд онцлох</span>
          </label>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving || uploading}
              className="bg-gold text-ivory px-7 py-3 rounded-lg text-[13px] tracking-[0.12em] uppercase hover:bg-gold-dark transition-colors disabled:opacity-50"
            >
              {saving ? "Хадгалж байна…" : isEdit ? "Өөрчлөлт хадгалах" : "Бүтээгдэхүүн нэмэх"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin")}
              className="px-7 py-3 rounded-lg text-[13px] tracking-[0.12em] uppercase border border-ink/15 text-ink/60 hover:bg-ink/5 hover:text-ink transition-colors"
            >
              Цуцлах
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
