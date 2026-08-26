import type { Metadata } from "next";
import { Playfair_Display, Manrope, IBM_Plex_Mono } from "next/font/google";
import { getSettings } from "@/lib/db";
import SiteChrome from "@/components/SiteChrome";
import "./globals.css";

const display = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const body = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    metadataBase: new URL("https://happyoptical.mn"),
    title: {
      default: settings.seo.defaultTitle,
      template: settings.seo.titleTemplate,
    },
    description: settings.seo.description,
    icons: {
      icon: [{ url: "/favicon.svg?v=4", type: "image/svg+xml" }],
      shortcut: [{ url: "/favicon.svg?v=4", type: "image/svg+xml" }],
    },
    openGraph: {
      title: settings.seo.defaultTitle,
      description: settings.seo.description,
      url: "https://happyoptical.mn",
      siteName: settings.fullName,
      images: [{ url: settings.seo.ogImage, width: 1200, height: 630 }],
      locale: "mn_MN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: settings.seo.defaultTitle,
      description: settings.seo.description,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();
  return (
    <html lang="mn" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="bg-ink text-ivory font-body antialiased">
        <SiteChrome settings={settings}>{children}</SiteChrome>
      </body>
    </html>
  );
}
