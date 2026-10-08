import { areaSlugs } from "@/data/areas";
import type { AmenityKey, AreaSlug, Property, PropertySummary, PropertyType } from "@/types";

export type PurposeFilter = "buy" | "rent" | "off-plan";
export type SortKey = "newest" | "price-asc" | "price-desc" | "size-desc";
export type ViewMode = "grid" | "list";

export const PAGE_SIZE = 12;

export const propertyTypes: PropertyType[] = ["apartment", "villa", "penthouse", "townhouse", "duplex"];
export const sortKeys: SortKey[] = ["newest", "price-asc", "price-desc", "size-desc"];
export const purposeFilters: PurposeFilter[] = ["buy", "rent", "off-plan"];
export const bedOptions = ["0", "1", "2", "3", "4", "5"] as const;
export const bathOptions = [1, 2, 3, 4, 5] as const;
export const amenityKeys: AmenityKey[] = [
  "pool",
  "privatePool",
  "gym",
  "parking",
  "balcony",
  "seaView",
  "burjView",
  "beachAccess",
  "privateGarden",
  "maidRoom",
  "concierge",
  "smartHome",
  "kidsPlay",
  "study",
  "petFriendly",
  "security",
];

/** Price stops (AED) used by the range slider. The last stop means "no maximum". */
export const priceSteps: Record<"sale" | "rent", number[]> = {
  sale: [0, 500_000, 750_000, 1_000_000, 1_500_000, 2_000_000, 3_000_000, 4_000_000, 5_000_000, 7_500_000, 10_000_000, 15_000_000, 20_000_000, 30_000_000, 50_000_000, 100_000_000],
  rent: [0, 50_000, 75_000, 100_000, 125_000, 150_000, 200_000, 250_000, 350_000, 500_000, 750_000, 1_000_000, 2_000_000],
};

export const priceScale = (purpose: PurposeFilter) => (purpose === "rent" ? priceSteps.rent : priceSteps.sale);

export interface ListingFilters {
  purpose: PurposeFilter;
  type?: PropertyType;
  area?: AreaSlug;
  minPrice?: number;
  maxPrice?: number;
  beds?: string;
  baths?: number;
  minSize?: number;
  maxSize?: number;
  amenities: AmenityKey[];
  sort: SortKey;
  view: ViewMode;
  map: boolean;
  page: number;
}

export const defaultFilters: ListingFilters = {
  purpose: "buy",
  amenities: [],
  sort: "newest",
  view: "grid",
  map: true,
  page: 1,
};

type ParamSource = URLSearchParams | Record<string, string | string[] | undefined>;

function read(source: ParamSource, key: string): string | undefined {
  if (source instanceof URLSearchParams) return source.get(key) ?? undefined;
  const value = source[key];
  return Array.isArray(value) ? value[0] : value;
}

const toNumber = (value: string | undefined) => {
  if (value === undefined || value === "") return undefined;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
};

const oneOf = <T extends string>(value: string | undefined, options: readonly T[]) =>
  value && (options as readonly string[]).includes(value) ? (value as T) : undefined;

export function parseFilters(source: ParamSource): ListingFilters {
  const amenitiesRaw = read(source, "amenities");
  return {
    purpose: oneOf(read(source, "purpose"), purposeFilters) ?? defaultFilters.purpose,
    type: oneOf(read(source, "type"), propertyTypes),
    area: oneOf(read(source, "area"), areaSlugs),
    minPrice: toNumber(read(source, "minPrice")),
    maxPrice: toNumber(read(source, "maxPrice")),
    beds: oneOf(read(source, "beds"), bedOptions),
    baths: toNumber(read(source, "baths")),
    minSize: toNumber(read(source, "minSize")),
    maxSize: toNumber(read(source, "maxSize")),
    amenities: amenitiesRaw
      ? amenitiesRaw.split(",").filter((a): a is AmenityKey => (amenityKeys as string[]).includes(a))
      : [],
    sort: oneOf(read(source, "sort"), sortKeys) ?? defaultFilters.sort,
    view: oneOf(read(source, "view"), ["grid", "list"] as const) ?? defaultFilters.view,
    map: read(source, "map") !== "0",
    page: Math.max(1, Math.floor(toNumber(read(source, "page")) ?? 1)),
  };
}

export function serializeFilters(filters: Partial<ListingFilters>): string {
  const params = new URLSearchParams();
  if (filters.purpose) params.set("purpose", filters.purpose);
  if (filters.type) params.set("type", filters.type);
  if (filters.area) params.set("area", filters.area);
  if (filters.minPrice) params.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice) params.set("maxPrice", String(filters.maxPrice));
  if (filters.beds) params.set("beds", filters.beds);
  if (filters.baths) params.set("baths", String(filters.baths));
  if (filters.minSize) params.set("minSize", String(filters.minSize));
  if (filters.maxSize) params.set("maxSize", String(filters.maxSize));
  if (filters.amenities?.length) params.set("amenities", filters.amenities.join(","));
  if (filters.sort && filters.sort !== defaultFilters.sort) params.set("sort", filters.sort);
  if (filters.view && filters.view !== defaultFilters.view) params.set("view", filters.view);
  if (filters.map === false) params.set("map", "0");
  if (filters.page && filters.page > 1) params.set("page", String(filters.page));
  return params.toString();
}

export function matchesPurpose(property: PropertySummary, purpose: PurposeFilter) {
  if (purpose === "rent") return property.purpose === "rent";
  if (purpose === "off-plan") return property.completion === "off-plan";
  return property.purpose === "buy";
}

export function applyFilters<T extends PropertySummary>(list: T[], f: ListingFilters): T[] {
  const filtered = list.filter((p) => {
    if (!matchesPurpose(p, f.purpose)) return false;
    if (f.type && p.type !== f.type) return false;
    if (f.area && p.area !== f.area) return false;
    if (f.minPrice && p.price < f.minPrice) return false;
    if (f.maxPrice && p.price > f.maxPrice) return false;
    if (f.beds !== undefined) {
      const beds = Number(f.beds);
      if (beds >= 5 ? p.beds < 5 : p.beds !== beds) return false;
    }
    if (f.baths && p.baths < f.baths) return false;
    if (f.minSize && p.size < f.minSize) return false;
    if (f.maxSize && p.size > f.maxSize) return false;
    if (f.amenities.length && !f.amenities.every((a) => p.amenities.includes(a))) return false;
    return true;
  });
  return sortProperties(filtered, f.sort);
}

export function sortProperties<T extends PropertySummary>(list: T[], sort: SortKey): T[] {
  const sorted = [...list];
  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "size-desc":
      return sorted.sort((a, b) => b.size - a.size);
    default:
      return sorted.sort((a, b) => b.listedAt.localeCompare(a.listedAt));
  }
}

export function paginate<T>(list: T[], page: number, size = PAGE_SIZE) {
  const totalPages = Math.max(1, Math.ceil(list.length / size));
  const current = Math.min(Math.max(page, 1), totalPages);
  return {
    items: list.slice((current - 1) * size, current * size),
    page: current,
    totalPages,
  };
}

export function activeFilterCount(f: ListingFilters) {
  return [f.type, f.area, f.minPrice, f.maxPrice, f.beds, f.baths, f.minSize, f.maxSize].filter(
    (v) => v !== undefined && v !== "",
  ).length + f.amenities.length;
}

export function similarProperties(list: Property[], property: Property, count = 3) {
  return list
    .filter((p) => p.id !== property.id && p.purpose === property.purpose)
    .map((p) => ({
      p,
      score:
        (p.area === property.area ? 3 : 0) +
        (p.type === property.type ? 2 : 0) +
        (Math.abs(p.beds - property.beds) <= 1 ? 1 : 0) +
        (Math.abs(p.price - property.price) / property.price < 0.5 ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(({ p }) => p);
}
