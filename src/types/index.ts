export type Locale = "en" | "ar";
export type Localized = Record<Locale, string>;
export type LatLng = [number, number];

export type Purpose = "buy" | "rent";
export type Completion = "ready" | "off-plan";
export type PropertyType = "apartment" | "villa" | "penthouse" | "townhouse" | "duplex";
export type AreaSlug =
  | "downtown-dubai"
  | "dubai-marina"
  | "palm-jumeirah"
  | "business-bay"
  | "jvc";

export type AmenityKey =
  | "pool"
  | "gym"
  | "parking"
  | "balcony"
  | "seaView"
  | "burjView"
  | "concierge"
  | "maidRoom"
  | "privateGarden"
  | "privatePool"
  | "smartHome"
  | "beachAccess"
  | "kidsPlay"
  | "security"
  | "study"
  | "petFriendly";

export type FloorPlanKind = "studio" | "apartment" | "villa" | "penthouse";

export interface Property {
  id: string;
  slug: string;
  ref: string;
  title: Localized;
  description: Localized;
  purpose: Purpose;
  completion: Completion;
  type: PropertyType;
  area: AreaSlug;
  building: Localized;
  /** Sale price, or yearly rent, in AED. */
  price: number;
  beds: number;
  baths: number;
  /** Built-up area in square feet. */
  size: number;
  coordinates: LatLng;
  images: string[];
  floorPlan: FloorPlanKind;
  amenities: AmenityKey[];
  agentId: string;
  featured?: boolean;
  furnished: boolean;
  listedAt: string;
  handover?: string;
  projectSlug?: string;
}

/** Everything a card, map pin or comparison row needs; the long description stays on the server. */
export type PropertySummary = Omit<Property, "description"> & { excerpt?: Localized };

export type PlaceKind = "metro" | "mall" | "school" | "hospital" | "beach" | "park" | "landmark";

export interface Place {
  name: Localized;
  kind: PlaceKind;
  coordinates: LatLng;
}

export interface Area {
  slug: AreaSlug;
  name: Localized;
  tagline: Localized;
  intro: Localized;
  description: Localized;
  image: string;
  gallery: string[];
  center: LatLng;
  zoom: number;
  avgSalePricePerSqft: number;
  avgApartmentPrice: number;
  avgVillaPrice?: number;
  avgRent1Bed: number;
  avgRent2Bed: number;
  rentalYield: number;
  priceChange: number;
  lifestyle: { title: Localized; text: Localized; icon: LifestyleIcon }[];
  highlights: Localized[];
  places: Place[];
}

export type LifestyleIcon = "waves" | "utensils" | "shopping" | "school" | "train" | "trees" | "building" | "sun";

export interface Developer {
  id: string;
  name: string;
  founded: number;
  delivered: number;
  description: Localized;
}

export type ProjectStatus = "launching" | "under-construction" | "near-completion";

export interface PaymentStep {
  label: Localized;
  percent: number;
  stage: "booking" | "construction" | "handover" | "post-handover";
}

export interface Project {
  slug: string;
  name: string;
  tagline: Localized;
  description: Localized;
  developerId: string;
  area: AreaSlug;
  image: string;
  gallery: string[];
  startingPrice: number;
  handover: string;
  status: ProjectStatus;
  progress: number;
  unitTypes: Localized;
  bedrooms: string;
  totalUnits: number;
  coordinates: LatLng;
  paymentPlan: PaymentStep[];
  highlights: Localized[];
}

export interface Agent {
  id: string;
  slug: string;
  name: Localized;
  role: Localized;
  photo: string;
  phone: string;
  whatsapp: string;
  email: string;
  languages: ("en" | "ar" | "fr" | "ru" | "hi" | "de")[];
  specialties: AreaSlug[];
  experience: number;
  deals: number;
  rating: number;
  bio: Localized;
}

export interface Testimonial {
  id: string;
  name: string;
  role: Localized;
  quote: Localized;
  avatar: string;
  rating: number;
}

export interface Insight {
  slug: string;
  title: Localized;
  excerpt: Localized;
  category: Localized;
  date: string;
  readMinutes: number;
  image: string;
  href: string;
}
