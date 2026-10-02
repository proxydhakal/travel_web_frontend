import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContent } from "../content/ContentContext";
import { cn } from "../utils/format";
import { IconArrow, IconClose, IconSearch } from "./Icons";
import { Media } from "./Media";

const slides = [
  {
    src: "/images/kathmandu.jpg",
    alt: "A golden stupa draped in prayer flags under a Himalayan sky",
    place: "Kathmandu",
  },
  {
    src: "/images/everest.jpg",
    alt: "Trekkers passing a stupa with prayer flags beneath snow peaks",
    place: "Everest",
  },
  {
    src: "/images/annapurna.jpg",
    alt: "Hikers following footprints up a snowy ridge above the clouds",
    place: "Annapurna",
  },
  {
    src: "/images/hike.jpg",
    alt: "Two hikers with backpacks walking a trail toward sharp peaks",
    place: "The trails",
  },
  {
    src: "/images/alps.jpg",
    alt: "Sunrise lighting a range of peaks above a sea of clouds",
    place: "The Himalaya",
  },
];

const INTERVAL = 6000;

export function Hero() {
  const { company } = useContent();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const [offer, setOffer] = useState(true);
  const [userPaused, setUserPaused] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [searching, setSearching] = useState(false);
  const [status, setStatus] = useState("");
  const paused = userPaused || hidden || searching;
  const count = slides.length;

  const go = (next: number, announce = false) => {
    const wrapped = (next + count) % count;
    setIndex(wrapped);
    if (announce) setStatus(`Slide ${wrapped + 1} of ${count}, ${slides[wrapped].place}`);
  };

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, INTERVAL);
    return () => window.clearInterval(id);
  }, [paused, index, count]);

  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const slide = slides[index];

  return (
    <section
      className="relative min-h-[calc(100svh-107px)] w-full overflow-hidden bg-ink"
      aria-roledescription="carousel"
      aria-label="Featured destinations"
      onKeyDown={(event) => {
        const target = event.target as HTMLElement;
        if (target.closest("input, textarea")) return;
        if (event.key === "ArrowRight") {
          event.preventDefault();
          go(index + 1, true);
        }
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          go(index - 1, true);
        }
      }}
    >
      {slides.map((item, itemIndex) => (
        <div
          key={item.src}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-out",
            itemIndex === index ? "opacity-100" : "pointer-events-none opacity-0",
          )}
          aria-hidden={itemIndex !== index}
        >
          <Media
            src={item.src}
            alt={itemIndex === index ? item.alt : ""}
            className="absolute inset-0 h-full w-full"
            priority={itemIndex < 2}
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/35 to-secondary/10" />

      <div className="relative mx-auto flex min-h-[calc(100svh-107px)] w-full max-w-[1240px] flex-col justify-center px-4 pb-36 pt-12 text-white sm:px-6 sm:pb-32 lg:px-8">
            <p className="reveal text-sm font-medium text-tertiary sm:text-base">{company.short}</p>
            <h1 className="reveal reveal-delay-1 mt-3 max-w-xl text-4xl font-extrabold leading-[1.08] sm:text-5xl lg:text-6xl">
              Walk the Himalaya with a crew that lives here.
            </h1>
        <p className="reveal reveal-delay-1 mt-4 inline-flex w-fit rounded-full bg-ink/50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-sm" aria-live="off">
          Now showing · {slide.place}
        </p>
        <form
          className="reveal reveal-delay-2 mt-8 flex max-w-md overflow-hidden rounded-xl bg-white shadow-floating"
          onSubmit={(event) => {
            event.preventDefault();
            navigate(query.trim() ? `/packages?q=${encodeURIComponent(query.trim())}` : "/packages");
          }}
        >
          <label htmlFor="hero-search" className="sr-only">
            Search trips
          </label>
          <input
            id="hero-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onFocus={() => setSearching(true)}
            onBlur={() => setSearching(false)}
            placeholder="Search"
            className="w-full px-4 py-3.5 text-sm text-ink outline-none"
          />
          <button type="submit" className="grid w-12 place-items-center text-secondary" aria-label="Search">
            <IconSearch className="h-5 w-5" />
          </button>
        </form>
        <p className="reveal reveal-delay-3 mt-6 text-sm text-white/90">
          <span className="mr-2 text-emerald-300" aria-hidden="true">
            ●●●●●
          </span>
          {company.reviews} guest notes · led by {company.owner}
        </p>
      </div>

      <p className="sr-only" aria-live="polite">
        {status}
      </p>

      <div className={cn("absolute inset-x-0 z-10 px-4 sm:px-6 lg:px-8", offer ? "bottom-[4.25rem]" : "bottom-5")}>
        <div className="mx-auto flex w-full max-w-[1240px] items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full bg-white/15 text-white backdrop-blur-sm transition hover:bg-white hover:text-ink"
              aria-label="Previous slide"
              onClick={() => go(index - 1, true)}
            >
              <IconArrow className="h-4 w-4 rotate-180" />
            </button>
            <div className="flex items-center gap-2" role="tablist" aria-label="Hero slides">
              {slides.map((item, itemIndex) => (
                <button
                  key={item.src}
                  type="button"
                  role="tab"
                  aria-selected={itemIndex === index}
                  aria-label={`Show ${item.place}`}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    itemIndex === index ? "w-8 bg-white" : "w-2 bg-white/55 hover:bg-white",
                  )}
                  onClick={() => go(itemIndex, true)}
                />
              ))}
            </div>
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full bg-white/15 text-white backdrop-blur-sm transition hover:bg-white hover:text-ink"
              aria-label="Next slide"
              onClick={() => go(index + 1, true)}
            >
              <IconArrow className="h-4 w-4" />
            </button>
          </div>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full bg-white/15 text-white backdrop-blur-sm transition hover:bg-white hover:text-ink"
            aria-pressed={userPaused}
            aria-label={userPaused ? "Play slideshow" : "Pause slideshow"}
            onClick={() => setUserPaused((value) => !value)}
          >
            {userPaused ? (
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {offer && (
        <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between gap-3 bg-tertiary px-4 py-3 text-sm font-semibold text-primary sm:px-6 lg:px-8">
          <Link to="/packages/gokyo-lakes-trek" className="hover:underline">
            New sample trip: Gokyo Lakes — quieter than base camp, same Khumbu sky.
          </Link>
          <button type="button" onClick={() => setOffer(false)} aria-label="Dismiss offer" className="grid h-8 w-8 shrink-0 place-items-center rounded-full hover:bg-white/15">
            <IconClose className="h-4 w-4" />
          </button>
        </div>
      )}
    </section>
  );
}
