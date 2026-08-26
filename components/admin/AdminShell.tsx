"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

const navItems = [
  { label: "Бүтээгдэхүүн", href: "/admin", match: ["/admin", "/admin/products"] },
  { label: "Ангилал", href: "/admin/categories", match: ["/admin/categories"] },
  { label: "Галерей", href: "/admin/gallery", match: ["/admin/gallery"] },
  { label: "Тохиргоо", href: "/admin/settings", match: ["/admin/settings"] },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-ivory text-ink">
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-ivory/95 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center justify-between gap-4">
              <Link href="/admin" className="group flex min-w-0 items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ink text-center font-display text-2xl leading-none text-gold-light shadow-sm transition-colors group-hover:bg-charcoal">
                  H
                </span>
                <span className="min-w-0">
                  <span className="block font-display text-xl leading-none text-ink">
                    Happy Optical
                  </span>
                  <span className="mt-1 block truncate font-mono text-[10px] uppercase tracking-[0.18em] text-ink/45">
                    Админ самбар
                  </span>
                </span>
              </Link>

              <div className="flex shrink-0 items-center gap-2 lg:hidden">
                <Link
                  href="/"
                  target="_blank"
                  className="rounded-lg border border-ink/10 bg-white px-3 py-2 text-[12px] font-medium text-ink/65 shadow-sm transition-colors hover:border-gold/40 hover:text-ink"
                >
                  Сайт
                </Link>
                <button
                  onClick={handleLogout}
                  className="rounded-lg border border-red-200 bg-white px-3 py-2 text-[12px] font-medium text-red-600 shadow-sm transition-colors hover:border-red-600 hover:bg-red-600 hover:text-white"
                >
                  Гарах
                </button>
              </div>
            </div>

            <nav className="flex items-center gap-2 overflow-x-auto rounded-lg bg-ink/[0.04] p-1 lg:mx-6 lg:flex-1 lg:justify-center">
              {navItems.map((item) => {
                const active = item.match.some((match) =>
                  match === "/admin" ? pathname === match : pathname?.startsWith(match)
                );

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`whitespace-nowrap rounded-md px-4 py-2 text-[13px] font-semibold transition-colors ${
                      active
                        ? "bg-white text-gold-dark shadow-sm"
                        : "text-ink/55 hover:bg-white/70 hover:text-ink"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="hidden shrink-0 items-center gap-2 lg:flex">
              <Link
                href="/"
                target="_blank"
                className="rounded-lg border border-ink/10 bg-white px-4 py-2.5 text-[13px] font-medium text-ink/65 shadow-sm transition-colors hover:border-gold/40 hover:text-ink"
              >
                Сайтыг үзэх
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-lg border border-red-200 bg-white px-4 py-2.5 text-[13px] font-medium text-red-600 shadow-sm transition-colors hover:border-red-600 hover:bg-red-600 hover:text-white"
              >
                Гарах
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">{children}</main>
    </div>
  );
}