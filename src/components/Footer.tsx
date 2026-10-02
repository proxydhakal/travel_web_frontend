import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { useContent } from "../content/ContentContext";
import { useToast } from "../context/ToastContext";
import { IconMail, IconPhone, IconPin } from "./Icons";

export function Footer() {
  const { push } = useToast();
  const { company, socials } = useContent();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const subscribe = (event: FormEvent) => {
    event.preventDefault();
    if (name.trim().length < 2) {
      setError("Please add your name.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    const list = JSON.parse(localStorage.getItem("eh-newsletter") ?? "[]");
    list.push({ name, email, at: new Date().toISOString() });
    localStorage.setItem("eh-newsletter", JSON.stringify(list));
    setName("");
    setEmail("");
    setError("");
    push("You are on the list. Watch your inbox for Himalayan notes.");
  };

  return (
    <footer className="mt-16">
      <div className="bg-surface">
        <div className="container-page grid gap-8 py-10 md:grid-cols-2">
          <div>
            <h2 className="text-sm font-semibold text-ink">Our affiliations</h2>
            <ul className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-primary">
              {["Nepal Tourism Board", "TAAN", "NMA", "KEEP"].map((item) => (
                <li key={item} className="rounded-lg border border-line bg-white px-3 py-2">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-ink">Recommendations</h2>
            <p className="mt-3 text-sm text-muted">
              {company.reviews} guest notes. Owner {company.owner}, {company.ownerRole.toLowerCase()}.
            </p>
          </div>
        </div>
      </div>
      <div className="bg-primary text-white">
        <svg viewBox="0 0 1440 70" className="block w-full text-surface" preserveAspectRatio="none" aria-hidden="true">
          <path fill="currentColor" d="M0 32c180 36 280 8 460-8 200-18 280 40 480 28 160-10 300-36 500-8V0H0z" />
        </svg>
        <div className="container-page grid gap-8 pb-8 lg:grid-cols-[1.4fr_0.8fr] lg:items-center">
          <form onSubmit={subscribe} className="grid gap-3">
            <p className="text-sm font-semibold tracking-[0.14em]">SUBSCRIBE TO OUR NEWSLETTER</p>
            <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
              <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Full name" aria-label="Full name" className="rounded-md border border-white/20 bg-white/5 px-3 py-3 text-sm outline-none placeholder:text-white/60" />
              <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email address" aria-label="Email address" type="email" className="rounded-md border border-white/20 bg-white/5 px-3 py-3 text-sm outline-none placeholder:text-white/60" />
              <button type="submit" className="rounded-md bg-tertiary px-5 py-3 text-sm font-bold tracking-wide text-primary hover:bg-white">
                Subscribe
              </button>
            </div>
            {error && <p className="text-sm text-tertiary">{error}</p>}
          </form>
          <p className="text-sm lg:text-right">
            <span className="block text-xs tracking-[0.14em] text-white/70">For the best holiday, call us</span>
            <a href={company.phoneHref} className="mt-1 inline-block text-lg font-semibold">
              {company.phone}
            </a>
          </p>
        </div>
        <div className="container-page pb-10">
          <div className="grid gap-8 rounded-2xl bg-white/5 p-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h2 className="text-sm font-bold tracking-wide">{company.name.toUpperCase()}</h2>
              <ul className="mt-4 space-y-3 text-sm text-white/85">
                <li className="flex gap-2">
                  <IconPin className="mt-0.5 h-4 w-4 shrink-0" />
                  {company.address}
                </li>
                <li className="flex gap-2">
                  <IconMail className="mt-0.5 h-4 w-4 shrink-0" />
                  <a href={`mailto:${company.email}`}>{company.email}</a>
                </li>
                <li className="flex gap-2">
                  <IconPhone className="mt-0.5 h-4 w-4 shrink-0" />
                  <a href={company.phoneHref}>{company.phone} ({company.phoneLabel})</a>
                </li>
                <li className="flex gap-2">
                  <IconPhone className="mt-0.5 h-4 w-4 shrink-0" />
                  <a href={company.phoneAltHref}>{company.phoneAlt} ({company.phoneAltLabel})</a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-wide">EXPLORE</h2>
              <FooterLinks
                links={[
                  ["Destinations", "/destinations"],
                  ["Packages", "/packages"],
                  ["Activities", "/activities"],
                  ["Blog", "/stories"],
                  ["Gallery", "/gallery"],
                ]}
              />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-wide">COMPANY</h2>
              <FooterLinks
                links={[
                  ["About", "/about"],
                  ["Our story", "/about#story"],
                  ["Contact", "/contact"],
                  ["Careers", "/careers"],
                  ["FAQ", "/faq"],
                ]}
              />
              <h2 className="mt-6 text-sm font-bold tracking-wide">SUPPORT</h2>
              <FooterLinks
                links={[
                  ["Terms", "/terms"],
                  ["Privacy policy", "/privacy"],
                  ["Booking policy", "/booking-policy"],
                  ["Site map", "/sitemap"],
                ]}
              />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-wide">FOLLOW US</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {socials.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="grid h-10 w-10 place-items-center rounded-md bg-white text-primary transition hover:bg-tertiary"
                      aria-label={item.label}
                    >
                      <SocialIcon name={item.label} />
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-xs tracking-[0.14em] text-white/70">WE ACCEPT</p>
              <p className="mt-2 text-sm font-semibold">Visa · Mastercard · Amex · UnionPay</p>
            </div>
          </div>
          <p className="mt-8 text-center text-xs tracking-wide text-white/75">© {new Date().getFullYear()} {company.name.toUpperCase()} ALL RIGHTS RESERVED.</p>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ name }: { name: string }) {
  const common = { viewBox: "0 0 24 24", className: "h-4 w-4", fill: "currentColor", "aria-hidden": true as const };
  if (name === "Facebook") return <svg {...common}><path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.6l.4-3H13v-2c0-.6.4-1 1-1z" /></svg>;
  if (name === "Instagram") return <svg {...common}><path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm5 4.5A4.5 4.5 0 1 0 16.5 12 4.5 4.5 0 0 0 12 7.5zm6.2-.9a1.1 1.1 0 1 0 1.1 1.1 1.1 1.1 0 0 0-1.1-1.1zM12 9.2A2.8 2.8 0 1 1 9.2 12 2.8 2.8 0 0 1 12 9.2z" /></svg>;
  if (name === "X") return <svg {...common}><path d="M4 4l6.8 8.7L4.4 20H7l4.2-5.1L15.8 20H20l-7.1-9.1L19.4 4H16.8l-3.8 4.6L9.2 4H4z" /></svg>;
  if (name === "LinkedIn") return <svg {...common}><path d="M6.5 9H4V20h2.5V9zM5.2 4A1.6 1.6 0 1 0 5.2 7.2 1.6 1.6 0 0 0 5.2 4zM20 20h-2.5v-5.6c0-1.6-.6-2.6-2-2.6a2.2 2.2 0 0 0-2 1.5 2.7 2.7 0 0 0-.1 1v5.7H11V9h2.4v1.5A3.2 3.2 0 0 1 16.4 9c2.3 0 3.6 1.5 3.6 4.6V20z" /></svg>;
  return <svg {...common}><path d="M23 12.2s0-3.2-.4-4.6a3 3 0 0 0-2.1-2.1C18.8 5 12 5 12 5s-6.8 0-8.5.5a3 3 0 0 0-2.1 2.1C1 9 1 12.2 1 12.2s0 3.2.4 4.6a3 3 0 0 0 2.1 2.1c1.7.5 8.5.5 8.5.5s6.8 0 8.5-.5a3 3 0 0 0 2.1-2.1c.4-1.4.4-4.6.4-4.6zM9.8 15.5V8.9l6.2 3.3-6.2 3.3z" /></svg>;
}

function FooterLinks({ links }: { links: Array<[string, string]> }) {
  return (
    <ul className="mt-4 space-y-2 text-sm text-white/85">
      {links.map(([label, to]) => (
        <li key={to}>
          <Link to={to} className="hover:text-tertiary">
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
