import type { ReactNode } from "react";
import { useContent } from "../content/ContentContext";
import type { PackageFilters } from "../utils/filters";
import { durationOptions, priceBounds } from "../utils/filters";

const styles = ["Adventure", "Cultural", "Wildlife", "Family", "Pilgrimage", "Comfort"];
const difficulties = ["Easy", "Moderate", "Challenging", "Strenuous"];

function toggle(list: string[], value: string) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

export function FilterPanel({
  filters,
  onChange,
  onClear,
}: {
  filters: PackageFilters;
  onChange: (next: PackageFilters) => void;
  onClear: () => void;
}) {
  const { activities, destinations } = useContent();
  return (
    <form className="space-y-6" onSubmit={(event) => event.preventDefault()}>
      <FilterGroup title="Destination">
        {destinations.map((destination) => (
          <Check
            key={destination.slug}
            label={destination.name}
            checked={filters.destinations.includes(destination.slug)}
            onChange={() => onChange({ ...filters, destinations: toggle(filters.destinations, destination.slug) })}
          />
        ))}
      </FilterGroup>
      <FilterGroup title="Price range">
        <label className="block text-xs text-muted">
          Up to US${filters.maxPrice.toLocaleString("en-US")}
          <input
            type="range"
            min={priceBounds.min}
            max={priceBounds.max}
            step={20}
            value={filters.maxPrice}
            onChange={(event) => onChange({ ...filters, maxPrice: Number(event.target.value) })}
            className="mt-2 w-full accent-primary"
          />
        </label>
      </FilterGroup>
      <FilterGroup title="Duration">
        {durationOptions.map((option) => (
          <label key={option.id || "any"} className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="duration"
              checked={filters.duration === option.id}
              onChange={() => onChange({ ...filters, duration: option.id })}
              className="accent-primary"
            />
            {option.label}
          </label>
        ))}
      </FilterGroup>
      <FilterGroup title="Activities">
        {activities.map((activity) => (
          <Check
            key={activity.slug}
            label={activity.name}
            checked={filters.activities.includes(activity.slug)}
            onChange={() => onChange({ ...filters, activities: toggle(filters.activities, activity.slug) })}
          />
        ))}
      </FilterGroup>
      <FilterGroup title="Difficulty">
        {difficulties.map((item) => (
          <Check
            key={item}
            label={item}
            checked={filters.difficulties.includes(item)}
            onChange={() => onChange({ ...filters, difficulties: toggle(filters.difficulties, item) })}
          />
        ))}
      </FilterGroup>
      <FilterGroup title="Travel style">
        {styles.map((item) => (
          <Check
            key={item}
            label={item}
            checked={filters.styles.includes(item)}
            onChange={() => onChange({ ...filters, styles: toggle(filters.styles, item) })}
          />
        ))}
      </FilterGroup>
      <FilterGroup title="Rating">
        {[0, 4, 4.5, 4.8].map((value) => (
          <label key={value} className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="rating"
              checked={filters.rating === value}
              onChange={() => onChange({ ...filters, rating: value })}
              className="accent-primary"
            />
            {value === 0 ? "Any rating" : `${value}+ stars`}
          </label>
        ))}
      </FilterGroup>
      <button type="button" onClick={onClear} className="text-sm font-semibold text-primary underline-offset-2 hover:underline">
        Clear all filters
      </button>
    </form>
  );
}

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="max-h-56 space-y-2 overflow-auto pr-1">
      <legend className="mb-2 text-sm font-bold text-ink">{title}</legend>
      {children}
    </fieldset>
  );
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-2 text-sm text-ink/90">
      <input type="checkbox" checked={checked} onChange={onChange} className="accent-primary" />
      {label}
    </label>
  );
}
