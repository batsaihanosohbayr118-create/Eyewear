import { promises as fs } from "fs";
import path from "path";
import { nanoid } from "nanoid";
import { put, head, list, del } from "@vercel/blob";
import { unstable_cache, revalidateTag } from "next/cache";
import { FALLBACK_IMAGE_SRC, imageSrc } from "@/lib/image-src";

export type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  featured: boolean;
};

export type Category = {
  slug: string;
  label: string;
};

export type Settings = {
  name: string;
  fullName: string;
  tagline: string;
  description: string;
  founded: string;
  heroImage: string;
  contact: {
    address: string;
    phone: string;
    email: string;
    hours: { day: string; time: string }[];
    mapEmbedUrl: string;
  };
  social: { label: string; href: string }[];
  seo: {
    titleTemplate: string;
    defaultTitle: string;
    description: string;
    ogImage: string;
  };
};

export type GalleryImage = {
  id: string;
  src: string;
  alt: string;
  span: "" | "row-span-2";
  order: number;
};

// ---------- Local seed files (унших зөвхөн, эхний load-д ашиглана) ----------

const LOCAL_DB_PATH = path.join(process.cwd(), "data", "products.json");
const LOCAL_CATEGORIES_PATH = path.join(process.cwd(), "data", "categories.json");
const LOCAL_SETTINGS_PATH = path.join(process.cwd(), "data", "settings.json");
const LOCAL_GALLERY_PATH = path.join(process.cwd(), "data", "gallery.json");

// ---------- Blob pathnames (унших/бичих хоёуланд) ----------

const BLOB_PRODUCTS = "data/products.json";
const BLOB_CATEGORIES = "data/categories.json";
const BLOB_SETTINGS = "data/settings.json";
const BLOB_GALLERY = "data/gallery.json";
const DEFAULT_HERO_IMAGE =
  "https://images.unsplash.com/photo-1563136047-fb51e000144a?auto=format&fit=crop&w=2200&q=85";

function sanitizeProduct(product: Product): Product {
  return { ...product, image: imageSrc(product.image, FALLBACK_IMAGE_SRC) };
}

function sanitizeGalleryImage(image: GalleryImage): GalleryImage {
  return { ...image, src: imageSrc(image.src, FALLBACK_IMAGE_SRC) };
}

function sanitizeSettings(settings: Settings): Settings {
  return {
    ...settings,
    heroImage: imageSrc(settings.heroImage, DEFAULT_HERO_IMAGE),
  };
}

/**
 * Blob-ийн CDN нь query параметрийг (?v=...) үл тоож, давхар бичсэн файлын
 * хуучин хувилбарыг 30 хоног хүртэл кэшлэдэг. Тиймээс хадгалах бүрд шинэ,
 * давтагдашгүй нэртэй файл үүсгэж ("data/gallery@<timestamp>-xxxx.json"),
 * уншихдаа list()-ээр (CDN кэшгүй) хамгийн сүүлийн хувилбарыг олно.
 */
const VERSIONS_TO_KEEP = 5;

const versionPrefix = (pathname: string) => pathname.replace(/\.json$/, "") + "@";

async function listVersions(pathname: string) {
  const prefix = versionPrefix(pathname);
  const { blobs } = await list({ prefix });
  const stamp = (p: string) => parseInt(p.slice(prefix.length), 10) || 0;
  return blobs.sort((a, b) => stamp(b.pathname) - stamp(a.pathname));
}

async function fetchJsonBlob<T>(
  pathname: string,
  localSeedPath: string
): Promise<T> {
  try {
    const [latest] = await listVersions(pathname);
    // Хувилбар хараахан байхгүй бол хуучин тогтмол нэртэй файлыг уншина
    const url = latest?.url ?? (await head(pathname)).url;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("blob fetch failed");
    return (await res.json()) as T;
  } catch {
    // Blob хараахан үүсээгүй бол local seed файлаас уншина
    const raw = await fs.readFile(localSeedPath, "utf-8");
    return JSON.parse(raw) as T;
  }
}

const blobTag = (pathname: string) => `blob:${pathname}`;

/**
 * Blob уншилтыг Next.js-ийн data cache-д хадгална. Хуудас бүр Blob руу
 * дахин хандахгүй тул шилжилт хурдан болно. Бичих үед (writeJsonBlob)
 * revalidateTag-аар шууд шинэчлэгдэнэ; revalidate нь Blob-ыг гаднаас
 * өөрчилсөн тохиолдлын нөөц хугацаа.
 */
function readJsonBlob<T>(
  pathname: string,
  localSeedPath: string,
  fresh = false
): Promise<T> {
  // Өөрчлөлт хийхийн өмнөх уншилт кэшээс биш шууд Blob-оос байх ёстой —
  // эс бөгөөс дараалсан хадгалалтууд бие биенээ дарж устгана.
  if (fresh) return fetchJsonBlob<T>(pathname, localSeedPath);
  return unstable_cache(
    () => fetchJsonBlob<T>(pathname, localSeedPath),
    ["blob-json", pathname],
    { tags: [blobTag(pathname)], revalidate: 300 }
  )();
}

/**
 * JSON-ыг Blob руу шинэ хувилбар болгон бичих.
 */
async function writeJsonBlob<T>(pathname: string, data: T): Promise<void> {
  await put(`${versionPrefix(pathname)}${Date.now()}.json`, JSON.stringify(data, null, 2), {
    access: "public",
    addRandomSuffix: true,
    contentType: "application/json",
  });
  revalidateTag(blobTag(pathname));

  // Хуучин хувилбаруудыг цэвэрлэнэ (сүүлийн хэдийг нөөц болгон үлдээнэ)
  try {
    const stale = (await listVersions(pathname)).slice(VERSIONS_TO_KEEP);
    if (stale.length) await del(stale.map((b) => b.url));
  } catch {
    // Цэвэрлэгээ амжилтгүй болсон ч хадгалалтад нөлөөгүй
  }
}

// ---------- Products ----------

async function readAll(fresh = false): Promise<Product[]> {
  return readJsonBlob<Product[]>(BLOB_PRODUCTS, LOCAL_DB_PATH, fresh);
}

async function writeAll(products: Product[]): Promise<void> {
  await writeJsonBlob(BLOB_PRODUCTS, products);
}

export async function getProducts(): Promise<Product[]> {
  const products = await readAll();
  return products.map(sanitizeProduct);
}

export async function getProduct(id: string): Promise<Product | undefined> {
  const products = await readAll();
  const product = products.find((p) => p.id === id);
  return product ? sanitizeProduct(product) : undefined;
}

export async function createProduct(
  input: Omit<Product, "id">
): Promise<Product> {
  const products = await readAll(true);
  const product: Product = sanitizeProduct({ id: nanoid(8), ...input });
  products.unshift(product);
  await writeAll(products);
  return product;
}

export async function updateProduct(
  id: string,
  input: Partial<Omit<Product, "id">>
): Promise<Product | null> {
  const products = await readAll(true);
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;
  products[index] = sanitizeProduct({ ...products[index], ...input });
  await writeAll(products);
  return products[index];
}

export async function deleteProduct(id: string): Promise<boolean> {
  const products = await readAll(true);
  const next = products.filter((p) => p.id !== id);
  if (next.length === products.length) return false;
  await writeAll(next);
  return true;
}

// ---------- Categories ----------

function slugify(label: string): string {
  const base = label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9Ѐ-ӿ]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || nanoid(6);
}

async function readCategories(fresh = false): Promise<Category[]> {
  return readJsonBlob<Category[]>(BLOB_CATEGORIES, LOCAL_CATEGORIES_PATH, fresh);
}

async function writeCategories(categories: Category[]): Promise<void> {
  await writeJsonBlob(BLOB_CATEGORIES, categories);
}

export async function getCategories(): Promise<Category[]> {
  return readCategories();
}

export async function createCategory(label: string): Promise<Category> {
  const categories = await readCategories(true);
  let slug = slugify(label);
  let suffix = 2;
  while (categories.some((c) => c.slug === slug)) {
    slug = `${slugify(label)}-${suffix++}`;
  }
  const category: Category = { slug, label };
  categories.push(category);
  await writeCategories(categories);
  return category;
}

export async function updateCategory(
  slug: string,
  label: string
): Promise<Category | null> {
  const categories = await readCategories(true);
  const index = categories.findIndex((c) => c.slug === slug);
  if (index === -1) return null;
  categories[index] = { ...categories[index], label };
  await writeCategories(categories);
  return categories[index];
}

export async function deleteCategory(slug: string): Promise<boolean> {
  const categories = await readCategories(true);
  const next = categories.filter((c) => c.slug !== slug);
  if (next.length === categories.length) return false;
  await writeCategories(next);
  return true;
}

// ---------- Settings ----------

export async function getSettings(fresh = false): Promise<Settings> {
  const settings = await readJsonBlob<Settings>(BLOB_SETTINGS, LOCAL_SETTINGS_PATH, fresh);
  return sanitizeSettings(settings);
}

export async function updateSettings(
  input: Partial<Settings>
): Promise<Settings> {
  const current = await getSettings(true);
  const next: Settings = {
    ...current,
    ...input,
    contact: { ...current.contact, ...input.contact },
    seo: { ...current.seo, ...input.seo },
  };
  next.heroImage = imageSrc(next.heroImage, DEFAULT_HERO_IMAGE);
  await writeJsonBlob(BLOB_SETTINGS, next);
  return next;
}

// ---------- Gallery ----------

async function readGallery(fresh = false): Promise<GalleryImage[]> {
  const images = await readJsonBlob<GalleryImage[]>(
    BLOB_GALLERY,
    LOCAL_GALLERY_PATH,
    fresh
  );
  return images.map(sanitizeGalleryImage).sort((a, b) => a.order - b.order);
}

async function writeGallery(images: GalleryImage[]): Promise<void> {
  await writeJsonBlob(BLOB_GALLERY, images);
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  return readGallery();
}

export async function getGalleryImage(
  id: string
): Promise<GalleryImage | undefined> {
  const images = await readGallery();
  return images.find((i) => i.id === id);
}

export async function createGalleryImage(
  input: Omit<GalleryImage, "id" | "order">
): Promise<GalleryImage> {
  const images = await readGallery(true);
  const maxOrder = images.reduce((max, i) => Math.max(max, i.order), -1);
  const image: GalleryImage = sanitizeGalleryImage({
    id: nanoid(8),
    order: maxOrder + 1,
    ...input,
  });
  images.push(image);
  await writeGallery(images);
  return image;
}

export async function updateGalleryImage(
  id: string,
  input: Partial<Omit<GalleryImage, "id">>
): Promise<GalleryImage | null> {
  const images = await readGallery(true);
  const index = images.findIndex((i) => i.id === id);
  if (index === -1) return null;
  images[index] = sanitizeGalleryImage({ ...images[index], ...input });
  await writeGallery(images);
  return images[index];
}

export async function deleteGalleryImage(id: string): Promise<boolean> {
  const images = await readGallery(true);
  const next = images.filter((i) => i.id !== id);
  if (next.length === images.length) return false;
  await writeGallery(next);
  return true;
}

export async function reorderGalleryImages(
  orderedIds: string[]
): Promise<GalleryImage[]> {
  const images = await readGallery(true);
  const byId = new Map(images.map((i) => [i.id, i]));
  const next = orderedIds
    .map((id, index) => {
      const img = byId.get(id);
      if (!img) return null;
      return { ...img, order: index };
    })
    .filter((i): i is GalleryImage => i !== null);
  await writeGallery(next);
  return next;
}
