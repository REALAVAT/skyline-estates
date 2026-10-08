import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { img } from "@/data/images";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("notFound");
  return (
    <section className="relative isolate flex min-h-[70vh] items-center overflow-hidden bg-navy">
      <Image src={img.skylineSunset} alt="" fill sizes="100vw" quality={60} className="-z-20 object-cover opacity-40" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-navy via-navy/70 to-navy/40" />
      <div className="container-luxe py-24 text-center">
        <p className="font-display text-8xl font-medium text-gold-light sm:text-9xl" dir="ltr">
          404
        </p>
        <h1 className="mt-4 font-display text-4xl text-white sm:text-5xl">{t("title")}</h1>
        <p className="mx-auto mt-4 max-w-md text-white/75">{t("text")}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-gold">
            {t("home")}
          </Link>
          <Link href="/properties" className="btn-ghost-light">
            {t("browse")}
          </Link>
        </div>
      </div>
    </section>
  );
}
