import type { Destination } from "../types";
import { useContent } from "../content/ContentContext";
import { ImageCard, RichImageCard } from "./ImageCard";

export function DestinationCard({ destination, variant = "overlay" }: { destination: Destination; variant?: "overlay" | "rich" }) {
  const { packagesForDestination } = useContent();
  const count = packagesForDestination(destination.slug).length;
  const meta = count === 1 ? "1 package" : `${count} packages`;
  if (variant === "rich") {
    return (
      <RichImageCard
        href={`/destinations/${destination.slug}`}
        image={destination.image}
        alt={`${destination.name}, ${destination.country}`}
        eyebrow={destination.country}
        title={destination.name}
        text={destination.summary}
        meta={meta}
      />
    );
  }
  return (
    <ImageCard
      href={`/destinations/${destination.slug}`}
      image={destination.image}
      alt={`${destination.name}, ${destination.country}`}
      title={destination.name}
      subtitle={`${destination.country} · ${meta}`}
    />
  );
}
