import { FormEvent, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Accordion } from "../components/Accordion";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { Button, ButtonLink } from "../components/Button";
import { IconCheck, IconHeart, IconShare } from "../components/Icons";
import { Lightbox } from "../components/Lightbox";
import { Media } from "../components/Media";
import { PackageCard } from "../components/PackageCard";
import { Rating } from "../components/Rating";
import { ArrowList } from "../components/SectionHeading";
import NotFound from "./NotFound";
import { ApiError, api } from "../admin/api";
import { useContent } from "../content/ContentContext";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../context/ToastContext";
import { usePageMeta } from "../hooks/usePageMeta";
import { durationLabel, money } from "../utils/format";

export default function PackageDetails() {
  const { slug } = useParams();
  const { getPackage, relatedPackages, seo, company } = useContent();
  const trip = getPackage(slug);
  usePageMeta(
    trip ? trip.metaTitle || trip.title : "Package not found",
    trip ? trip.metaDescription || trip.summary : "This trip is not on the current list.",
    { keywords: trip?.metaKeywords || seo.keywords, image: trip?.ogImage || trip?.image || seo.ogImage, brand: company.short, favicon: seo.favicon },
  );
  const { has, toggle } = useWishlist();
  const { push } = useToast();
  const [photo, setPhoto] = useState<number | null>(null);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    if (!trip) return;
    const apply = () => {
      document.body.style.paddingBottom = window.innerWidth < 1024 ? "84px" : "";
    };
    apply();
    window.addEventListener("resize", apply);
    return () => {
      window.removeEventListener("resize", apply);
      document.body.style.paddingBottom = "";
    };
  }, [trip]);

  if (!trip) return <NotFound />;

  const images = trip.gallery.map((src) => ({ src, alt: `${trip.title} photo`, title: trip.title }));
  const saved = has(trip.slug);
  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: trip.title, url });
      else {
        await navigator.clipboard.writeText(url);
        push("Link copied.");
      }
    } catch {
      push("Share cancelled.");
    }
  };

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", to: "/" },
          { label: "Destinations", to: "/destinations" },
          { label: trip.country, to: `/packages?country=${trip.country}` },
          { label: trip.destination, to: `/destinations/${trip.destinationSlug}` },
          { label: trip.title },
        ]}
      />
      <article className="container-page py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{trip.title}</h1>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                  <Rating value={trip.rating} count={trip.reviews} />
                  <button type="button" onClick={() => setPhoto(0)} className="font-semibold text-primary">
                    View photos
                  </button>
                  <button type="button" onClick={share} className="inline-flex items-center gap-1 font-semibold text-primary">
                    <IconShare className="h-4 w-4" /> Share
                  </button>
                </div>
              </div>
              <button
                type="button"
                aria-pressed={saved}
                onClick={() => toggle(trip.slug, trip.title)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${saved ? "border-sun text-sun" : "border-line"}`}
              >
                <IconHeart className="h-4 w-4" filled={saved} />
                {saved ? "Saved" : "Save"}
              </button>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-[1.6fr_0.8fr]">
              <button type="button" onClick={() => setPhoto(0)} className="overflow-hidden rounded-2xl text-left">
                <Media src={trip.gallery[0]} alt={`${trip.title} cover`} className="h-72 sm:h-96" priority />
              </button>
              <div className="grid grid-cols-3 gap-3 md:grid-cols-1">
                {trip.gallery.slice(1, 4).map((src, index) => (
                  <button key={src} type="button" onClick={() => setPhoto(index + 1)} className="overflow-hidden rounded-xl">
                    <Media src={src} alt="" className="h-24 md:h-[7.4rem]" />
                  </button>
                ))}
              </div>
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-4 rounded-2xl bg-surface p-4 text-sm sm:grid-cols-3">
              <Fact label="Duration" value={durationLabel(trip.durationDays)} />
              <Fact label="Trip grade" value={trip.difficulty} />
              <Fact label="Country" value={trip.country} />
              <Fact label="Maximum altitude" value={trip.maxAltitude} />
              <Fact label="Group size" value={`${trip.groupSize} people`} />
              <Fact label="Starts" value={trip.starts} />
              <Fact label="Ends" value={trip.ends} />
              <Fact label="Activities" value={trip.activities[0]?.replace("-", " ") ?? "Trekking"} />
              <Fact label="Best time" value={trip.bestSeason} />
            </dl>

            <section className="mt-10 max-w-3xl">
              <h2 className="text-2xl font-bold">{trip.title}: the journey</h2>
              {trip.overview.includes("<") ? (
                <div className="mt-3 space-y-3 text-sm leading-7 text-muted" dangerouslySetInnerHTML={{ __html: trip.overview }} />
              ) : (
                <p className="mt-3 text-sm leading-7 text-muted">{trip.overview}</p>
              )}
              <h3 className="mt-8 text-xl font-bold">Highlights</h3>
              <div className="mt-4">
                <ArrowList items={trip.highlights} />
              </div>
            </section>

            <section className="mt-10">
              <h2 className="text-2xl font-bold">Itinerary</h2>
              <p className="mt-2 text-sm text-muted">
                Starts from {trip.starts} · Ends in {trip.ends}
              </p>
              <div className="mt-4">
                <Accordion
                  numbered
                  items={trip.itinerary.map((day) => ({
                    title: `Day ${String(day.day).padStart(2, "0")}: ${day.title}`,
                    content: day.description,
                  }))}
                />
              </div>
            </section>

            <section className="mt-10 grid gap-6 md:grid-cols-2">
              <div>
                <h2 className="text-xl font-bold">Includes</h2>
                <ul className="mt-4 space-y-2">
                  {trip.includes.map((item) => (
                    <li key={item} className="flex gap-2 text-sm leading-6">
                      <IconCheck className="mt-1 h-4 w-4 shrink-0 text-secondary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-xl font-bold">Excludes</h2>
                <ul className="mt-4 space-y-2">
                  {trip.excludes.map((item) => (
                    <li key={item} className="flex gap-2 text-sm leading-6 text-muted">
                      <span aria-hidden="true">–</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="mt-10">
              <h2 className="text-2xl font-bold">Questions</h2>
              <div className="mt-4">
                <Accordion items={trip.faqs.map((faq) => ({ title: faq.question, content: faq.answer }))} />
              </div>
            </section>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-4">
              <BookingPanel tripTitle={trip.title} price={trip.price} original={trip.originalPrice} onBook={() => setBooking(true)} />
            </div>
          </aside>
        </div>

        <section className="mt-16">
          <h2 className="text-2xl font-extrabold uppercase">You may also like</h2>
          <div className="mt-6 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {relatedPackages(trip).map((item) => (
              <PackageCard key={item.slug} trip={item} />
            ))}
          </div>
        </section>
      </article>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white p-3 shadow-floating lg:hidden">
        <div className="mx-auto flex max-w-xl items-center justify-between gap-3">
          <p>
            <span className="block text-xs text-muted">From</span>
            <span className="text-lg font-bold text-sun">{money(trip.price)}</span>
          </p>
          <Button onClick={() => setBooking(true)}>Book now</Button>
        </div>
      </div>

      {photo !== null && <Lightbox images={images} index={photo} onClose={() => setPhoto(null)} onIndex={setPhoto} />}
      {booking && <BookingModal title={trip.title} slug={trip.slug} onClose={() => setBooking(false)} />}
    </>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="font-semibold capitalize">{value}</dd>
    </div>
  );
}

function BookingPanel({
  tripTitle,
  price,
  original,
  onBook,
}: {
  tripTitle: string;
  price: number;
  original?: number;
  onBook: () => void;
}) {
  const { company } = useContent();
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
      <div className="bg-primary px-5 py-4 text-white">
        <p className="text-xs uppercase tracking-wide text-white/80">Price per person</p>
        <p className="mt-1 text-3xl font-extrabold">
          {money(price)} {original && <span className="ml-2 text-base font-medium text-white/60 line-through">{money(original)}</span>}
        </p>
      </div>
      <div className="space-y-3 p-5">
        <p className="text-sm text-muted">Group rates drop as the party grows. Ask for 2–3, 4–7, or 8+ travelers on {tripTitle}.</p>
        <Button className="w-full" onClick={onBook}>
          Book this trip
        </Button>
        <ButtonLink to={`/contact?intent=inquiry&package=${encodeURIComponent(tripTitle)}`} variant="outline" className="w-full">
          Send an inquiry
        </ButtonLink>
      </div>
      <div className="border-t border-line bg-surface px-5 py-4 text-sm">
        <p className="font-semibold">Talk to an expert</p>
        <p className="mt-1 text-muted">{company.owner} · {company.ownerRole}</p>
        <a href={company.phoneHref} className="font-semibold text-primary">
          {company.phone}
        </a>
      </div>
    </div>
  );
}

function BookingModal({ title, slug, onClose }: { title: string; slug: string; onClose: () => void }) {
  const { push } = useToast();
  const { company } = useContent();
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const date = String(data.get("date") ?? "");
    const next: Record<string, string> = {};
    if (name.trim().length < 2) next.name = "Add your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid email.";
    if (!date) next.date = "Choose a rough travel date.";
    setErrors(next);
    if (Object.keys(next).length) return;
    try {
      await api("/api/inquiries", {
        method: "POST",
        body: JSON.stringify({
          kind: "booking",
          name,
          email,
          travelDate: date,
          travelers: Number(data.get("travelers") || 1),
          message: String(data.get("message") ?? ""),
          packageTitle: title,
          packageSlug: slug,
        }),
      });
      setSent(true);
      push("Your request is in. A confirmation email is on its way.", "success");
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : "Could not send the booking.";
      if (reason instanceof ApiError) setErrors(reason.errors);
      push(message, "error");
    }
  };

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-ink/60 p-4" role="dialog" aria-modal="true" aria-labelledby="book-title">
      <button type="button" className="absolute inset-0" aria-label="Close booking form" onClick={onClose} />
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-auto rounded-2xl bg-white p-6 shadow-floating">
        <h2 id="book-title" className="text-2xl font-bold">
          Book {title}
        </h2>
        {sent ? (
          <p className="mt-4 text-sm leading-6 text-muted">
            Thank you. A confirmation was sent to your email. If it does not arrive, write to {company.email} and mention {title}.
          </p>
        ) : (
          <form className="mt-4 grid gap-3" onSubmit={submit}>
            <Field label="Name" name="name" error={errors.name} />
            <Field label="Email" name="email" type="email" error={errors.email} />
            <Field label="Travel date" name="date" type="date" error={errors.date} />
            <label className="text-sm font-medium">
              Travelers
              <input name="travelers" type="number" min={1} max={30} defaultValue={2} className="mt-1 w-full rounded-lg border border-line px-3 py-2.5" />
            </label>
            <label className="text-sm font-medium">
              Message
              <textarea name="message" rows={4} className="mt-1 w-full rounded-lg border border-line px-3 py-2.5" placeholder="Pace, hotels, or questions" />
            </label>
            <div className="mt-2 flex gap-2">
              <Button type="submit">Send enquiry</Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        )}
        <p className="mt-4 text-xs text-muted">
          Prefer the full form? <Link to="/contact" className="font-semibold text-primary">Go to contact</Link>.
        </p>
      </div>
    </div>
  );
}

function Field({ label, name, type = "text", error }: { label: string; name: string; type?: string; error?: string }) {
  return (
    <label className="text-sm font-medium">
      {label}
      <input name={name} type={type} className="mt-1 w-full rounded-lg border border-line px-3 py-2.5" aria-invalid={Boolean(error)} />
      {error && <span className="mt-1 block text-xs font-normal text-red-700">{error}</span>}
    </label>
  );
}
