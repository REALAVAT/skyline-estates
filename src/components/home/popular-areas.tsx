import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { areas } from "@/data/areas";
import { properties } from "@/data/properties";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { Locale } from "@/types";

export async function PopularAreas() {
  const t = await getTranslations("home");
  const tc = await getTranslations("common");
  const locale = (await getLocale()) as Locale;

  return (
    <section className="bg-sand py-24 lg:py-32">
      <div className="container-luxe">
        <SectionHeading
          eyebrow={t("areasEyebrow")}
          title={t("areasTitle")}
          subtitle={t("areasSubtitle")}
          action={
            <Link href="/areas" className="btn-outline">
              {tc("viewAll")}
            </Link>
          }
        />
        <ul className="mt-14 grid auto-rows-[260px] gap-4 sm:grid-cols-2 lg:auto-rows-[290px] lg:grid-cols-4">
          {areas.map((area, i) => {
            const count = properties.filter((p) => p.area === area.slug).length;
            return (
              <Reveal
                as="li"
                key={area.slug}
                delay={i * 0.06}
                className={cn(i === 0 && "sm:col-span-2 lg:row-span-2")}
              >
                <Link
                  href={`/areas/${area.slug}`}
                  className="group relative flex h-full overflow-hidden rounded-2xl bg-navy"
                >
                  <Image
                    src={area.image}
                    alt={area.name[locale]}
                    fill
                    sizes={i === 0 ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"}
                    className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-luxe)] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/25 to-transparent" />
                  <div className="relative mt-auto flex w-full items-end justify-between gap-4 p-6">
                    <div>
                      <p className="text-xs font-medium tracking-[0.18em] text-gold-light uppercase rtl:tracking-normal">
                        {t("areaListings", { count })}
                      </p>
                      <h3 className={cn("mt-2 font-display text-white", i === 0 ? "text-4xl lg:text-5xl rtl:text-3xl" : "text-2xl lg:text-3xl rtl:text-2xl")}>
                        {area.name[locale]}
                      </h3>
                      {i === 0 && <p className="mt-3 max-w-md text-sm text-white/80">{area.tagline[locale]}</p>}
                    </div>
                    <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition-all duration-500 group-hover:bg-gold group-hover:text-navy">
                      <ArrowUpRight className="size-5 rtl:-scale-x-100" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
