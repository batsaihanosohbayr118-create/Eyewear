import { getGalleryImages } from "@/lib/db";
import AdminShell from "@/components/admin/AdminShell";
import GalleryAdminClient from "./GalleryAdminClient";

export default async function AdminGalleryPage() {
  const images = await getGalleryImages();

  return (
    <AdminShell>
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl leading-none text-ink">
            Галерей
          </h1>
          <p className="mt-2 text-[13px] text-ink/50">
            {images.length} нийт зураг
          </p>
        </div>
      </div>

      <GalleryAdminClient initialImages={images} />
    </AdminShell>
  );
}
