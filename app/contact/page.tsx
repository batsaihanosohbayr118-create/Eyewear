import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import { getSettings } from "@/lib/db";

export const metadata: Metadata = {
  title: "Холбоо барих",
  description: "Happy Optical-той холбогдох хаяг, утас, и-мэйл, ажиллах цаг.",
};

export default async function ContactPage() {
  const settings = await getSettings();
  return (
    <div className="pt-20">
      <section className="max-w-content mx-auto px-6 md:px-10 pt-20 pb-16">
        <Reveal>
          <h1 className="font-display text-5xl md:text-6xl leading-[1.05] max-w-2xl text-balance">
            Хараагаа шалгуулж, өөрт тохирсон шилээ сонгоорой.
          </h1>
        </Reveal>
      </section>

      <section className="max-w-content mx-auto px-6 md:px-10 pb-24 grid lg:grid-cols-2 gap-16">
        <Reveal>
          <ContactForm />
        </Reveal>

        <Reveal delay={120} className="space-y-10">
          <div>
            <p className="text-[12px] tracking-[0.18em] uppercase text-ivory/40 mb-3">
              Хаяг
            </p>
            <p className="text-lg leading-relaxed">{settings.contact.address}</p>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-[12px] tracking-[0.18em] uppercase text-ivory/40 mb-3">
                Утас
              </p>
              <a
                href={`tel:${settings.contact.phone.replace(/\s/g, "")}`}
                className="text-lg hover:text-gold-light transition-colors"
              >
                {settings.contact.phone}
              </a>
            </div>
            <div>
              <p className="text-[12px] tracking-[0.18em] uppercase text-ivory/40 mb-3">
                И-мэйл
              </p>
              <a
                href={`mailto:${settings.contact.email}`}
                className="text-lg hover:text-gold-light transition-colors"
              >
                {settings.contact.email}
              </a>
            </div>
          </div>
          <div>
            <p className="text-[12px] tracking-[0.18em] uppercase text-ivory/40 mb-3">
              Ажиллах цаг
            </p>
            <ul className="space-y-1">
              {settings.contact.hours.map((h) => (
                <li key={h.day} className="flex justify-between max-w-xs text-ivory/70">
                  <span>{h.day}</span>
                  <span className="font-mono text-[13px]">{h.time}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[12px] tracking-[0.18em] uppercase text-ivory/40 mb-3">
              Сошиал
            </p>
            <div className="flex gap-5">
              {settings.social.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-ivory/70 border-b border-ivory/20 hover:border-gold hover:text-gold-light transition-colors"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <section className="border-t border-line/40">
        <div className="h-[420px] w-full">
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
