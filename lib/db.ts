import { promises as fs } from "fs";
import path from "path";
import { nanoid } from "nanoid";
import { put, head } from "@vercel/blob";

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

/**
 * Blob-оос JSON унших. Хэрэв Blob дээр байхгүй бол (анхны удаа)
 * local seed файлаас уншиж, fallback болгоно.
 */
async function readJsonBlob<T>(
  pathname: string,
  localSeedPath: string
): Promise<T> {
  try {
    const info = await head(pathname);
    const res = await fetch(info.url, { cache: "no-store" });
    if (!res.ok) throw new Error("blob fetch failed");
    return (await res.json()) as T;
  } catch {
    // Blob хараахан үүсээгүй бол local seed файлаас уншина
    const raw = await fs.readFile(localSeedPath, "utf-8");
    return JSON.parse(raw) as T;
  }
}

/**
 * JSON-ыг Blob руу бичих. addRandomSuffix: false ашигласнаар
 * URL тогтмол хэвээр байна (дахин бичихэд дахин хайх шаардлагагүй).
 */
async function writeJsonBlob<T>(pathname: string, data: T): Promise<void> {
  await put(pathname, JSON.stringify(data, null, 2), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

// ---------- Products ----------

async function readAll(): Promise<Product[]> {
  return readJsonBlob<Product[]>(BLOB_PRODUCTS, LOCAL_DB_PATH);
}

async function writeAll(products: Product[]): Promise<void> {
  await writeJsonBlob(BLOB_PRODUCTS, products);
}

export async function getProducts(): Promise<Product[]> {
  return readAll();
}

export async function getProduct(id: string): Promise<Product | undefined> {
  const products = await readAll();
  return products.find((p) => p.id === id);
}

export async function createProduct(
  input: Omit<Product, "id">
): Promise<Product> {
  const products = await readAll();
  const product: Product = { id: nanoid(8), ...input };
  products.unshift(product);
  await writeAll(products);
  return product;
}

export async function updateProduct(
  id: string,
  input: Partial<Omit<Product, "id">>
): Promise<Product | null> {
  const products = await readAll();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;
  products[index] = { ...products[index], ...input };
  await writeAll(products);
  return products[index];
}

export async function deleteProduct(id: string): Promise<boolean> {
  const products = await readAll();
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

async function readCategories(): Promise<Category[]> {
  return readJsonBlob<Category[]>(BLOB_CATEGORIES, LOCAL_CATEGORIES_PATH);
}

async function writeCategories(categories: Category[]): Promise<void> {
  await writeJsonBlob(BLOB_CATEGORIES, categories);
}

export async function getCategories(): Promise<Category[]> {
  return readCategories();
}

export async function createCategory(label: string): Promise<Category> {
  const categories = await readCategories();
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
  const categories = await readCategories();
  const index = categories.findIndex((c) => c.slug === slug);
  if (index === -1) return null;
  categories[index] = { ...categories[index], label };
  await writeCategories(categories);
  return categories[index];
}

export async function deleteCategory(slug: string): Promise<boolean> {
  const categories = await readCategories();
  const next = categories.filter((c) => c.slug !== slug);
  if (next.length === categories.length) return false;
  await writeCategories(next);
  return true;
}

// ---------- Settings ----------

export async function getSettings(): Promise<Settings> {
  return readJsonBlob<Settings>(BLOB_SETTINGS, LOCAL_SETTINGS_PATH);
}

export async function updateSettings(
  input: Partial<Settings>
): Promise<Settings> {
  const current = await getSettings();
  const next: Settings = {
    ...current,
    ...input,
    contact: { ...current.contact, ...input.contact },
    seo: { ...current.seo, ...input.seo },
  };
  await writeJsonBlob(BLOB_SETTINGS, next);
  return next;
}

// ---------- Gallery ----------

async function readGallery(): Promise<GalleryImage[]> {
  const images = await readJsonBlob<GalleryImage[]>(
    BLOB_GALLERY,
    LOCAL_GALLERY_PATH
  );
  return images.sort((a, b) => a.order - b.order);
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
  const images = await readGallery();
  const maxOrder = images.reduce((max, i) => Math.max(max, i.order), -1);
  const image: GalleryImage = { id: nanoid(8), order: maxOrder + 1, ...input };
  images.push(image);
  await writeGallery(images);
  return image;
}

export async function updateGalleryImage(
  id: string,
  input: Partial<Omit<GalleryImage, "id">>
): Promise<GalleryImage | null> {
  const images = await readGallery();
  const index = images.findIndex((i) => i.id === id);
  if (index === -1) return null;
  images[index] = { ...images[index], ...input };
  await writeGallery(images);
  return images[index];
}

export async function deleteGalleryImage(id: string): Promise<boolean> {
  const images = await readGallery();
  const next = images.filter((i) => i.id !== id);
  if (next.length === images.length) return false;
  await writeGallery(next);
  return true;
}

export async function reorderGalleryImages(
  orderedIds: string[]
): Promise<GalleryImage[]> {
  const images = await readGallery();
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