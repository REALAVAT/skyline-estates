"use client";

import Image from "next/image";
import { useEffect } from "react";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useCompare } from "@/lib/stores";

export interface TrayProperty {
  id: string;
  title: string;
  image: string;
}

export function CompareTray({ index }: { index: TrayProperty[] }) {
  const t = useTranslations("compare");
  const pathname = usePathname();
  const { ids, remove, clear } = useCompare();
  const items = ids.map((id) => index.find((p) => p.id === id)).filter((p) => p !== undefined);
  const visible = items.length > 0 && pathname !== "/compare";

  useEffect(() => {
    const root = document.documentElement;
    if (visible) root.dataset.compareTray = "";
    else delete root.dataset.compareTray;
    return () => {
      delete root.dataset.compareTray;
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <aside
      aria-label={t("title")}
      className="fixed start-3 end-[5.25rem] animate-[trayIn_0.5s_var(--ease-luxe)_both] bottom-4 z-40 rounded-2xl bg-navy p-3 text-white shadow-lift sm:inset-x-24 sm:bottom-6 sm:mx-auto sm:max-w-2xl sm:p-4"
    >
      <div className="flex items-center gap-3">
        <ul className="flex -space-x-3 rtl:space-x-reverse">
          {items.map((p) => (
            <li key={p.id} className="relative">
              <div className="relative size-11 overflow-hidden rounded-full ring-2 ring-navy sm:size-12">
                <Image src={p.image} alt={p.title} fill sizes="48px" className="object-cover" />
              </div>
              <button
                type="button"
                onClick={() => remove(p.id)}
                aria-label={`${t("remove")}: ${p.title}`}
                className="absolute -end-1 -top-1 grid size-5 place-items-center rounded-full bg-white text-navy shadow"
              >
                <X className="size-3" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
        <p className="hidden text-sm text-white/80 sm:block">{t("tray", { count: items.length })}</p>
        <div className="ms-auto flex items-center gap-2">
          <button type="button" onClick={clear} className="px-2 text-xs text-white/70 hover:text-white">
            {t("clear")}
          </button>
          <Link href="/compare" className="btn-gold h-10 px-5">
            {t("compareNow")}
          </Link>
        </div>
      </div>
    </aside>
  );
}
