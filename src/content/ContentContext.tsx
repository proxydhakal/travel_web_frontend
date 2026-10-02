import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Activity, Country, Destination, GalleryItem, Story, Testimonial, TripPackage } from "../types";

export type Company = {
  name: string;
  short: string;
  slogan: string;
  owner: string;
  ownerRole: string;
  phone: string;
  phoneHref: string;
  phoneLabel: string;
  phoneAlt: string;
  phoneAltHref: string;
  phoneAltLabel: string;
  whatsapp: string;
  email: string;
  address: string;
  license: string;
  regd: string;
  hours: string;
  reviews: string;
  since: number;
  travelers: string;
  lat: number;
  lng: number;
};

export type MenuColumn = { title: string; links: { label: string; to: string }[] };
export type Reason = { title: string; text: string };
export type Social = { label: string; href: string };

export type AboutContent = {
  heroImage: string;
  heading: string;
  paragraphs: string[];
  mission: string;
  vision: string;
  promise: string;
  values: { title: string; text: string }[];
};

export type ContactPage = { heading: string; intro: string };
export type SeoConfig = { title: string; description: string; keywords: string; favicon: string; logo: string; ogImage: string };
export type TeamMember = { id: number; name: string; role: string; bio: string; image: string; published?: boolean };
export type LegalDocument = { slug: string; title: string; summary: string; body: string };
export type CmsPage = {
  slug: string;
  group: "company" | "guide" | string;
  title: string;
  cover: string;
  excerpt: string;
  body: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
};

export type SiteContent = {
  company: Company;
  socials: Social[];
  destinationMenu: MenuColumn[];
  reasons: Reason[];
  about: AboutContent;
  contactPage: ContactPage;
  seo: SeoConfig;
  countries: Country[];
  team: TeamMember[];
  legalDocuments: LegalDocument[];
  pages: CmsPage[];
  packages: TripPackage[];
  destinations: Destination[];
  activities: Activity[];
  testimonials: Testimonial[];
  galleryItems: GalleryItem[];
  galleryCategories: string[];
  stories: Story[];
  getPackage: (slug?: string) => TripPackage | undefined;
  getDestination: (slug?: string) => Destination | undefined;
  getStory: (slug?: string) => Story | undefined;
  packagesForDestination: (slug: string) => TripPackage[];
  relatedPackages: (current: TripPackage, limit?: number) => TripPackage[];
};

type State = {
  ready: boolean;
  error: string;
  data: SiteContent | null;
  reload: () => void;
};

const ContentContext = createContext<State | null>(null);

const emptyCompany: Company = {
  name: "",
  short: "",
  slogan: "",
  owner: "",
  ownerRole: "",
  phone: "",
  phoneHref: "",
  phoneLabel: "",
  phoneAlt: "",
  phoneAltHref: "",
  phoneAltLabel: "",
  whatsapp: "",
  email: "",
  address: "",
  license: "",
  regd: "",
  hours: "",
  reviews: "",
  since: 2016,
  travelers: "",
  lat: 27.7,
  lng: 85.3,
};

function withHelpers(raw: Omit<SiteContent, "getPackage" | "getDestination" | "getStory" | "packagesForDestination" | "relatedPackages">): SiteContent {
  const packages = raw.packages;
  const about = Object.assign(
    { heroImage: "/images/ebc.jpg", heading: "About us", paragraphs: [], mission: "", vision: "", promise: "", values: [] },
    raw.about,
  );
  const contactPage = Object.assign({ heading: "Contact us", intro: "" }, raw.contactPage);
  const seo = Object.assign({ title: "", description: "", keywords: "", favicon: "/logo.svg", logo: "/logo.svg", ogImage: "" }, raw.seo);
  return {
    ...raw,
    company: { ...emptyCompany, ...raw.company },
    about,
    contactPage,
    seo,
    countries: raw.countries || [],
    team: raw.team || [],
    legalDocuments: raw.legalDocuments || [],
    pages: raw.pages || [],
    getPackage: (slug) => packages.find((item) => item.slug === slug),
    getDestination: (slug) => raw.destinations.find((item) => item.slug === slug),
    getStory: (slug) => raw.stories.find((item) => item.slug === slug),
    packagesForDestination: (slug) => packages.filter((item) => item.destinationSlug === slug),
    relatedPackages: (current, limit = 3) => {
      const same = packages.filter((item) => item.slug !== current.slug && item.destinationSlug === current.destinationSlug);
      const rest = packages.filter((item) => item.slug !== current.slug && item.destinationSlug !== current.destinationSlug);
      return [...same, ...rest].slice(0, limit);
    },
  };
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [raw, setRaw] = useState<SiteContent | null>(null);
  const [error, setError] = useState("");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let active = true;
    setError("");
    fetch("/api/content")
      .then(async (response) => {
        if (!response.ok) throw new Error("The content service did not respond.");
        return response.json();
      })
      .then((json) => {
        if (active) setRaw(withHelpers(json));
      })
      .catch((reason: Error) => {
        if (active) setError(reason.message || "Could not load the site.");
      });
    return () => {
      active = false;
    };
  }, [tick]);

  const value = useMemo<State>(
    () => ({
      ready: Boolean(raw),
      error,
      data: raw,
      reload: () => {
        setRaw(null);
        setTick((value) => value + 1);
      },
    }),
    [raw, error],
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContentState() {
  const value = useContext(ContentContext);
  if (!value) throw new Error("Content is unavailable.");
  return value;
}

export function useContent() {
  const value = useContentState();
  if (!value.data) throw new Error("Content is still loading.");
  return value.data;
}
