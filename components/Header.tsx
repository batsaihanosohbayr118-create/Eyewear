"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { nav } from "@/content/site";
import type { Settings } from "@/lib/db";
import Wordmark from "./Wordmark";

function PhoneIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path
        d="M4 4h4l2 5-2.5 1.5a11 11 0 005 5L14 13l5 2v4a2 2 0 01-2 2A15 15 0 014 6a2 2 0 012-2z"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" strokeLinecap="round" />
    </svg>
  );
}

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

  const phoneHref = `tel:${settings.contact.phone.replace(/\s/g, "")}`;

  return (
    <>
    <header
      className={`fixed top-0 left-0 right-0 z-50 border-b border-ivory/10 transition-colors duration-500 ease-signature ${
        scrolled || menuOpen ? "bg-ink/90 backdrop-blur-md" : "bg-ink/20"
      }`}
    >
      <div className="max-w-content mx-auto px-5 sm:px-6 md:px-8 lg:px-10 h-20 grid grid-cols-[1fr_auto] lg:grid-cols-[1fr_auto_1fr] items-center">
        <Link
          href="/"
          className="justify-self-start"
          aria-label={`${settings.fullName} — нүүр хуудас`}
        >
          <Wordmark name={settings.name} />
        </Link>

        <nav className="hidden lg:flex items-center gap-10 xl:gap-12">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative py-2 text-[14px] transition-colors duration-300 ${
                  active ? "text-ivory font-semibold" : "text-ivory/75 hover:text-ivory"
                }`}
              >
                {item.label}
                <span
                  className={`absolute left-1/2 -translate-x-1/2 -bottom-1 h-px bg-gold transition-all duration-300 ease-signature ${
                    active ? "w-full" : "w-0"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="justify-self-end flex items-center gap-5">
          <a
            href={phoneHref}
            className="hidden sm:inline-flex text-ivory/85 hover:text-gold-light transition-colors"
            aria-label={`Утас: ${settings.contact.phone}`}
          >
            <PhoneIcon />
          </a>
          <Link
            href="/admin/login"
            className="hidden lg:inline-flex text-ivory/85 hover:text-gold-light transition-colors"
            aria-label="Админаар нэвтрэх"
          >
            <UserIcon />
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="lg:hidden relative w-9 h-9 flex flex-col items-center justify-center gap-[6px]"
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
      </div>

    </header>

    {/* Mobile menu — rendered outside <header>: the header's backdrop-blur
        would otherwise become the containing block for this fixed panel. */}
    <div
      className={`lg:hidden fixed inset-x-0 top-20 bottom-0 z-40 overflow-y-auto bg-ink transition-transform duration-500 ease-signature ${
        menuOpen ? "translate-x-0" : "translate-x-full"
      }`}
      aria-hidden={!menuOpen}
    >
      {/* Soft gold glow + hairline for a richer background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_100%_100%,rgba(196,164,111,0.22),transparent_55%),radial-gradient(ellipse_at_0%_0%,rgba(196,164,111,0.08),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

      <nav className="relative flex min-h-full flex-col px-6 pt-8 pb-10">
        {nav.map((item, i) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMenuOpen(false)}
            tabIndex={menuOpen ? 0 : -1}
            className={`flex items-baseline gap-4 py-4 border-b border-ivory/10 font-display text-3xl transition-all duration-500 ease-signature ${
              pathname === item.href ? "text-gold-light" : "text-ivory"
            } ${menuOpen ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"}`}
            style={{ transitionDelay: menuOpen ? `${120 + i * 60}ms` : "0ms" }}
          >
            <span className="font-body text-[11px] tracking-[0.2em] text-gold/70">
              0{i + 1}
            </span>
            {item.label}
          </Link>
        ))}

        <div className="mt-auto pt-10">
          <a
            href={phoneHref}
            tabIndex={menuOpen ? 0 : -1}
            className="btn-sweep btn-sweep-gold flex h-12 items-center justify-center gap-3 bg-gold px-5 text-[14px] text-ink"
          >
            <PhoneIcon /> {settings.contact.phone}
          </a>
          <Link
            href="/admin/login"
            tabIndex={menuOpen ? 0 : -1}
            className="mt-3 btn-sweep btn-sweep-outline flex h-12 items-center justify-center border border-ivory/25 px-5 text-[14px] text-ivory"
          >
            Админаар нэвтрэх
          </Link>
        </div>
      </nav>
    </div>
    </>
  );
}
