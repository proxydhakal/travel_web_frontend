import { useEffect, useState, type ReactNode } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useContent } from "../content/ContentContext";
import { useLockBody } from "../hooks/useLockBody";
import { cn } from "../utils/format";
import { ButtonLink } from "./Button";
import { IconClose, IconMenu, IconPhone, IconSearch } from "./Icons";

const links = [
  { to: "/destinations", label: "Destinations", menu: "destinations" as const },
  { to: "/packages", label: "Packages" },
  { to: "/activities", label: "Activities" },
];

function MenuDrop({ label, open, onOpen, onClose, children }: { label: string; open: boolean; onOpen: () => void; onClose: () => void; children: ReactNode }) {
  return (
    <div className="relative" onMouseEnter={onOpen} onMouseLeave={onClose}>
      <button type="button" className="inline-flex items-center gap-1 text-[13px] font-semibold tracking-wide text-white/85 hover:text-tertiary" aria-expanded={open} onClick={() => (open ? onClose() : onOpen())}>
        {label} <span aria-hidden="true">+</span>
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 w-64 pt-3">
          <div className="rounded-2xl border border-line bg-white px-4 py-2 shadow-floating">{children}</div>
        </div>
      )}
    </div>
  );
}

export function Navbar({ onSearch }: { onSearch: () => void }) {
  const { company, destinationMenu, seo, pages } = useContent();
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState<string | null>(null);
  const companyPages = pages.filter((item) => item.group === "company");
  const guidePages = pages.filter((item) => item.group === "guide");
  const [scrolled, setScrolled] = useState(false);
  useLockBody(open);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setMega(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className={cn("sticky top-0 z-40", scrolled && "shadow-floating")}>
      <div className="bg-tertiary text-primary">
        <div className="container-page flex items-center justify-between gap-3 py-2 text-[11px] sm:text-xs">
          <div className="flex items-center gap-3 sm:gap-4">
            <a href={company.phoneHref} className="inline-flex items-center gap-1.5 font-medium hover:text-secondary">
              <IconPhone className="h-3.5 w-3.5" />
              {company.phone}
            </a>
            <span className="hidden font-medium sm:inline">Owner · {company.owner}</span>
          </div>
          <p className="hidden font-medium lg:block">
            Tourism License: {company.license} <span className="mx-2">|</span> Regd. No: {company.regd}
          </p>
        </div>
      </div>
      <div className="bg-primary text-white">
        <div className="container-page flex h-[74px] items-center justify-between gap-4">
          <Link to="/" className="shrink-0 rounded-xl bg-white px-2 py-1" aria-label={`${company.short} home`}>
            <img src={seo.logo || "/logo.svg"} alt={company.short} className="h-10 w-auto sm:h-11" />
          </Link>
          <nav className="hidden items-center gap-6 xl:flex" aria-label="Primary">
            {links.map((link) =>
              link.menu ? (
                <div key={link.to} className="relative" onMouseEnter={() => setMega("destinations")} onMouseLeave={() => setMega(null)}>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-[13px] font-semibold tracking-wide text-white/85 hover:text-tertiary"
                    aria-expanded={mega === "destinations"}
                    onClick={() => setMega((value) => (value === "destinations" ? null : "destinations"))}
                  >
                    Destinations <span aria-hidden="true">+</span>
                  </button>
                  {mega === "destinations" && (
                    <div className="absolute left-1/2 top-full z-50 w-[720px] -translate-x-1/2 pt-4">
                      <div className="grid grid-cols-3 gap-6 rounded-2xl border border-line bg-white p-6 shadow-floating">
                        {destinationMenu.map((column) => (
                          <div key={column.title}>
                            <p className="text-sm font-bold text-secondary">{column.title}</p>
                            <ul className="mt-3 space-y-2">
                              {column.links.map((item) => (
                                <li key={item.label}>
                                  <Link to={item.to} className="text-sm text-ink/80 hover:text-primary" onClick={() => setMega(null)}>
                                    {item.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/"}
                  className={({ isActive }) =>
                    cn(
                      "text-[13px] font-semibold tracking-wide hover:text-tertiary",
                      isActive ? "text-tertiary" : "text-white/85",
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ),
            )}
            <MenuDrop label="Company" open={mega === "company"} onOpen={() => setMega("company")} onClose={() => setMega(null)}>
              {companyPages.map((item) => (
                <Link key={item.slug} to={`/pages/${item.slug}`} className="block border-b border-dashed border-line py-2.5 text-sm text-ink last:border-0 hover:text-primary" onClick={() => setMega(null)}>
                  {item.title}
                </Link>
              ))}
            </MenuDrop>
            <MenuDrop label="Travel guides" open={mega === "guides"} onOpen={() => setMega("guides")} onClose={() => setMega(null)}>
              {guidePages.map((item) => (
                <Link key={item.slug} to={`/pages/${item.slug}`} className="block border-b border-dashed border-line py-2.5 text-sm text-ink last:border-0 hover:text-primary" onClick={() => setMega(null)}>
                  {item.title}
                </Link>
              ))}
            </MenuDrop>
            <NavLink to="/contact" className={({ isActive }) => cn("text-[13px] font-semibold tracking-wide hover:text-tertiary", isActive ? "text-tertiary" : "text-white/85")}>
              Contact us
            </NavLink>
          </nav>
          <div className="flex items-center gap-3">
            <button type="button" onClick={onSearch} className="grid h-11 w-11 place-items-center rounded-full border border-white/30 text-white hover:bg-white hover:text-primary" aria-label="Search trips">
              <IconSearch className="h-5 w-5" />
            </button>
            <ButtonLink to="/contact" variant="sun" className="!hidden px-4 py-2.5 xl:!inline-flex">
              Plan a trip
            </ButtonLink>
            <button
              type="button"
              className="grid h-11 w-11 place-items-center rounded-lg border border-white/30 text-white xl:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <IconClose className="h-5 w-5" /> : <IconMenu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
      {open && (
        <MobileDrawer
          menu={destinationMenu}
          companyPages={companyPages}
          guidePages={guidePages}
          onClose={() => setOpen(false)}
        />
      )}
    </header>
  );
}

function MobileDrawer({
  menu,
  companyPages,
  guidePages,
  onClose,
}: {
  menu: { title: string; links: { label: string; to: string }[] }[];
  companyPages: { slug: string; title: string }[];
  guidePages: { slug: string; title: string }[];
  onClose: () => void;
}) {
  const navigate = useNavigate();
  return (
    <div className="fixed inset-0 z-50 xl:hidden">
      <button type="button" className="absolute inset-0 bg-ink/50" aria-label="Close menu" onClick={onClose} />
      <div className="animate-fade-in absolute inset-y-0 right-0 flex w-[min(100%,380px)] flex-col bg-white shadow-floating">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <img src="/logo.svg" alt="" className="h-10 w-auto" />
          <button type="button" onClick={onClose} aria-label="Close menu" className="grid h-11 w-11 place-items-center rounded-lg border border-line">
            <IconClose className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 overflow-auto px-5 py-4" aria-label="Mobile">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              onClick={onClose}
              className={({ isActive }) =>
                cn("block border-b border-line py-4 text-base font-semibold", isActive ? "text-primary" : "text-ink")
              }
            >
              {link.label}
            </NavLink>
          ))}
          <p className="pt-4 text-xs font-bold uppercase tracking-widest text-muted">Company</p>
          <ul>
            {companyPages.map((item) => (
              <li key={item.slug}>
                <Link to={`/pages/${item.slug}`} onClick={onClose} className="block border-b border-line py-3 text-sm font-semibold text-ink">
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
          <p className="pt-4 text-xs font-bold uppercase tracking-widest text-muted">Travel guides</p>
          <ul>
            {guidePages.map((item) => (
              <li key={item.slug}>
                <Link to={`/pages/${item.slug}`} onClick={onClose} className="block border-b border-line py-3 text-sm font-semibold text-ink">
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6 grid gap-2 text-sm text-muted">
            {menu.flatMap((column) => column.links).slice(0, 6).map((item) => (
              <Link key={item.label} to={item.to} onClick={onClose} className="py-1 hover:text-primary">
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
        <div className="border-t border-line p-5">
          <button
            type="button"
            className="w-full rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white"
            onClick={() => {
              onClose();
              navigate("/contact");
            }}
          >
            Plan a trip
          </button>
        </div>
      </div>
    </div>
  );
}

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  useLockBody(open);
  if (!open) return null;

  const submit = (value?: string) => {
    const q = (value ?? query).trim();
    onClose();
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center bg-ink/60 p-4 pt-[12vh]" role="dialog" aria-modal="true" aria-label="Search trips">
      <button type="button" className="absolute inset-0" aria-label="Close search" onClick={onClose} />
      <form
        className="relative w-full max-w-xl rounded-2xl bg-white p-5 shadow-floating"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <label htmlFor="site-search" className="text-sm font-semibold text-ink">
          Search trips and places
        </label>
        <div className="mt-3 flex overflow-hidden rounded-xl border border-line">
          <input
            id="site-search"
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Everest, Bhutan, rafting..."
            className="w-full px-4 py-3 text-sm outline-none"
          />
          <button type="submit" className="grid w-12 place-items-center bg-secondary text-white" aria-label="Search">
            <IconSearch className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {["Everest", "Annapurna", "Bhutan", "Pokhara"].map((item) => (
            <button key={item} type="button" onClick={() => submit(item)} className="rounded-full border border-line px-3 py-1.5 text-xs font-medium hover:border-primary">
              {item}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
}
