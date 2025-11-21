import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from "react-icons/fa"; //Social Icons for Footer

import { LatestOfferCardType } from "@/types/home/latestOfferType";
import { HelperCard } from "@/types/home/meetHelpersType";
import { OfferListType } from "@/types/home/offerListType"; //Type of Offer Card Data
//nav Links Data
export const navLinks = [
  {
    name: "Home",
    link: "#",
  },
  {
    name: "Services",
    link: "#",
  },
  {
    name: "browse",
    link: "#",
  },
  {
    name: "contact",
    link: "#",
  },
];

// city names for  search service of hero section
export const cityOptions: string[] = [
  "Casablanca",
  "Marrakech",
  "Rabat",
  "Fes",
  "Tangier",
  "Agadir",
  "Oujda",
  "Kenitra",
  "Tetouan",
  "Safi",
  "Meknes",
  "El Jadida",
  "Nador",
  "Taza",
  "Settat",
  "Larache",
  "Beni Mellal",
  "Ksar El Kebir",
  "Khouribga",
  "Essaouira",
  "Ouarzazate",
  "Chefchaouen",
  "Taroudant",
];

export const popularServices = [
  "Plumbing",
  "Electrical",
  "Cleaning",
  "AC Repair",
  "Painting",
  "Handyman",
  "Gardening",
  "Security",
  "Elderly Care",
  "Men's Salon Services",
  "Event Setup",
  "Babysitting",
  "Window & Glass",
  "Moving & Transport",
  "Appliance Repair",
  "Vehicle Cleaning",
  "Water Tank Cleaning",
  "Women's Salon",
  "Renovation",
  "Solar Panel Services",
  "Pest Control",
];

//Browse by need section data
export const browseByNeed = [
  {
    img: "/home/browseByNeedImages/c1.png",
    text: "c1",
    name: "Plumbing",
    backgroundColor: "#EFF6FF",
  },
  {
    img: "/home/browseByNeedImages/c2.png",
    text: "c2",
    name: "Electrical",
    backgroundColor: "#FEFCE8",
  },
  {
    img: "/home/browseByNeedImages/c3.png",
    text: "c3",
    name: "Cleaning",
    backgroundColor: "#EBF6FF",
  },
  {
    img: "/home/browseByNeedImages/c4.png",
    text: "c4",
    name: "AC Repair",
    backgroundColor: "#CFFAFE",
  },
  {
    img: "/home/browseByNeedImages/c5.png",
    text: "c5",
    name: "Painting",
    backgroundColor: "#FAF5FF",
  },
  {
    img: "/home/browseByNeedImages/c6.png",
    text: "c6",
    name: "Handyman",
    backgroundColor: "#FFF7ED",
  },
  {
    img: "/home/browseByNeedImages/c7.png",
    text: "c7",
    name: "Gardening",
    backgroundColor: "#ECFEEC",
  },
  {
    img: "/home/browseByNeedImages/c8.png",
    text: "c8",
    name: "Security",
    backgroundColor: "#F0F1F2",
  },
  {
    img: "/home/browseByNeedImages/c9.png",
    text: "c9",
    name: "Elderly Care",
    backgroundColor: "#EFF6FF",
  },
  {
    img: "/home/browseByNeedImages/c10.png",
    text: "c10",
    name: "Men's Salon Services",
    backgroundColor: "#EFF6FF",
  },
  {
    img: "/home/browseByNeedImages/c11.png",
    text: "c11",
    name: "Event Setup",
    backgroundColor: "#FAF5FF",
  },
  {
    img: "/home/browseByNeedImages/c12.png",
    text: "c12",
    name: "Babysitting",
    backgroundColor: "#FAF5FF",
  },
  {
    img: "/home/browseByNeedImages/c13.png",
    text: "c13",
    name: "Window & Glass",
    backgroundColor: "#EFF6FF",
  },
  {
    img: "/home/browseByNeedImages/c14.png",
    text: "c14",
    name: "Moving & Transport",
    backgroundColor: "#FFFBEB",
  },
  {
    img: "/home/browseByNeedImages/c16.png",
    text: "c16",
    name: "Appliance Repair",
    backgroundColor: "#F9FAFB",
  },
  {
    img: "/home/browseByNeedImages/c17.png",
    text: "c17",
    name: "Vehicle Cleaning",
    backgroundColor: "#EEF2FF",
  },
  {
    img: "/home/browseByNeedImages/c18.png",
    text: "c18",
    name: "Water Tank Cleaning",
    backgroundColor: "#EFF6FF",
  },
  {
    img: "/home/browseByNeedImages/c19.png",
    text: "c19",
    name: "Women's Salon",
    backgroundColor: "#FFF8FD",
  },
  {
    img: "/home/browseByNeedImages/c20.png",
    text: "c20",
    name: "Renovation",
    backgroundColor: "#FFF2E5",
  },
  {
    img: "/home/browseByNeedImages/c21.png",
    text: "c21",
    name: "Solar Panel Services",
    backgroundColor: "#FFFBEB",
  },
  {
    img: "/home/browseByNeedImages/c22.png",
    text: "c22",
    name: "Pest Control",
    backgroundColor: "#E8F2FB",
  },
];

//Card Data of Offer Section
export const OfferList: OfferListType[] = [
  {
    image: "/home/whatWeOffer/offerImage3.png",
    alt: "",
    heading: "Gardening Services",
    paragraph: "Starting from 100 MAD",
  },
  {
    image: "/home/whatWeOffer/offerImage2.png",
    alt: "",
    heading: "AC Installation & Repair",
    paragraph: "Starting from 200 MAD",
  },
  {
    image: "/home/whatWeOffer/offerImage.png",
    alt: "",
    heading: "Deep House Cleaning",
    paragraph: "Starting from 150 MAD",
  },
  {
    image: "/home/whatWeOffer/offerImage3.png",
    alt: "",
    heading: "Beauty & Spa Services",
    paragraph: "Starting from 100 MAD",
  },
];

export const FAQListKeys = {
  user: ["faqList.user.q1", "faqList.user.q2", "faqList.user.q3", "faqList.user.q4"],
  provider: [
    "faqList.provider.q1",
    "faqList.provider.q2",
    "faqList.provider.q3",
    "faqList.provider.q4",
  ],
};

export const howHomezupWorksData = [
  {
    id: "01",
    heading: "Select your city & service",
    description: "Use the search bar to find the right category in your area.",
  },
  {
    id: "02",
    heading: "Browse trusted providers",
    description: "See ratings, reviews, and service details at a glance.",
  },
  {
    id: "03",
    heading: "Call or message directly",
    description: "Tap a button to contact the provider via WhatsApp or phone.",
  },
];

//latest offer data

export const latestOfferData: LatestOfferCardType[] = [
  {
    img: "/home/latestOffers/offer1.png",
    featured: true, //for future use
    active: false, //for future use
    avatar: "/home/latestOffers/avatar1.png",
    name: "Ahmed K.",
    location: "Casablanca",
    serviceType: "Cleaning",
    serviceName: "Deep Kitchen Cleaning Service",
    rating: "4.8(34)",
    price: "250",
  },
  {
    img: "/home/latestOffers/offer2.png",
    featured: false,
    active: false,
    avatar: "/home/latestOffers/avatar2.png",
    name: "Leila H.",
    location: "Casablanca",
    serviceType: "Home Salon",
    serviceName: "Pest Control Treatment",
    rating: "4.8(34)",
    price: "350",
  },
  {
    img: "/home/latestOffers/offer3.png",
    featured: false,
    active: true,
    avatar: "/home/latestOffers/avatar1.png",
    name: "Karim M.",
    location: "Casablanca",
    serviceType: "Plumbing",
    serviceName: "Emergency Plumbing Repair",
    rating: "4.8(34)",
    price: "250",
  },
  {
    img: "/home/latestOffers/offer4.png",
    featured: false,
    active: false,
    avatar: "/home/latestOffers/avatar1.png",
    name: "Youssef B.",
    location: "Casablanca",
    serviceType: "Painting",
    serviceName: "Professional Painting Service",
    rating: "4.8(34)",
    price: "5,000",
  },
];

export const meetHelpersData: HelperCard[] = [
  {
    img: "/home/meetHelpers/helper1.png",
    name: "Hassan M.",
    jobDone: "98 jobs completed",
    location: "Rabat",
    rating: "4.9",
    category: ["Electrical", "AC Repair"],
    color: "#018CFA",
  },
  {
    img: "/home/meetHelpers/helper2.png",
    name: "Sophie Bennett",
    jobDone: "98 jobs completed",
    location: "Rabat",
    rating: "4.9",
    category: ["Cleaning", "Organization"],
    color: "#166534",
  },
  {
    img: "/home/meetHelpers/helper5.png",
    name: "Omar B.",
    jobDone: "98 jobs completed",
    location: "Rabat",
    rating: "4.9",
    category: ["Plumbing", "Maintenance"],
    color: "#018CFA",
  },
  {
    img: "/home/meetHelpers/helper4.png",
    name: "Nadia A.",
    jobDone: "98 jobs completed",
    location: "Rabat",
    rating: "4.9",
    category: ["Salon", "Beauty"],
    color: "#9D174D",
  },
  {
    img: "/home/meetHelpers/helper1.png",
    name: "Hassan M.",
    jobDone: "98 jobs completed",
    location: "Rabat",
    rating: "4.9",
    category: ["Electrical", "AC Repair"],
    color: "#018CFA",
  },
];

//Testimonial Card Data
export const testimonialList = [
  {
    key: "testimonials.t1",
    img: "/home/testimonialImages/avatar (4).png",
  },
  {
    key: "testimonials.t2",
    img: "/home/testimonialImages/avatar (2).png",
  },
  {
    key: "testimonials.t3",
    img: "/home/testimonialImages/avatar (3).png",
  },
  {
    key: "testimonials.t4",
    img: "/home/testimonialImages/avatar (4).png",
  },
  {
    key: "testimonials.t5",
    img: "/home/testimonialImages/avatar (2).png",
  },
  {
    key: "testimonials.t6",
    img: "/home/testimonialImages/avatar (3).png",
  },
];

//footer section constants
export const footerLinks = [
  {
    titleKey: "footer.forCustomers.title",
    links: [
      { labelKey: "footer.forCustomers.findServices", href: "/" },
      { labelKey: "footer.forCustomers.browseProviders", href: "/" },
      { labelKey: "footer.forCustomers.howItWorks", href: "/" },
      { labelKey: "footer.forCustomers.safetyGuide", href: "/" },
      { labelKey: "footer.forCustomers.faqs", href: "/" },
    ],
  },
  {
    titleKey: "footer.forProviders.title",
    links: [
      { labelKey: "footer.forProviders.joinAsProvider", href: "/" },
      { labelKey: "footer.forProviders.providerLogin", href: "/" },
      { labelKey: "footer.forProviders.faqs", href: "/" },
    ],
  },
  {
    titleKey: "footer.aboutHomezup.title",
    links: [
      { labelKey: "footer.aboutHomezup.aboutUs", href: "/" },
      { labelKey: "footer.aboutHomezup.contactUs", href: "/" },
      { labelKey: "footer.aboutHomezup.cookiesPolicy", href: "/" },
      { labelKey: "footer.aboutHomezup.privacyPolicy", href: "/" },
      { labelKey: "footer.aboutHomezup.termsOfService", href: "/" },
    ],
  },
];

//Social Icons and their links for footer
export const socialLogos = [
  { Icon: FaFacebookF, link: "#" },
  { Icon: FaInstagram, link: "#" },
  { Icon: FaTwitter, link: "#" },
  { Icon: FaLinkedinIn, link: "#" },
];
