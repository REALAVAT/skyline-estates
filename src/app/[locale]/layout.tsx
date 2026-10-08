import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, IBM_Plex_Sans_Arabic, Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CompareTray } from "@/components/compare/compare-tray";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { WhatsAppFab } from "@/components/layout/whatsapp-fab";
import { Providers } from "@/components/providers";
import { properties } from "@/data/properties";
import { site } from "@/data/site";
import { localeDirection, routing } from "@/i18n/routing";
import { getSiteUrl, jsonLd, pageMetadata } from "@/lib/seo";
import { organizationJsonLd } from "@/lib/structured-data";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const arabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
  preload: false,
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#0b1f3a",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(getSiteUrl()),
    applicationName: site.name,
    authors: [{ name: site.author.name, url: site.author.url }],
    creator: site.author.name,
    formatDetection: { telephone: false },
    ...pageMetadata({
      locale,
      path: "",
      title: t("siteTitle"),
      description: t("siteDescription"),
    }),
    title: { default: t("siteTitle"), template: `%s | ${site.name}` },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "nav" });
  const dir = localeDirection[locale];

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${display.variable} ${body.variable} ${arabic.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background">
        <a
          href="#main"
          className="fixed start-4 top-4 z-[100] -translate-y-24 rounded-full bg-navy px-5 py-3 text-sm font-semibold text-ivory transition-transform focus:translate-y-0"
        >
          {t("skip")}
        </a>
        <NextIntlClientProvider>
          <Providers dir={dir}>
            <Header />
            <main id="main">{children}</main>
            <Footer locale={locale} />
            <CompareTray index={properties.map((p) => ({ id: p.id, title: p.title[locale], image: p.images[0] }))} />
            <WhatsAppFab />
          </Providers>
        </NextIntlClientProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(organizationJsonLd(locale))} />
      </body>
    </html>
  );
}
