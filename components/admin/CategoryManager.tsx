"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Category } from "@/lib/db";

const field =
  "w-full rounded-lg border border-ink/15 bg-white px-4 py-2.5 text-[15px] text-ink placeholder:text-ink/30 outline-none transition-colors focus:border-gold focus:ring-2 focus:ring-gold/15";

export default function CategoryManager({
  categories,
  productCounts,
}: {
  categories: Category[];
  productCounts: Record<string, number>;
}) {
  const router = useRouter();
  const [newLabel, setNewLabel] = useState("");
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newLabel.trim()) return;
    setSaving(true);
    setError("");

    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: newLabel.trim() }),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Ангилал нэмэхэд алдаа гарлаа.");
      return;
    }

    setNewLabel("");
    router.refresh();
  }

  async function handleRename(slug: string) {
    if (!editLabel.trim()) return;
    setSaving(true);
    setError("");

    const res = await fetch(`/api/categories/${slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: editLabel.trim() }),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Хадгалахад алдаа гарлаа.");
      return;
    }

    setEditingSlug(null);
    router.refresh();
  }

  async function handleDelete(slug: string) {
    setSaving(true);
    await fetch(`/api/categories/${slug}`, { method: "DELETE" });
    setSaving(false);
    router.refresh();
  }

  return (
    <div className="max-w-2xl">
      <form
        onSubmit={handleCreate}
        className="flex gap-3 mb-8 bg-white border border-ink/10 rounded-2xl shadow-sm p-4"
      >
        <input
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          placeholder="Шинэ ангиллын нэр"
          className={field}
        />
        <button
          type="submit"
          disabled={saving || !newLabel.trim()}
          className="shrink-0 bg-gold text-ivory px-6 py-2.5 rounded-lg text-[13px] tracking-[0.12em] uppercase hover:bg-gold-dark transition-colors disabled:opacity-50"
        >
          Нэмэх
        </button>
      </form>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3 mb-6">
          {error}
        </p>
      )}

      <div className="bg-white border border-ink/10 rounded-2xl shadow-sm divide-y divide-ink/10 overflow-hidden">
        {categories.length === 0 && (
          <p className="py-16 text-center text-ink/40">Ангилал одоогоор алга.</p>
        )}
        {categories.map((c) => (
          <div key={c.slug} className="flex items-center gap-3 px-5 py-4">
            {editingSlug === c.slug ? (
              <>
                <input
                  autoFocus
                  value={editLabel}
                  onChange={(e) => setEditLabel(e.target.value)}
                  className={`${field} py-2`}
                />
                <button
                  onClick={() => handleRename(c.slug)}
                  disabled={saving}
                  className="shrink-0 text-[12px] tracking-[0.06em] bg-gold text-ivory px-4 py-2 rounded-lg hover:bg-gold-dark transition-colors disabled:opacity-50"
                >
                  Хадгалах
                </button>
                <button
                  onClick={() => setEditingSlug(null)}
                  className="shrink-0 text-[12px] tracking-[0.06em] border border-ink/15 text-ink/60 px-4 py-2 rounded-lg hover:bg-ink/5 transition-colors"
                >
                  Цуцлах
                </button>
              </>
            ) : (
              <>
                <div className="flex-1 min-w-0">
                  <p className="font-display text-lg truncate">{c.label}</p>
                  <p className="text-[12px] text-ink/40 font-mono">
                    {c.slug} · {productCounts[c.slug] ?? 0} бараа
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingSlug(c.slug);
                    setEditLabel(c.label);
                  }}
                  className="shrink-0 text-[12px] tracking-[0.06em] border border-gold/50 text-gold-dark px-4 py-2 rounded-lg hover:bg-gold hover:text-ivory hover:border-gold transition-colors"
                >
                  Засах
                </button>
                <button
                  onClick={() => handleDelete(c.slug)}
                  disabled={saving}
                  className="shrink-0 text-[12px] tracking-[0.06em] border border-red-300 text-red-600 px-4 py-2 rounded-lg hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors"
                >
                  Устгах
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
