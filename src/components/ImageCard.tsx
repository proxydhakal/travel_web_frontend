import { Link } from "react-router-dom";
import { Media } from "./Media";
import { IconArrow } from "./Icons";

export function ImageCard({
  href,
  image,
  alt,
  title,
  subtitle,
}: {
  href: string;
  image: string;
  alt: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <Link to={href} className="group relative block h-64 overflow-hidden rounded-2xl sm:h-72">
      <Media src={image} alt={alt} className="h-full w-full" imgClassName="transition duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/85 via-primary-dark/15 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-4 text-white">
        <h3 className="text-lg font-bold leading-tight">{title}</h3>
        {subtitle && <p className="mt-1 text-sm text-white/85">{subtitle}</p>}
      </div>
    </Link>
  );
}

export function RichImageCard({
  href,
  image,
  alt,
  eyebrow,
  title,
  text,
  meta,
}: {
  href: string;
  image: string;
  alt: string;
  eyebrow?: string;
  title: string;
  text: string;
  meta: string;
}) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-floating">
      <Link to={href} className="relative block h-56 overflow-hidden">
        <Media src={image} alt={alt} className="h-full w-full" imgClassName="transition duration-700 group-hover:scale-105" />
        {eyebrow && (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-primary">{eyebrow}</span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-xl font-bold text-ink">
          <Link to={href} className="hover:text-primary">
            {title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted">{text}</p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-sm font-medium text-secondary">{meta}</span>
          <Link to={href} className="group/link inline-flex items-center gap-1 text-sm font-semibold text-primary">
            Explore
            <IconArrow className="h-4 w-4 transition group-hover/link:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
}
