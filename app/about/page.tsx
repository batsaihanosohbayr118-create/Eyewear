import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import Arrow from "@/components/Arrow";
import { getSettings } from "@/lib/db";

export const metadata: Metadata = {
  title: "Бидний тухай",
  description: "HEX Luxury Eyewear — тансаг нүдний шилний бутикийн түүх, үнэт зүйлс.",
};

const wrap = "max-w-content mx-auto px-5 sm:px-6 md:px-8 lg:px-10";

function SectionMark({ n, label }: { n: string; label?: string }) {
  return (
    <div className="flex flex-col gap-2 text-[10px] tracking-[0.28em] uppercase text-ivory/70">
      <span className="text-gold-light">{n}</span>
      {label && <span>{label}</span>}
      <span className="mt-2 h-10 w-px bg-gold/60" />
    </div>
  );
}

function SideNote({ lines }: { lines: string[] }) {
  return (
    <div className="hidden lg:flex flex-col items-end gap-1 text-[10px] tracking-[0.28em] uppercase text-ivory/70">
      {lines.map((l) => (
        <span key={l}>{l}</span>
      ))}
      <span className="mt-2 h-px w-12 bg-gold/60" />
    </div>
  );
}

function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-3 text-[11px] tracking-[0.24em] uppercase text-ivory transition-colors hover:text-gold-light"
    >
      {children}
      <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  );
}

const values = [
  {
    title: "Нарийн оношилгоо",
    body: "Орчин үеийн тоног төхөөрөмжөөр харааг тань нарийн хэмжиж, хэрэгцээнд тань тохирох шийдлийг гаргана.",
    icon: (
      <path d="M2 16s5.5-9 14-9 14 9 14 9-5.5 9-14 9S2 16 2 16zM16 20.5a4.5 4.5 0 100-9 4.5 4.5 0 000 9z" />
    ),
  },
  {
    title: "Премиум линз",
    body: "Нимгэн, хөнгөн, UV болон blue filter хамгаалалттай линзний өргөн сонголт.",
    icon: <path d="M9 5h14l6 7-13 15L3 12l6-7zM3 12h26M12 5l4 22 4-22M9 5l3 7M23 5l-3 7" />,
  },
  {
    title: "Хувийн тохируулга",
    body: "Хүрээг нүүрний хэлбэр, хамар, чихний суултад яг тааруулж, өдөржин тухтай зүүх боломжийг бүрдүүлнэ.",
    icon: (
      <path d="M4 16c0-3 2-5 5-5s5 2 5 5-2 5-5 5-5-2-5-5zm14 0c0-3 2-5 5-5s5 2 5 5-2 5-5 5-5-2-5-5zm-4 0h4" />
    ),
  },
];

export default async function AboutPage() {
  const settings = await getSettings();

  return (
    <div className="bg-ink">
      {/* 01 — Hero */}
      <section className="relative min-h-[620px] h-[92svh] max-h-[820px] overflow-hidden border-b border-ivory/10">
        <div className="absolute inset-0">
          <Image
            src="/images/about-hero.png"
            alt="Нарны шил зүүсэн эмэгтэйн хөрөг"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[72%_center] lg:object-right"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/30" />
          <div className="absolute inset-0 bg-ink/50 lg:bg-transparent" />
        </div>

        <div className={`${wrap} relative z-10 h-full flex items-end pb-16 pt-28 lg:items-center lg:pb-0`}>
          <Reveal className="max-w-xl lg:ml-28 xl:ml-36">
            <h1 className="font-display font-medium text-[3.2rem] leading-[1.02] sm:text-6xl md:text-7xl">
              Бид шилнээс <span className="italic text-gold-light">илүүг</span> хардаг
            </h1>
            <p className="mt-7 max-w-md text-[15px] leading-relaxed text-ivory/75">
              {settings.name} {settings.founded} онд нэгэн энгийн санаанаас төрсөн —
              нүдний шил бол зөвхөн хэрэгцээ биш, таны зан чанарыг илэрхийлэх
              дагалдах хэрэгсэл. Ур хийц, загвар, тод харааг нэгтгэх нь бидний
              өдөр бүрийн эрхэм зорилго.
            </p>
            <div className="mt-10">
              <TextLink href="#vision">Бидний түүх</TextLink>
            </div>
          </Reveal>
        </div>

        <div className="absolute right-10 top-[58%] z-10">
          <SideNote lines={["Тансаг", "Ур чадвар", "Мөнхийн загвар"]} />
        </div>
      </section>

      {/* 02 — Vision */}
      <section id="vision" className="grid lg:grid-cols-2 border-b border-ivory/10 scroll-mt-20">
        <Reveal className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[560px] overflow-hidden">
          <Image
            src="/images/about-vision.png"
            alt="Чулуун дээр байрлуулсан алтан хүрээтэй нүдний шил"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover object-[60%_center]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-ink/50" />
        </Reveal>

        <div className="flex items-center px-5 sm:px-6 md:px-8 lg:px-16 xl:px-24 py-16 lg:py-20">
          <Reveal delay={120} className="flex gap-8 lg:gap-10 max-w-xl">
            <div className="hidden sm:block shrink-0">
              <SectionMark n="02" />
            </div>
            <div className="border-l border-ivory/15 pl-8 lg:pl-10">
              <h2 className="font-display font-medium text-5xl md:text-[3.5rem] leading-[1.05]">
                Бидний <span className="italic text-gold-light">алсын хараа</span>
              </h2>
              <p className="mt-7 text-[15px] leading-relaxed text-ivory/75">
                Хүн бүр ертөнцийг өөрийн өнцгөөс тод, гоё харах эрхтэй гэж бид
                итгэдэг. Тиймээс нарийн хийц, чанартай материал, цаг хугацаанаас
                үл хамаарах загварыг л сонгодог.
              </p>
              <p className="mt-5 text-[15px] leading-relaxed text-ivory/75">
                {settings.name}-д та сонгодог гар урлалаас орчин үеийн минимал
                дизайн хүртэлх хязгаарлагдмал цуглуулгатай танилцаж, өөрт
                тань л зориулсан хосыг олох болно.
              </p>
              <span className="mt-8 block h-px w-12 bg-gold/60" />
              <div className="mt-8">
                <TextLink href="#values">Бидний философи</TextLink>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 03 — Values */}
      <section id="values" className="relative border-b border-ivory/10 py-20 md:py-24 scroll-mt-20">
        <div className={wrap}>
          <div className="hidden lg:block absolute left-10 top-24">
            <SectionMark n="03" label="Бидний үнэт зүйлс" />
          </div>
          <Reveal>
            <h2 className="text-center font-display font-medium text-4xl md:text-5xl leading-[1.1]">
              Хүн бүрийн <span className="italic text-gold-light">өнцөгт</span> зориулав
            </h2>
          </Reveal>

          <div className="mt-14 grid md:grid-cols-3 max-w-5xl mx-auto">
            {values.map((v, i) => (
              <Reveal
                key={v.title}
                delay={i * 120}
                className={`px-6 py-8 md:py-2 text-center ${
                  i > 0 ? "border-t md:border-t-0 md:border-l border-ivory/10" : ""
                }`}
              >
                <svg
                  width="34"
                  height="34"
                  viewBox="0 0 32 32"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                  className="mx-auto text-gold-light"
                  aria-hidden="true"
                >
                  {v.icon}
                </svg>
                <h3 className="mt-5 font-display text-2xl">{v.title}</h3>
                <p className="mt-3 mx-auto max-w-[260px] text-[14px] leading-relaxed text-ivory/65">
                  {v.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Image band */}
      <section className="relative h-[52vh] min-h-[320px] max-h-[560px] overflow-hidden border-b border-ivory/10">
        <Image
          src="/images/about-band.png"
          alt="Чулуун дээр байрлуулсан нарны шил болон алтан хүрээтэй шил"
          fill
          sizes="100vw"
          className="object-cover object-[45%_58%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-ink/70" />
        {/* Mobile: top-right over the dark pillar, clear of the glasses. Desktop: vertically centred. */}
        <div className="absolute right-5 top-6 flex items-start gap-4 border-l border-gold/60 pl-4 text-[10px] tracking-[0.28em] uppercase text-ivory/85 leading-[2] lg:right-10 lg:top-1/2 lg:-translate-y-1/2">
          <p>
            Тансаг хийц
            <br />
            тод маргаашийн
            <br />
            төлөө
          </p>
        </div>
      </section>

      {/* 04 — CTA */}
      <section className="relative overflow-hidden py-28 md:py-36">
        <Image
          src="/images/about-cta.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-[70%_center]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(15,14,13,0.75)_0%,rgba(15,14,13,0.35)_60%,rgba(15,14,13,0.1)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-transparent to-ink/60" />
        <div className={`${wrap} relative`}>
          <div className="hidden lg:block absolute left-10 top-0">
            <SectionMark n="04" label="Бидэнтэй нэгдээрэй" />
          </div>
          <Reveal className="text-center">
            <h2 className="font-display font-medium text-4xl md:text-5xl leading-[1.1]">
              Өөрийн <span className="italic text-gold-light">өнцгөө</span> ол
            </h2>
            <p className="mt-6 mx-auto max-w-md text-[15px] leading-relaxed text-ivory/75">
              Цуглуулгатай маань танилцаж, хэв маяг, хараанд тань төгс
              тохирох хосоо олоорой.
            </p>
            <Link
              href="/collections"
              className="group mt-9 btn-sweep btn-sweep-gold inline-flex h-12 items-center gap-4 bg-gold px-8 text-[14px] text-ink"
            >
              Цуглуулга үзэх
              <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
