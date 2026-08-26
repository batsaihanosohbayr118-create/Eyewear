import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import GalleryGrid from "@/components/GalleryGrid";

export const metadata: Metadata = {
  title: "Галерей",
  description: "Happy Optical-ийн оптик үйлчилгээ, хүрээ, хараа шалгалтын зураглал.",
};

export default function GalleryPage() {
  return (
    <div className="pt-20">
      <section className="max-w-content mx-auto px-6 md:px-10 pt-20 pb-16">
        <Reveal>
          <h1 className="font-display text-5xl md:text-6xl leading-[1.05] max-w-2xl text-balance">
            Хараа шалгалт, хүрээ сонголт, өдөр тутмын тод хараа.
          </h1>
        </Reveal>
      </section>

      <section className="max-w-content mx-auto px-6 md:px-10 pb-28">
        <GalleryGrid />
      </section>
    </div>
  );
}
