import { useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { FilterPanel } from "../components/FilterPanel";
import { IconClose, IconFilter } from "../components/Icons";
import { PackageCard } from "../components/PackageCard";
import { EmptyState } from "../components/States";
import { useContent } from "../content/ContentContext";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { useLockBody } from "../hooks/useLockBody";
import { usePageMeta } from "../hooks/usePageMeta";
import { applyFilters, emptyFilters, filtersFromParams, filtersToParams, type PackageFilters, type SortKey } from "../utils/filters";

const sorts: Array<{ id: SortKey; label: string }> = [
  { id: "recommended", label: "Recommended" },
  { id: "price-asc", label: "Price: Low → High" },
  { id: "price-desc", label: "Price: High → Low" },
  { id: "rating", label: "Rating" },
  { id: "newest", label: "Newest" },
];

export default function Packages() {
  const { packages } = useContent();
  usePageMeta("Explore Our Packages", "Compare treks and tours across Nepal, Bhutan, and Tibet. Filter by destination, price, duration, difficulty, and style.");
  const [params, setParams] = useSearchParams();
  const filters = useMemo(() => filtersFromParams(params), [params]);
  const results = useMemo(() => applyFilters(packages, filters), [packages, filters]);
  const [drawer, setDrawer] = useState(false);

  const update = (next: PackageFilters) => setParams(filtersToParams(next), { replace: true });

  return (
    <>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Packages" }]} />
      <section className="container-page py-10">
        <p className="eyebrow">Find your next unforgettable journey</p>
        <h1 className="display-title mt-1">Explore our packages</h1>
        <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-28 rounded-2xl border border-line bg-white p-5 shadow-subtle">
              <h2 className="text-base font-bold">Filters</h2>
              <div className="mt-4">
                <FilterPanel filters={filters} onChange={update} onClear={() => update(emptyFilters())} />
              </div>
            </div>
          </aside>
          <div>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted">
                Showing <span className="font-semibold text-ink">{results.length}</span> {results.length === 1 ? "package" : "packages"}
              </p>
              <div className="flex items-center gap-2">
                <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm font-semibold lg:hidden" onClick={() => setDrawer(true)}>
                  <IconFilter className="h-4 w-4" />
                  Filters
                </button>
                <label className="text-sm text-muted">
                  <span className="sr-only">Sort packages</span>
                  <select
                    value={filters.sort}
                    onChange={(event) => update({ ...filters, sort: event.target.value as SortKey })}
                    className="rounded-lg border border-line bg-white px-3 py-2 font-medium text-ink"
                  >
                    {sorts.map((sort) => (
                      <option key={sort.id} value={sort.id}>
                        {sort.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
            {results.length === 0 ? (
              <EmptyState
                title="No packages found."
                text="Try changing your filters, or tell us the route you have in mind and we will build it."
                action={{ label: "Plan a custom trip", to: "/contact?intent=plan" }}
              />
            ) : (
              <div className="grid gap-x-5 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
                {results.map((trip) => (
                  <PackageCard key={trip.slug} trip={trip} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
      {drawer && (
        <FilterDrawer
          filters={filters}
          onChange={update}
          onClose={() => setDrawer(false)}
          onClear={() => update(emptyFilters())}
        />
      )}
    </>
  );
}

function FilterDrawer({
  filters,
  onChange,
  onClose,
  onClear,
}: {
  filters: PackageFilters;
  onChange: (next: PackageFilters) => void;
  onClose: () => void;
  onClear: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useLockBody(true);
  useFocusTrap(true, ref);
  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Package filters">
      <button type="button" className="absolute inset-0 bg-ink/50" aria-label="Close filters" onClick={onClose} />
      <div ref={ref} className="absolute inset-y-0 right-0 flex w-[min(100%,400px)] flex-col bg-white shadow-floating">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-lg font-bold">Filters</h2>
          <button type="button" onClick={onClose} aria-label="Close filters" className="grid h-10 w-10 place-items-center rounded-lg border border-line">
            <IconClose className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-auto px-5 py-4">
          <FilterPanel filters={filters} onChange={onChange} onClear={onClear} />
        </div>
        <div className="border-t border-line p-4">
          <button type="button" onClick={onClose} className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-white">
            Show trips
          </button>
        </div>
      </div>
    </div>
  );
}
