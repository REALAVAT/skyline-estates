import type { MetadataRoute } from "next";
import { agents } from "@/data/agents";
import { areas } from "@/data/areas";
import { projects } from "@/data/projects";
import { properties } from "@/data/properties";
import { routing } from "@/i18n/routing";
import { languageAlternates, localizedUrl } from "@/lib/seo";

type Entry = { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; lastModified?: string };

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: Entry[] = [
    { path: "/", priority: 1, changeFrequency: "daily" },
    { path: "/properties", priority: 0.9, changeFrequency: "daily" },
    { path: "/properties?purpose=rent", priority: 0.8, changeFrequency: "daily" },
    { path: "/off-plan", priority: 0.8, changeFrequency: "weekly" },
    { path: "/areas", priority: 0.7, changeFrequency: "monthly" },
    { path: "/agents", priority: 0.6, changeFrequency: "monthly" },
    { path: "/list-your-property", priority: 0.6, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.5, changeFrequency: "yearly" },
    ...properties.map((p) => ({
      path: `/properties/${p.slug}`,
      priority: 0.8,
      changeFrequency: "weekly" as const,
      lastModified: p.listedAt,
    })),
    ...projects.map((p) => ({ path: `/off-plan/${p.slug}`, priority: 0.7, changeFrequency: "weekly" as const })),
    ...areas.map((a) => ({ path: `/areas/${a.slug}`, priority: 0.6, changeFrequency: "monthly" as const })),
    ...agents.map((a) => ({ path: `/agents/${a.slug}`, priority: 0.5, changeFrequency: "monthly" as const })),
  ];

  return entries.flatMap(({ path, priority, changeFrequency, lastModified }) =>
    routing.locales.map((locale) => ({
      url: localizedUrl(locale, path),
      lastModified: lastModified ? new Date(lastModified) : undefined,
      changeFrequency,
      priority,
      alternates: { languages: languageAlternates(path) },
    })),
  );
}
