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
      <section className="max-w-content mx-auto px-6 md:px-10 py-24 md:py-32">
        <Reveal>
          <h1 className="font-display text-5xl md:text-7xl leading-[1.02] max-w-4xl text-balance">
            {settings.founded} оноос хойш таны хараанд тохирсон шийдлийг
            илүү ойр болгож байна.
          </h1>
        </Reveal>
      </section>

      <section className="relative h-[70vh] min-h-[420px]">
        <Image
          src="https://images.unsplash.com/photo-1486250944723-86bca2b15b06?auto=format&fit=crop&w=2200&q=85"
          alt="Оптик дэлгүүрийн шилний тавиур"
          fill
          sizes="100vw"
          className="object-cover"
        />
      </section>

      <section className="max-w-content mx-auto px-6 md:px-10 py-24 md:py-32 grid md:grid-cols-[1fr_1.4fr] gap-14">
        <Reveal>
          <p className="font-mono text-[11px] tracking-[0.24em] uppercase text-gold-light">
            Философи
          </p>
        </Reveal>
        <Reveal delay={100} className="space-y-8 text-ivory/70 leading-relaxed text-lg">
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

      <section className="border-t border-line/40 bg-ivory text-ink py-24 md:py-32">
        <div className="max-w-content mx-auto px-6 md:px-10 grid md:grid-cols-3 gap-12">
          {[
            {
              title: "Хэмжилт",
              body: "Харааны хэрэгцээ, дэлгэцийн хэрэглээ, өдөр тутмын орчныг хамтад нь тодруулна.",
            },
            {
              title: "Линз",
              body: "Нимгэн, хамгаалалттай, blue filter, нарны линз зэрэг сонголтыг тайлбарлаж өгнө.",
            },
            {
              title: "Тохируулга",
              body: "Хүрээг хамар, чих, нүүрний суултад тааруулж тухтай зүүхэд бэлдэнэ.",
            },
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 120}>
              <div className="border-t border-ink/15 pt-6">
                <h3 className="font-display text-2xl mb-3">{item.title}</h3>
                <p className="text-ink/60 leading-relaxed">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
