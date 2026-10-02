import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Link, NavLink, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { ApiError, api } from "./api";
import { ActivitiesAdmin } from "./ActivitiesAdmin";
import { AboutAdmin } from "./AboutAdmin";
import { ContactPageAdmin } from "./ContactPageAdmin";
import { CountriesAdmin } from "./CountriesAdmin";
import { Dashboard } from "./Dashboard";
import { DestinationsAdmin } from "./DestinationsAdmin";
import { GalleryAdmin } from "./GalleryAdmin";
import { InquiriesAdmin } from "./InquiriesAdmin";
import { LegalAdmin } from "./LegalAdmin";
import { LoginPage } from "./LoginPage";
import { PagesAdmin } from "./PagesAdmin";
import { ConfirmModal } from "./widgets";
import { PackagesAdmin } from "./PackagesAdmin";
import { SeoAdmin } from "./SeoAdmin";
import { SettingsAdmin } from "./SettingsAdmin";
import { StoriesAdmin } from "./StoriesAdmin";
import { TeamAdmin } from "./TeamAdmin";
import { TestimonialsAdmin } from "./TestimonialsAdmin";
import { UsersAdmin } from "./UsersAdmin";

export type StaffUser = { id: number; name: string; email: string; role: "admin" | "editor"; active: boolean };

type Session = {
  user: StaffUser | null;
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
};

const SessionContext = createContext<Session | null>(null);

export function useSession() {
  const value = useContext(SessionContext);
  if (!value) throw new Error("Session missing");
  return value;
}

function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StaffUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const data = await api<{ user: StaffUser }>("/api/auth/me");
      setUser(data.user);
    } catch (reason) {
      if (reason instanceof ApiError && reason.status === 401) setUser(null);
      else setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const logout = async () => {
    await api("/api/auth/logout", { method: "POST" });
    setUser(null);
  };

  return <SessionContext.Provider value={{ user, loading, refresh, logout }}>{children}</SessionContext.Provider>;
}

const groups: { label: string; items: [string, string, boolean?][] }[] = [
  { label: "Overview", items: [["Dashboard", "/admin", true], ["Inquiries", "/admin/inquiries"]] },
  {
    label: "Catalog",
    items: [
      ["Countries", "/admin/countries"],
      ["Destinations", "/admin/destinations"],
      ["Activities", "/admin/activities"],
      ["Packages", "/admin/packages"],
    ],
  },
  {
    label: "Company",
    items: [
      ["Profile", "/admin/settings"],
      ["About page", "/admin/about"],
      ["Pages", "/admin/pages"],
      ["Team", "/admin/team"],
      ["Contact page", "/admin/contact-page"],
      ["SEO", "/admin/seo"],
    ],
  },
  {
    label: "Stories & media",
    items: [
      ["Gallery", "/admin/gallery"],
      ["Stories", "/admin/stories"],
      ["Testimonials", "/admin/testimonials"],
      ["Legal documents", "/admin/legal"],
    ],
  },
];

function SideLink({ to, label, end }: { to: string; label: string; end?: boolean }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${isActive ? "bg-[#eef3f8] font-semibold text-primary" : "text-[#445066] hover:bg-[#f4f7fb]"}`
      }
    >
      <span className="h-1.5 w-1.5 rounded-full bg-[#f5b400]" />
      {label}
    </NavLink>
  );
}

function Shell() {
  const { user, logout } = useSession();
  const navigate = useNavigate();
  const location = useLocation();
  const [menu, setMenu] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [openGroup, setOpenGroup] = useState("Catalog");
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<{ kind: string; label: string; to: string }[]>([]);
  const title = location.pathname === "/admin" ? "Dashboard" : "Admin panel";
  const today = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short", year: "numeric" });

  useEffect(() => {
    const term = query.trim();
    if (term.length < 2) {
      setHits([]);
      return;
    }
    const timer = window.setTimeout(() => {
      api<{ results: { kind: string; label: string; to: string }[] }>(`/api/admin/search?q=${encodeURIComponent(term)}`)
        .then((data) => setHits(data.results))
        .catch(() => setHits([]));
    }, 250);
    return () => window.clearTimeout(timer);
  }, [query]);

  return (
    <div className="min-h-screen bg-[#f3f5f8] text-ink lg:grid lg:grid-cols-[248px_1fr]">
      <aside className="border-r border-[#e6ebf1] bg-white lg:min-h-screen">
        <Link to="/admin" className="flex h-[72px] items-center gap-3 border-b border-[#e6ebf1] px-4">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-sm font-bold text-white">EH</span>
          <span>
            <span className="block text-sm font-bold leading-tight text-primary">Enlighten Himalays</span>
            <span className="text-xs text-muted">Admin Panel</span>
          </span>
        </Link>
        <nav className="px-3 py-4">
          <ul className="space-y-2">
            {groups.map((group) => {
              const open = openGroup === group.label;
              return (
                <li key={group.label}>
                  <button type="button" className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.14em] text-muted hover:bg-[#f4f7fb]" onClick={() => setOpenGroup(open ? "" : group.label)}>
                    {group.label}
                    <span>{open ? "–" : "+"}</span>
                  </button>
                  {open && (
                    <ul className="mt-1 space-y-0.5 border-l border-[#e6ebf1] pl-2">
                      {group.items.map(([label, to, end]) => (
                        <li key={to}>
                          <SideLink to={to} label={label} end={Boolean(end)} />
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
            {user?.role === "admin" && (
              <li>
                <ul>
                  <li><SideLink to="/admin/users" label="Users" /></li>
                </ul>
              </li>
            )}
          </ul>
        </nav>
      </aside>
      <div className="min-w-0">
        <header className="flex h-[72px] items-center gap-3 border-b border-[#e6ebf1] bg-white px-4 sm:px-6">
          <div className="min-w-[140px]">
            <p className="text-sm font-semibold">{title}</p>
            <p className="text-xs text-muted">Home</p>
          </div>
          <div className="relative min-w-[220px] flex-1">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search packages, activities, countries"
              className="w-full rounded-full border border-[#e6ebf1] bg-[#f7f9fb] px-4 py-2 text-sm outline-none focus:border-secondary"
            />
            {hits.length > 0 && (
              <ul className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-line bg-white shadow-card">
                {hits.map((hit) => (
                  <li key={`${hit.kind}-${hit.to}`}>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-sand"
                      onClick={() => {
                        setQuery("");
                        setHits([]);
                        navigate(hit.to);
                      }}
                    >
                      <span>{hit.label}</span>
                      <span className="text-xs uppercase text-muted">{hit.kind}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <p className="hidden text-sm text-muted xl:block">{today}</p>
          <div className="relative">
            <button type="button" className="flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-sm" onClick={() => setMenu((open) => !open)}>
              <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-xs font-bold text-white">{user?.name.slice(0, 1)}</span>
              {user?.name}
            </button>
            {menu && (
              <div className="absolute right-0 z-20 mt-2 w-44 rounded-xl border border-line bg-white p-2 text-sm shadow-card">
                <p className="px-2 py-1 text-xs uppercase text-muted">{user?.role}</p>
                <Link to="/" className="block rounded-lg px-2 py-2 hover:bg-sand" onClick={() => setMenu(false)}>
                  View website
                </Link>
                <button type="button" className="block w-full rounded-lg px-2 py-2 text-left hover:bg-sand" onClick={() => { setMenu(false); setConfirmLogout(true); }}>
                  Sign out
                </button>
              </div>
            )}
          </div>
        </header>
        <main className="p-4 sm:p-6">
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="packages/*" element={<PackagesAdmin />} />
            <Route path="destinations/*" element={<DestinationsAdmin />} />
            <Route path="countries/*" element={<CountriesAdmin />} />
            <Route path="activities" element={<ActivitiesAdmin />} />
            <Route path="gallery" element={<GalleryAdmin />} />
            <Route path="stories/*" element={<StoriesAdmin />} />
            <Route path="testimonials" element={<TestimonialsAdmin />} />
            <Route path="inquiries" element={<InquiriesAdmin />} />
            <Route path="pages" element={<PagesAdmin />} />
            <Route path="settings" element={<SettingsAdmin />} />
            <Route path="about" element={<AboutAdmin />} />
            <Route path="contact-page" element={<ContactPageAdmin />} />
            <Route path="seo" element={<SeoAdmin />} />
            <Route path="team" element={<TeamAdmin />} />
            <Route path="legal/*" element={<LegalAdmin />} />
            <Route path="users" element={user?.role === "admin" ? <UsersAdmin /> : <Navigate to="/admin" replace />} />
          </Routes>
        </main>
      </div>
      {confirmLogout && (
        <ConfirmModal
          title="Sign out?"
          message="Your session cookie will be cleared. You can sign in again from the login card."
          confirmLabel="Sign out"
          onClose={() => setConfirmLogout(false)}
          onConfirm={async () => {
            await logout();
            navigate("/admin/login");
          }}
        />
      )}
    </div>
  );
}

function Guard() {
  const { user, loading } = useSession();
  if (loading) return <p className="p-10 text-sm text-muted">Checking your session…</p>;
  if (!user) return <Navigate to="/admin/login" replace />;
  return <Shell />;
}

export function AdminApp() {
  return (
    <SessionProvider>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route path="*" element={<Guard />} />
      </Routes>
    </SessionProvider>
  );
}
