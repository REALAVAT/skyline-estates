import { getTranslations } from "next-intl/server";
import { cn } from "@/lib/utils";
import type { Locale, PaymentStep } from "@/types";

const stageColor: Record<PaymentStep["stage"], string> = {
  booking: "bg-gold",
  construction: "bg-navy-700",
  handover: "bg-navy",
  "post-handover": "bg-gold-deep",
};

export async function PaymentPlanBar({
  plan,
  locale,
  compact = false,
}: {
  plan: PaymentStep[];
  locale: Locale;
  compact?: boolean;
}) {
  const t = await getTranslations({ locale, namespace: "offPlan" });
  return (
    <div>
      <div className="flex h-2.5 w-full gap-0.5 overflow-hidden rounded-full" aria-hidden="true">
        {plan.map((step) => (
          <div key={step.stage} className={stageColor[step.stage]} style={{ width: `${step.percent}%` }} />
        ))}
      </div>
      <ul className={cn("mt-3 grid gap-2", plan.length > 3 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-3")}>
        {plan.map((step) => (
          <li key={step.stage} className="flex items-start gap-2">
            <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", stageColor[step.stage])} aria-hidden="true" />
            <span className="leading-tight">
              <span className={cn("block font-semibold text-navy", compact ? "text-sm" : "text-lg")} dir="ltr">
                {step.percent}%
              </span>
              <span className="text-xs text-muted-foreground">{compact ? t(`stage.${step.stage}`) : step.label[locale]}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
