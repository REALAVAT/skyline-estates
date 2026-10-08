import type { AreaSlug, Localized } from "@/types";

// Kept apart from the full area guides so client components can show names without bundling the guides.
export const areaNames: Record<AreaSlug, Localized> = {
  "downtown-dubai": { en: "Downtown Dubai", ar: "وسط مدينة دبي" },
  "dubai-marina": { en: "Dubai Marina", ar: "دبي مارينا" },
  "palm-jumeirah": { en: "Palm Jumeirah", ar: "نخلة جميرا" },
  "business-bay": { en: "Business Bay", ar: "الخليج التجاري" },
  jvc: { en: "Jumeirah Village Circle", ar: "قرية جميرا الدائرية" },
};

export const areaOptions = (Object.keys(areaNames) as AreaSlug[]).map((slug) => ({ slug, name: areaNames[slug] }));
