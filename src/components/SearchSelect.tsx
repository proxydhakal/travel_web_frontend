import { useEffect, useMemo, useRef, useState } from "react";

type Option = { value: string; label: string };

export function SearchSelect({
  value,
  options,
  onChange,
  placeholder = "Search and choose",
  empty = "Nothing matches",
}: {
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  placeholder?: string;
  empty?: string;
}) {
  const selected = options.find((item) => item.value === value);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(selected?.label ?? "");
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(selected?.label ?? "");
  }, [selected?.label]);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!box.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", close);
    return () => window.removeEventListener("mousedown", close);
  }, []);

  const matches = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term || term === selected?.label.toLowerCase()) return options;
    return options.filter((item) => item.label.toLowerCase().includes(term));
  }, [options, query, selected?.label]);

  return (
    <div ref={box} className="relative">
      <input
        value={query}
        placeholder={placeholder}
        className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-secondary"
        onFocus={() => setOpen(true)}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
          if (!event.target.value) onChange("");
        }}
      />
      {open && (
        <ul className="absolute z-30 mt-1 max-h-56 w-full overflow-auto rounded-xl border border-line bg-white py-1 shadow-card">
          {matches.length === 0 && <li className="px-3 py-2 text-sm text-muted">{empty}</li>}
          {matches.map((item) => (
            <li key={item.value}>
              <button
                type="button"
                className={`block w-full px-3 py-2 text-left text-sm hover:bg-sand ${item.value === value ? "font-semibold text-primary" : ""}`}
                onClick={() => {
                  onChange(item.value);
                  setQuery(item.label);
                  setOpen(false);
                }}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
