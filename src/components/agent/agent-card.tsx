import Image from "next/image";
import { Mail, Phone, Star } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { WhatsAppIcon } from "@/components/layout/whatsapp-fab";
import { Link } from "@/i18n/navigation";
import type { Agent, Locale } from "@/types";

export async function AgentCard({ agent, locale }: { agent: Agent; locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "agent" });
  const tc = await getTranslations({ locale, namespace: "common" });
  const tl = await getTranslations({ locale, namespace: "languagesList" });
  const name = agent.name[locale];
  const wa = `https://wa.me/${agent.whatsapp}?text=${encodeURIComponent(t("whatsappGeneric", { name }))}`;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-navy/5 transition-shadow duration-500 hover:shadow-lift">
      <div className="relative aspect-[4/5] overflow-hidden bg-sand">
        <Image
          src={agent.photo}
          alt={name}
          fill
          sizes="(min-width: 1280px) 22vw, (min-width: 640px) 45vw, 100vw"
          className="object-cover object-top grayscale-[25%] transform-gpu transition-[transform,filter] duration-700 group-hover:scale-[1.03] group-hover:grayscale-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent" />
        <div className="absolute inset-x-5 bottom-5 text-white">
          <h3 className="font-display text-2xl text-white rtl:text-xl">
            <Link href={`/agents/${agent.slug}`} className="after:absolute after:inset-0 after:content-['']">
              {name}
            </Link>
          </h3>
          <p className="mt-1 text-sm text-white/80">{agent.role[locale]}</p>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1 font-semibold text-navy">
            <Star className="size-4 fill-gold text-gold" aria-hidden="true" />
            <span dir="ltr">{agent.rating.toFixed(1)}</span>
          </span>
          <span className="text-muted-foreground">{t("experience", { count: agent.experience })}</span>
        </div>
        <p className="text-xs text-muted-foreground">{agent.languages.map((l) => tl(l)).join(" · ")}</p>
        <div className="relative z-10 mt-auto grid grid-cols-3 gap-2">
          <a href={`tel:${agent.phone}`} className="inline-flex h-10 items-center justify-center rounded-full bg-sand text-navy transition-colors hover:bg-navy hover:text-ivory" aria-label={`${tc("call")} ${name}`}>
            <Phone className="size-4" aria-hidden="true" />
          </a>
          <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center justify-center rounded-full bg-sand text-navy transition-colors hover:bg-whatsapp hover:text-white" aria-label={`${tc("whatsapp")} ${name}`}>
            <WhatsAppIcon className="size-4" />
          </a>
          <a href={`mailto:${agent.email}`} className="inline-flex h-10 items-center justify-center rounded-full bg-sand text-navy transition-colors hover:bg-navy hover:text-ivory" aria-label={`${tc("email")} ${name}`}>
            <Mail className="size-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  );
}
