import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "./api";
import { useSession } from "./AdminApp";

type Overview = {
  counts: Record<string, number>;
  funnel: { label: string; value: number }[];
  trends: { day: string; visits: number; inquiries: number }[];
  topPages: { path: string; views: number }[];
  inquiries: { id: number; kind: string; name: string; email: string; status: string; packageTitle: string; destination: string; createdAt: string }[];
};

const funnelColors = ["#f5b400", "#2a6f97", "#3aa76d", "#c5ced6"];

export function Dashboard() {
  const { user } = useSession();
  const [data, setData] = useState<Overview | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<Overview>("/api/admin/overview")
      .then(setData)
      .catch((reason: Error) => setError(reason.message));
  }, []);

  if (error) return <p className="text-sm text-red-700">{error}</p>;
  if (!data) return <p className="text-sm text-muted">Loading the desk…</p>;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const stamp = new Date().toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });
  const maxTrend = Math.max(1, ...data.trends.map((item) => Math.max(item.visits, item.inquiries)));
  const maxFunnel = Math.max(1, ...data.funnel.map((item) => item.value));

  const cards = [
    ["Packages", data.counts.packages, "/admin/packages", "Live departures"],
    ["New inquiries", data.counts.newInquiries, "/admin/inquiries", "Waiting for a reply"],
    ["Visitors today", data.counts.visitorsToday, "/admin", "Unique browsers"],
    ["Countries", data.counts.countries, "/admin/countries", "Catalog roots"],
  ];

  return (
    <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
      <div className="grid gap-4">
        <section className="rounded-2xl bg-[#013A63] px-5 py-5 text-white shadow-card sm:px-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <p className="text-sm text-[#A9D6E5]">
              {greeting}, {user?.name}
            </p>
            <p className="text-xs text-white/70">{stamp}</p>
          </div>
          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Enlighten Himalays Pvt. Ltd.</h1>
          <p className="mt-1 text-sm text-white/75">Your admin dashboard overview for today.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link to="/admin/packages/new" className="rounded-full bg-white/10 px-3 py-2 text-xs font-semibold ring-1 ring-white/20">
              + Add package
            </Link>
            <Link to="/admin/inquiries" className="rounded-full bg-white/10 px-3 py-2 text-xs font-semibold ring-1 ring-white/20">
              Reply to inquiries
            </Link>
            <Link to="/admin/activities" className="rounded-full bg-white/10 px-3 py-2 text-xs font-semibold ring-1 ring-white/20">
              Activities
            </Link>
            <Link to="/" className="rounded-full bg-white/10 px-3 py-2 text-xs font-semibold ring-1 ring-white/20">
              View website
            </Link>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map(([label, count, to, note]) => (
            <Link key={String(label)} to={String(to)} className="rounded-2xl bg-white p-4 shadow-subtle">
              <p className="text-3xl font-bold text-primary">{count}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
              <p className="mt-2 text-xs text-secondary">{note}</p>
            </Link>
          ))}
        </section>

        <section className="grid gap-3 lg:grid-cols-2">
          <article className="rounded-2xl bg-white p-4 shadow-subtle">
            <h2 className="text-sm font-bold">Inquiry funnel</h2>
            <p className="text-xs text-muted">Status breakdown</p>
            <div className="mt-4 flex h-44 items-end gap-4">
              {data.funnel.map((item, index) => (
                <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex h-32 w-full items-end">
                    <div className="w-full rounded-t-md" style={{ height: `${Math.max(6, (item.value / maxFunnel) * 100)}%`, background: funnelColors[index] }} />
                  </div>
                  <p className="text-[11px] text-muted">{item.label}</p>
                  <p className="text-xs font-semibold">{item.value}</p>
                </div>
              ))}
            </div>
          </article>
          <article className="rounded-2xl bg-white p-4 shadow-subtle">
            <h2 className="text-sm font-bold">14-day trend</h2>
            <p className="text-xs text-muted">Visitors and inquiries</p>
            <svg viewBox="0 0 320 150" className="mt-3 h-44 w-full">
              <polyline fill="none" stroke="#2A6F97" strokeWidth="3" points={data.trends.map((item, index) => `${index * (300 / 13) + 8},${140 - (item.visits / maxTrend) * 110}`).join(" ")} />
              <polyline fill="none" stroke="#f5b400" strokeWidth="3" points={data.trends.map((item, index) => `${index * (300 / 13) + 8},${140 - (item.inquiries / maxTrend) * 110}`).join(" ")} />
            </svg>
            <div className="flex gap-4 text-xs text-muted">
              <span className="text-secondary">Visitors</span>
              <span className="text-[#c48a00]">Inquiries</span>
            </div>
          </article>
        </section>
      </div>

      <aside className="grid gap-3">
        <article className="rounded-2xl bg-white p-4 shadow-subtle">
          <h2 className="text-sm font-bold">Needs a reply</h2>
          <ul className="mt-3 space-y-3">
            {data.inquiries.filter((item) => item.status === "new" || item.status === "read").length === 0 && <li className="text-sm text-muted">Nothing waiting.</li>}
            {data.inquiries
              .filter((item) => item.status === "new" || item.status === "read")
              .slice(0, 5)
              .map((item) => (
                <li key={item.id}>
                  <Link to="/admin/inquiries" className="block text-sm font-semibold text-primary">
                    {item.name}
                  </Link>
                  <p className="text-xs text-muted">{item.packageTitle || item.destination || item.kind}</p>
                </li>
              ))}
          </ul>
        </article>
        <article className="rounded-2xl bg-white p-4 shadow-subtle">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold">Today’s pages</h2>
            <span className="text-xs text-secondary">{data.counts.visitsToday} views</span>
          </div>
          <ul className="mt-3 space-y-2 text-sm">
            {data.topPages.length === 0 && <li className="text-muted">No visits recorded today.</li>}
            {data.topPages.map((page) => (
              <li key={page.path} className="flex justify-between gap-3">
                <span className="truncate">{page.path}</span>
                <span className="font-semibold">{page.views}</span>
              </li>
            ))}
          </ul>
        </article>
        <article className="rounded-2xl bg-white p-4 shadow-subtle">
          <h2 className="text-sm font-bold">Catalog</h2>
          <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <div><dt className="text-xs text-muted">Destinations</dt><dd className="text-xl font-bold text-primary">{data.counts.destinations}</dd></div>
            <div><dt className="text-xs text-muted">Activities</dt><dd className="text-xl font-bold text-primary">{data.counts.activities}</dd></div>
            <div><dt className="text-xs text-muted">Stories</dt><dd className="text-xl font-bold text-primary">{data.counts.stories}</dd></div>
            <div><dt className="text-xs text-muted">Photos</dt><dd className="text-xl font-bold text-primary">{data.counts.gallery}</dd></div>
          </dl>
        </article>
      </aside>
    </div>
  );
}
