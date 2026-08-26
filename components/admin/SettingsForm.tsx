"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Settings } from "@/lib/db";
import { imageSrc } from "@/lib/image-src";

export default function SettingsForm({ settings }: { settings: Settings }) {
  const router = useRouter();
  const [values, setValues] = useState(settings);
  const [uploadingHeroImage, setUploadingHeroImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const heroPreviewSrc = imageSrc(values.heroImage, "");

  function updateContact<K extends keyof Settings["contact"]>(
    key: K,
    value: Settings["contact"][K]
  ) {
    setValues((v) => ({ ...v, contact: { ...v.contact, [key]: value } }));
  }

  function updateHour(index: number, key: "day" | "time", value: string) {
    setValues((v) => ({
      ...v,
      contact: {
        ...v.contact,
        hours: v.contact.hours.map((h, i) =>
          i === index ? { ...h, [key]: value } : h
        ),
      },
    }));
  }

  function addHourRow() {
    setValues((v) => ({
      ...v,
      contact: { ...v.contact, hours: [...v.contact.hours, { day: "", time: "" }] },
    }));
  }

  function removeHourRow(index: number) {
    setValues((v) => ({
      ...v,
      contact: {
        ...v.contact,
        hours: v.contact.hours.filter((_, i) => i !== index),
      },
    }));
  }

  function updateSocial(index: number, key: "label" | "href", value: string) {
    setValues((v) => ({
      ...v,
      social: v.social.map((s, i) => (i === index ? { ...s, [key]: value } : s)),
    }));
  }

  function addSocialRow() {
    setValues((v) => ({ ...v, social: [...v.social, { label: "", href: "" }] }));
  }

  function removeSocialRow(index: number) {
    setValues((v) => ({ ...v, social: v.social.filter((_, i) => i !== index) }));
  }

  async function handleHeroImageUpload(file: File) {
    setUploadingHeroImage(true);
    setError("");
    setSaved(false);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    setUploadingHeroImage(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Зураг байршуулахад алдаа гарлаа.");
      return;
    }

    const data = await res.json();
    setValues((v) => ({ ...v, heroImage: data.url }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);

    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Хадгалахад алдаа гарлаа.");
      return;
    }

    setSaved(true);
    router.refresh();
  }

  const field =
    "w-full rounded-lg border border-ink/15 bg-white px-4 py-2.5 text-[15px] text-ink placeholder:text-ink/30 outline-none transition-colors focus:border-gold focus:ring-2 focus:ring-gold/15";
  const label = "block text-[11px] font-mono tracking-[0.14em] uppercase text-ink/45 mb-2";
  const card = "space-y-5 bg-white border border-ink/10 rounded-2xl shadow-sm p-6 md:p-8";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6 items-start">
        <div className="space-y-6">
          <section className={card}>
            <h2 className="font-display text-xl">Компанийн мэдээлэл</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className={label}>Компанийн нэр</label>
                <input
                  required
                  value={values.fullName}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, fullName: e.target.value, name: e.target.value }))
                  }
                  className={field}
                />
              </div>
              <div>
                <label className={label}>Уриа (tagline)</label>
                <input
                  value={values.tagline}
                  onChange={(e) => setValues((v) => ({ ...v, tagline: e.target.value }))}
                  className={field}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={label}>Танилцуулга</label>
                <textarea
                  rows={3}
                  value={values.description}
                  onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))}
                  className={`${field} resize-none`}
                />
              </div>
              <div>
                <label className={label}>Байгуулагдсан он</label>
                <input
                  value={values.founded}
                  onChange={(e) => setValues((v) => ({ ...v, founded: e.target.value }))}
                  className={field}
                />
              </div>
            </div>
          </section>

          <section className={card}>
            <h2 className="font-display text-xl">Нүүр зураг</h2>
            <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-dashed border-ink/15 bg-ink/[0.03]">
              {heroPreviewSrc ? (
                <>
                  <Image
                    src={heroPreviewSrc}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                  />
                  <label className="absolute inset-x-3 bottom-3 flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-ink/70 py-2.5 text-[12px] uppercase tracking-[0.1em] text-ivory backdrop-blur-sm transition-colors hover:bg-ink/85">
                    {uploadingHeroImage ? "Байршуулж байна…" : "Зураг солих"}
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleHeroImageUpload(file);
                      }}
                    />
                  </label>
                </>
              ) : (
                <label className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-3 text-ink/35 transition-colors hover:bg-gold/5 hover:text-gold-dark">
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
                    {uploadingHeroImage ? "Байршуулж байна…" : "Зураг сонгох"}
                  </span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleHeroImageUpload(file);
                    }}
                  />
                </label>
              )}
            </div>
            <p className="mt-3 text-[12px] text-ink/40">
              Эсвэл доор шууд зурган URL оруулж болно
            </p>
            <input
              value={values.heroImage}
              onChange={(e) => setValues((v) => ({ ...v, heroImage: e.target.value }))}
              placeholder="https://…"
              className={`${field} mt-2 text-[13px] py-2.5`}
            />
          </section>

          <section className={card}>
            <h2 className="font-display text-xl">SEO</h2>
            <div>
              <label className={label}>Үндсэн гарчиг (default title)</label>
              <input
                value={values.seo.defaultTitle}
                onChange={(e) =>
                  setValues((v) => ({ ...v, seo: { ...v.seo, defaultTitle: e.target.value } }))
                }
                className={field}
              />
            </div>
            <div>
              <label className={label}>SEO тайлбар</label>
              <textarea
                rows={2}
                value={values.seo.description}
                onChange={(e) =>
                  setValues((v) => ({ ...v, seo: { ...v.seo, description: e.target.value } }))
                }
                className={`${field} resize-none`}
              />
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className={card}>
            <h2 className="font-display text-xl">Холбоо барих</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label className={label}>Хаяг</label>
                <input
                  value={values.contact.address}
                  onChange={(e) => updateContact("address", e.target.value)}
                  className={field}
                />
              </div>
              <div>
                <label className={label}>Утас</label>
                <input
                  value={values.contact.phone}
                  onChange={(e) => updateContact("phone", e.target.value)}
                  className={field}
                />
              </div>
              <div>
                <label className={label}>И-мэйл</label>
                <input
                  type="email"
                  value={values.contact.email}
                  onChange={(e) => updateContact("email", e.target.value)}
                  className={field}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={label}>Google Maps embed URL</label>
                <input
                  value={values.contact.mapEmbedUrl}
                  onChange={(e) => updateContact("mapEmbedUrl", e.target.value)}
                  className={field}
                />
              </div>
            </div>
            <div>
              <label className={label}>Ажиллах цаг</label>
              <div className="space-y-3">
                {values.contact.hours.map((h, i) => (
                  <div key={i} className="rounded-lg border border-ink/10 p-3 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        value={h.day}
                        onChange={(e) => updateHour(i, "day", e.target.value)}
                        placeholder="Даваа - Баасан"
                        className={`${field} py-2`}
                      />
                      <input
                        value={h.time}
                        onChange={(e) => updateHour(i, "time", e.target.value)}
                        placeholder="10:00 - 20:00"
                        className={`${field} py-2`}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeHourRow(i)}
                      className="text-[12px] tracking-[0.06em] border border-red-300 text-red-600 px-3 py-2 rounded-lg hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors"
                    >
                      Хасах
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addHourRow}
                  className="text-[12px] tracking-[0.06em] border border-gold/50 text-gold-dark px-4 py-2 rounded-lg hover:bg-gold hover:text-ivory hover:border-gold transition-colors"
                >
                  + Мөр нэмэх
                </button>
              </div>
            </div>
          </section>

          <section className={card}>
            <h2 className="font-display text-xl">Сошиал холбоос</h2>
            <div className="space-y-3">
              {values.social.map((s, i) => (
                <div key={i} className="rounded-lg border border-ink/10 p-3 space-y-2">
                  <div className="flex gap-2 items-center">
                    <input
                      value={s.label}
                      onChange={(e) => updateSocial(i, "label", e.target.value)}
                      placeholder="Instagram"
                      className={`${field} py-2 min-w-0 flex-1`}
                    />
                    <button
                      type="button"
                      onClick={() => removeSocialRow(i)}
                      className="shrink-0 text-[12px] tracking-[0.06em] border border-red-300 text-red-600 px-3 py-2 rounded-lg hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors"
                    >
                      Хасах
                    </button>
                  </div>
                  <input
                    value={s.href}
                    onChange={(e) => updateSocial(i, "href", e.target.value)}
                    placeholder="https://instagram.com/…"
                    className={`${field} py-2`}
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={addSocialRow}
                className="text-[12px] tracking-[0.06em] border border-gold/50 text-gold-dark px-4 py-2 rounded-lg hover:bg-gold hover:text-ivory hover:border-gold transition-colors"
              >
                + Холбоос нэмэх
              </button>
            </div>
          </section>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
          {error}
        </p>
      )}
      {saved && !error && (
        <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-4 py-3">
          Хадгалагдлаа.
        </p>
      )}

      <div>
        <button
          type="submit"
          disabled={saving || uploadingHeroImage}
          className="bg-gold text-ivory px-7 py-3 rounded-lg text-[13px] tracking-[0.12em] uppercase hover:bg-gold-dark transition-colors disabled:opacity-50"
        >
          {saving ? "Хадгалж байна…" : "Өөрчлөлт хадгалах"}
        </button>
      </div>
    </form>
  );
}
