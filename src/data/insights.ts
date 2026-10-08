import type { Insight } from "@/types";
import { img } from "./images";

export const insights: Insight[] = [
  {
    slug: "dubai-prime-market-2026",
    title: {
      en: "Dubai prime market review: what 2026 has delivered so far",
      ar: "مراجعة سوق دبي الفاخر: ما حققه عام 2026 حتى الآن",
    },
    excerpt: {
      en: "Record villa transactions on the Palm and steady growth in Downtown. Here is what the numbers say.",
      ar: "صفقات فلل قياسية في النخلة ونمو مستقر في وسط المدينة. إليك ما تقوله الأرقام.",
    },
    category: { en: "Market report", ar: "تقرير السوق" },
    date: "2026-09-18",
    readMinutes: 6,
    image: img.skylineSunset,
    href: "/areas/palm-jumeirah",
  },
  {
    slug: "off-plan-payment-plans",
    title: {
      en: "Understanding off-plan payment plans in Dubai",
      ar: "فهم خطط السداد للمشاريع على الخارطة في دبي",
    },
    excerpt: {
      en: "From 80/20 to post-handover plans: how to choose the structure that fits your cash flow.",
      ar: "من خطط 80/20 إلى خطط السداد بعد التسليم: كيف تختار الهيكل المناسب لتدفقاتك النقدية.",
    },
    category: { en: "Buying guide", ar: "دليل الشراء" },
    date: "2026-08-27",
    readMinutes: 5,
    image: img.architectPlans,
    href: "/off-plan",
  },
  {
    slug: "best-areas-rental-yield",
    title: {
      en: "Where to buy for the best rental yield",
      ar: "أين تشتري لتحقيق أفضل عائد إيجاري",
    },
    excerpt: {
      en: "JVC and Business Bay continue to lead on yield. We compare five communities side by side.",
      ar: "تواصل قرية جميرا الدائرية والخليج التجاري الصدارة في العوائد. نقارن خمسة مجتمعات جنباً إلى جنب.",
    },
    category: { en: "Investment", ar: "استثمار" },
    date: "2026-08-04",
    readMinutes: 7,
    image: img.marinaTowers,
    href: "/areas/jvc",
  },
];
