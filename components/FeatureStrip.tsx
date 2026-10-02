const icon = {
  width: 30,
  height: 30,
  viewBox: "0 0 32 32",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.2,
  strokeLinejoin: "round" as const,
  strokeLinecap: "round" as const,
  "aria-hidden": true,
};

const features = [
  {
    title: "Хувийн хараа шалгалт",
    body: "Нарийн оношилгоо, зөв диоптр",
    svg: (
      <svg {...icon}>
        <path d="M2 16s5.5-9 14-9 14 9 14 9-5.5 9-14 9S2 16 2 16z" />
        <circle cx="16" cy="16" r="4.5" />
      </svg>
    ),
  },
  {
    title: "Премиум линз",
    body: "UV400 ба blue filter хамгаалалт",
    svg: (
      <svg {...icon}>
        <path d="M16 3l11 4v8c0 7-4.7 11.5-11 14C9.7 26.5 5 22 5 15V7l11-4z" />
        <path d="M11 16l3.5 3.5L21 13" />
      </svg>
    ),
  },
  {
    title: "Дизайнер хүрээ",
    body: "Хязгаарлагдмал цуглуулга",
    svg: (
      <svg {...icon}>
        <path d="M9 5h14l6 7-13 15L3 12l6-7z" />
        <path d="M3 12h26M12 5l4 22 4-22M9 5l3 7M23 5l-3 7" />
      </svg>
    ),
  },
  {
    title: "VIP үйлчилгээ",
    body: "Насан туршийн тохируулга, арчилгаа",
    svg: (
      <svg {...icon}>
        <path d="M6 18v-3a10 10 0 0120 0v3" />
        <rect x="4" y="17" width="5" height="8" rx="2" />
        <rect x="23" y="17" width="5" height="8" rx="2" />
        <path d="M25.5 25c0 2.5-3 4-7.5 4" />
      </svg>
    ),
  },
];

export default function FeatureStrip() {
  return (
    <section className="bg-ink border-y border-ivory/10">
      <div className="max-w-content mx-auto px-5 sm:px-6 md:px-8 lg:px-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f, i) => (
          <div
            key={f.title}
            className={[
              "group relative flex items-center gap-5 py-7 border-ivory/10 overflow-hidden cursor-default lg:justify-center lg:border-t-0",
              i > 0 && "border-t lg:border-l",
              i === 1 && "sm:border-t-0 sm:border-l",
              i % 2 === 1 && "sm:pl-8 lg:pl-0",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {/* Soft gold glow rising from the bottom */}
            <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(196,164,111,0.14),transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            {/* Gold underline sweeping left → right, matching the buttons */}
            <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-right scale-x-0 bg-gold transition-transform duration-700 ease-signature group-hover:origin-left group-hover:scale-x-100" />

            <span className="relative shrink-0 text-gold-light transition-all duration-500 ease-signature group-hover:-translate-y-1 group-hover:scale-110 group-hover:text-gold group-hover:drop-shadow-[0_0_10px_rgba(196,164,111,0.55)]">
              {f.svg}
            </span>
            <div className="relative transition-transform duration-500 ease-signature group-hover:translate-x-1">
              <p className="text-[14px] text-ivory transition-colors duration-300 group-hover:text-gold-light">
                {f.title}
              </p>
              <p className="mt-1 text-[12px] text-ivory/55 transition-colors duration-300 group-hover:text-ivory/80">
                {f.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
