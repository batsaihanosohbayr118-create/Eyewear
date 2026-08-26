export default function SectionHeading({
  eyebrow,
  title,
  align = "left",
  light = false,
}: {
  eyebrow: string;
  title: string;
  align?: "left" | "center";
  light?: boolean;
}) {
  return (
    <div className={align === "center" ? "text-center" : "text-left"}>
      <p
        className={`font-mono text-[11px] tracking-[0.28em] uppercase mb-4 ${
          light ? "text-ink/50" : "text-gold-light"
        }`}
      >
        {eyebrow}
      </p>
      <h2
        className={`font-display text-4xl md:text-[2.75rem] lg:text-5xl leading-[1.05] text-balance ${
          align === "center" ? "mx-auto max-w-2xl" : "max-w-xl"
        }`}
      >
        {title}
      </h2>
    </div>
  );
}
