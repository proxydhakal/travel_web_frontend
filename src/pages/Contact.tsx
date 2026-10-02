import { FormEvent, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SearchSelect } from "../components/SearchSelect";
import { Button } from "../components/Button";
import { api } from "../admin/api";
import { useContent } from "../content/ContentContext";
import { useToast } from "../context/ToastContext";
import { usePageMeta } from "../hooks/usePageMeta";
import { ApiError } from "../admin/api";

type Errors = Partial<Record<"name" | "email" | "phone" | "destination" | "date" | "travelers" | "message", string>>;

export default function Contact() {
  const { company, socials, destinations, contactPage, seo } = useContent();
  const { push } = useToast();
  usePageMeta(contactPage.heading || "Contact us", contactPage.intro || `Write or call ${company.short} in Kathmandu.`, { brand: company.short, keywords: seo.keywords, favicon: seo.favicon });
  const [params] = useSearchParams();
  const presetDestination = params.get("destination") ?? "";
  const intent = params.get("intent");
  const activity = params.get("activity");
  const trip = params.get("package");
  const [destination, setDestination] = useState(presetDestination);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const starter = useMemo(() => {
    if (intent === "plan") return "I would like help planning a trip.";
    if (intent === "customize") return "I would like to customize a departure.";
    if (intent === "review") return "I would like to share a review of my trip.";
    if (activity) return `I am interested in ${activity}.`;
    if (trip) return `Please send details for ${trip}.`;
    return "";
  }, [intent, activity, trip]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const values = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim(),
      destination,
      date: String(data.get("date") ?? ""),
      travelers: String(data.get("travelers") ?? ""),
      message: String(data.get("message") ?? "").trim(),
    };
    const next: Errors = {};
    if (values.name.length < 2) next.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = "Enter a valid email.";
    if (values.phone.replace(/\D/g, "").length < 7) next.phone = "Enter a phone number we can reach.";
    if (!values.destination) next.destination = "Choose a destination.";
    if (!values.date) next.date = "Add a travel date.";
    else if (new Date(values.date) < new Date(new Date().toDateString())) next.date = "Choose today or a future date.";
    const count = Number(values.travelers);
    if (!count || count < 1 || count > 30) next.travelers = "Enter between 1 and 30 travelers.";
    if (values.message.length < 10) next.message = "Tell us a little more (at least 10 characters).";
    setErrors(next);
    if (Object.keys(next).length) return;
    setSending(true);
    try {
      await api("/api/inquiries", {
        method: "POST",
        body: JSON.stringify({
          kind: "contact",
          ...values,
          travelDate: values.date,
          travelers: Number(values.travelers),
        }),
      });
      setSent(true);
      push("Your enquiry was sent. A confirmation email is on its way.", "success");
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : "Could not send the enquiry.";
      const fieldErrors = reason instanceof ApiError ? reason.errors : {};
      setErrors({
        name: fieldErrors.name,
        email: fieldErrors.email,
        phone: fieldErrors.phone,
        destination: fieldErrors.destination,
        date: fieldErrors.travelDate,
        travelers: fieldErrors.travelers,
        message: fieldErrors.message || message,
      });
      push(message, "error");
    } finally {
      setSending(false);
    }
  };

  const map = `https://www.openstreetmap.org/export/embed.html?bbox=85.30%2C27.66%2C85.42%2C27.74&layer=mapnik&marker=${company.lat}%2C${company.lng}`;

  return (
    <>
      <section className="bg-primary text-white">
        <div className="container-page py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-tertiary">Kathmandu desk</p>
          <h1 className="mt-2 max-w-xl text-4xl font-bold sm:text-5xl">{contactPage.heading || "Contact us"}</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80">{contactPage.intro || `Write to ${company.short}. A planner replies with a written plan.`}</p>
        </div>
      </section>
      <section className="container-page -mt-8 pb-16">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="grid content-start gap-3">
            {[
              ["Address", company.address],
              ["Email", company.email],
              ["Phone", `${company.phone} · ${company.phoneLabel}`],
              ["Hours", company.hours],
            ].map(([label, value]) => (
              <article key={label} className="rounded-2xl bg-white p-4 shadow-card">
                <p className="text-xs font-semibold uppercase tracking-wide text-secondary">{label}</p>
                <p className="mt-1 text-sm leading-6">{value}</p>
              </article>
            ))}
            <div className="flex flex-wrap gap-2 px-1">
              {socials.map((item) => (
                <a key={item.label} href={item.href} target="_blank" rel="noreferrer" className="rounded-full bg-tertiary px-3 py-1 text-xs font-semibold text-primary">
                  {item.label}
                </a>
              ))}
            </div>
          </aside>
          <div className="rounded-3xl bg-white p-6 shadow-floating sm:p-8">
            {sent ? (
              <div role="status">
                <h2 className="text-2xl font-bold text-primary">Message received</h2>
                <p className="mt-3 text-sm leading-7 text-muted">A confirmation email is on its way. If it does not arrive, write to {company.email}.</p>
                <button type="button" className="mt-5 text-sm font-semibold text-secondary" onClick={() => setSent(false)}>Write another message</button>
              </div>
            ) : (
              <form className="grid gap-4" onSubmit={submit} noValidate>
                <h2 className="text-2xl font-bold text-primary">Plan the trip</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Name" name="name" error={errors.name} />
                  <Field label="Email" name="email" type="email" error={errors.email} />
                  <Field label="Phone" name="phone" type="tel" error={errors.phone} />
                  <label className="text-sm font-medium">
                    Destination
                    <div className="mt-1">
                      <SearchSelect
                        value={destination}
                        placeholder="Search destinations"
                        options={[...destinations.map((item) => ({ value: item.name, label: item.name })), { value: "Not sure yet", label: "Not sure yet" }]}
                        onChange={setDestination}
                      />
                    </div>
                    {errors.destination && <span className="mt-1 block text-xs text-red-700">{errors.destination}</span>}
                  </label>
                  <Field label="Travel date" name="date" type="date" error={errors.date} />
                  <Field label="Travelers" name="travelers" type="number" error={errors.travelers} />
                </div>
                <label className="text-sm font-medium">
                  Message
                  <textarea name="message" rows={5} defaultValue={starter} className="mt-1 w-full rounded-xl border border-line px-3 py-3" aria-invalid={Boolean(errors.message)} />
                  {errors.message && <span className="mt-1 block text-xs text-red-700">{errors.message}</span>}
                </label>
                <Button type="submit" className="justify-self-start" disabled={sending}>{sending ? "Sending…" : "Send message"}</Button>
              </form>
            )}
          </div>
        </div>
        <div className="mt-8 overflow-hidden rounded-3xl border border-line">
          <iframe title="Map of the Kathmandu office" src={map} className="h-80 w-full" loading="lazy" />
        </div>
      </section>
    </>
  );
}

function Field({ label, name, type = "text", error }: { label: string; name: string; type?: string; error?: string }) {
  return (
    <label className="text-sm font-medium">
      {label}
      <input name={name} type={type} min={type === "number" ? 1 : undefined} className="mt-1 w-full rounded-lg border border-line px-3 py-3" aria-invalid={Boolean(error)} />
      {error && <span className="mt-1 block text-xs font-normal text-red-700">{error}</span>}
    </label>
  );
}
