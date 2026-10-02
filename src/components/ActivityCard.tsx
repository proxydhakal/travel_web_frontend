import type { Activity } from "../types";
import { useContent } from "../content/ContentContext";
import { ImageCard, RichImageCard } from "./ImageCard";

export function ActivityCard({ activity, variant = "rich" }: { activity: Activity; variant?: "overlay" | "rich" }) {
  const { packages } = useContent();
  const count = packages.filter((item) => item.activities.includes(activity.slug)).length;
  const meta = count === 0 ? "Plan with us" : count === 1 ? "1 package" : `${count} packages`;
  const href = count === 0 ? `/contact?activity=${encodeURIComponent(activity.name)}` : `/packages?activity=${activity.slug}`;
  if (variant === "overlay") {
    return <ImageCard href={href} image={activity.image} alt={activity.name} title={activity.name} subtitle={meta} />;
  }
  return (
    <RichImageCard href={href} image={activity.image} alt={activity.name} title={activity.name} text={activity.summary} meta={meta} />
  );
}
