import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import { getSettings } from "@/lib/db";

export const metadata: Metadata = {
  title: "Холбоо барих",
  description: "Happy Optical-той холбогдох хаяг, утас, и-мэйл, ажиллах цаг.",
};

export default async function ContactPage() {
  const settings = await getSettings();
  return (
    <div className="pt-20">
      <section className="max-w-content mx-auto px-5 sm:px-6 md:px-8 lg:px-10 pt-16 md:pt-20 pb-12 md:pb-16">
        <Reveal>
          <h1 className="font-display text-5xl md:text-[3.5rem] lg:text-6xl leading-[1.05] max-w-3xl lg:max-w-2xl text-balance">
            Хараагаа шалгуулж, өөрт тохирсон шилээ сонгоорой.
          </h1>
        </Reveal>
      </section>

      <section className="max-w-content mx-auto px-5 sm:px-6 md:px-8 lg:px-10 pb-20 md:pb-24">
        <Reveal delay={120}>
          <div className="rounded-2xl border border-line/30 bg-charcoal/40 grid lg:grid-cols-2 divide-y lg:divide-y-0 divide-line/20 overflow-hidden">
            {/* Зүүн багана: Хаяг + Ажиллах цаг */}
            <div className="divide-y divide-line/20 lg:border-r border-line/20">
              <div className="flex gap-4 p-5 sm:p-6 md:gap-5 md:p-8">
                <div className="w-11 h-11 shrink-0 rounded-full bg-gold/10 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="text-gold-light">
                    <path d="M12 21s-7-6.1-7-11a7 7 0 1 1 14 0c0 4.9-7 11-7 11z" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="10" r="2.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <p className="text-[11px] tracking-[0.18em] uppercase text-ivory/40 mb-2">
                    Хаяг
                  </p>
                  <p className="text-lg leading-relaxed">{settings.contact.address}</p>
                </div>
              </div>

              <div className="flex gap-4 p-5 sm:p-6 md:gap-5 md:p-8">
                <div className="w-11 h-11 shrink-0 rounded-full bg-gold/10 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="text-gold-light">
                    <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-[11px] tracking-[0.18em] uppercase text-ivory/40 mb-3">
                    Ажиллах цаг
                  </p>
                  <ul className="space-y-2">
                    {settings.contact.hours.map((h) => (
                      <li key={h.day} className="flex max-w-sm justify-between gap-4 text-ivory/70">
                        <span>{h.day}</span>
                        <span className="font-mono text-[13px]">{h.time}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Баруун багана: Утас, И-мэйл + Сошиал */}
            <div className="divide-y divide-line/20">
              <div className="flex gap-4 p-5 sm:p-6 md:gap-5 md:p-8">
                <div className="w-11 h-11 shrink-0 rounded-full bg-gold/10 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="text-gold-light">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <p className="text-[11px] tracking-[0.18em] uppercase text-ivory/40 mb-2">
                    Утас
                  </p>
                  <a
                    href={`tel:${settings.contact.phone.replace(/\s/g, "")}`}
                    className="text-lg hover:text-gold-light transition-colors"
                  >
                    {settings.contact.phone}
                  </a>
                </div>
              </div>

              <div className="flex gap-4 p-5 sm:p-6 md:gap-5 md:p-8">
                <div className="w-11 h-11 shrink-0 rounded-full bg-gold/10 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="text-gold-light">
                    <rect x="2" y="4" width="20" height="16" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="m22 6-10 7L2 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <p className="text-[11px] tracking-[0.18em] uppercase text-ivory/40 mb-2">
                    И-мэйл
                  </p>
                  <a
                    href={`mailto:${settings.contact.email}`}
                    className="text-lg hover:text-gold-light transition-colors break-all"
                  >
                    {settings.contact.email}
                  </a>
                </div>
              </div>

              <div className="p-5 sm:p-6 md:p-8">
                <p className="text-[11px] tracking-[0.18em] uppercase text-ivory/40 mb-3">
                  Сошиал
                </p>
                <div className="flex flex-wrap gap-3">
                  {settings.social.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm px-4 py-2 rounded-full border border-line/30 text-ivory/70 hover:border-gold hover:text-gold-light transition-colors"
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="border-t border-line/40">
        <div className="h-[360px] w-full md:h-[420px]">
          <iframe
            title="Happy Optical байршил"
            src={settings.contact.mapEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </div>
  );
}
