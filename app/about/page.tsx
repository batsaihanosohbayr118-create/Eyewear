import Image from "next/image";
import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import { getSettings } from "@/lib/db";

export const metadata: Metadata = {
  title: "Бидний тухай",
  description: "Happy Optical хараа зүйн төвийн үйлчилгээ, философи.",
};

export default async function AboutPage() {
  const settings = await getSettings();
  return (
    <div className="pt-20">
      <section className="max-w-content mx-auto px-5 sm:px-6 md:px-8 lg:px-10 py-20 md:py-24 lg:py-32">
        <Reveal>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[1.02] max-w-4xl text-balance">
            {settings.founded} оноос хойш таны хараанд тохирсон шийдлийг
            илүү ойр болгож байна.
          </h1>
        </Reveal>
      </section>

      <section className="relative h-[58vh] min-h-[380px] overflow-hidden md:h-[62vh] md:min-h-[440px] lg:h-[70vh]">
        <div className="absolute inset-0 animate-[kenburns_18s_ease-in-out_infinite_alternate]">
          <Image
            src="https://images.unsplash.com/photo-1486250944723-86bca2b15b06?auto=format&fit=crop&w=2200&q=85"
            alt="Оптик дэлгүүрийн шилний тавиур"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent animate-[fadeIn_1.2s_ease-out]" />
      </section>

      <style>{`
        @keyframes kenburns {
          0% { transform: scale(1) translate(0, 0); }
          100% { transform: scale(1.12) translate(-1%, -1%); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      <section className="max-w-content mx-auto px-5 sm:px-6 md:px-8 lg:px-10 py-20 md:py-24 lg:py-32 grid gap-10 md:gap-14 lg:grid-cols-[1fr_1.4fr]">
        <Reveal>
          <p className="font-mono text-[11px] tracking-[0.24em] uppercase text-gold-light">
            Философи
          </p>
        </Reveal>
        <Reveal
          delay={100}
          direction="right"
          className="max-w-3xl space-y-6 text-base leading-relaxed text-ivory/70 md:space-y-8 md:text-lg lg:max-w-none"
        >
          <p>
            Happy Optical нь зөвхөн хүрээ худалдах биш, харааг тань ойлгож
            тохирсон линз, эвтэйхэн хүрээ, өдөр тутмын хэрэглээнд нийцсэн
            шийдлийг хамтад нь санал болгодог.
          </p>
          <p>
            Манай зөвлөхүүд харааны хэмжилт, линзний төрөл, хүрээний суулт,
            нүүрний хэлбэрийн харьцааг хамтад нь харж сонголт хийхэд тусална.
          </p>
          <p>
            Шил авсны дараа ч хүрээний тохируулга, арчилгаа, линзний зөв
            хэрэглээний зөвлөгөөг үргэлжлүүлэн өгдөг.
          </p>
        </Reveal>
      </section>

      <section className="border-t border-line/40 bg-ivory text-ink py-20 md:py-24 lg:py-32">
        <div className="max-w-content mx-auto px-5 sm:px-6 md:px-8 lg:px-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          {[
            {
              title: "Хэмжилт",
              body: "Харааны хэрэгцээ, дэлгэцийн хэрэглээ, өдөр тутмын орчныг хамтад нь тодруулна.",
              step: "01",
            },
            {
              title: "Линз",
              body: "Нимгэн, хамгаалалттай, blue filter, нарны линз зэрэг сонголтыг тайлбарлаж өгнө.",
              step: "02",
            },
            {
              title: "Тохируулга",
              body: "Хүрээг хамар, чих, нүүрний суултад тааруулж тухтай зүүхэд бэлдэнэ.",
              step: "03",
            },
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 150}>
              <div className="group border-t border-ink/15 pt-6 transition-all duration-500 hover:-translate-y-2 hover:border-gold">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-ink/5 text-[12px] font-mono text-ink/40 mb-5 transition-all duration-500 group-hover:bg-gold group-hover:text-ink group-hover:scale-110">
                  {item.step}
                </span>
                <h3 className="font-display text-2xl mb-3 transition-colors duration-300 group-hover:text-gold">
                  {item.title}
                </h3>
                <p className="text-ink/60 leading-relaxed">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
