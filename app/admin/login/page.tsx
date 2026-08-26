"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Нэвтрэхэд алдаа гарлаа.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-ink px-5 py-10 text-ivory sm:px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(73,182,255,0.2),transparent_28%),radial-gradient(circle_at_82%_22%,rgba(0,104,255,0.18),transparent_26%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_38%,rgba(73,182,255,0.08))]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-light/70 to-transparent" />
      <div className="absolute -left-16 top-24 h-64 w-64 rounded-full border border-gold-light/10" />
      <div className="absolute -right-20 bottom-16 h-80 w-80 rounded-full border border-ivory/10" />

      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-5xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[28px] border border-ivory/12 bg-ivory/[0.04] shadow-2xl shadow-black/30 backdrop-blur xl:grid-cols-[0.95fr_1.05fr]">
          <div className="hidden min-h-[560px] flex-col justify-between border-r border-ivory/10 bg-ivory/[0.04] p-10 xl:flex">
            <div>
              <div className="relative h-24 w-56">
                <Image
                  src="/logo.png"
                  alt="Happy Optical"
                  fill
                  priority
                  className="object-contain object-left drop-shadow-[0_0_28px_rgba(73,182,255,0.35)]"
                />
              </div>
              <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.22em] text-ivory/45">
                Happy Optical
              </p>
              <h1 className="mt-4 font-display text-5xl leading-tight text-balance">
                Админ удирдлагын төв
              </h1>
            </div>

            <div className="space-y-4">
              <div className="h-px w-full bg-gradient-to-r from-gold-light/60 to-transparent" />
              <p className="max-w-sm text-sm leading-7 text-ivory/55">
                Бүтээгдэхүүн, ангилал, сайтын тохиргоогоо нэг дороос хурдан удирдаарай.
              </p>
            </div>
          </div>

          <div className="px-6 py-10 sm:px-10 sm:py-14 lg:px-14">
            <div className="mx-auto w-full max-w-md">
              <div className="mb-10 text-center xl:text-left">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-gold-light/25 bg-gold-light/10 font-display text-4xl text-gold-light shadow-lg shadow-gold/10 xl:mx-0 xl:hidden">
                  H
                </div>
                <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.22em] text-ivory/45 xl:mt-0">
                  Админ самбар
                </p>
                <h2 className="mt-3 font-display text-3xl text-ivory sm:text-4xl">
                  Тавтай морил
                </h2>
                <p className="mt-3 text-sm leading-6 text-ivory/50">
                  Нууц үгээ оруулаад удирдлагын хэсэг рүү нэвтэрнэ үү.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-[12px] uppercase tracking-[0.12em] text-ivory/55"
                  >
                    Нууц үг
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    autoFocus
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-14 w-full rounded-2xl border border-ivory/12 bg-ivory/[0.07] px-5 text-base text-ivory outline-none transition duration-300 placeholder:text-ivory/25 hover:border-gold-light/35 focus:border-gold-light focus:bg-ivory/[0.1] focus:shadow-[0_0_0_4px_rgba(73,182,255,0.12)]"
                  />
                </div>

                {error && (
                  <p className="rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-gold px-5 text-[13px] font-semibold uppercase tracking-[0.14em] text-ivory shadow-lg shadow-gold/25 transition duration-300 hover:-translate-y-0.5 hover:bg-gold-light hover:shadow-gold/35 disabled:translate-y-0 disabled:cursor-wait disabled:opacity-60"
                >
                  <span>{loading ? "Түр хүлээнэ үү..." : "Нэвтрэх"}</span>
                  <span className="text-lg leading-none transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </button>
              </form>

              <p className="mt-8 text-center text-xs leading-6 text-ivory/35 xl:text-left">
                Зөвшөөрөгдсөн админ хэрэглэгчдэд зориулагдсан хамгаалалттай хэсэг.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
