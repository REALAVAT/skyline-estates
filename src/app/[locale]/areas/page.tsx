import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight, TrendingUp } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/shared/page-hero";
import { Reveal } from "@/components/shared/reveal";
import { areas } from "@/data/areas";
import { img } from "@/data/images";
import { properties } from "@/data/properties";
import { Link } from "@/i18n/navigation";
import { formatNumber } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";
import type { Locale } from "@/types";

export async function generateMetadata({ params }: PageProps<"/[locale]/areas">): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const t = await getTranslations({ locale, namespace: "meta" });
  return pageMetadata({ locale, path: "/areas", title: t("areasTitle"), description: t("areasDescription") });
}

export default async function AreasPage({ params }: PageProps<"/[locale]/areas">) {
  const { locale } = (await params) as { locale: Locale };
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "areas" });
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const tHome = await getTranslations({ locale, namespace: "home" });

  return (
    <>
      <PageHero
        locale={locale}
        crumbs={[{ label: tNav("areas"), href: "/areas" }]}
        eyebrow={tNav("areas")}
        title={t("title")}
        subtitle={t("subtitle")}
        image={img.marinaDusk}
      />
      <section className="container-luxe py-16 sm:py-20">
        <ul className="grid gap-8 md:grid-cols-2">
          {areas.map((area, i) => {
            const count = properties.filter((p) => p.area === area.slug).length;
            return (
              <Reveal as="li" key={area.slug} delay={(i % 2) * 0.08}>
                <article className="group relative overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-navy/5 transition-shadow duration-500 hover:shadow-lift">
                  <div className="relative aspect-[16/9] overflow-hidden bg-sand">
                    <Image
                      src={area.image}
                      alt={area.name[locale]}
                      fill
                      sizes="(min-width: 768px) 45vw, 100vw"
                      className="object-cover transform-gpu transition-transform duration-[1.2s] ease-luxe group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/75 via-navy/10 to-transparent" />
                    <div className="absolute inset-x-6 bottom-6 flex items-end justify-between gap-4 text-white">
                      <div>
                        <p className="text-sm text-white/80">{tHome("areaListings", { count })}</p>
                        <h2 className="mt-1 font-display text-3xl text-white sm:text-4xl rtl:text-3xl">
                          <Link href={`/areas/${area.slug}`} className="after:absolute after:inset-0 after:content-['']">
                            {area.name[locale]}
                          </Link>
                        </h2>
                      </div>
                      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white/15 backdrop-blur transition-colors group-hover:bg-gold group-hover:text-navy">
                        <ArrowUpRight className="size-5 rtl:-scale-x-100" aria-hidden="true" />
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-[15px] leading-relaxed text-ink/80">{area.intro[locale]}</p>
                    <dl className="mt-5 grid grid-cols-3 gap-4 border-t border-navy/5 pt-5">
                      <div>
                        <dt className="text-xs text-muted-foreground">{t("avgSale")}</dt>
                        <dd className="mt-1 font-semibold text-navy" dir="ltr">
                          AED {formatNumber(area.avgSalePricePerSqft, locale)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-muted-foreground">{t("yield")}</dt>
                        <dd className="mt-1 font-semibold text-navy" dir="ltr">
                          {area.rentalYield}%
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-muted-foreground">{t("priceChange")}</dt>
                        <dd className="mt-1 flex items-center gap-1 font-semibold text-emerald-700" dir="ltr">
                          <TrendingUp className="size-4" aria-hidden="true" />+{area.priceChange}%
                        </dd>
                      </div>
                    </dl>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </ul>
        <p className="mt-8 text-xs text-muted-foreground">{t("dataNote")}</p>
      </section>
    </>
  );
}
