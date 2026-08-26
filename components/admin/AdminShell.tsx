"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  { label: "Бүтээгдэхүүн", href: "/admin", match: ["/admin", "/admin/products"] },
  { label: "Ангилал", href: "/admin/categories", match: ["/admin/categories"] },
  { label: "Галерей", href: "/admin/gallery", match: ["/admin/gallery"] },
  { label: "Тохиргоо", href: "/admin/settings", match: ["/admin/settings"] },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-ivory text-ink">
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-ivory/95 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-transparent text-ink transition-colors hover:bg-ink/[0.04] lg:hidden"
              aria-label="Цэс"
              aria-expanded={menuOpen}
            >
              <span className="relative h-4 w-5">
                <span
                  className={`absolute left-0 top-0 h-0.5 w-5 bg-current transition-transform ${
                    menuOpen ? "translate-y-[7px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`absolute left-0 top-[7px] h-0.5 w-5 bg-current transition-opacity ${
                    menuOpen ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`absolute left-0 top-[14px] h-0.5 w-5 bg-current transition-transform ${
                    menuOpen ? "-translate-y-[7px] -rotate-45" : ""
                  }`}
                />
              </span>
            </button>

            <nav className="hidden items-center gap-2 rounded-lg bg-ink/[0.04] p-1 lg:flex">
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

          {menuOpen && (
            <div className="mt-3 space-y-3 rounded-lg border border-ink/10 bg-white p-3 shadow-sm lg:hidden">
              <nav className="grid gap-1">
                {navItems.map((item) => {
                  const active = item.match.some((match) =>
                    match === "/admin" ? pathname === match : pathname?.startsWith(match)
                  );

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`rounded-md px-3 py-2 text-[13px] font-semibold transition-colors ${
                        active
                          ? "bg-gold/15 text-gold-dark"
                          : "text-ink/60 hover:bg-ink/[0.04] hover:text-ink"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="grid grid-cols-2 gap-2 border-t border-ink/10 pt-3">
                <Link
                  href="/"
                  target="_blank"
                  className="rounded-lg border border-ink/10 bg-white px-3 py-2 text-center text-[12px] font-medium text-ink/65 shadow-sm transition-colors hover:border-gold/40 hover:text-ink"
                >
                  Сайт
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg border border-red-200 bg-white px-3 py-2 text-[12px] font-medium text-red-600 shadow-sm transition-colors hover:border-red-600 hover:bg-red-600 hover:text-white"
                >
                  Гарах
                </button>
              </div>
            </div>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">{children}</main>
    </div>
  );
}
