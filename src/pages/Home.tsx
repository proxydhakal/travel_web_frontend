import { Link } from "react-router-dom";
import { ButtonLink } from "../components/Button";
import { Carousel } from "../components/Carousel";
import { DestinationCard } from "../components/DestinationCard";
import { Hero } from "../components/Hero";
import { ImageCard } from "../components/ImageCard";
import { Media } from "../components/Media";
import { PackageCard } from "../components/PackageCard";
import { Reasons } from "../components/Reasons";
import { Testimonials } from "../components/Testimonials";
import { useContent } from "../content/ContentContext";
import { usePageMeta } from "../hooks/usePageMeta";

export default function Home() {
  const { destinations, packages, company, stories, galleryItems, seo } = useContent();
  const travelStyles = [
    { title: "Outbound Tours", subtitle: "Bhutan & Tibet", image: "/images/stupa.jpg", to: "/destinations/bhutan", count: packages.filter((item) => item.country !== "Nepal").length },
    { title: "Mountain Flights", subtitle: "See the range", image: "/images/flight.jpg", to: "/packages/everest-scenic-flight", count: packages.filter((item) => item.activities.includes("mountain-flight") || item.activities.includes("helicopter")).length },
    { title: "Trekking in Nepal", subtitle: "Teahouse trails", image: "/images/hike.jpg", to: "/packages?activity=trekking", count: packages.filter((item) => item.activities.includes("trekking")).length },
    { title: "Tours in Nepal", subtitle: "Cities & culture", image: "/images/pokhara.jpg", to: "/packages?style=Cultural", count: packages.filter((item) => item.styles.includes("Cultural")).length },
  ];
  usePageMeta(seo.title || `${company.short} | Treks and tours in Nepal`, seo.description || "Treks and tours from Kathmandu.", {
    keywords: seo.keywords,
    image: seo.ogImage,
    brand: company.short,
    favicon: seo.favicon,
  });
  const bestsellers = packages.filter((item) => item.bestseller);

  return (
    <>
      <Hero />

      <section className="container-page py-14">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">Plan with a local</p>
            <h2 className="display-title mt-1 max-w-sm">Explore by travel styles</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-muted">
            The Himalaya are Nepal’s headline. The same team also builds city tours, wildlife breaks, and journeys into Bhutan and Tibet.
          </p>
          <ButtonLink to="/activities" withArrow>
            See all activities
          </ButtonLink>
        </div>
        <div className="mt-8">
          <Carousel label="Travel styles">
            {travelStyles.map((style) => (
              <div key={style.title} className="w-[82%] shrink-0 snap-start sm:w-[calc(50%-8px)] lg:w-[calc(25%-12px)]">
                <ImageCard href={style.to} image={style.image} alt={style.title} title={style.title} subtitle={`${style.count} ${style.count === 1 ? "package" : "packages"}`} />
              </div>
            ))}
          </Carousel>
        </div>
      </section>

      <section className="container-page pb-16">
        <div className="mb-8">
          <p className="eyebrow">Where the trails begin</p>
          <h2 className="display-title mt-1">Featured destinations</h2>
        </div>
        <Carousel label="Featured destinations">
          {destinations.slice(0, 8).map((destination) => (
            <div key={destination.slug} className="w-[82%] shrink-0 snap-start sm:w-[calc(50%-8px)] lg:w-[calc(25%-12px)]">
              <DestinationCard destination={destination} />
            </div>
          ))}
        </Carousel>
      </section>

      <section className="bg-surface py-16">
        <div className="container-page">
          <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="eyebrow">Top-picked packages</p>
              <h2 className="display-title mt-1 max-w-md">Our best sellers for 2026</h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-muted">
              Nepal is a trekker’s dream: Himalayan peaks, golden temples, hill villages, and wildlife that still feels close.
            </p>
            <ButtonLink to="/packages" withArrow>
              View all trips
            </ButtonLink>
          </div>
          <div className="hidden gap-x-5 gap-y-10 md:grid md:grid-cols-2 xl:grid-cols-3">
            {bestsellers.slice(0, 6).map((trip) => (
              <PackageCard key={trip.slug} trip={trip} />
            ))}
          </div>
          <div className="md:hidden">
            <Carousel label="Best selling trips">
              {bestsellers.map((trip) => (
                <div key={trip.slug} className="w-[88%] shrink-0 snap-start">
                  <PackageCard trip={trip} />
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="relative overflow-hidden rounded-2xl">
          <Media src="/images/alps.jpg" alt="Sunrise above a sea of clouds with a dark summit" className="h-[420px] w-full" />
          <div className="absolute inset-0 bg-primary/45" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
            <p className="text-sm font-semibold tracking-[0.2em]">CUSTOMIZE & BOOK</p>
            <h2 className="mt-3 max-w-3xl text-3xl font-bold leading-tight sm:text-5xl">Tell {company.owner.split(" ")[0]} the dates. We’ll shape the trail.</h2>
            <ButtonLink to="/contact?intent=plan" variant="sun" className="mt-6">
              Plan your holiday
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="container-page grid items-center gap-10 pb-16 lg:grid-cols-2">
        <div>
          <p className="eyebrow">{company.slogan}</p>
          <h2 className="display-title mt-1">{company.short} plans the walk with you</h2>
          <div className="mt-5 space-y-4 text-sm leading-7 text-muted">
            <p>
              {company.owner} opened the desk in {company.since}. The work is still the same: a written plan, a local guide, and a phone that answers after you leave the hotel.
            </p>
            <p>
              More than {company.travelers} travelers have used that desk. Routes stay classic, with room for a slower day or a private departure when the main trail is crowded.
            </p>
          </div>
          <ButtonLink to="/about" withArrow className="mt-6">
            More about us
          </ButtonLink>
        </div>
        <MountainArt />
      </section>

      <Reasons />
      <Testimonials />

      <section className="bg-surface py-16">
        <div className="container-page">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="eyebrow">Latest notes</p>
              <h2 className="display-title mt-1">Travel stories and news</h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-muted">Practical writing from the Kathmandu desk: seasons, packing, and how to choose a first trail.</p>
            <ButtonLink to="/stories" withArrow>
              View all posts
            </ButtonLink>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {stories.map((story) => (
              <article key={story.slug} className="group">
                <Link to={`/stories/${story.slug}`} className="block overflow-hidden rounded-2xl">
                  <Media src={story.image} alt="" className="h-52" imgClassName="transition duration-500 group-hover:scale-105" />
                </Link>
                <p className="mt-3 text-xs text-muted">
                  {story.date} · {story.author}
                </p>
                <h3 className="mt-1 text-lg font-bold leading-snug">
                  <Link to={`/stories/${story.slug}`} className="hover:text-primary">
                    {story.title}
                  </Link>
                </h3>
                <Link to={`/stories/${story.slug}`} className="mt-2 inline-flex text-sm font-semibold text-primary">
                  Continue reading →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <p className="eyebrow">Discover the difference</p>
        <h2 className="display-title mt-1">Moments from the trails</h2>
        <div className="mt-8">
          <Carousel label="Travel moments">
            {galleryItems.slice(0, 8).map((item) => (
              <Link key={item.id} to="/gallery" className="group w-[78%] shrink-0 snap-start sm:w-[calc(50%-8px)] lg:w-[calc(25%-12px)]">
                <Media src={item.src} alt={item.alt} className="h-72 rounded-2xl" imgClassName="transition duration-500 group-hover:scale-105" />
                <p className="mt-3 text-sm font-semibold">{item.title}</p>
              </Link>
            ))}
          </Carousel>
        </div>
        <ButtonLink to="/gallery" withArrow className="mt-4">
          View the gallery
        </ButtonLink>
      </section>

    </>
  );
}

function MountainArt() {
  return (
    <svg viewBox="0 0 640 420" className="w-full" role="img" aria-label="Illustration of hikers on a ridge at sunrise">
      <circle cx="470" cy="150" r="58" fill="#A9D6E5" />
      <circle cx="470" cy="150" r="36" fill="#A9D6E5" />
      <path d="M40 250c30-20 50-8 70 6 18-40 48-78 78-78 20 0 32 18 48 40 22-62 58-110 96-110 34 0 58 40 78 78 28-48 70-90 112-70 30 14 48 48 62 84v120H40V250z" fill="#D7E3EE" />
      <path d="M0 320l90-70 70 48 80-110 90 120 70-64 80 50 70-40 90 66v100H0V320z" fill="#013A63" />
      <path d="M0 360l120-40 80 24 90-70 100 80 80-36 90 30 80-20v72H0V360z" fill="#2A6F97" />
      <path d="M250 188l28 46h-22l18 28-34-52 10-22z" fill="#012640" />
      <path d="M300 168l22 36-16 8 14 24-30-46 10-22z" fill="#012640" />
      <path d="M228 168c18-8 28-2 34 10" stroke="#013A63" strokeWidth="3" fill="none" />
    </svg>
  );
}
