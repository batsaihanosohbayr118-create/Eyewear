import Image from "next/image";
import Link from "next/link";
import Hero from "@/components/Hero";
import Reveal from "@/components/Reveal";
import Arrow from "@/components/Arrow";
import FeatureStrip from "@/components/FeatureStrip";
import FeaturedCarousel from "@/components/FeaturedCarousel";
import CategoryTiles from "@/components/CategoryTiles";
import { getProducts, getCategories, getSettings } from "@/lib/db";

const eyebrow = "text-[11px] md:text-[12px] tracking-[0.32em] uppercase text-ivory/80 mb-5";

export default async function HomePage() {
  const [products, categories, settings] = await Promise.all([
    getProducts(),
    getCategories(),
    getSettings(),
  ]);
  const featuredOnly = products.filter((p) => p.featured);
  const featured = (featuredOnly.length >= 3 ? featuredOnly : products).slice(0, 8);

  return (
    <>
      <Hero settings={settings} />
      <FeatureStrip />

      {/* Featured collection */}
      <section className="bg-ink py-16 md:py-20 lg:py-24">
        <div className="max-w-content mx-auto px-5 sm:px-6 md:px-8 lg:px-10 lg:pr-28 grid grid-cols-1 gap-10 lg:grid-cols-[300px_1fr] xl:grid-cols-[340px_1fr] lg:gap-14 items-center">
          {/* Button sits right of the text whenever it fits (tablets), wraps below otherwise. */}
          <Reveal className="flex flex-wrap items-end justify-between gap-x-10 gap-y-8 lg:block">
            <div className="min-w-0">
              <p className={eyebrow}>Онцлох цуглуулга</p>
              <h2 className="font-display font-medium text-[2.6rem] md:text-5xl leading-[1.05] text-balance">
                Шилдэг загварууд,
                <br />
                <span className="italic text-gold-light">сонгодог ур хийц</span>
              </h2>
              <p className="mt-6 text-[14px] text-ivory/70 leading-relaxed max-w-xs">
                Гараар өнгөлсөн ацетат, хөнгөн титан, алтан шармал хүрээ —
                дүр төрхөө тодотгох хосоо сонгоорой.
              </p>
            </div>
            <Link
              href="/collections"
              className="group shrink-0 lg:mt-8 btn-sweep btn-sweep-outline inline-flex h-12 items-center gap-4 border border-ivory/40 px-6 text-[14px] text-ivory"
            >
              Бүгдийг үзэх
              <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>

          <FeaturedCarousel products={featured} categories={categories} />
        </div>
      </section>

      <CategoryTiles categories={categories} products={products} />

      {/* About teaser */}
      <section className="bg-charcoal py-20 md:py-24 lg:py-28 border-t border-ivory/10">
        <div className="max-w-content mx-auto px-5 sm:px-6 md:px-8 lg:px-10 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <Reveal className="relative aspect-[4/3] w-full overflow-hidden order-2 lg:order-1">
            <Image
              src="/images/home-about.png"
              alt="Гантиг ширээн дээр байрлуулсан тунгалаг хүрээтэй нүдний шил"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover object-[58%_center]"
            />
          </Reveal>
          <Reveal delay={150} className="order-1 max-w-xl lg:order-2">
            <p className={eyebrow}>{settings.name}-ийн тухай</p>
            <h2 className="font-display font-medium text-[2.6rem] md:text-5xl leading-[1.05] mb-6 text-balance">
              Хүрээ бүр түүхтэй,{" "}
              <span className="italic text-gold-light">харц бүр онцгой.</span>
            </h2>
            <p className="text-ivory/65 leading-relaxed mb-8">
              {settings.fullName} бол тансаг нүдний шилний бутик. Бид
              сонгомол брэндийн хүрээг хувийн хараа шалгалт, мэргэжлийн
              тохируулгатай хослуулж, таны хэв маяг, хараанд яг тохирох хосыг
              санал болгодог.
            </p>
            <Link
              href="/about"
              className="group btn-sweep btn-sweep-gold inline-flex h-12 items-center gap-4 bg-gold px-8 text-[14px] text-ink"
            >
              Дэлгэрэнгүй
              <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
