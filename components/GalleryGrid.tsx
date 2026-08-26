import Image from "next/image";
import { getGalleryImages } from "@/lib/db";

export default async function GalleryGrid() {
  const images = await getGalleryImages();

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 auto-rows-[180px] md:auto-rows-[220px] gap-2 md:gap-3">
      {images.map((img) => (
        <div
          key={img.id}
          className={`relative overflow-hidden group ${img.span}`}
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            loading="lazy"
            sizes="(min-width: 768px) 33vw, 50vw"
            className="object-cover transition-all duration-[900ms] ease-signature grayscale-[15%] group-hover:grayscale-0 group-hover:scale-[1.05]"
          />
          <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/15 transition-colors duration-500" />
        </div>
      ))}
    </div>
  );
}