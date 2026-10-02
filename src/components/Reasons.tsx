import { useContent } from "../content/ContentContext";
import { ButtonLink } from "./Button";

const icons = ["guide", "calendar", "tag", "route", "family", "support"];

export function Reasons() {
  const { reasons } = useContent();
  return (
    <section className="bg-sand py-16">
      <div className="container-page">
        <p className="eyebrow">Adventures inspired by nature</p>
        <h2 className="display-title mt-1">Reasons to travel with us</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason, index) => (
            <article key={reason.title} className="rounded-2xl bg-white p-5 shadow-subtle">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-tertiary text-primary">
                <ReasonIcon name={icons[index]} />
              </span>
              <h3 className="mt-4 text-base font-bold">{reason.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{reason.text}</p>
            </article>
          ))}
        </div>
        <ButtonLink to="/about" withArrow className="mt-8">
          Explore more
        </ButtonLink>
      </div>
    </section>
  );
}

function ReasonIcon({ name }: { name: string }) {
  const common = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, className: "h-6 w-6", "aria-hidden": true as const };
  if (name === "calendar") {
    return (
      <svg {...common}>
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M8 3v4M16 3v4M4 10h16M9 15l2 2 4-4" />
      </svg>
    );
  }
  if (name === "tag") {
    return (
      <svg {...common}>
        <path d="M4 12l8-8h6v6l-8 8-6-6z" />
        <circle cx="16" cy="8" r="1" fill="currentColor" />
      </svg>
    );
  }
  if (name === "route") {
    return (
      <svg {...common}>
        <circle cx="6" cy="6" r="2" />
        <circle cx="18" cy="18" r="2" />
        <path d="M8 7c6 0 4 10 10 10" />
      </svg>
    );
  }
  if (name === "family") {
    return (
      <svg {...common}>
        <circle cx="8" cy="8" r="2" />
        <circle cx="16" cy="9" r="2" />
        <path d="M4 18c.5-2.5 2-3.5 4-3.5s3.5 1 4 3.5M13 18c.4-2 1.6-3 3.2-3 1.4 0 2.5.8 3 2.4" />
      </svg>
    );
  }
  if (name === "support") {
    return (
      <svg {...common}>
        <path d="M5 13a7 7 0 0 1 14 0" />
        <rect x="3" y="13" width="4" height="6" rx="1" />
        <rect x="17" y="13" width="4" height="6" rx="1" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <circle cx="12" cy="8" r="3" />
      <path d="M6 19c1-3 3-4.5 6-4.5S17 16 18 19" />
    </svg>
  );
}
