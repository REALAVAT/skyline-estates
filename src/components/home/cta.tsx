import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/shared/reveal";
import { img } from "@/data/images";
import { Link } from "@/i18n/navigation";

export async function Cta() {
  const t = await getTranslations("home");
  return (
    <section className="bg-ivory py-20 lg:py-28">
      <div className="container-luxe">
        <Reveal className="relative isolate overflow-hidden rounded-[2rem] bg-navy px-6 py-16 text-center sm:px-12 lg:py-24">
          <Image src={img.villaInfinity} alt="" fill sizes="(min-width: 1440px) 1340px, 100vw" className="-z-10 object-cover opacity-35" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy via-navy/80 to-navy/60 rtl:bg-gradient-to-l" />
          <h2 className="mx-auto max-w-3xl font-display text-4xl leading-tight text-white sm:text-5xl rtl:text-3xl rtl:sm:text-4xl">
            {t("ctaTitle")}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/80">{t("ctaSubtitle")}</p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/list-your-property" className="btn-gold">
              {t("ctaPrimary")}
            </Link>
            <Link href="/contact" className="btn-ghost-light">
              {t("ctaSecondary")}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
