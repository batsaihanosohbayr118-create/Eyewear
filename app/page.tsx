import Image from "next/image";
import Link from "next/link";
import Hero from "@/components/Hero";
import Reveal from "@/components/Reveal";
import ProductCard from "@/components/ProductCard";
import WhyChooseUs from "@/components/WhyChooseUs";
import { getProducts, getCategories, getSettings } from "@/lib/db";

export default async function HomePage() {
  const [products, categories, settings] = await Promise.all([
    getProducts(),
    getCategories(),
    getSettings(),
  ]);
  const featured = products.filter((p) => p.featured).slice(0, 4);

  return (
    <>
      <Hero settings={settings} />

      {/* About teaser */}
      <section className="py-24 md:py-32 bg-ink">
        <div className="max-w-content mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-14 md:gap-20 items-center">
          <Reveal className="relative aspect-[4/3] w-full max-w-[560px] overflow-hidden order-2 justify-self-center md:order-1 md:justify-self-start">
            <Image
              src="https://images.unsplash.com/photo-1517948430535-1e2469d314fe?auto=format&fit=crop&w=1000&q=85"
              alt="Хараа шалгах самбарын өмнө барьсан нүдний шил"
              fill
              sizes="(min-width: 768px) 560px, 100vw"
              className="object-cover"
            />
          </Reveal>
          <Reveal delay={150} className="order-1 md:order-2">
            <p className="font-mono text-[11px] tracking-[0.28em] uppercase text-gold-light mb-4">
              Бидний тухай
            </p>
            <h2 className="font-display text-4xl md:text-5xl leading-[1.05] mb-6 text-balance">
              Хараанд тань таарсан линз, царайнд тань зохих хүрээ.
            </h2>
            <p className="text-ivory/60 leading-relaxed mb-8 max-w-md">
              Happy Optical баг харааны хэмжилт, линзний зөв сонголт,
              хүрээний тохируулгыг нэг дор хийж өгдөг. Өдөр тутмын ажил,
              жолоо барих, дэлгэцийн хэрэглээнд тань тохирсон шийдлийг санал болгоно.
            </p>
            <Link
              href="/about"
              className="inline-flex text-[13px] tracking-[0.14em] uppercase text-ivory border-b border-gold pb-1 hover:text-gold-light transition-colors duration-300"
            >
              Дэлгэрэнгүй унших
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Featured collections */}
      <section className="py-24 md:py-32 bg-ink border-t border-line/40">
        <div className="max-w-content mx-auto px-6 md:px-10">
          <Reveal className="flex flex-wrap items-end justify-between gap-6 mb-14">
            <div>
              <p className="font-mono text-[11px] tracking-[0.28em] uppercase text-gold-light mb-4">
                Онцлох цуглуулга
              </p>
              <h2 className="font-display text-4xl md:text-5xl max-w-xl leading-[1.05] text-balance">
                Өдөр тутамд эвтэйхэн, хараанд зөв хүрээнүүд.
              </h2>
            </div>
            <Link
              href="/collections"
              className="text-[13px] tracking-[0.14em] uppercase text-ivory/70 border-b border-ivory/30 pb-1 hover:text-ivory hover:border-ivory transition-colors duration-300"
            >
              Бүх бүтээгдэхүүнийг үзэх
            </Link>
          </Reveal>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {featured.map((product, i) => (
              <Reveal key={product.id} delay={i * 100}>
                <ProductCard product={product} categories={categories} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <WhyChooseUs />
    </>
  );
}
