import { getArea } from "@/data/areas";
import { getProperty, properties } from "@/data/properties";
import { routing } from "@/i18n/routing";
import { ogSize, renderOg } from "@/lib/og";

export const alt = "Property at Skyline Estates";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => properties.map((p) => ({ locale, slug: p.slug })));
}

const typeLabels: Record<string, string> = {
  apartment: "Apartment",
  villa: "Villa",
  penthouse: "Penthouse",
  townhouse: "Townhouse",
  duplex: "Duplex",
};

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const property = getProperty(slug);
  if (!property) {
    return renderOg({ eyebrow: "Skyline Estates", title: "Luxury real estate in Dubai" });
  }

  const area = getArea(property.area);
  const price = `AED ${property.price.toLocaleString("en-US")}${property.purpose === "rent" ? " / yr" : ""}`;
  const purpose = property.completion === "off-plan" ? "Off-plan" : property.purpose === "rent" ? "For rent" : "For sale";

  return renderOg({
    eyebrow: `${purpose} · ${area?.name.en ?? "Dubai"}`,
    title: property.title.en,
    subtitle: price,
    facts: [
      typeLabels[property.type] ?? property.type,
      property.beds === 0 ? "Studio" : `${property.beds} Bed${property.beds === 1 ? "" : "s"}`,
      `${property.size.toLocaleString("en-US")} sq ft`,
    ],
    photo: property.images[0],
  });
}
