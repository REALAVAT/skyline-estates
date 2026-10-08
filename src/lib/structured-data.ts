import { getArea } from "@/data/areas";
import { site } from "@/data/site";
import type { Agent, Locale, Property } from "@/types";
import { getSiteUrl, localizedUrl } from "./seo";

const residenceType: Record<Property["type"], string> = {
  apartment: "Apartment",
  penthouse: "Apartment",
  duplex: "Apartment",
  villa: "SingleFamilyResidence",
  townhouse: "House",
};

export function organizationJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": `${localizedUrl("en")}#organization`,
    name: site.name,
    legalName: site.legalName,
    url: localizedUrl(locale),
    logo: `${getSiteUrl()}/icon.svg`,
    image: `${localizedUrl(locale)}/opengraph-image`,
    telephone: site.phone,
    email: site.email,
    priceRange: "AED 640,000 – AED 68,000,000",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street[locale],
      addressLocality: "Dubai",
      addressRegion: "Dubai",
      addressCountry: site.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.address.coordinates[0],
      longitude: site.address.coordinates[1],
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "19:00",
    },
    areaServed: { "@type": "City", name: "Dubai" },
    sameAs: Object.values(site.socials),
    knowsLanguage: ["en", "ar"],
  };
}

export function propertyJsonLd(property: Property, locale: Locale) {
  const url = localizedUrl(locale, `/properties/${property.slug}`);
  const area = getArea(property.area);
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "@id": `${url}#listing`,
    name: property.title[locale],
    description: property.description[locale],
    url,
    image: property.images,
    datePosted: property.listedAt,
    inLanguage: locale,
    offers: {
      "@type": "Offer",
      price: property.price,
      priceCurrency: "AED",
      availability: "https://schema.org/InStock",
      businessFunction:
        property.purpose === "rent" ? "http://purl.org/goodrelations/v1#LeaseOut" : "http://purl.org/goodrelations/v1#Sell",
      ...(property.purpose === "rent"
        ? { priceSpecification: { "@type": "UnitPriceSpecification", price: property.price, priceCurrency: "AED", unitCode: "ANN" } }
        : {}),
      seller: { "@id": `${localizedUrl("en")}#organization` },
    },
    mainEntity: {
      "@type": residenceType[property.type],
      name: property.building[locale],
      numberOfRooms: property.beds + 1,
      numberOfBedrooms: property.beds,
      numberOfBathroomsTotal: property.baths,
      floorSize: { "@type": "QuantitativeValue", value: property.size, unitCode: "FTK" },
      address: {
        "@type": "PostalAddress",
        addressLocality: area?.name[locale] ?? "Dubai",
        addressRegion: "Dubai",
        addressCountry: "AE",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: property.coordinates[0],
        longitude: property.coordinates[1],
      },
      amenityFeature: property.amenities.map((a) => ({
        "@type": "LocationFeatureSpecification",
        name: a,
        value: true,
      })),
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function itemListJsonLd(list: Property[], locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    numberOfItems: list.length,
    itemListElement: list.map((p, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: localizedUrl(locale, `/properties/${p.slug}`),
      name: p.title[locale],
    })),
  };
}

export function agentJsonLd(agent: Agent, locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: agent.name[locale],
    jobTitle: agent.role[locale],
    image: agent.photo,
    telephone: agent.phone,
    email: agent.email,
    url: localizedUrl(locale, `/agents/${agent.slug}`),
    knowsLanguage: agent.languages,
    parentOrganization: { "@id": `${localizedUrl("en")}#organization` },
  };
}
