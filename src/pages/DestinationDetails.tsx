import { Link, useParams } from "react-router-dom";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { ButtonLink } from "../components/Button";
import { Media } from "../components/Media";
import { PackageCard } from "../components/PackageCard";
import { ArrowList } from "../components/SectionHeading";
import NotFound from "./NotFound";
import { useContent } from "../content/ContentContext";
import { usePageMeta } from "../hooks/usePageMeta";

export default function DestinationDetails() {
  const { slug } = useParams();
  const { getDestination, packagesForDestination } = useContent();
  const destination = getDestination(slug);
  const trips = destination ? packagesForDestination(destination.slug) : [];
  usePageMeta(destination ? destination.name : "Destination not found", destination ? destination.summary : "This destination is not listed.");

  if (!destination) return <NotFound />;

  const map = `https://www.openstreetmap.org/export/embed.html?bbox=${destination.lng - 0.6}%2C${destination.lat - 0.4}%2C${destination.lng + 0.6}%2C${destination.lat + 0.4}&layer=mapnik&marker=${destination.lat}%2C${destination.lng}`;

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", to: "/" },
          { label: "Destinations", to: "/destinations" },
          { label: destination.country, to: "/destinations" },
          { label: destination.name },
        ]}
      />
      <article className="container-page py-8">
        <Media src={destination.image} alt={`${destination.name}, ${destination.country}`} className="h-72 rounded-2xl sm:h-[460px]" priority />
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.14em] text-sun">{destination.country}</p>
        <h1 className="mt-1 text-4xl font-extrabold uppercase tracking-tight">{destination.name}</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-muted">{destination.introduction}</p>

        <section className="mt-10 max-w-3xl">
          <h2 className="text-2xl font-bold">Highlights</h2>
          <div className="mt-4">
            <ArrowList items={destination.highlights} />
          </div>
          <h2 className="mt-8 text-2xl font-bold">Best time to visit</h2>
          <p className="mt-3 text-sm leading-7 text-muted">{destination.bestTime}</p>
          <h2 className="mt-8 text-2xl font-bold">Things to do</h2>
          <div className="mt-4">
            <ArrowList items={destination.thingsToDo} />
          </div>
        </section>

        <section className="mt-12">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-2xl font-bold">Popular packages</h2>
            <Link to={`/packages?destination=${destination.slug}`} className="text-sm font-semibold text-primary">
              View all
            </Link>
          </div>
          {trips.length === 0 ? (
            <div className="mt-4 rounded-2xl bg-sand p-6">
              <p className="text-sm leading-6 text-muted">This region is planned privately. Tell us your dates and we will draw the route.</p>
              <ButtonLink to={`/contact?intent=plan&destination=${encodeURIComponent(destination.name)}`} className="mt-4">
                Plan this journey
              </ButtonLink>
            </div>
          ) : (
            <div className="mt-6 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {trips.slice(0, 6).map((trip) => (
                <PackageCard key={trip.slug} trip={trip} />
              ))}
            </div>
          )}
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold">Gallery</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
            {destination.gallery.map((src) => (
              <Media key={src} src={src} alt={`${destination.name} scenery`} className="h-36 rounded-xl sm:h-44" />
            ))}
          </div>
        </section>

        <section className="mt-12 grid gap-6 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold">Travel information</h2>
            <div className="mt-4">
              <ArrowList items={destination.travelInfo} />
            </div>
            <ButtonLink to="/contact?intent=plan" className="mt-6" withArrow>
              Plan a trip here
            </ButtonLink>
          </div>
          <div>
            <h2 className="text-2xl font-bold">Location</h2>
            <iframe title={`Map of ${destination.name}`} src={map} className="mt-4 h-72 w-full rounded-2xl border border-line" loading="lazy" />
          </div>
        </section>
      </article>
    </>
  );
}
