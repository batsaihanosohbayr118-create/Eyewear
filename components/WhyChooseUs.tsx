import Reveal from "./Reveal";

const advantages = [
  {
    mark: "01",
    title: "Хараа шалгалт",
    body: "Таны өдөр тутмын хэрэглээнд тохирсон диоптр, линзний төрлийг мэргэжлийн хэмжилтээр тодорхойлно.",
  },
  {
    mark: "02",
    title: "Зөв хүрээ сонголт",
    body: "Царайны хэлбэр, хамрын суулт, ажил амьдралын хэв маягт таарсан эвтэйхэн хүрээг санал болгоно.",
  },
  {
    mark: "03",
    title: "Чанартай линз",
    body: "Blue filter, нарны хамгаалалт, нимгэн линз зэрэг хэрэгцээнд таарсан сонголтуудтай.",
  },
  {
    mark: "04",
    title: "Тохируулга ба арчилгаа",
    body: "Авсны дараах хүрээний тохируулга, суулт шалгалт, арчилгааны зөвлөгөөг тогтмол өгнө.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-ivory text-ink py-20 md:py-24 lg:py-32">
      <div className="max-w-content mx-auto px-5 sm:px-6 md:px-8 lg:px-10">
        <Reveal>
          <p className="font-mono text-[11px] tracking-[0.28em] uppercase text-gold-dark mb-4">
            Яагаад Happy Optical
          </p>
          <h2 className="font-display text-4xl md:text-[2.75rem] lg:text-5xl max-w-2xl lg:max-w-xl leading-[1.05] mb-12 md:mb-16 text-balance">
            Тод хараа, эвтэйхэн зүүлт, найдвартай үйлчилгээ.
          </h2>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-14">
          {advantages.map((item, i) => (
            <Reveal key={item.mark} delay={i * 120}>
              <div className="border-t border-ink/15 pt-6">
                <span className="font-mono text-[12px] text-gold-dark">
                  {item.mark}
                </span>
                <h3 className="font-display text-xl mt-4 mb-3">{item.title}</h3>
                <p className="text-[14px] text-ink/60 leading-relaxed">
                  {item.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
