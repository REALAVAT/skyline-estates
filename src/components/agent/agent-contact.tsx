import Image from "next/image";
import { Mail, Phone, Star } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { WhatsAppIcon } from "@/components/layout/whatsapp-fab";
import { Link } from "@/i18n/navigation";
import type { Agent, Locale } from "@/types";

export async function AgentContact({
  agent,
  locale,
  propertyRef,
}: {
  agent: Agent;
  locale: Locale;
  propertyRef?: string;
}) {
  const t = await getTranslations({ locale, namespace: "agent" });
  const tc = await getTranslations({ locale, namespace: "common" });
  const name = agent.name[locale];
  const message = propertyRef ? t("whatsappMessage", { name, ref: propertyRef }) : t("whatsappGeneric", { name });
  const wa = `https://wa.me/${agent.whatsapp}?text=${encodeURIComponent(message)}`;

  return (
    <div>
      <p className="eyebrow">{t("listedBy")}</p>
      <div className="mt-4 flex items-center gap-4">
        <div className="relative size-16 shrink-0 overflow-hidden rounded-full bg-sand ring-2 ring-gold/40">
          <Image src={agent.photo} alt={name} fill sizes="64px" className="object-cover object-top" />
        </div>
        <div className="min-w-0">
          <Link href={`/agents/${agent.slug}`} className="font-display text-xl font-semibold text-navy hover:text-gold-deep">
            {name}
          </Link>
          <p className="text-sm text-muted-foreground">{agent.role[locale]}</p>
          <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-navy">
            <Star className="size-3.5 fill-gold text-gold" aria-hidden="true" />
            <span dir="ltr">{agent.rating.toFixed(1)}</span>
            <span className="font-normal text-muted-foreground">· {t("experience", { count: agent.experience })}</span>
          </p>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-2">
        <a
          href={`tel:${agent.phone}`}
          className="inline-flex h-11 items-center justify-center gap-1.5 rounded-full border border-navy/15 text-sm font-semibold text-navy transition-colors hover:border-navy hover:bg-navy hover:text-ivory"
        >
          <Phone className="size-4" aria-hidden="true" />
          {tc("call")}
        </a>
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 items-center justify-center gap-1.5 rounded-full bg-whatsapp text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          <WhatsAppIcon className="size-4" />
          {tc("whatsapp")}
        </a>
        <a
          href={`mailto:${agent.email}?subject=${encodeURIComponent(propertyRef ?? "Skyline Estates")}`}
          className="inline-flex h-11 items-center justify-center gap-1.5 rounded-full border border-navy/15 text-sm font-semibold text-navy transition-colors hover:border-navy hover:bg-navy hover:text-ivory"
        >
          <Mail className="size-4" aria-hidden="true" />
          {tc("email")}
        </a>
      </div>
    </div>
  );
}
