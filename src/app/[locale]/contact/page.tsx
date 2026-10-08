import type { Metadata } from "next";
import { Clock, Mail, MapPin, Navigation, Phone } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactForm } from "@/components/forms/contact-form";
import { WhatsAppIcon } from "@/components/layout/whatsapp-fab";
import { OfficeMap } from "@/components/map/office-map";
import { PageHero } from "@/components/shared/page-hero";
import { img } from "@/data/images";
import { site } from "@/data/site";
import { contactSubjects, type ContactSubject } from "@/lib/schemas";
import { pageMetadata } from "@/lib/seo";
import type { Locale } from "@/types";

export async function generateMetadata({ params }: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const t = await getTranslations({ locale, namespace: "meta" });
  return pageMetadata({ locale, path: "/contact", title: t("contactTitle"), description: t("contactDescription") });
}

export default async function ContactPage({ params, searchParams }: PageProps<"/[locale]/contact">) {
  const { locale } = (await params) as { locale: Locale };
  setRequestLocale(locale);
  const query = await searchParams;
  const subjectParam = typeof query.subject === "string" ? query.subject : undefined;
  const defaultSubject = contactSubjects.includes(subjectParam as ContactSubject) ? (subjectParam as ContactSubject) : undefined;

  const [t, tNav, tw] = await Promise.all([
    getTranslations({ locale, namespace: "contactPage" }),
    getTranslations({ locale, namespace: "nav" }),
    getTranslations({ locale, namespace: "whatsapp" }),
  ]);
  const [lat, lng] = site.address.coordinates;
  const waHref = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(tw("message"))}`;

  const items = [
    {
      icon: MapPin,
      label: t("office"),
      content: (
        <>
          {site.address.street[locale]}
          <br />
          {site.address.locality[locale]}
        </>
      ),
    },
    { icon: Clock, label: t("hours"), content: site.hours[locale] },
    {
      icon: Phone,
      label: t("phone"),
      content: (
        <a href={site.phoneHref} dir="ltr" className="hover:text-gold-deep">
          {site.phone}
        </a>
      ),
    },
    {
      icon: Mail,
      label: t("email"),
      content: (
        <a href={`mailto:${site.email}`} className="hover:text-gold-deep">
          {site.email}
        </a>
      ),
    },
  ];

  return (
    <>
      <PageHero
        locale={locale}
        crumbs={[{ label: tNav("contact"), href: "/contact" }]}
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
        image={img.downtownPalms}
      />

      <section className="container-luxe grid gap-10 py-14 sm:py-20 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
        <div className="space-y-8">
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {items.map(({ icon: Icon, label, content }) => (
              <li key={label} className="rounded-2xl bg-white p-5 ring-1 ring-navy/5">
                <Icon className="size-5 text-gold-deep" aria-hidden="true" />
                <p className="mt-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase rtl:tracking-normal">{label}</p>
                <p className="mt-1 text-sm leading-relaxed font-medium text-navy">{content}</p>
              </li>
            ))}
          </ul>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-whatsapp px-7 text-sm font-semibold text-white transition-opacity hover:opacity-90 sm:w-auto"
          >
            <WhatsAppIcon className="size-5" />
            {t("whatsapp")}
          </a>
          <div className="relative h-[300px] overflow-hidden rounded-2xl ring-1 ring-navy/5 sm:h-[360px]">
            <OfficeMap center={site.address.coordinates} label={t("mapLabel")} homeLabel={site.name} className="size-full" />
            <a
              href={`https://www.openstreetmap.org/directions?to=${lat}%2C${lng}#map=16/${lat}/${lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute end-3 bottom-8 z-[500] inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-navy shadow-soft hover:bg-ivory"
            >
              <Navigation className="size-4" aria-hidden="true" />
              {t("directions")}
            </a>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-navy/5 sm:p-10">
          <h2 className="font-display text-3xl text-navy">{t("formTitle")}</h2>
          <div className="mt-8">
            <ContactForm defaultSubject={defaultSubject} />
          </div>
        </div>
      </section>
    </>
  );
}
