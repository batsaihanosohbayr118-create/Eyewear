import Link from "next/link";
import Image from "next/image";
import { nav } from "@/content/site";
import type { Settings } from "@/lib/db";

function PinIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 21s-7-7.14-7-12a7 7 0 1114 0c0 4.86-7 12-7 12z" strokeLinejoin="round" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path
        d="M4 4h4l2 5-2.5 1.5a11 11 0 005 5L14 13l5 2v4a2 2 0 01-2 2A15 15 0 014 6a2 2 0 012-2z"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M14 22v-8h2.7l.4-3.3H14V8.6c0-.96.27-1.6 1.65-1.6H17V4.14C16.7 4.1 15.68 4 14.5 4 12.1 4 10.5 5.47 10.5 8.3v2.4H8V14h2.5v8h3.5z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function PinterestIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3a9 9 0 00-3.3 17.4c-.05-.75-.1-1.9.02-2.72.11-.75.72-4.78.72-4.78s-.18-.37-.18-.9c0-.85.49-1.48 1.11-1.48.52 0 .78.4.78.87 0 .53-.34 1.32-.51 2.05-.15.62.3 1.12.9 1.12 1.08 0 1.9-1.15 1.9-2.79 0-1.46-1.04-2.48-2.53-2.48-1.72 0-2.74 1.3-2.74 2.63 0 .53.2 1.09.45 1.4a.18.18 0 01.04.17c-.05.2-.16.62-.18.7-.03.12-.09.15-.22.09-.8-.37-1.3-1.55-1.3-2.5 0-2.03 1.48-3.9 4.26-3.9 2.24 0 3.98 1.6 3.98 3.72 0 2.22-1.4 4-3.34 4-.65 0-1.27-.34-1.48-.74l-.4 1.55c-.15.56-.54 1.27-.8 1.7A9 9 0 1012 3z" />
    </svg>
  );
}

function MessengerIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.15 2 11.25c0 2.9 1.46 5.49 3.75 7.19V22l3.42-1.88c.91.25 1.87.38 2.83.38 5.52 0 10-4.15 10-9.25S17.52 2 12 2zm1.02 12.45l-2.55-2.72-4.98 2.72 5.48-5.82 2.61 2.72 4.92-2.72-5.48 5.82z" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 010 18 14 14 0 010-18z" />
    </svg>
  );
}

function socialIcon(label: string) {
  const key = label.trim().toLowerCase();
  if (key.includes("facebook")) return <FacebookIcon />;
  if (key.includes("instagram")) return <InstagramIcon />;
  if (key.includes("pinterest")) return <PinterestIcon />;
  if (key.includes("messenger")) return <MessengerIcon />;
  return <LinkIcon />;
}

export default function Footer({ settings }: { settings: Settings }) {
  return (
    <footer className="bg-ink border-t border-line/60">
      <div className="max-w-content mx-auto px-5 sm:px-6 md:px-8 lg:px-10 py-14 md:py-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
        <div className="sm:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Image
              src="/logo.png"
              alt={settings.fullName}
              width={180}
              height={92}
              className="h-20 w-auto"
            />
          </div>
          <p className="text-ivory/55 text-sm leading-relaxed max-w-sm">
            {settings.description}
          </p>
        </div>

        <div>
          <p className="text-[11px] tracking-[0.2em] uppercase text-ivory/40 mb-4">
            Мэдээлэл
          </p>
          <ul className="space-y-3">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-ivory/65 hover:text-ivory transition-colors duration-300"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[11px] tracking-[0.2em] uppercase text-ivory/40 mb-4">
            Холбоо барих
          </p>
          <ul className="space-y-3 text-sm text-ivory/65">
            <li className="flex items-start gap-2.5">
              <span className="text-ivory/40 mt-0.5 shrink-0"><PinIcon /></span>
              <span>{settings.contact.address}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <span className="text-ivory/40 shrink-0"><PhoneIcon /></span>
              <a href={`tel:${settings.contact.phone.replace(/\s/g, "")}`} className="hover:text-ivory transition-colors">
                {settings.contact.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${settings.contact.email}`} className="hover:text-ivory transition-colors">
                {settings.contact.email}
              </a>
            </li>
            {settings.social.map((s) => (
              <li key={s.label} className="flex items-center gap-2.5">
                <span className="text-ivory/40 shrink-0">{socialIcon(s.label)}</span>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-ivory transition-colors"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-line/50">
        <div className="max-w-content mx-auto px-5 sm:px-6 md:px-8 lg:px-10 py-6 flex flex-col sm:flex-row justify-between gap-2 text-[12px] text-ivory/35">
          <p>© {new Date().getFullYear()} {settings.fullName}. Бүх эрх хуулиар хамгаалагдсан.</p>
          <p className="font-mono">Founded {settings.founded}</p>
        </div>
      </div>
    </footer>
  );
}
