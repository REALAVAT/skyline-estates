import type { Developer, Project } from "@/types";
import { img } from "./images";

export const developers: Developer[] = [
  {
    id: "meridian",
    name: "Meridian Properties",
    founded: 2004,
    delivered: 38,
    description: {
      en: "One of Dubai's most established master developers, known for landmark mixed-use towers in Downtown and Business Bay.",
      ar: "من أعرق المطورين الرئيسيين في دبي، ويُعرف بأبراجه متعددة الاستخدامات البارزة في وسط المدينة والخليج التجاري.",
    },
  },
  {
    id: "crescent",
    name: "Crescent Holdings",
    founded: 2009,
    delivered: 17,
    description: {
      en: "A boutique ultra-luxury developer creating limited-edition beachfront villas and residences.",
      ar: "مطور متخصص في الفخامة الفائقة يبتكر فللاً ومساكن حصرية على الشاطئ بأعداد محدودة.",
    },
  },
  {
    id: "azure",
    name: "Azure Development",
    founded: 2012,
    delivered: 24,
    description: {
      en: "Design-led waterfront towers with resort-style amenities and award-winning architecture.",
      ar: "أبراج على الواجهة المائية بتصميم مميز ومرافق على طراز المنتجعات وهندسة معمارية حائزة على جوائز.",
    },
  },
  {
    id: "oasis",
    name: "Oasis Living",
    founded: 2015,
    delivered: 12,
    description: {
      en: "Community-focused developer of townhouses and family homes with generous green spaces.",
      ar: "مطور يركز على المجتمعات السكنية ويقدم منازل متلاصقة ومنازل عائلية مع مساحات خضراء واسعة.",
    },
  },
];

export const projects: Project[] = [
  {
    slug: "aurelia-residences",
    name: "The Aurelia Residences",
    tagline: { en: "Canal-front living in Business Bay", ar: "حياة على ضفاف القناة في الخليج التجاري" },
    description: {
      en: "A 52-storey tower of one to three-bedroom residences overlooking the Dubai Water Canal, with a sky pool, residents' club and hotel-style concierge. Interiors feature full-height glazing, Italian kitchens and smart-home technology throughout.",
      ar: "برج من 52 طابقاً يضم مساكن من غرفة إلى ثلاث غرف نوم تطل على قناة دبي المائية، مع مسبح في السماء ونادٍ للسكان وخدمة كونسيرج بمستوى الفنادق. تتميز التصميمات الداخلية بواجهات زجاجية كاملة الارتفاع ومطابخ إيطالية وتقنيات المنزل الذكي في جميع الأرجاء.",
    },
    developerId: "meridian",
    area: "business-bay",
    image: img.towerDetail,
    gallery: [img.towerDetail, img.livingGlass, img.kitchenIsland, img.rooftopPool],
    startingPrice: 1_650_000,
    handover: "Q4 2028",
    status: "under-construction",
    progress: 35,
    unitTypes: { en: "Apartments & duplexes", ar: "شقق ودوبلكس" },
    bedrooms: "1–3",
    totalUnits: 412,
    coordinates: [25.1878, 55.2598],
    paymentPlan: [
      { stage: "booking", percent: 20, label: { en: "On booking", ar: "عند الحجز" } },
      { stage: "construction", percent: 50, label: { en: "During construction", ar: "خلال البناء" } },
      { stage: "handover", percent: 30, label: { en: "On handover", ar: "عند التسليم" } },
    ],
    highlights: [
      { en: "Infinity sky pool on level 52", ar: "مسبح لا متناهٍ في الطابق 52" },
      { en: "Direct canal promenade access", ar: "وصول مباشر إلى ممشى القناة" },
      { en: "5 minutes to Downtown Dubai", ar: "5 دقائق إلى وسط مدينة دبي" },
    ],
  },
  {
    slug: "palm-crest-villas",
    name: "Palm Crest Villas",
    tagline: { en: "Signature beachfront villas on the fronds", ar: "فلل فريدة على الشاطئ في سعف النخلة" },
    description: {
      en: "Just 24 contemporary villas with private beaches, rooftop terraces and 25-metre pools. Each home is designed by an award-winning architecture studio with landscaping by a renowned Balinese garden designer.",
      ar: "24 فيلا عصرية فقط مع شواطئ خاصة وتراسات على الأسطح ومسابح بطول 25 متراً. صمم كل منزل استوديو معماري حائز على جوائز، مع تنسيق حدائق من مصمم بالي مشهور.",
    },
    developerId: "crescent",
    area: "palm-jumeirah",
    image: img.villaPavilion,
    gallery: [img.villaPavilion, img.villaInfinity, img.livingDouble, img.bedroomSuite],
    startingPrice: 18_500_000,
    handover: "Q2 2029",
    status: "launching",
    progress: 5,
    unitTypes: { en: "Beachfront villas", ar: "فلل على الشاطئ" },
    bedrooms: "5–7",
    totalUnits: 24,
    coordinates: [25.1205, 55.1335],
    paymentPlan: [
      { stage: "booking", percent: 10, label: { en: "On booking", ar: "عند الحجز" } },
      { stage: "construction", percent: 60, label: { en: "During construction", ar: "خلال البناء" } },
      { stage: "handover", percent: 30, label: { en: "On handover", ar: "عند التسليم" } },
    ],
    highlights: [
      { en: "Private beach for every villa", ar: "شاطئ خاص لكل فيلا" },
      { en: "Only 24 homes", ar: "24 منزلاً فقط" },
      { en: "Rooftop terraces with Burj Al Arab views", ar: "تراسات على الأسطح بإطلالات على برج العرب" },
    ],
  },
  {
    slug: "marina-vista-tower",
    name: "Marina Vista Tower",
    tagline: { en: "Panoramic sea and marina views", ar: "إطلالات بانورامية على البحر والمرسى" },
    description: {
      en: "A slender glass tower at the mouth of Dubai Marina with uninterrupted views of the Gulf and Ain Dubai. Amenities include a beach club, padel courts and a 40th-floor residents' lounge.",
      ar: "برج زجاجي رشيق عند مدخل دبي مارينا بإطلالات مفتوحة على الخليج وعين دبي. تشمل المرافق نادياً شاطئياً وملاعب بادل وصالة للسكان في الطابق الأربعين.",
    },
    developerId: "azure",
    area: "dubai-marina",
    image: img.marinaTowers,
    gallery: [img.marinaTowers, img.livingView, img.bedroomElegant, img.bathMarble],
    startingPrice: 1_950_000,
    handover: "Q1 2028",
    status: "near-completion",
    progress: 78,
    unitTypes: { en: "Apartments & penthouses", ar: "شقق وبنتهاوس" },
    bedrooms: "1–4",
    totalUnits: 286,
    coordinates: [25.0745, 55.1325],
    paymentPlan: [
      { stage: "booking", percent: 10, label: { en: "On booking", ar: "عند الحجز" } },
      { stage: "construction", percent: 40, label: { en: "During construction", ar: "خلال البناء" } },
      { stage: "handover", percent: 50, label: { en: "On handover", ar: "عند التسليم" } },
    ],
    highlights: [
      { en: "Beach club membership included", ar: "عضوية النادي الشاطئي مشمولة" },
      { en: "Ain Dubai and sea views", ar: "إطلالات على عين دبي والبحر" },
      { en: "Handover in early 2028", ar: "التسليم في أوائل 2028" },
    ],
  },
  {
    slug: "opus-downtown-heights",
    name: "Opus Downtown Heights",
    tagline: { en: "Burj Khalifa views with post-handover plan", ar: "إطلالات على برج خليفة مع خطة سداد بعد التسليم" },
    description: {
      en: "Twin towers on the Downtown boulevard with residences framed by Burj Khalifa views. Buyers benefit from a 60/40 plan, with 40% payable over two years after handover.",
      ar: "برجان توأمان على بوليفارد وسط المدينة بمساكن تحيط بها إطلالات برج خليفة. يستفيد المشترون من خطة 60/40، مع سداد 40% على مدى عامين بعد التسليم.",
    },
    developerId: "meridian",
    area: "downtown-dubai",
    image: img.downtownPalms,
    gallery: [img.downtownPalms, img.livingModern, img.dining, img.bedroomNoir],
    startingPrice: 2_400_000,
    handover: "Q3 2029",
    status: "launching",
    progress: 8,
    unitTypes: { en: "Apartments & sky villas", ar: "شقق وفلل في السماء" },
    bedrooms: "1–4",
    totalUnits: 534,
    coordinates: [25.1925, 55.2770],
    paymentPlan: [
      { stage: "booking", percent: 20, label: { en: "On booking", ar: "عند الحجز" } },
      { stage: "construction", percent: 30, label: { en: "During construction", ar: "خلال البناء" } },
      { stage: "handover", percent: 10, label: { en: "On handover", ar: "عند التسليم" } },
      { stage: "post-handover", percent: 40, label: { en: "Over 24 months after handover", ar: "على مدى 24 شهراً بعد التسليم" } },
    ],
    highlights: [
      { en: "40% post-handover payment plan", ar: "خطة سداد 40% بعد التسليم" },
      { en: "Burj Khalifa views from most units", ar: "إطلالات على برج خليفة من معظم الوحدات" },
      { en: "Walk to The Dubai Mall", ar: "على مسافة مشي من دبي مول" },
    ],
  },
  {
    slug: "verde-park-townhouses",
    name: "Verde Park Townhouses",
    tagline: { en: "Garden townhouses for growing families", ar: "منازل متلاصقة بحدائق للعائلات" },
    description: {
      en: "A gated collection of three and four-bedroom townhouses wrapped around a central park, with a community pool, nursery and retail boulevard.",
      ar: "مجموعة مسوّرة من المنازل المتلاصقة بثلاث وأربع غرف نوم تحيط بحديقة مركزية، مع مسبح مجتمعي وحضانة وبوليفارد تجاري.",
    },
    developerId: "oasis",
    area: "jvc",
    image: img.villaWood,
    gallery: [img.villaWood, img.livingSun, img.kitchenSage, img.bedroomWhite],
    startingPrice: 2_350_000,
    handover: "Q4 2027",
    status: "near-completion",
    progress: 86,
    unitTypes: { en: "Townhouses", ar: "منازل متلاصقة" },
    bedrooms: "3–4",
    totalUnits: 148,
    coordinates: [25.0625, 55.2055],
    paymentPlan: [
      { stage: "booking", percent: 10, label: { en: "On booking", ar: "عند الحجز" } },
      { stage: "construction", percent: 50, label: { en: "During construction", ar: "خلال البناء" } },
      { stage: "handover", percent: 40, label: { en: "On handover", ar: "عند التسليم" } },
    ],
    highlights: [
      { en: "Private gardens and roof terraces", ar: "حدائق خاصة وتراسات على الأسطح" },
      { en: "Gated community with park", ar: "مجتمع مسوّر مع حديقة" },
      { en: "Ready by end of 2027", ar: "جاهز بنهاية 2027" },
    ],
  },
  {
    slug: "lumiere-bay",
    name: "Lumière Bay",
    tagline: { en: "Resort-style residences on the water", ar: "مساكن على طراز المنتجعات على الماء" },
    description: {
      en: "A low-density waterfront address with only 96 residences, a private marina berth for select units and a wellness floor with spa, hammam and yoga studio.",
      ar: "عنوان على الواجهة المائية منخفض الكثافة بـ 96 مسكناً فقط، مع مراسٍ خاصة لوحدات مختارة وطابق للعافية يضم سبا وحماماً تقليدياً واستوديو يوغا.",
    },
    developerId: "azure",
    area: "business-bay",
    image: img.rooftopPool,
    gallery: [img.rooftopPool, img.livingArches, img.bathSpa, img.bedroomWarm],
    startingPrice: 3_100_000,
    handover: "Q2 2028",
    status: "under-construction",
    progress: 52,
    unitTypes: { en: "Apartments & penthouses", ar: "شقق وبنتهاوس" },
    bedrooms: "2–5",
    totalUnits: 96,
    coordinates: [25.1830, 55.2700],
    paymentPlan: [
      { stage: "booking", percent: 15, label: { en: "On booking", ar: "عند الحجز" } },
      { stage: "construction", percent: 45, label: { en: "During construction", ar: "خلال البناء" } },
      { stage: "handover", percent: 40, label: { en: "On handover", ar: "عند التسليم" } },
    ],
    highlights: [
      { en: "Only 96 residences", ar: "96 مسكناً فقط" },
      { en: "Private berths for select units", ar: "مراسٍ خاصة لوحدات مختارة" },
      { en: "Dedicated wellness floor", ar: "طابق مخصص للعافية" },
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function getDeveloper(id: string) {
  return developers.find((d) => d.id === id);
}
