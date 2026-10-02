import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { SearchSelect } from "../components/SearchSelect";
import type { Activity, Country, Destination, Faq, ItineraryDay, TripPackage } from "../types";
import { slugify } from "../utils/format";
import { api } from "./api";
import { useNotify } from "./notify";
import { RichText } from "./RichText";
import { Area, Check, Field, RepeatList, TextInput } from "./ui";
import { ConfirmModal, DataTable, ImageField, ImageGallery, Modal } from "./widgets";

const blank = (): TripPackage => ({
  slug: "",
  title: "",
  destination: "",
  destinationSlug: "",
  country: "Nepal",
  region: "",
  durationDays: 7,
  price: 0,
  rating: 5,
  reviews: 0,
  groupSize: 10,
  maxAltitude: "",
  difficulty: "Moderate",
  starts: "Kathmandu",
  ends: "Kathmandu",
  bestSeason: "",
  activities: [],
  styles: [],
  image: "",
  gallery: [],
  summary: "",
  overview: "",
  highlights: [""],
  includes: [""],
  excludes: [""],
  itinerary: [{ day: 1, title: "", description: "" }],
  faqs: [],
  bestseller: false,
  published: true,
  created: new Date().toISOString().slice(0, 10),
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
  ogImage: "",
});

export function PackagesAdmin() {
  return (
    <Routes>
      <Route index element={<PackageList />} />
      <Route path=":slug" element={<PackageModal />} />
    </Routes>
  );
}

function PackageModal() {
  const { slug } = useParams();
  const navigate = useNavigate();
  return (
    <>
      <PackageList />
      <Modal full title={slug === "new" ? "New package" : "Edit package"} onClose={() => navigate("/admin/packages")}>
        <PackageEditor slug={slug} onSaved={(saved) => navigate(`/admin/packages/${saved.slug}`, { replace: true })} />
      </Modal>
    </>
  );
}

function PackageList() {
  const [rows, setRows] = useState<TripPackage[]>([]);
  const [error, setError] = useState("");
  const [removing, setRemoving] = useState<TripPackage | null>(null);
  const { run } = useNotify();

  const load = () => api<TripPackage[]>("/api/admin/packages").then(setRows).catch((reason: Error) => setError(reason.message));
  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-primary">Packages</h1>
          <p className="text-sm text-muted">Each package belongs to one country and one activity.</p>
        </div>
        <Link to="/admin/packages/new" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">
          New package
        </Link>
      </div>
      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
      <div className="mt-4">
        <DataTable
          rows={rows}
          rowKey={(row) => row.slug}
          searchText={(row) => `${row.title} ${row.country} ${row.slug} ${row.destination}`}
          columns={[
            { key: "title", label: "Package", sortValue: (row) => row.title, render: (row) => <Link to={`/admin/packages/${row.slug}`} className="font-semibold text-primary">{row.title}</Link> },
            { key: "country", label: "Country", sortValue: (row) => row.country, render: (row) => row.country },
            { key: "days", label: "Days", sortValue: (row) => row.durationDays, render: (row) => row.durationDays },
            { key: "price", label: "Price", sortValue: (row) => row.price, render: (row) => `US$${row.price}` },
            { key: "status", label: "Status", sortValue: (row) => (row.published === false ? "Draft" : "Live"), render: (row) => (row.published === false ? "Draft" : "Live") },
            {
              key: "actions",
              label: "",
              render: (row) => (
                <div className="flex justify-end gap-3">
                  <Link to={`/admin/packages/${row.slug}`} className="text-sm font-semibold text-secondary">Edit</Link>
                  <button type="button" className="text-sm text-red-700" onClick={() => setRemoving(row)}>Delete</button>
                </div>
              ),
            },
          ]}
        />
      </div>
      {removing && (
        <ConfirmModal
          title={`Delete ${removing.title}?`}
          message="The public trip page for this package will disappear."
          confirmLabel="Delete"
          onClose={() => setRemoving(null)}
          onConfirm={() =>
            run(async () => {
              await api(`/api/admin/packages/${removing.slug}`, { method: "DELETE" });
              setRemoving(null);
              await load();
            }, "Package deleted.")
          }
        />
      )}
    </div>
  );
}

function PackageEditor({ slug, onSaved }: { slug?: string; onSaved: (saved: TripPackage) => void }) {
  const [form, setForm] = useState<TripPackage>(blank());
  const [countries, setCountries] = useState<Country[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const { errors, run } = useNotify();
  const creating = slug === "new";

  useEffect(() => {
    api<Country[]>("/api/admin/countries").then(setCountries);
    api<Activity[]>("/api/admin/activities").then(setActivities);
    api<Destination[]>("/api/admin/destinations").then(setDestinations);
    if (creating) return;
    api<TripPackage[]>("/api/admin/packages").then((rows) => {
      const found = rows.find((item) => item.slug === slug);
      if (found) setForm({ ...blank(), ...found, highlights: found.highlights.length ? found.highlights : [""], includes: found.includes.length ? found.includes : [""], excludes: found.excludes.length ? found.excludes : [""] });
    });
  }, [slug, creating]);

  const set = <K extends keyof TripPackage>(key: K, value: TripPackage[K]) => setForm((current) => ({ ...current, [key]: value }));
  const countryActivities = useMemo(() => activities.filter((item) => !form.countryId || item.countryId === form.countryId), [activities, form.countryId]);
  const countryDestinations = useMemo(() => destinations.filter((item) => !form.countryId || item.countryId === form.countryId), [destinations, form.countryId]);

  const save = (event: FormEvent, published = true) => {
    event.preventDefault();
    const payload = {
      ...form,
      published,
      highlights: form.highlights.filter(Boolean),
      includes: form.includes.filter(Boolean),
      excludes: form.excludes.filter(Boolean),
      styles: form.styles.filter(Boolean),
      gallery: form.gallery.filter(Boolean),
      itinerary: form.itinerary.filter((day) => day.title || day.description).map((day, index) => ({ ...day, day: index + 1 })),
      faqs: form.faqs.filter((item) => item.question || item.answer),
    };
    run(async () => {
      const saved = await api<TripPackage>(creating ? "/api/admin/packages" : `/api/admin/packages/${slug}`, {
        method: creating ? "POST" : "PUT",
        body: JSON.stringify(payload),
      });
      setForm((current) => ({ ...current, published, slug: saved.slug }));
      onSaved(saved);
    }, published ? "Package published." : "Draft saved.");
  };

  return (
    <form onSubmit={(event) => save(event, true)} className="grid gap-4" noValidate>
      <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 shadow-subtle">
        <div>
          <h1 className="text-2xl font-bold text-primary">{creating ? "New package" : form.title || "Edit package"}</h1>
          <p className="text-xs text-muted">{form.published === false ? "Draft" : "Published"}</p>
        </div>
        <div className="flex gap-2">
          <button type="button" className="rounded-lg border border-line px-4 py-2 text-sm font-semibold" onClick={(event) => save(event, false)}>
            Save draft
          </button>
          <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">
            Publish
          </button>
        </div>
      </div>
      <section className="grid gap-3 rounded-2xl bg-white p-4 sm:grid-cols-2">
        <Field label="Title" error={errors.title}>
          <TextInput value={form.title} onChange={(event) => { const title = event.target.value; setForm((current) => ({ ...current, title, slug: slugify(title) })); }} />
        </Field>
        <Field label="Slug" error={errors.slug}>
          <TextInput value={form.slug} readOnly />
        </Field>
        <Field label="Country" error={errors.countryId}>
          <SearchSelect
            value={form.countryId ? String(form.countryId) : ""}
            placeholder="Search countries"
            options={countries.map((item) => ({ value: String(item.id), label: item.name }))}
            onChange={(value) => setForm((current) => ({ ...current, countryId: value ? Number(value) : null, activityId: null, destinationId: null }))}
          />
        </Field>
        <Field label="Activity" error={errors.activityId}>
          <SearchSelect
            value={form.activityId ? String(form.activityId) : ""}
            placeholder="Search activities"
            options={countryActivities.map((item) => ({ value: String(item.id), label: item.name }))}
            onChange={(value) => set("activityId", value ? Number(value) : null)}
          />
        </Field>
        <Field label="Destination" error={errors.destinationId}>
          <SearchSelect
            value={form.destinationId ? String(form.destinationId) : ""}
            placeholder="Search destinations"
            options={countryDestinations.map((item) => ({ value: String(item.id), label: item.name }))}
            onChange={(value) => set("destinationId", value ? Number(value) : null)}
          />
        </Field>
        <Field label="Region" error={errors.region}>
          <TextInput value={form.region} onChange={(event) => set("region", event.target.value)} />
        </Field>
        <Field label="Days" error={errors.durationDays}>
          <TextInput type="number" value={form.durationDays} onChange={(event) => set("durationDays", Number(event.target.value))} />
        </Field>
        <Field label="Price USD" error={errors.price}>
          <TextInput type="number" value={form.price} onChange={(event) => set("price", Number(event.target.value))} />
        </Field>
        <Field label="Was price" error={errors.originalPrice}>
          <TextInput type="number" value={form.originalPrice ?? ""} onChange={(event) => set("originalPrice", event.target.value ? Number(event.target.value) : undefined)} />
        </Field>
        <Field label="Difficulty" error={errors.difficulty}>
          <SearchSelect
            value={form.difficulty}
            options={["Easy", "Moderate", "Challenging", "Strenuous"].map((item) => ({ value: item, label: item }))}
            onChange={(value) => set("difficulty", (value || "Moderate") as TripPackage["difficulty"])}
          />
        </Field>
        <Field label="Group size">
          <TextInput type="number" value={form.groupSize} onChange={(event) => set("groupSize", Number(event.target.value))} />
        </Field>
        <Field label="Max altitude">
          <TextInput value={form.maxAltitude} onChange={(event) => set("maxAltitude", event.target.value)} />
        </Field>
        <Field label="Starts">
          <TextInput value={form.starts} onChange={(event) => set("starts", event.target.value)} />
        </Field>
        <Field label="Ends">
          <TextInput value={form.ends} onChange={(event) => set("ends", event.target.value)} />
        </Field>
        <Field label="Best season">
          <TextInput value={form.bestSeason} onChange={(event) => set("bestSeason", event.target.value)} />
        </Field>
        <Field label="Cover image" error={errors.image}>
          <ImageField value={form.image} onChange={(image) => set("image", image)} />
        </Field>
      </section>
      <Field label="Summary" error={errors.summary}>
        <Area value={form.summary} onChange={(event) => set("summary", event.target.value)} />
      </Field>
      <div>
        <p className="mb-1 text-sm font-medium">Description</p>
        <RichText value={form.overview} onChange={(overview) => set("overview", overview)} />
        {errors.overview && <p className="mt-1 text-xs text-red-700">{errors.overview}</p>}
      </div>
      <RepeatList label="Highlights" items={form.highlights} onChange={(highlights) => set("highlights", highlights)} error={errors.highlights} />
      <RepeatList label="Includes" items={form.includes} onChange={(includes) => set("includes", includes)} error={errors.includes} />
      <RepeatList label="Excludes" items={form.excludes} onChange={(excludes) => set("excludes", excludes)} error={errors.excludes} />
      <RepeatList label="Travel styles" items={form.styles} onChange={(styles) => set("styles", styles)} placeholder="Cultural" />
      <ImageGallery value={form.gallery} onChange={(gallery) => set("gallery", gallery)} />
      <div className="flex gap-4">
        <Check label="Popular" checked={Boolean(form.bestseller)} onChange={(bestseller) => set("bestseller", bestseller)} />
        <Check label="Published" checked={form.published !== false} onChange={(published) => set("published", published)} />
      </div>
      <ItineraryEditor days={form.itinerary} onChange={(itinerary) => set("itinerary", itinerary)} error={errors.itinerary} />
      <FaqEditor faqs={form.faqs} onChange={(faqs) => set("faqs", faqs)} />
      <section className="grid gap-3 rounded-2xl bg-white p-4">
        <h2 className="text-sm font-bold">Search listing</h2>
        <Field label="Meta title" error={errors.metaTitle}>
          <TextInput value={form.metaTitle || ""} onChange={(event) => set("metaTitle", event.target.value)} />
        </Field>
        <Field label="Meta description" error={errors.metaDescription}>
          <Area value={form.metaDescription || ""} onChange={(event) => set("metaDescription", event.target.value)} />
        </Field>
        <Field label="Meta keywords" error={errors.metaKeywords}>
          <TextInput value={form.metaKeywords || ""} onChange={(event) => set("metaKeywords", event.target.value)} placeholder="everest trek, gokyo, nepal" />
        </Field>
        <Field label="Social image" error={errors.ogImage}>
          <TextInput value={form.ogImage || ""} onChange={(event) => set("ogImage", event.target.value)} />
        </Field>
      </section>
    </form>
  );
}

function ItineraryEditor({ days, onChange, error }: { days: ItineraryDay[]; onChange: (next: ItineraryDay[]) => void; error?: string }) {
  return (
    <fieldset className="grid gap-3 rounded-2xl bg-white p-4">
      <legend className="px-1 text-sm font-bold">Itinerary</legend>
      {days.map((day, index) => (
        <div key={index} className="grid gap-2 border-b border-line pb-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase text-muted">Day {index + 1}</p>
            <button type="button" className="text-xs text-red-700" onClick={() => onChange(days.filter((_, itemIndex) => itemIndex !== index))}>
              Remove
            </button>
          </div>
          <TextInput value={day.title} placeholder="Title" onChange={(event) => onChange(days.map((item, itemIndex) => (itemIndex === index ? { ...item, title: event.target.value } : item)))} />
          <Area value={day.description} placeholder="What happens this day" onChange={(event) => onChange(days.map((item, itemIndex) => (itemIndex === index ? { ...item, description: event.target.value } : item)))} />
        </div>
      ))}
      <button type="button" className="justify-self-start rounded-lg bg-[#f5b400] px-3 py-2 text-sm font-semibold text-white" onClick={() => onChange([...days, { day: days.length + 1, title: "", description: "" }])}>
        Add day
      </button>
      {error && <p className="text-xs text-red-700">{error}</p>}
    </fieldset>
  );
}

function FaqEditor({ faqs, onChange }: { faqs: Faq[]; onChange: (next: Faq[]) => void }) {
  return (
    <fieldset className="grid gap-3 rounded-2xl bg-white p-4">
      <legend className="px-1 text-sm font-bold">Questions</legend>
      {faqs.map((item, index) => (
        <div key={index} className="grid gap-2">
          <TextInput value={item.question} placeholder="Question" onChange={(event) => onChange(faqs.map((faq, faqIndex) => (faqIndex === index ? { ...faq, question: event.target.value } : faq)))} />
          <Area value={item.answer} placeholder="Answer" onChange={(event) => onChange(faqs.map((faq, faqIndex) => (faqIndex === index ? { ...faq, answer: event.target.value } : faq)))} />
          <button type="button" className="justify-self-start text-xs text-red-700" onClick={() => onChange(faqs.filter((_, faqIndex) => faqIndex !== index))}>
            Remove
          </button>
        </div>
      ))}
      <button type="button" className="justify-self-start text-sm font-semibold text-secondary" onClick={() => onChange([...faqs, { question: "", answer: "" }])}>
        Add question
      </button>
    </fieldset>
  );
}

