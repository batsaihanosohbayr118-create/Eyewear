"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Product, Category } from "@/lib/db";
import { imageSrc } from "@/lib/image-src";
import { prepareImage } from "@/lib/prepare-image";

const field =
  "w-full rounded-lg border border-ink/15 bg-white px-4 py-3 text-[15px] text-ink placeholder:text-ink/30 outline-none transition-colors focus:border-gold focus:ring-2 focus:ring-gold/15";
const label =
  "block text-[11px] font-mono tracking-[0.14em] uppercase text-ink/45 mb-2";
const categoryAccents = [
  "from-gold-light to-gold-dark",
  "from-emerald-400 to-teal-600",
  "from-amber-300 to-orange-500",
  "from-rose-300 to-pink-500",
  "from-violet-300 to-indigo-500",
];

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
  const [categoryOpen, setCategoryOpen] = useState(false);
  const categoryMenuRef = useRef<HTMLDivElement>(null);
  const productImageSrc = imageSrc(values.image, "");
  const selectedCategory =
    categories.find((c) => c.slug === values.category) ?? categories[0];

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!categoryMenuRef.current?.contains(event.target as Node)) {
        setCategoryOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  async function handleImageUpload(file: File) {
    setUploading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", await prepareImage(file));

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
            {productImageSrc ? (
              <>
                <Image src={productImageSrc} alt="" fill className="object-cover" />
                <label className="absolute inset-x-3 bottom-3 flex items-center justify-center gap-2 rounded-lg bg-ink/70 backdrop-blur-sm text-ivory text-[12px] tracking-[0.1em] uppercase py-2.5 cursor-pointer hover:bg-ink/85 transition-colors">
                  {uploading ? "Байршуулж байна…" : "Зураг солих"}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
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
                  accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
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
              <div ref={categoryMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setCategoryOpen((open) => !open)}
                  className={`${field} flex items-center justify-between gap-3 bg-gradient-to-r from-white via-parchment/60 to-parchment pr-3 text-left shadow-[0_10px_28px_rgba(179,139,77,0.10)] hover:border-gold/45 hover:shadow-[0_14px_34px_rgba(179,139,77,0.18)]`}
                  aria-haspopup="listbox"
                  aria-expanded={categoryOpen}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span
                      className={`h-2.5 w-2.5 shrink-0 rounded-full bg-gradient-to-br ${
                        categoryAccents[
                          Math.max(
                            0,
                            categories.findIndex((c) => c.slug === selectedCategory?.slug)
                          ) % categoryAccents.length
                        ]
                      } shadow-[0_0_0_4px_rgba(179,139,77,0.15)]`}
                    />
                    <span className="truncate">
                      {selectedCategory?.label ?? "Ангилал сонгох"}
                    </span>
                  </span>
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gold/10 text-gold-dark transition-transform ${
                      categoryOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  >
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M5.5 7.5 10 12l4.5-4.5"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </button>

                {categoryOpen && (
                  <div
                    className="absolute left-0 right-0 top-full z-30 mt-2 max-h-64 overflow-y-auto rounded-xl border border-gold/20 bg-white p-2 shadow-[0_24px_60px_rgba(20,17,15,0.16)]"
                    role="listbox"
                  >
                    {categories.map((c, index) => {
                      const selected = c.slug === values.category;

                      return (
                        <button
                          key={c.slug}
                          type="button"
                          onClick={() => {
                            setValues((v) => ({ ...v, category: c.slug }));
                            setCategoryOpen(false);
                          }}
                          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[14px] transition-colors ${
                            selected
                              ? "bg-gold text-white shadow-sm"
                              : "text-ink/75 hover:bg-parchment hover:text-ink"
                          }`}
                          role="option"
                          aria-selected={selected}
                        >
                          <span
                            className={`h-2.5 w-2.5 shrink-0 rounded-full bg-gradient-to-br ${
                              categoryAccents[index % categoryAccents.length]
                            } ${selected ? "shadow-[0_0_0_4px_rgba(255,255,255,0.24)]" : ""}`}
                          />
                          <span className="min-w-0 flex-1 truncate">{c.label}</span>
                          {selected && (
                            <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-white/80">
                              Сонгосон
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
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
