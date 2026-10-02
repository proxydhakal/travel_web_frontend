import { ButtonLink } from "./Button";

export function EmptyState({ title, text, action }: { title: string; text: string; action?: { label: string; to: string } }) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-sand px-6 py-14 text-center">
      <h3 className="text-xl font-bold text-ink">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">{text}</p>
      {action && (
        <ButtonLink to={action.to} className="mt-6">
          {action.label}
        </ButtonLink>
      )}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="container-page py-10">
      <div className="h-8 w-56 animate-pulse rounded bg-slate-200" />
      <div className="mt-3 h-4 w-80 max-w-full animate-pulse rounded bg-slate-100" />
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="overflow-hidden rounded-2xl border border-line">
            <div className="h-52 animate-pulse bg-slate-200" />
            <div className="space-y-3 p-4">
              <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="container-page py-20 text-center">
      <p className="eyebrow">Something went wrong</p>
      <h1 className="mt-2 text-3xl font-extrabold text-ink">This page did not load.</h1>
      <p className="mt-3 text-muted">Refresh the page. If it keeps happening, call the Kathmandu desk.</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="mt-6 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white">
          Try again
        </button>
      )}
    </div>
  );
}
