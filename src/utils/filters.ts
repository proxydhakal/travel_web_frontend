import type { TripPackage } from "../types";

export type SortKey = "recommended" | "price-asc" | "price-desc" | "rating" | "newest";

export type PackageFilters = {
  q: string;
  country: string;
  destinations: string[];
  activities: string[];
  styles: string[];
  difficulties: string[];
  duration: string;
  minPrice: number;
  maxPrice: number;
  rating: number;
  sort: SortKey;
};

export const priceBounds = { min: 0, max: 3000 };

export const durationOptions = [
  { id: "", label: "Any length" },
  { id: "1-5", label: "1–5 days" },
  { id: "6-10", label: "6–10 days" },
  { id: "11-15", label: "11–15 days" },
  { id: "16+", label: "16 days or more" },
];

export function emptyFilters(): PackageFilters {
  return {
    q: "",
    country: "",
    destinations: [],
    activities: [],
    styles: [],
    difficulties: [],
    duration: "",
    minPrice: priceBounds.min,
    maxPrice: priceBounds.max,
    rating: 0,
    sort: "recommended",
  };
}

export function filtersFromParams(params: URLSearchParams): PackageFilters {
  const base = emptyFilters();
  const num = (key: string, fallback: number) => {
    const raw = params.get(key);
    if (raw == null || raw === "") return fallback;
    const value = Number(raw);
    return Number.isFinite(value) ? value : fallback;
  };
  const list = (key: string) => {
    const value = params.get(key);
    return value ? value.split(",").filter(Boolean) : [];
  };
  const sort = params.get("sort");
  const allowed: SortKey[] = ["recommended", "price-asc", "price-desc", "rating", "newest"];
  return {
    ...base,
    q: params.get("q") ?? "",
    country: params.get("country") ?? "",
    destinations: list("destination"),
    activities: list("activity"),
    styles: list("style"),
    difficulties: list("difficulty"),
    duration: params.get("duration") ?? "",
    minPrice: num("min", priceBounds.min),
    maxPrice: num("max", priceBounds.max),
    rating: num("rating", 0),
    sort: allowed.includes(sort as SortKey) ? (sort as SortKey) : "recommended",
  };
}

export function filtersToParams(filters: PackageFilters) {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.country) params.set("country", filters.country);
  if (filters.destinations.length) params.set("destination", filters.destinations.join(","));
  if (filters.activities.length) params.set("activity", filters.activities.join(","));
  if (filters.styles.length) params.set("style", filters.styles.join(","));
  if (filters.difficulties.length) params.set("difficulty", filters.difficulties.join(","));
  if (filters.duration) params.set("duration", filters.duration);
  if (filters.minPrice > priceBounds.min) params.set("min", String(filters.minPrice));
  if (filters.maxPrice < priceBounds.max) params.set("max", String(filters.maxPrice));
  if (filters.rating) params.set("rating", String(filters.rating));
  if (filters.sort !== "recommended") params.set("sort", filters.sort);
  return params;
}

function matchesDuration(days: number, bucket: string) {
  if (!bucket) return true;
  if (bucket === "1-5") return days <= 5;
  if (bucket === "6-10") return days >= 6 && days <= 10;
  if (bucket === "11-15") return days >= 11 && days <= 15;
  if (bucket === "16+") return days >= 16;
  return true;
}

export function applyFilters(list: TripPackage[], filters: PackageFilters) {
  const query = filters.q.trim().toLowerCase();
  const filtered = list.filter((item) => {
    if (query) {
      const haystack = [item.title, item.destination, item.country, item.region, item.summary, ...item.activities, ...item.styles]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    if (filters.country && item.country !== filters.country) return false;
    if (filters.destinations.length && !filters.destinations.includes(item.destinationSlug)) return false;
    if (filters.activities.length && !filters.activities.some((activity) => item.activities.includes(activity))) return false;
    if (filters.styles.length && !filters.styles.some((style) => item.styles.includes(style))) return false;
    if (filters.difficulties.length && !filters.difficulties.includes(item.difficulty)) return false;
    if (!matchesDuration(item.durationDays, filters.duration)) return false;
    if (item.price < filters.minPrice || item.price > filters.maxPrice) return false;
    if (filters.rating && item.rating < filters.rating) return false;
    return true;
  });

  const sorted = [...filtered];
  switch (filters.sort) {
    case "price-asc":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      sorted.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
      break;
    case "newest":
      sorted.sort((a, b) => b.created.localeCompare(a.created));
      break;
    default:
      sorted.sort((a, b) => Number(b.bestseller) - Number(a.bestseller) || b.rating - a.rating);
  }
  return sorted;
}
