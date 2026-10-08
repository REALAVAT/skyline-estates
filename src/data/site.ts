import type { Localized } from "@/types";

export const site = {
  name: "Skyline Estates",
  legalName: "Skyline Estates Real Estate Brokers L.L.C.",
  shortName: "Skyline",
  productionUrl: "https://realestate.ahmadkhajeh.com",
  phone: "+971 4 555 0199",
  phoneHref: "tel:+97145550199",
  whatsapp: "971501234567",
  email: "hello@skyline-estates.ae",
  reraLicense: "RERA ORN 00000",
  address: {
    street: {
      en: "Level 21, Boulevard Plaza Tower 2",
      ar: "الطابق 21، برج بوليفارد بلازا 2",
    } satisfies Localized,
    locality: { en: "Downtown Dubai, UAE", ar: "وسط مدينة دبي، الإمارات" } satisfies Localized,
    postalCode: "00000",
    country: "AE",
    coordinates: [25.1956, 55.2745] as [number, number],
  },
  hours: {
    en: "Mon – Sat, 9:00 – 19:00",
    ar: "الاثنين – السبت، 9:00 – 19:00",
  } satisfies Localized,
  socials: {
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
    youtube: "https://youtube.com",
    x: "https://x.com",
  },
  author: { name: "Ahmad Khajeh", url: "https://ahmadkhajeh.com" },
  stats: { yearsActive: 15, propertiesSold: 2400, salesVolumeBillions: 9.6, clientSatisfaction: 98 },
} as const;

export const AED_PER_USD = 3.6725;
