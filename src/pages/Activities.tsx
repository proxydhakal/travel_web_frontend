import { ActivityCard } from "../components/ActivityCard";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { useContent } from "../content/ContentContext";
import { usePageMeta } from "../hooks/usePageMeta";

export default function Activities() {
  const { activities } = useContent();
  usePageMeta("Activities", "Trekking, rafting, safari, mountain flights, cycling, camping, and cultural tours across the Himalaya.");
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Activities" }]} />
      <section className="container-page py-10">
        <p className="eyebrow">Ways to travel</p>
        <h1 className="display-title mt-1">Activities</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">
          Most journeys are treks. The same desk also arranges rivers, wildlife, flights, and city days so a holiday can hold more than one pace.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {activities.map((activity) => (
            <div key={activity.slug} id={activity.slug}>
              <ActivityCard activity={activity} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
