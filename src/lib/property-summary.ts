import type { Localized, Property, PropertySummary } from "@/types";

const EXCERPT_LENGTH = 160;

function clip(text: string) {
  if (text.length <= EXCERPT_LENGTH) return text;
  const cut = text.slice(0, EXCERPT_LENGTH);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

export function toCard(property: Property): PropertySummary {
  const { description, ...card } = property;
  void description;
  return card;
}

export function toSummary(property: Property): PropertySummary {
  const { description, ...summary } = property;
  const excerpt: Localized = { en: clip(description.en), ar: clip(description.ar) };
  return { ...summary, excerpt };
}
