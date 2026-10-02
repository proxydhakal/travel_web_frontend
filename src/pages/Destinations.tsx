import { useMemo, useState } from "react";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { DestinationCard } from "../components/DestinationCard";
import { useContent } from "../content/ContentContext";
import { usePageMeta } from "../hooks/usePageMeta";
import { cn } from "../utils/format";

const categories = ["All", "Mountains", "Cities", "Adventure", "Cultural", "Wildlife", "Trekking"];

export default function Destinations() {
  const { destinations } = useContent();
  usePageMeta("Destinations", "Explore Nepal, Bhutan, and Tibet: Everest, Annapurna, Langtang, Mustang, Chitwan, and the sacred routes beyond.");
  const [category, setCategory] = useState("All");
  const visible = useMemo(
    () => destinations.filter((item) => category === "All" || item.categories.includes(category)),
    [category, destinations],
  );

  return (
    <>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Destinations" }]} />
      <section className="container-page py-10">
        <p className="eyebrow">Nepal, Bhutan, and Tibet</p>
        <h1 className="display-title mt-1 max-w-3xl">Destinations worth the journey</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">
          Mountains, cities, wildlife, and pilgrimage routes planned by a Kathmandu team that still walks them.
        </p>
        <div className="mt-6 flex gap-2 overflow-auto pb-2" role="tablist" aria-label="Destination categories">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={category === item}
              onClick={() => setCategory(item)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-sm font-semibold",
                category === item ? "bg-primary text-white" : "bg-surface text-ink hover:bg-sand",
              )}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((destination) => (
            <DestinationCard key={destination.slug} destination={destination} variant="rich" />
          ))}
        </div>
      </section>
    </>
  );
}
