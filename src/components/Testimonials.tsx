import { useContent } from "../content/ContentContext";
import { ButtonLink } from "./Button";
import { Carousel } from "./Carousel";
import { Rating } from "./Rating";

export function Testimonials({ compact = false }: { compact?: boolean }) {
  const { testimonials } = useContent();
  return (
    <section id="reviews" className="bg-white py-16">
      <div className="container-page">
        {!compact && (
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="eyebrow">Travel experiences</p>
              <h2 className="display-title mt-1">What our guests say</h2>
            </div>
            <div className="flex gap-2 text-xs font-semibold">
              <a href="https://www.tripadvisor.com/Attraction_Review-g293890-d9603907-Reviews-Top_of_the_World_Adventure-Kathmandu_Kathmandu_Valley_Bagmati_Zone_Central_Region.html" className="rounded-full border border-line px-3 py-2">
                Tripadvisor
              </a>
              <span className="rounded-full border border-line px-3 py-2 text-muted">Google</span>
            </div>
          </div>
        )}
        <Carousel label="Guest reviews" autoplay>
          {testimonials.map((item) => (
            <figure key={item.id} className="w-[86%] shrink-0 snap-start sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)]">
              <blockquote className="flex h-full flex-col rounded-2xl border border-line bg-white p-5 shadow-subtle">
                <h3 className="text-base font-bold leading-snug">{item.trip}</h3>
                <Rating value={item.rating} className="mt-2" />
                <p className="mt-3 flex-1 text-sm leading-6 text-muted">“{item.quote}”</p>
                <figcaption className="mt-4 flex items-center justify-between gap-3">
                  <span className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-secondary text-sm font-bold text-white">
                      {item.name.slice(0, 1)}
                    </span>
                    <span>
                      <span className="block text-sm font-semibold">{item.name}</span>
                      <span className="block text-xs text-muted">{item.country}</span>
                    </span>
                  </span>
                  <span className="text-right text-[11px] text-muted">
                    {item.source}
                    <span className="block">{item.date}</span>
                  </span>
                </figcaption>
              </blockquote>
            </figure>
          ))}
        </Carousel>
        <ButtonLink to="/about#reviews" withArrow className="mt-6">
          View all reviews
        </ButtonLink>
      </div>
    </section>
  );
}
