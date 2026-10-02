import { FormEvent, useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { usePageMeta } from "../hooks/usePageMeta";

type Results = {
  packages: { slug: string; title: string; country: string; image: string }[];
  activities: { slug: string; name: string }[];
  countries: { slug: string; name: string }[];
  destinations: { slug: string; name: string; country: string }[];
};

export default function Search() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const q = params.get("q") ?? "";
  const [results, setResults] = useState<Results | null>(null);
  const [error, setError] = useState("");
  usePageMeta(q ? `Search: ${q}` : "Search", "Search packages, activities, countries, and destinations.");

  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) {
      setResults({ packages: [], activities: [], countries: [], destinations: [] });
      return;
    }
    fetch(`/api/search?q=${encodeURIComponent(term)}`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || "Search failed.");
        return data as Results;
      })
      .then(setResults)
      .catch((reason: Error) => setError(reason.message));
  }, [q]);

  return (
    <>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Search" }]} />
      <section className="container-page py-10">
        <h1 className="text-3xl font-bold text-primary">Search</h1>
        <form
          className="mt-4"
          onSubmit={(event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const value = String(new FormData(event.currentTarget).get("q") ?? "");
            navigate(`/search?q=${encodeURIComponent(value)}`);
          }}
        >
          <input name="q" defaultValue={q} placeholder="Everest, trekking, Bhutan" className="w-full max-w-xl rounded-xl border border-line px-4 py-3" />
        </form>
        {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
        {q.trim().length < 2 && <p className="mt-6 text-sm text-muted">Type at least two letters.</p>}
        {results && q.trim().length >= 2 && (
          <div className="mt-8 grid gap-8">
            <Group title="Packages" empty="No packages matched.">
              {results.packages.map((item) => (
                <Link key={item.slug} to={`/packages/${item.slug}`} className="font-semibold text-primary">
                  {item.title} <span className="font-normal text-muted">· {item.country}</span>
                </Link>
              ))}
            </Group>
            <Group title="Activities" empty="No activities matched.">
              {results.activities.map((item) => (
                <Link key={item.slug} to={`/packages?activity=${item.slug}`} className="font-semibold text-primary">
                  {item.name}
                </Link>
              ))}
            </Group>
            <Group title="Countries" empty="No countries matched.">
              {results.countries.map((item) => (
                <Link key={item.slug} to={`/packages?country=${encodeURIComponent(item.name)}`} className="font-semibold text-primary">
                  {item.name}
                </Link>
              ))}
            </Group>
            <Group title="Destinations" empty="No destinations matched.">
              {results.destinations.map((item) => (
                <Link key={item.slug} to={`/destinations/${item.slug}`} className="font-semibold text-primary">
                  {item.name} <span className="font-normal text-muted">· {item.country}</span>
                </Link>
              ))}
            </Group>
          </div>
        )}
      </section>
    </>
  );
}

function Group({ title, empty, children }: { title: string; empty: string; children: ReactNode }) {
  const items = Array.isArray(children) ? children : [children];
  const visible = items.filter(Boolean);
  return (
    <section>
      <h2 className="text-lg font-bold">{title}</h2>
      <div className="mt-3 grid gap-2">{visible.length ? children : <p className="text-sm text-muted">{empty}</p>}</div>
    </section>
  );
}
