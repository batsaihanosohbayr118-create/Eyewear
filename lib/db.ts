import { promises as fs } from "fs";
import path from "path";
import { nanoid } from "nanoid";

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

const DB_PATH = path.join(process.cwd(), "data", "products.json");
const CATEGORIES_PATH = path.join(process.cwd(), "data", "categories.json");
const SETTINGS_PATH = path.join(process.cwd(), "data", "settings.json");
const GALLERY_PATH = path.join(process.cwd(), "data", "gallery.json");

async function readAll(): Promise<Product[]> {
  const raw = await fs.readFile(DB_PATH, "utf-8");
  return JSON.parse(raw) as Product[];
}

async function writeAll(products: Product[]): Promise<void> {
  await fs.writeFile(DB_PATH, JSON.stringify(products, null, 2), "utf-8");
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

function slugify(label: string): string {
  const base = label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9Ѐ-ӿ]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || nanoid(6);
}

async function readCategories(): Promise<Category[]> {
  const raw = await fs.readFile(CATEGORIES_PATH, "utf-8");
  return JSON.parse(raw) as Category[];
}

async function writeCategories(categories: Category[]): Promise<void> {
  await fs.writeFile(CATEGORIES_PATH, JSON.stringify(categories, null, 2), "utf-8");
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

export async function getSettings(): Promise<Settings> {
  const raw = await fs.readFile(SETTINGS_PATH, "utf-8");
  return JSON.parse(raw) as Settings;
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
  await fs.writeFile(SETTINGS_PATH, JSON.stringify(next, null, 2), "utf-8");
  return next;
}

// ---------- Gallery ----------

async function readGallery(): Promise<GalleryImage[]> {
  const raw = await fs.readFile(GALLERY_PATH, "utf-8");
  const images = JSON.parse(raw) as GalleryImage[];
  return images.sort((a, b) => a.order - b.order);
}

async function writeGallery(images: GalleryImage[]): Promise<void> {
  await fs.writeFile(GALLERY_PATH, JSON.stringify(images, null, 2), "utf-8");
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