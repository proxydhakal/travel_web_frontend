import { Link } from "react-router-dom";
import type { TripPackage } from "../types";
import { durationLabel, money } from "../utils/format";
import { useWishlist } from "../context/WishlistContext";
import { Media } from "./Media";
import { Rating } from "./Rating";
import { IconArrow, IconClock, IconHeart, IconUsers } from "./Icons";

export function PackageCard({ trip }: { trip: TripPackage }) {
  const { has, toggle } = useWishlist();
  const saved = has(trip.slug);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-subtle transition duration-300 hover:-translate-y-1 hover:shadow-card">
      <div className="relative">
        <Link to={`/packages/${trip.slug}`} className="block overflow-hidden" tabIndex={-1} aria-hidden="true">
          <Media
            src={trip.image}
            alt={`${trip.title} in ${trip.destination}`}
            className="h-52 sm:h-56"
            imgClassName="transition duration-500 group-hover:scale-105"
          />
        </Link>
        <button
          type="button"
          aria-pressed={saved}
          aria-label={saved ? `Remove ${trip.title} from saved trips` : `Save ${trip.title}`}
          onClick={() => toggle(trip.slug, trip.title)}
          className={`absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white/95 shadow-subtle transition hover:scale-105 ${saved ? "text-secondary" : "text-ink"}`}
        >
          <IconHeart className="h-5 w-5" filled={saved} />
        </button>
        {trip.bestseller && (
          <span className="absolute left-3 top-3 rounded-full bg-tertiary px-3 py-1 text-[11px] font-semibold text-primary">Popular</span>
        )}
      </div>
      <div className="flex flex-1 flex-col px-4 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-secondary">{trip.destination}</p>
        <h3 className="mt-1 text-lg font-bold leading-snug text-ink">
          <Link to={`/packages/${trip.slug}`} className="hover:text-secondary">
            {trip.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">{trip.summary}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-medium text-muted">
          <span className="inline-flex items-center gap-1">
            <IconClock className="h-3.5 w-3.5" />
            {durationLabel(trip.durationDays)}
          </span>
          <span className="inline-flex items-center gap-1">
            <IconUsers className="h-3.5 w-3.5" />
            {trip.groupSize}
          </span>
          <Rating value={trip.rating} count={trip.reviews} />
        </div>
      </div>
      <div className="mt-auto flex items-center justify-between gap-3 bg-primary px-4 py-3 text-white">
        <p>
          <span className="block text-[11px] text-white/70">From</span>
          <span className="text-base font-bold text-tertiary">{money(trip.price)}</span>
          {trip.originalPrice && <span className="ml-2 text-xs text-white/50 line-through">{money(trip.originalPrice)}</span>}
        </p>
        <Link to={`/packages/${trip.slug}`} className="group/link inline-flex items-center gap-1 text-sm font-semibold text-tertiary">
          Details
          <IconArrow className="h-4 w-4 transition group-hover/link:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
