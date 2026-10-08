import { Mail, MapPin, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { areas } from "@/data/areas";
import { site } from "@/data/site";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/types";
import { Logo } from "./logo";

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.77L17.75 3Zm-1.08 16.17h1.7L7.4 4.74H5.58l11.09 14.43Z" />
    </svg>
  );
}

function Instagram({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  );
}

function Linkedin({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11H3v-11Zm6.5 0h3.83v1.5h.05c.53-1 1.84-2.06 3.8-2.06 4.06 0 4.82 2.67 4.82 6.15v5.41h-4v-4.8c0-1.15-.02-2.62-1.6-2.62-1.6 0-1.84 1.25-1.84 2.54v4.88h-4v-11Z" />
    </svg>
  );
}

function Youtube({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" />
    </svg>
  );
}

export async function Footer({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "footer" });
  const nav = await getTranslations({ locale, namespace: "nav" });
  const year = 2026;

  const socials = [
    { href: site.socials.instagram, label: "Instagram", Icon: Instagram },
    { href: site.socials.linkedin, label: "LinkedIn", Icon: Linkedin },
    { href: site.socials.youtube, label: "YouTube", Icon: Youtube },
    { href: site.socials.x, label: "X", Icon: XIcon },
  ];

  return (
    <footer className="site-footer relative overflow-hidden bg-navy text-white/75">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 end-[-10%] size-[520px] rounded-full bg-gold/10 blur-3xl"
      />
      <div className="container-luxe relative grid gap-12 pt-20 pb-12 md:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo light />
          <p className="mt-6 max-w-sm text-sm leading-relaxed">{t("tagline")}</p>
          <ul className="mt-8 flex gap-2">
            {socials.map(({ href, label, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t("social", { network: label })}
                  className="grid size-10 place-items-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-gold hover:text-gold-light"
                >
                  <Icon className="size-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h2 className="font-sans text-xs font-semibold tracking-[0.2em] text-gold-light uppercase rtl:tracking-normal">
            {t("explore")}
          </h2>
          <ul className="mt-5 space-y-3 text-sm">
            <li><Link className="hover:text-white" href="/properties?purpose=buy">{nav("buy")}</Link></li>
            <li><Link className="hover:text-white" href="/properties?purpose=rent">{nav("rent")}</Link></li>
            <li><Link className="hover:text-white" href="/off-plan">{nav("offPlan")}</Link></li>
            <li><Link className="hover:text-white" href="/favorites">{nav("favorites")}</Link></li>
            <li><Link className="hover:text-white" href="/compare">{nav("compare")}</Link></li>
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h2 className="font-sans text-xs font-semibold tracking-[0.2em] text-gold-light uppercase rtl:tracking-normal">
            {t("areas")}
          </h2>
          <ul className="mt-5 space-y-3 text-sm">
            {areas.map((area) => (
              <li key={area.slug}>
                <Link className="hover:text-white" href={`/areas/${area.slug}`}>
                  {area.name[locale]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h2 className="font-sans text-xs font-semibold tracking-[0.2em] text-gold-light uppercase rtl:tracking-normal">
            {t("company")}
          </h2>
          <ul className="mt-5 space-y-3 text-sm">
            <li><Link className="hover:text-white" href="/agents">{nav("agents")}</Link></li>
            <li><Link className="hover:text-white" href="/list-your-property">{nav("listProperty")}</Link></li>
            <li><Link className="hover:text-white" href="/contact">{nav("contact")}</Link></li>
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h2 className="font-sans text-xs font-semibold tracking-[0.2em] text-gold-light uppercase rtl:tracking-normal">
            {t("contact")}
          </h2>
          <ul className="mt-5 space-y-4 text-sm">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
              <span>
                {site.address.street[locale]}
                <br />
                {site.address.locality[locale]}
              </span>
            </li>
            <li>
              <a href={site.phoneHref} className="flex items-center gap-3 hover:text-white">
                <Phone className="size-4 shrink-0 text-gold" aria-hidden="true" />
                <span dir="ltr">{site.phone}</span>
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="flex items-center gap-3 break-all hover:text-white">
                <Mail className="size-4 shrink-0 text-gold" aria-hidden="true" />
                {site.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-luxe flex flex-col gap-3 py-6 text-xs text-white/60 md:flex-row md:items-center md:justify-between">
          <p>
            {t("rights", { year })} · {site.reraLicense}
          </p>
          <p className="text-white/75">
            {t("demoNote")}{" "}
            <a
              href={site.author.url}
              target="_blank"
              rel="noopener"
              className="font-semibold text-gold-light underline-offset-4 hover:underline"
            >
              ahmadkhajeh.com
            </a>
          </p>
        </div>
        <p className="container-luxe pb-24 text-[11px] text-white/50 md:pb-8">{t("demoDisclaimer")}</p>
      </div>
    </footer>
  );
}
