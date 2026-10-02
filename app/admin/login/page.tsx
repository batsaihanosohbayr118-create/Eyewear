"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const iconProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

function ShieldIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...iconProps}>
      <path d="M12 3l8 3v6c0 5-3.5 8.2-8 9.5C7.5 20.2 4 17 4 12V6l8-3z" />
      <path d="M12 7v10" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" {...iconProps}>
      <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" {...iconProps}>
      <path d="M4 4v16h16" />
      <path d="M8 15l3-4 3 2 4-6" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" {...iconProps}>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 018 0v3" />
    </svg>
  );
}

function EyeIcon({ off }: { off: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" {...iconProps}>
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
      {off && <path d="M4 4l16 16" />}
    </svg>
  );
}

function LoginIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" {...iconProps}>
      <path d="M14 4h4a2 2 0 012 2v12a2 2 0 01-2 2h-4" />
      <path d="M3 12h11M10 8l4 4-4 4" />
    </svg>
  );
}

/** Thin flowing gold lines, used for the backdrop and the left panel. */
function GoldWaves({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 600"
      preserveAspectRatio="none"
      fill="none"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="wave" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#d9c096" stopOpacity="0" />
          <stop offset="0.5" stopColor="#d9c096" stopOpacity="0.9" />
          <stop offset="1" stopColor="#d9c096" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M-50 520C200 380 380 600 640 470S1000 260 1250 330" stroke="url(#wave)" strokeWidth="1.4" />
      <path d="M-50 560C240 420 420 640 700 500S1040 300 1250 380" stroke="url(#wave)" strokeWidth="0.8" />
      <path d="M-50 90C220 10 420 160 700 80S1050 -10 1250 60" stroke="url(#wave)" strokeWidth="1" />
    </svg>
  );
}

const perks = [
  { label: ["Аюулгүй", "нэвтрэлт"], icon: <ShieldIcon /> },
  { label: ["Хурдан", "үйл ажиллагаа"], icon: <BoltIcon /> },
  { label: ["Илүү үр дүнтэй", "удирдлага"], icon: <ChartIcon /> },
];

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink px-4 py-10 text-ivory sm:px-6">
      {/* Backdrop: blurred photo + gold waves */}
      <Image
        src="/images/about-band.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="scale-110 object-cover opacity-40 blur-xl"
      />
      <div className="absolute inset-0 bg-ink/60" />
      <GoldWaves className="opacity-50" />

      <div className="relative grid w-full max-w-[440px] lg:max-w-[940px] overflow-hidden rounded-2xl border border-gold/50 bg-ink/80 shadow-[0_40px_120px_rgba(0,0,0,0.6)] backdrop-blur-md lg:grid-cols-2">
        {/* Left panel */}
        <div className="relative hidden min-h-[460px] flex-col justify-between overflow-hidden border-r border-ivory/10 p-10 lg:flex">
          <Image
            src="/images/about-vision.png"
            alt=""
            fill
            sizes="470px"
            className="object-cover object-[65%_center]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/70 to-ink/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent" />
          <GoldWaves className="opacity-60" />

          <div className="relative">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-gold-light">
              HEX Luxury Eyewear
            </p>
            <span className="mt-3 block h-px w-11 bg-gold" />
            <h1 className="mt-7 font-display text-[2.6rem] font-medium leading-[1.05]">
              Админ
              <br />
              удирдлагын төв
            </h1>
            <p className="mt-6 max-w-[240px] text-[14px] leading-relaxed text-ivory/70">
              Системд нэвтэрч, үйл ажиллагаагаа удирдана уу.
            </p>
          </div>

          <div className="relative grid grid-cols-3">
            {perks.map((p, i) => (
              <div
                key={p.label[0]}
                className={`flex flex-col items-center gap-3 px-2 text-center ${
                  i > 0 ? "border-l border-ivory/15" : ""
                }`}
              >
                <span className="grid h-9 w-9 place-items-center rounded-full border border-gold/60 text-gold-light">
                  {p.icon}
                </span>
                <span className="text-[11px] leading-snug text-ivory/75">
                  {p.label[0]}
                  <br />
                  {p.label[1]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel — form */}
        <div className="flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-12 lg:px-12 lg:py-14">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-gold-light">
            Админ самбар
          </p>
          <span className="mt-3 block h-px w-11 bg-gold" />
          <h2 className="mt-6 font-display text-4xl font-medium">Тавтай морил</h2>
          <p className="mt-3 text-[13px] text-ivory/60">
            Системд нэвтрэхийн тулд нууц үгээ оруулна уу.
          </p>

          <form onSubmit={handleSubmit} className="mt-9">
            <label
              htmlFor="password"
              className="mb-3 flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-ivory/70"
            >
              <span className="text-gold-light">
                <LockIcon />
              </span>
              Нууц үг
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                autoFocus
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Нууц үгээ оруулна уу"
                className="h-12 w-full rounded-lg border border-ivory/15 bg-ivory/[0.04] pl-4 pr-12 text-[14px] text-ivory outline-none transition placeholder:text-ivory/30 hover:border-gold/40 focus:border-gold focus-visible:outline-none focus:shadow-[0_0_0_3px_rgba(196,164,111,0.15)]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-ivory/60 transition-colors hover:text-gold-light"
                aria-label={showPassword ? "Нууц үгийг нуух" : "Нууц үгийг харуулах"}
              >
                <EyeIcon off={!showPassword} />
              </button>
            </div>

            {error && (
              <p className="mt-4 rounded-lg border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group mt-7 flex h-12 w-full items-center justify-center gap-3 rounded-lg bg-gradient-to-r from-[#e3c99c] via-gold to-[#b08f5a] text-[12px] font-semibold uppercase tracking-[0.24em] text-ink shadow-[0_10px_30px_rgba(196,164,111,0.3)] transition hover:brightness-110 disabled:cursor-wait disabled:opacity-60"
            >
              <LoginIcon />
              {loading ? "Түр хүлээнэ үү..." : "Нэвтрэх"}
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </button>
          </form>

          <div className="mt-8 flex items-center gap-4">
            <span className="h-px flex-1 bg-ivory/10" />
            <span className="text-gold-light/80">
              <ShieldIcon size={13} />
            </span>
            <span className="h-px flex-1 bg-ivory/10" />
          </div>
          <p className="mt-4 text-center text-[10px] uppercase tracking-[0.2em] text-gold-light/80">
            Системийн аюулгүй байдал хамгаалагдсан
          </p>
        </div>
      </div>
    </div>
  );
}
