export type Difficulty = "Easy" | "Moderate" | "Challenging" | "Strenuous";

export type ItineraryDay = {
  day: number;
  title: string;
  description: string;
};

export type Faq = {
  question: string;
  answer: string;
};

export type Country = {
  id: number;
  slug: string;
  name: string;
  summary: string;
  description: string;
  image: string;
  published?: boolean;
};

export type TripPackage = {
  slug: string;
  title: string;
  destination: string;
  destinationSlug: string;
  destinationId?: number | null;
  countryId?: number | null;
  activityId?: number | null;
  country: "Nepal" | "Bhutan" | "Tibet" | string;
  region: string;
  durationDays: number;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  groupSize: number;
  maxAltitude: string;
  difficulty: Difficulty;
  starts: string;
  ends: string;
  bestSeason: string;
  activities: string[];
  styles: string[];
  image: string;
  gallery: string[];
  summary: string;
  overview: string;
  highlights: string[];
  includes: string[];
  excludes: string[];
  itinerary: ItineraryDay[];
  faqs: Faq[];
  bestseller?: boolean;
  published?: boolean;
  created: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogImage?: string;
};

export type Destination = {
  id?: number;
  slug: string;
  name: string;
  countryId?: number | null;
  country: string;
  categories: string[];
  image: string;
  gallery: string[];
  summary: string;
  introduction: string;
  highlights: string[];
  bestTime: string;
  thingsToDo: string[];
  travelInfo: string[];
  lat: number;
  lng: number;
  published?: boolean;
};

export type Activity = {
  id?: number;
  slug: string;
  name: string;
  countryId?: number | null;
  image: string;
  summary: string;
  description: string;
  published?: boolean;
};

export type Testimonial = {
  id: string;
  name: string;
  country: string;
  rating: number;
  trip: string;
  quote: string;
  source: string;
  date: string;
  published?: boolean;
};

export type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  title: string;
  category: "Destinations" | "Adventure" | "Culture" | "Nature" | "People" | "Tours" | string;
  tall?: boolean;
  published?: boolean;
};

export type Story = {
  slug: string;
  title: string;
  date: string;
  author: string;
  image: string;
  excerpt: string;
  body: string[];
  published?: boolean;
};
