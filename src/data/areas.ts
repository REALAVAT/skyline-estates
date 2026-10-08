import type { Area, AreaSlug } from "@/types";
import { areaNames } from "./area-names";
import { img } from "./images";

export const areas: Area[] = [
  {
    slug: "downtown-dubai",
    name: areaNames["downtown-dubai"],
    tagline: {
      en: "Life at the foot of the Burj Khalifa",
      ar: "الحياة عند سفح برج خليفة",
    },
    intro: {
      en: "The beating heart of the city, home to the world's tallest tower, The Dubai Mall and the Dubai Fountain.",
      ar: "قلب المدينة النابض، وموطن أطول برج في العالم ودبي مول ونافورة دبي.",
    },
    description: {
      en: "Downtown Dubai is a 500-acre mixed-use district built around the Burj Khalifa and the Boulevard. Residents enjoy walkable streets lined with cafés, five-star hotels, the Dubai Opera and direct access to The Dubai Mall. It is one of the most liquid markets in the city, with strong demand from end users and investors alike for its iconic views and short-stay rental potential.",
      ar: "وسط مدينة دبي حي متعدد الاستخدامات بمساحة 500 فدان، يتمحور حول برج خليفة والبوليفارد. يستمتع السكان بشوارع مناسبة للمشي تصطف على جانبيها المقاهي والفنادق الفاخرة ودار أوبرا دبي، مع وصول مباشر إلى دبي مول. ويُعد من أكثر الأسواق سيولة في المدينة، مع طلب قوي من المستخدمين النهائيين والمستثمرين بفضل إطلالاته الأيقونية وإمكانات التأجير قصير الأمد.",
    },
    image: img.burjKhalifa,
    gallery: [img.downtownPalms, img.skylineSunset, img.towerDetail],
    center: [25.1955, 55.2755],
    zoom: 15,
    avgSalePricePerSqft: 3150,
    avgApartmentPrice: 3_850_000,
    avgRent1Bed: 145_000,
    avgRent2Bed: 225_000,
    rentalYield: 6.1,
    priceChange: 11.4,
    lifestyle: [
      {
        icon: "shopping",
        title: { en: "World-class retail", ar: "تسوق عالمي المستوى" },
        text: {
          en: "Over 1,200 stores at The Dubai Mall, plus Souk Al Bahar on the waterfront.",
          ar: "أكثر من 1,200 متجر في دبي مول، إضافة إلى سوق البحار على الواجهة المائية.",
        },
      },
      {
        icon: "utensils",
        title: { en: "Dining & culture", ar: "مطاعم وثقافة" },
        text: {
          en: "Celebrity-chef restaurants, rooftop lounges and the Dubai Opera on your doorstep.",
          ar: "مطاعم لأشهر الطهاة وصالات على الأسطح ودار أوبرا دبي على بُعد خطوات.",
        },
      },
      {
        icon: "train",
        title: { en: "Connected", ar: "اتصال سلس" },
        text: {
          en: "Burj Khalifa/Dubai Mall Metro station and quick access to Sheikh Zayed Road.",
          ar: "محطة مترو برج خليفة/دبي مول ووصول سريع إلى شارع الشيخ زايد.",
        },
      },
      {
        icon: "building",
        title: { en: "Iconic addresses", ar: "عناوين أيقونية" },
        text: {
          en: "Branded residences and towers with direct Burj Khalifa and fountain views.",
          ar: "مساكن تحمل علامات تجارية فاخرة وأبراج بإطلالات مباشرة على برج خليفة والنافورة.",
        },
      },
    ],
    highlights: [
      { en: "Highest short-term rental demand in Dubai", ar: "أعلى طلب على التأجير قصير الأمد في دبي" },
      { en: "Walkable boulevard lifestyle", ar: "نمط حياة البوليفارد المناسب للمشي" },
      { en: "Strong capital appreciation since 2021", ar: "نمو قوي في قيمة رأس المال منذ 2021" },
    ],
    places: [
      { name: { en: "Burj Khalifa", ar: "برج خليفة" }, kind: "landmark", coordinates: [25.1972, 55.2744] },
      { name: { en: "The Dubai Mall", ar: "دبي مول" }, kind: "mall", coordinates: [25.1985, 55.2796] },
      { name: { en: "Burj Khalifa/Dubai Mall Metro", ar: "مترو برج خليفة/دبي مول" }, kind: "metro", coordinates: [25.2013, 55.2696] },
      { name: { en: "Burj Park", ar: "حديقة البرج" }, kind: "park", coordinates: [25.1939, 55.2738] },
      { name: { en: "Mediclinic City Hospital", ar: "مستشفى ميديكلينك سيتي" }, kind: "hospital", coordinates: [25.2290, 55.3220] },
    ],
  },
  {
    slug: "dubai-marina",
    name: areaNames["dubai-marina"],
    tagline: {
      en: "Waterfront living, yachts and sunsets",
      ar: "حياة على الواجهة البحرية، يخوت وغروب ساحر",
    },
    intro: {
      en: "A glittering canal city of high-rise towers wrapped around a 3 km marina, steps from JBR Beach.",
      ar: "مدينة قنوات متلألئة من الأبراج الشاهقة تحيط بمرسى طوله 3 كم، على بُعد خطوات من شاطئ جي بي آر.",
    },
    description: {
      en: "Dubai Marina is one of the world's largest man-made marinas, offering a vibrant waterfront lifestyle with promenade dining, yacht clubs and easy access to the beach at JBR. Its towers range from boutique buildings to landmark skyscrapers, making it a favourite for young professionals, families and investors seeking reliable rental yields.",
      ar: "دبي مارينا واحدة من أكبر المراسي الاصطناعية في العالم، وتوفر نمط حياة نابضاً على الواجهة البحرية مع مطاعم الممشى ونوادي اليخوت وسهولة الوصول إلى شاطئ جي بي آر. تتنوع أبراجها بين المباني الصغيرة الراقية وناطحات السحاب الشهيرة، ما يجعلها الخيار المفضل للمهنيين الشباب والعائلات والمستثمرين الباحثين عن عوائد إيجارية مستقرة.",
    },
    image: img.marinaDusk,
    gallery: [img.marinaTowers, img.rooftopPool, img.livingView],
    center: [25.0805, 55.1403],
    zoom: 15,
    avgSalePricePerSqft: 2150,
    avgApartmentPrice: 2_450_000,
    avgRent1Bed: 120_000,
    avgRent2Bed: 180_000,
    rentalYield: 6.8,
    priceChange: 9.2,
    lifestyle: [
      {
        icon: "waves",
        title: { en: "Beach & marina", ar: "الشاطئ والمرسى" },
        text: {
          en: "JBR Beach, Skydive Dubai and yacht charters minutes from home.",
          ar: "شاطئ جي بي آر وسكاي دايف دبي ورحلات اليخوت على بُعد دقائق من منزلك.",
        },
      },
      {
        icon: "utensils",
        title: { en: "Promenade dining", ar: "مطاعم الممشى" },
        text: {
          en: "Seven kilometres of Marina Walk lined with restaurants and cafés.",
          ar: "سبعة كيلومترات من ممشى المارينا تصطف على جانبيه المطاعم والمقاهي.",
        },
      },
      {
        icon: "train",
        title: { en: "Metro & tram", ar: "المترو والترام" },
        text: {
          en: "Two Metro stations and the Dubai Tram loop through the community.",
          ar: "محطتا مترو وترام دبي يمران عبر المجتمع.",
        },
      },
      {
        icon: "sun",
        title: { en: "Outdoor living", ar: "حياة في الهواء الطلق" },
        text: {
          en: "Running tracks, paddle boarding and sunset views over the Gulf.",
          ar: "مسارات للجري وركوب الألواح ومشاهد الغروب فوق الخليج.",
        },
      },
    ],
    highlights: [
      { en: "Among the highest rental yields in prime Dubai", ar: "من أعلى العوائد الإيجارية في دبي الراقية" },
      { en: "Walk-to-beach lifestyle", ar: "نمط حياة قريب من الشاطئ" },
      { en: "Deep resale and leasing market", ar: "سوق إعادة بيع وتأجير واسع" },
    ],
    places: [
      { name: { en: "JBR Beach", ar: "شاطئ جي بي آر" }, kind: "beach", coordinates: [25.0781, 55.1335] },
      { name: { en: "Dubai Marina Mall", ar: "دبي مارينا مول" }, kind: "mall", coordinates: [25.0763, 55.1405] },
      { name: { en: "DMCC Metro Station", ar: "محطة مترو أبراج بحيرات الجميرا" }, kind: "metro", coordinates: [25.0705, 55.1386] },
      { name: { en: "Marina Walk", ar: "ممشى المارينا" }, kind: "landmark", coordinates: [25.0838, 55.1427] },
      { name: { en: "Emirates International School", ar: "مدرسة الإمارات الدولية" }, kind: "school", coordinates: [25.0935, 55.1555] },
    ],
  },
  {
    slug: "palm-jumeirah",
    name: areaNames["palm-jumeirah"],
    tagline: {
      en: "The island address the world knows",
      ar: "عنوان الجزيرة الذي يعرفه العالم",
    },
    intro: {
      en: "Dubai's iconic palm-shaped island, with private-beach villas, branded residences and resort living.",
      ar: "جزيرة دبي الأيقونية على شكل نخلة، مع فلل بشواطئ خاصة ومساكن فاخرة تحمل علامات تجارية وحياة منتجعات.",
    },
    description: {
      en: "Palm Jumeirah is the ultimate trophy address. Signature villas on the fronds come with private beaches, while the trunk and crescent host branded residences, five-star resorts and beach clubs. Ultra-prime demand has made it the epicentre of Dubai's record-breaking sales, with limited supply supporting long-term value.",
      ar: "نخلة جميرا هي العنوان الأرقى على الإطلاق. تتميز الفلل الفريدة على سعف النخلة بشواطئ خاصة، بينما يحتضن الجذع والهلال مساكن فاخرة ومنتجعات خمس نجوم ونوادي شاطئية. جعل الطلب على العقارات فائقة الفخامة منها مركز صفقات دبي القياسية، مع معروض محدود يدعم القيمة على المدى الطويل.",
    },
    image: img.palmAerial,
    gallery: [img.burjAlArabAerial, img.villaPavilion, img.villaInfinity],
    center: [25.1150, 55.1380],
    zoom: 13,
    avgSalePricePerSqft: 4600,
    avgApartmentPrice: 5_200_000,
    avgVillaPrice: 38_000_000,
    avgRent1Bed: 210_000,
    avgRent2Bed: 320_000,
    rentalYield: 5.2,
    priceChange: 14.8,
    lifestyle: [
      {
        icon: "waves",
        title: { en: "Private beaches", ar: "شواطئ خاصة" },
        text: {
          en: "Frond villas with direct beach access and calm turquoise water.",
          ar: "فلل على السعف بوصول مباشر إلى الشاطئ ومياه فيروزية هادئة.",
        },
      },
      {
        icon: "utensils",
        title: { en: "Resort dining", ar: "مطاعم المنتجعات" },
        text: {
          en: "Beach clubs and fine dining at Atlantis, One&Only and FIVE.",
          ar: "نوادي شاطئية ومطاعم راقية في أتلانتس ووان آند أونلي وفايف.",
        },
      },
      {
        icon: "shopping",
        title: { en: "Nakheel Mall", ar: "نخيل مول" },
        text: {
          en: "Shopping, cinema and The View at The Palm observation deck.",
          ar: "تسوق وسينما ومنصة المراقبة ذا فيو آت ذا بالم.",
        },
      },
      {
        icon: "trees",
        title: { en: "Boardwalk", ar: "الممشى الخشبي" },
        text: {
          en: "An 11 km crescent boardwalk for running, cycling and sunset walks.",
          ar: "ممشى خشبي بطول 11 كم على الهلال للجري وركوب الدراجات ونزهات الغروب.",
        },
      },
    ],
    highlights: [
      { en: "Dubai's ultra-prime villa market", ar: "سوق الفلل فائقة الفخامة في دبي" },
      { en: "Limited land supply", ar: "معروض محدود من الأراضي" },
      { en: "Branded residences by global hotel groups", ar: "مساكن فاخرة من مجموعات فندقية عالمية" },
    ],
    places: [
      { name: { en: "Atlantis The Palm", ar: "أتلانتس النخلة" }, kind: "landmark", coordinates: [25.1304, 55.1171] },
      { name: { en: "Nakheel Mall", ar: "نخيل مول" }, kind: "mall", coordinates: [25.1121, 55.1395] },
      { name: { en: "Palm Monorail – Al Ittihad Park", ar: "مونوريل النخلة – حديقة الاتحاد" }, kind: "metro", coordinates: [25.1080, 55.1420] },
      { name: { en: "Palm West Beach", ar: "شاطئ النخلة الغربي" }, kind: "beach", coordinates: [25.1145, 55.1268] },
      { name: { en: "Al Ittihad Park", ar: "حديقة الاتحاد" }, kind: "park", coordinates: [25.1045, 55.1445] },
    ],
  },
  {
    slug: "business-bay",
    name: areaNames["business-bay"],
    tagline: {
      en: "Canal-side towers next to Downtown",
      ar: "أبراج على ضفاف القناة بجوار وسط المدينة",
    },
    intro: {
      en: "A dynamic canal-front district where sleek residential towers meet the city's business core.",
      ar: "حي ديناميكي على ضفاف القناة تلتقي فيه الأبراج السكنية الأنيقة بقلب الأعمال في المدينة.",
    },
    description: {
      en: "Business Bay sits along the Dubai Water Canal, minutes from Downtown and DIFC. It blends Grade A offices with modern residences, waterfront promenades and hotels. Competitive entry prices, new launches and strong rental demand from professionals make it one of the city's most popular investment hubs.",
      ar: "يمتد الخليج التجاري على طول قناة دبي المائية، على بُعد دقائق من وسط المدينة ومركز دبي المالي العالمي. يجمع بين المكاتب من الدرجة الأولى والمساكن العصرية والممشى المائي والفنادق. وتجعله أسعار الدخول التنافسية والمشاريع الجديدة والطلب الإيجاري القوي من المهنيين أحد أكثر مراكز الاستثمار شعبية في المدينة.",
    },
    image: img.glassTowers,
    gallery: [img.towerDetail, img.modernBlock, img.livingGlass],
    center: [25.1860, 55.2640],
    zoom: 15,
    avgSalePricePerSqft: 2350,
    avgApartmentPrice: 2_100_000,
    avgRent1Bed: 115_000,
    avgRent2Bed: 170_000,
    rentalYield: 7.0,
    priceChange: 10.1,
    lifestyle: [
      {
        icon: "building",
        title: { en: "Work nearby", ar: "قرب أماكن العمل" },
        text: {
          en: "Walk to offices in Bay Avenue and reach DIFC in under ten minutes.",
          ar: "امشِ إلى المكاتب في باي أفينيو وصِل إلى مركز دبي المالي في أقل من عشر دقائق.",
        },
      },
      {
        icon: "waves",
        title: { en: "Canal promenade", ar: "ممشى القناة" },
        text: {
          en: "Waterfront cycling tracks, water taxis and the Tolerance Bridge.",
          ar: "مسارات دراجات على الواجهة المائية وتاكسي مائي وجسر التسامح.",
        },
      },
      {
        icon: "utensils",
        title: { en: "Hotel dining", ar: "مطاعم الفنادق" },
        text: {
          en: "Rooftop bars and restaurants at Paramount, JW Marriott Marquis and more.",
          ar: "مطاعم وصالات على الأسطح في فنادق باراماونت وجي دبليو ماريوت ماركيز وغيرها.",
        },
      },
      {
        icon: "train",
        title: { en: "Central location", ar: "موقع مركزي" },
        text: {
          en: "Business Bay Metro and fast links to Al Khail Road and Sheikh Zayed Road.",
          ar: "مترو الخليج التجاري وروابط سريعة بشارع الخيل وشارع الشيخ زايد.",
        },
      },
    ],
    highlights: [
      { en: "Top rental yield among central districts", ar: "أعلى عائد إيجاري بين الأحياء المركزية" },
      { en: "Steady pipeline of new launches", ar: "تدفق مستمر من المشاريع الجديدة" },
      { en: "Minutes from Downtown and DIFC", ar: "دقائق من وسط المدينة ومركز دبي المالي" },
    ],
    places: [
      { name: { en: "Dubai Water Canal", ar: "قناة دبي المائية" }, kind: "landmark", coordinates: [25.1885, 55.2580] },
      { name: { en: "Business Bay Metro", ar: "مترو الخليج التجاري" }, kind: "metro", coordinates: [25.1913, 55.2603] },
      { name: { en: "Bay Avenue", ar: "باي أفينيو" }, kind: "mall", coordinates: [25.1867, 55.2672] },
      { name: { en: "Canal Park", ar: "حديقة القناة" }, kind: "park", coordinates: [25.1838, 55.2560] },
      { name: { en: "Hartland International School", ar: "مدرسة هارتلاند الدولية" }, kind: "school", coordinates: [25.1786, 55.3085] },
    ],
  },
  {
    slug: "jvc",
    name: areaNames.jvc,
    tagline: {
      en: "Family-friendly community with green parks",
      ar: "مجتمع عائلي مع حدائق خضراء",
    },
    intro: {
      en: "A master-planned community of townhouses, villas and low-rise apartments with more than 30 parks.",
      ar: "مجتمع مخطط بعناية يضم منازل متلاصقة وفللاً وشققاً منخفضة الارتفاع مع أكثر من 30 حديقة.",
    },
    description: {
      en: "Jumeirah Village Circle (JVC) offers exceptional value in a central location between Al Khail Road and Sheikh Mohammed Bin Zayed Road. Tree-lined streets, community parks, schools and neighbourhood retail make it ideal for families, while affordable entry prices deliver some of the highest rental yields in Dubai.",
      ar: "تقدم قرية جميرا الدائرية قيمة استثنائية في موقع مركزي بين شارع الخيل وشارع الشيخ محمد بن زايد. وتجعلها الشوارع المظللة بالأشجار والحدائق المجتمعية والمدارس ومتاجر الحي مثالية للعائلات، بينما تحقق أسعار الدخول المعقولة بعضاً من أعلى العوائد الإيجارية في دبي.",
    },
    image: img.modernBlock,
    gallery: [img.townhouseRow, img.villaLawn, img.livingSun],
    center: [25.0595, 55.2100],
    zoom: 15,
    avgSalePricePerSqft: 1250,
    avgApartmentPrice: 1_050_000,
    avgVillaPrice: 3_900_000,
    avgRent1Bed: 78_000,
    avgRent2Bed: 110_000,
    rentalYield: 7.9,
    priceChange: 8.6,
    lifestyle: [
      {
        icon: "trees",
        title: { en: "Parks everywhere", ar: "حدائق في كل مكان" },
        text: {
          en: "Over 30 landscaped parks, jogging tracks and play areas.",
          ar: "أكثر من 30 حديقة منسقة ومسارات للجري ومناطق لعب.",
        },
      },
      {
        icon: "school",
        title: { en: "Schools", ar: "المدارس" },
        text: {
          en: "Highly rated nurseries and international schools within the community.",
          ar: "حضانات ومدارس دولية عالية التقييم داخل المجتمع.",
        },
      },
      {
        icon: "shopping",
        title: { en: "Circle Mall", ar: "سيركل مول" },
        text: {
          en: "Supermarkets, cinema and dining at Circle Mall and neighbourhood plazas.",
          ar: "متاجر كبرى وسينما ومطاعم في سيركل مول وساحات الحي.",
        },
      },
      {
        icon: "sun",
        title: { en: "Community feel", ar: "روح المجتمع" },
        text: {
          en: "Quiet, low-rise streets with a welcoming neighbourhood atmosphere.",
          ar: "شوارع هادئة منخفضة الارتفاع بأجواء حي ودودة.",
        },
      },
    ],
    highlights: [
      { en: "Highest average rental yields in Dubai", ar: "أعلى متوسط عوائد إيجارية في دبي" },
      { en: "Affordable entry for first-time buyers", ar: "دخول ميسور للمشترين لأول مرة" },
      { en: "Ideal for families", ar: "مثالي للعائلات" },
    ],
    places: [
      { name: { en: "Circle Mall", ar: "سيركل مول" }, kind: "mall", coordinates: [25.0623, 55.2138] },
      { name: { en: "JSS International School", ar: "مدرسة جي إس إس الدولية" }, kind: "school", coordinates: [25.0567, 55.2070] },
      { name: { en: "JVC Central Park", ar: "حديقة قرية جميرا المركزية" }, kind: "park", coordinates: [25.0598, 55.2102] },
      { name: { en: "Mediclinic Parkview Hospital", ar: "مستشفى ميديكلينك باركفيو" }, kind: "hospital", coordinates: [25.0535, 55.2420] },
      { name: { en: "Dubai Hills Mall", ar: "دبي هيلز مول" }, kind: "mall", coordinates: [25.1022, 55.2394] },
    ],
  },
];

export const areaSlugs = areas.map((a) => a.slug);

export function getArea(slug: string): Area | undefined {
  return areas.find((a) => a.slug === slug);
}

export function getAreaOrThrow(slug: AreaSlug): Area {
  const area = getArea(slug);
  if (!area) throw new Error(`Unknown area: ${slug}`);
  return area;
}
