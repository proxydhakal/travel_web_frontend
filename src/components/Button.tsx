import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { cn } from "../utils/format";
import { IconArrow } from "./Icons";

type Variant = "primary" | "sun" | "outline" | "ghost" | "white";

const variants: Record<Variant, string> = {
  primary: "bg-primary text-white hover:bg-primary-dark",
  sun: "bg-tertiary text-primary hover:bg-white",
  outline: "border border-primary bg-white text-primary hover:bg-primary hover:text-white",
  white: "border border-white/70 bg-white/10 text-white hover:bg-white hover:text-primary",
  ghost: "bg-transparent text-ink hover:text-primary",
};

type Common = {
  children: ReactNode;
  variant?: Variant;
  className?: string;
  withArrow?: boolean;
};

export function Button({
  children,
  variant = "primary",
  className,
  withArrow,
  ...props
}: Common & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
      {withArrow && <IconArrow className="h-4 w-4 transition group-hover:translate-x-1" />}
    </button>
  );
}

export function ButtonLink({
  children,
  to,
  variant = "primary",
  className,
  withArrow,
}: Common & { to: string }) {
  const external = to.startsWith("http") || to.startsWith("mailto:") || to.startsWith("tel:");
  const classes = cn(
    "group inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition duration-200 hover:-translate-y-0.5",
    variants[variant],
    className,
  );
  if (external) {
    return (
      <a className={classes} href={to}>
        {children}
        {withArrow && <IconArrow className="h-4 w-4 transition group-hover:translate-x-1" />}
      </a>
    );
  }
  return (
    <Link className={classes} to={to}>
      {children}
      {withArrow && <IconArrow className="h-4 w-4 transition group-hover:translate-x-1" />}
    </Link>
  );
}
