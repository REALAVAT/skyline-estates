"use client";

import { Share2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "@/lib/toast";

export function ShareButton({ title }: { title: string }) {
  const t = useTranslations("property");
  const tl = useTranslations("listings");

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch (error) {
        if ((error as DOMException)?.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      toast.success(tl("linkCopied"));
    } catch {
      toast(url);
    }
  };

  return (
    <button
      type="button"
      onClick={share}
      className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-navy/15 bg-white px-5 text-sm font-semibold text-navy transition-colors hover:border-navy"
    >
      <Share2 className="size-[18px]" aria-hidden="true" />
      <span>{t("share")}</span>
    </button>
  );
}
