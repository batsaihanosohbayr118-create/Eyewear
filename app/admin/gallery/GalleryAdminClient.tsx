"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import type { GalleryImage } from "@/lib/db";
import { imageSrc } from "@/lib/image-src";
import { prepareImage } from "@/lib/prepare-image";

const primaryBtn =
  "rounded-lg bg-gold px-4 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-gold-dark disabled:opacity-50";
const outlineBtn =
  "rounded-lg border px-3 py-1.5 text-[12px] font-medium shadow-sm transition-colors";
const editBtn = `${outlineBtn} border-gold/30 bg-white text-gold-dark hover:border-gold hover:bg-gold hover:text-white`;
const deleteBtn = `${outlineBtn} border-red-200 bg-white text-red-600 hover:border-red-600 hover:bg-red-600 hover:text-white`;
const cancelBtn = `${outlineBtn} border-ink/10 bg-white text-ink/60 hover:border-ink/30 hover:text-ink`;
const arrowBtn =
  "flex h-8 w-8 items-center justify-center rounded-lg border border-ink/10 bg-white text-ink/50 shadow-sm transition-colors hover:border-ink/30 hover:text-ink disabled:opacity-30";
const fieldClass =
  "w-full rounded-lg border border-ink/10 bg-white px-3 py-2 text-sm text-ink shadow-sm focus:border-gold focus:outline-none";

export default function GalleryAdminClient({
  initialImages,
}: {
  initialImages: GalleryImage[];
}) {
  const [images, setImages] = useState<GalleryImage[]>(initialImages);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<GalleryImage | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [newAlt, setNewAlt] = useState("");
  const [newSpan, setNewSpan] = useState<"" | "row-span-2">("");
  const [newUrl, setNewUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [adding, setAdding] = useState(false);

  async function refresh() {
    const res = await fetch("/api/gallery", { cache: "no-store" });
    const data = (await res.json()) as GalleryImage[];
    setImages(data.sort((a, b) => a.order - b.order));
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const file = fileInputRef.current?.files?.[0];
    if (!file && !newUrl.trim()) {
      setError("Файл сонгох эсвэл линк оруулна уу.");
      return;
    }
    if (!newAlt.trim()) {
      setError("Зургийн тайлбар шаардлагатай.");
      return;
    }

    const formData = new FormData();
    if (file) formData.append("file", await prepareImage(file));
    if (newUrl.trim()) formData.append("src", newUrl.trim());
    formData.append("alt", newAlt.trim());
    formData.append("span", newSpan);

    setAdding(true);
    try {
      const res = await fetch("/api/gallery", { method: "POST", body: formData });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Зураг нэмэхэд алдаа гарлаа.");
      }
      setNewAlt("");
      setNewSpan("");
      setNewUrl("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      setShowAddForm(false);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Тодорхойгүй алдаа.");
    } finally {
      setAdding(false);
    }
  }

  async function handleSaveEdit(
    id: string,
    patch: { alt: string; span: "" | "row-span-2" },
    file?: File | null
  ) {
    const formData = new FormData();
    formData.append("alt", patch.alt);
    formData.append("span", patch.span);
    if (file) formData.append("file", await prepareImage(file));

    setError(null);
    const res = await fetch(`/api/gallery/${id}`, { method: "PATCH", body: formData });
    if (res.ok) {
      const updated = (await res.json()) as GalleryImage;
      setImages((prev) => prev.map((img) => (img.id === id ? updated : img)));
      setEditingId(null);
    } else {
      const body = await res.json().catch(() => null);
      setError(body?.error ?? "Зураг хадгалахад алдаа гарлаа.");
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;

    setDeletingId(deleteTarget.id);
    setError(null);

    try {
      const res = await fetch(`/api/gallery/${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Зураг устгахад алдаа гарлаа.");
      }
      setImages((prev) => prev.filter((img) => img.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Тодорхойгүй алдаа.");
    } finally {
      setDeletingId(null);
    }
  }

  function move(index: number, direction: -1 | 1) {
    const next = [...images];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setImages(next);

    startTransition(async () => {
      await fetch("/api/gallery/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: next.map((i) => i.id) }),
      });
    });
  }

  return (
    <div className="space-y-6">
      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex items-center justify-between">
        <span className="text-[12px] font-mono uppercase tracking-[0.14em] text-ink/40">
          {isPending ? "хадгалж байна..." : "\u00A0"}
        </span>
        <button
          type="button"
          onClick={() => setShowAddForm((v) => !v)}
          className={primaryBtn}
        >
          {showAddForm ? "Хаах" : "+ Зураг нэмэх"}
        </button>
      </div>

      {showAddForm && (
        <form
          onSubmit={handleAdd}
          className="space-y-4 rounded-lg border border-ink/10 bg-white p-6 shadow-sm"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[12px] font-medium text-ink/60">
                Файл сонгох
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
                className="block w-full text-sm text-ink/70 file:mr-3 file:rounded-lg file:border-0 file:bg-ink file:px-4 file:py-2 file:text-[12px] file:font-semibold file:text-gold-light"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] font-medium text-ink/60">
                эсвэл зургийн линк
              </label>
              <input
                type="url"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="https://..."
                className={fieldClass}
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-[12px] font-medium text-ink/60">
              Тайлбар (alt текст)
            </label>
            <input
              type="text"
              value={newAlt}
              onChange={(e) => setNewAlt(e.target.value)}
              placeholder="Жишээ: Оптик дэлгүүрийн хананд өрсөн шилний хүрээнүүд"
              className={fieldClass}
            />
          </div>

          <label className="flex items-center gap-2 text-[13px] text-ink/70">
            <input
              type="checkbox"
              checked={newSpan === "row-span-2"}
              onChange={(e) => setNewSpan(e.target.checked ? "row-span-2" : "")}
            />
            Том зураг (2 мөр эзэлнэ)
          </label>

          <button type="submit" disabled={adding} className={primaryBtn}>
            {adding ? "Нэмж байна..." : "Хадгалах"}
          </button>
        </form>
      )}

      <div className="overflow-hidden rounded-lg border border-ink/10 bg-white shadow-sm">
        {images.length === 0 && (
          <p className="px-6 py-8 text-center text-sm text-ink/40">
            Одоогоор зураг алга.
          </p>
        )}

        <div className="divide-y divide-ink/10">
          {images.map((img, index) =>
            editingId === img.id ? (
              <EditRow
                key={img.id}
                image={img}
                onCancel={() => setEditingId(null)}
                onSave={handleSaveEdit}
              />
            ) : (
              <div
                key={img.id}
                className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:px-6"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-ink/5">
                  {imageSrc(img.src, "") && (
                    <Image
                      src={imageSrc(img.src)}
                      alt={img.alt}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-lg leading-tight text-ink">
                    {img.alt}
                  </p>
                  <p className="mt-0.5 text-[12px] text-ink/45">
                    {img.span === "row-span-2" ? "Том зураг" : "Энгийн зураг"}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    className={arrowBtn}
                    aria-label="Дээшлүүлэх"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === images.length - 1}
                    className={arrowBtn}
                    aria-label="Доошлуулах"
                  >
                    ↓
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setEditingId(img.id)} className={editBtn}>
                    Засах
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(img)}
                    className={deleteBtn}
                  >
                    Устгах
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/55 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-ink/10 bg-white text-ink shadow-2xl shadow-ink/25">
            <div className="border-b border-ink/10 px-6 py-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-red-500">
                Устгах
              </p>
              <h2 className="mt-2 font-display text-2xl leading-tight">
                Энэ зургийг устгах уу?
              </h2>
              <p className="mt-2 text-sm leading-6 text-ink/55">
                Устгасны дараа энэ зураг галерейгаас харагдахгүй болно.
              </p>
            </div>

            <div className="flex gap-4 px-6 py-5">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-ink/5">
                {imageSrc(deleteTarget.src, "") && (
                  <Image
                    src={imageSrc(deleteTarget.src)}
                    alt={deleteTarget.alt}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="min-w-0">
                <p className="line-clamp-2 font-display text-lg leading-snug">
                  {deleteTarget.alt}
                </p>
                <p className="mt-1 text-[12px] text-ink/45">
                  {deleteTarget.span === "row-span-2" ? "Том зураг" : "Энгийн зураг"}
                </p>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-ink/10 bg-ink/[0.02] px-6 py-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={deletingId === deleteTarget.id}
                className="inline-flex h-11 items-center justify-center rounded-lg border border-ink/15 bg-white px-5 text-[13px] font-medium text-ink/65 transition-colors hover:border-ink/30 hover:text-ink disabled:opacity-50"
              >
                Цуцлах
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deletingId === deleteTarget.id}
                className="inline-flex h-11 items-center justify-center rounded-lg bg-red-600 px-5 text-[13px] font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                {deletingId === deleteTarget.id ? "Устгаж байна..." : "Устгах"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EditRow({
  image,
  onCancel,
  onSave,
}: {
  image: GalleryImage;
  onCancel: () => void;
  onSave: (
    id: string,
    patch: { alt: string; span: "" | "row-span-2" },
    file?: File | null
  ) => Promise<void>;
}) {
  const [alt, setAlt] = useState(image.alt);
  const [span, setSpan] = useState<"" | "row-span-2">(image.span);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const previewSrc = imageSrc(image.src, "");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await onSave(image.id, { alt, span }, fileRef.current?.files?.[0] ?? null);
    setSaving(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 bg-gold/[0.04] px-4 py-5 sm:flex-row sm:px-6"
    >
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-ink/5">
        {previewSrc && (
          <Image src={previewSrc} alt={image.alt} fill sizes="64px" className="object-cover" />
        )}
      </div>

      <div className="flex-1 space-y-3">
        <input
          type="text"
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          className={fieldClass}
        />

        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-[13px] text-ink/70">
            <input
              type="checkbox"
              checked={span === "row-span-2"}
              onChange={(e) => setSpan(e.target.checked ? "row-span-2" : "")}
            />
            Том зураг
          </label>

          <label className="cursor-pointer text-[12px] font-medium text-gold-dark underline-offset-2 hover:underline">
            Зураг солих
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/gif" className="hidden" />
          </label>
        </div>

        <div className="flex gap-2">
          <button type="submit" disabled={saving} className={primaryBtn}>
            {saving ? "Хадгалж байна..." : "Хадгалах"}
          </button>
          <button type="button" onClick={onCancel} className={cancelBtn}>
            Цуцлах
          </button>
        </div>
      </div>
    </form>
  );
}
