import type { ReactNode } from "react";
import { ButtonLink } from "./Button";

export function SectionHeading({
  eyebrow,
  title,
  text,
  action,
}: {
  eyebrow: string;
  title: string;
  text?: string;
  action?: { label: string; to: string };
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-xl">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="display-title mt-1">{title}</h2>
      </div>
      <div className="flex flex-col gap-4 md:max-w-md md:items-end">
        {text && <p className="text-sm leading-6 text-muted md:text-right">{text}</p>}
        {action && (
          <ButtonLink to={action.to} className="self-start md:self-end">
            {action.label}
          </ButtonLink>
        )}
      </div>
    </div>
  );
}

export function ArrowList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item, index) => (
        <li key={index} className="flex gap-3 text-sm leading-6 text-ink/90">
          <span className="mt-1 text-sun" aria-hidden="true">
            →
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
