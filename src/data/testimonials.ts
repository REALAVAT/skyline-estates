import type { Testimonial } from "@/types";
import { img } from "./images";

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Daniel Foster",
    role: { en: "Bought a villa on Palm Jumeirah", ar: "اشترى فيلا في نخلة جميرا" },
    quote: {
      en: "Omar and the team found us an off-market frond villa within three weeks. Every detail, from negotiation to transfer at the land department, was handled flawlessly.",
      ar: "وجد لنا عمر والفريق فيلا على سعف النخلة غير معروضة في السوق خلال ثلاثة أسابيع. تمت معالجة كل التفاصيل، من التفاوض إلى نقل الملكية في دائرة الأراضي، بإتقان تام.",
    },
    avatar: img.personA,
    rating: 5,
  },
  {
    id: "t2",
    name: "Mariam Al Suwaidi",
    role: { en: "Investor, three Downtown apartments", ar: "مستثمرة، ثلاث شقق في وسط المدينة" },
    quote: {
      en: "Clear numbers, honest advice and no pressure. Sophie helped me compare yields across buildings and my units were leased within days of handover.",
      ar: "أرقام واضحة ونصائح صادقة ودون أي ضغط. ساعدتني صوفي في مقارنة العوائد بين المباني، وتم تأجير وحداتي خلال أيام من التسليم.",
    },
    avatar: img.personD,
    rating: 5,
  },
  {
    id: "t3",
    name: "Anna Kowalski",
    role: { en: "Rented in Dubai Marina", ar: "استأجرت في دبي مارينا" },
    quote: {
      en: "Relocating from Warsaw felt overwhelming until Elena took over. She arranged virtual viewings, negotiated the cheques and had the keys ready the day we landed.",
      ar: "بدا الانتقال من وارسو مرهقاً حتى تولت إيلينا الأمر. رتبت جولات افتراضية وتفاوضت على الشيكات وجهزت المفاتيح في يوم وصولنا.",
    },
    avatar: img.personC,
    rating: 5,
  },
  {
    id: "t4",
    name: "Karim Nassar",
    role: { en: "Off-plan buyer, Business Bay", ar: "مشترٍ على الخارطة، الخليج التجاري" },
    quote: {
      en: "Rahul secured launch pricing and a better payment plan than I could get directly from the developer. Professional, responsive and genuinely knowledgeable.",
      ar: "حصل لي راهول على سعر الإطلاق وخطة سداد أفضل مما كنت سأحصل عليه مباشرة من المطور. محترف وسريع الاستجابة وذو معرفة حقيقية.",
    },
    avatar: img.personE,
    rating: 5,
  },
  {
    id: "t5",
    name: "Sarah Mitchell",
    role: { en: "Sold a penthouse in Dubai Marina", ar: "باعت بنتهاوس في دبي مارينا" },
    quote: {
      en: "The photography, marketing and buyer screening were on another level. We achieved above the asking price in under a month.",
      ar: "كان التصوير والتسويق وفرز المشترين على مستوى آخر. حققنا سعراً أعلى من السعر المطلوب في أقل من شهر.",
    },
    avatar: img.personB,
    rating: 5,
  },
];
