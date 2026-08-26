"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { nav } from "@/content/site";
import type { Settings } from "@/lib/db";

export default function Header({ settings }: { settings: Settings }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ease-signature ${
        scrolled ? "bg-ink/90 backdrop-blur-md border-b border-line/60" : "bg-transparent"
      }`}
    >
      <div className="max-w-content mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 group"
          aria-label={`${settings.fullName} — нүүр хуудас`}
        >
          <Image
            src="/logo.png"
            alt={settings.fullName}
            width={180}
            height={92}
            priority
            className="h-14 w-auto md:h-16"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative text-[13px] tracking-[0.14em] uppercase py-2 transition-colors duration-300 ${
                  active ? "text-ivory" : "text-ivory/60 hover:text-ivory"
                }`}
              >
                {item.label}
                <span
                  className={`absolute left-0 -bottom-0.5 h-px bg-gold transition-all duration-300 ease-signature ${
                    active ? "w-full" : "w-0"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden relative w-9 h-9 flex flex-col items-center justify-center gap-[6px]"
          aria-label={menuOpen ? "Цэсийг хаах" : "Цэсийг нээх"}
          aria-expanded={menuOpen}
        >
          <span
            className={`block h-px w-6 bg-ivory transition-transform duration-300 ease-signature ${
              menuOpen ? "translate-y-[3.5px] rotate-45" : ""
            }`}
          />
          <span
            className={`block h-px w-6 bg-ivory transition-transform duration-300 ease-signature ${
              menuOpen ? "-translate-y-[3.5px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      <div
        className={`md:hidden fixed inset-x-0 top-20 bottom-0 bg-ink transition-transform duration-500 ease-signature ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <nav className="flex flex-col px-6 pt-10 gap-1">
          {nav.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className="py-4 border-b border-line/50 font-display text-2xl"
              style={{ transitionDelay: `${i * 40}ms` }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
