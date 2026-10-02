import { IconStar } from "./Icons";

export function Rating({ value, count, className = "" }: { value: number; count?: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium text-ink ${className}`}>
      <span className="inline-flex text-sun" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, index) => (
          <IconStar key={index} className={`h-3.5 w-3.5 ${index < Math.round(value) ? "opacity-100" : "opacity-25"}`} />
        ))}
      </span>
      <span className="sr-only">{value} out of 5 stars</span>
      {typeof count === "number" && <span className="text-muted">{count} {count === 1 ? "Review" : "Reviews"}</span>}
    </span>
  );
}
