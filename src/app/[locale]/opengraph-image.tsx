import { img } from "@/data/images";
import { routing } from "@/i18n/routing";
import { ogSize, renderOg } from "@/lib/og";

export const alt = "Skyline Estates – Luxury real estate in Dubai";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Image() {
  return renderOg({
    eyebrow: "Dubai luxury real estate",
    title: "Find your place above the skyline",
    subtitle: "Villas, penthouses and off-plan residences in Dubai's most coveted addresses.",
    facts: ["Buy", "Rent", "Off-plan"],
    photo: img.skylineSunset,
  });
}
