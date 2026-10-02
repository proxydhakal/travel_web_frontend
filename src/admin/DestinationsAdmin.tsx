import { FormEvent, useEffect, useState } from "react";
import { SearchSelect } from "../components/SearchSelect";
import type { Country, Destination } from "../types";
import { slugify } from "../utils/format";
import { api } from "./api";
import { useNotify } from "./notify";
import { Area, Check, Field, RepeatList, TextInput } from "./ui";
import { ConfirmModal, DataTable, ImageField, ImageGallery, Modal } from "./widgets";

const blank = (): Destination => ({
  slug: "",
  name: "",
  country: "Nepal",
  categories: [],
  image: "",
  gallery: [],
  summary: "",
  introduction: "",
  highlights: [],
  bestTime: "",
  thingsToDo: [],
  travelInfo: [],
  lat: 27.7,
  lng: 85.3,
  published: true,
});

export function DestinationsAdmin() {
  const [rows, setRows] = useState<Destination[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [form, setForm] = useState<Destination | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [removing, setRemoving] = useState<Destination | null>(null);
  const { errors, run } = useNotify();
  const load = () => api<Destination[]>("/api/admin/destinations").then(setRows);
  useEffect(() => {
    load();
    api<Country[]>("/api/admin/countries").then(setCountries);
  }, []);

  const countryName = (row: Destination) => countries.find((item) => item.id === row.countryId)?.name || row.country || "—";

  const save = (event: FormEvent) => {
    event.preventDefault();
    if (!form) return;
    run(async () => {
      const saved = await api<Destination>(editing ? `/api/admin/destinations/${editing}` : "/api/admin/destinations", {
        method: editing ? "PUT" : "POST",
        body: JSON.stringify({
          ...form,
          categories: form.categories.filter(Boolean),
          highlights: form.highlights.filter(Boolean),
          thingsToDo: form.thingsToDo.filter(Boolean),
          travelInfo: form.travelInfo.filter(Boolean),
          gallery: form.gallery.filter(Boolean),
        }),
      });
      setEditing(saved.slug);
      setForm(saved);
      await load();
    }, "Destination saved.");
  };

  const set = <K extends keyof Destination>(key: K, value: Destination[K]) => setForm((current) => (current ? { ...current, [key]: value } : current));

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Destinations</h1>
          <p className="text-sm text-muted">Each destination belongs to one country.</p>
        </div>
        <button type="button" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white" onClick={() => { setEditing(null); setForm(blank()); }}>
          New destination
        </button>
      </div>
      <DataTable
        rows={rows}
        rowKey={(row) => row.slug}
        searchText={(row) => `${row.name} ${countryName(row)} ${row.summary}`}
        columns={[
          { key: "name", label: "Destination", sortValue: (row) => row.name, render: (row) => <span className="font-semibold">{row.name}</span> },
          { key: "country", label: "Country", sortValue: (row) => countryName(row), render: (row) => countryName(row) },
          { key: "status", label: "Status", sortValue: (row) => (row.published === false ? "Draft" : "Live"), render: (row) => (row.published === false ? "Draft" : "Live") },
          {
            key: "actions",
            label: "",
            render: (row) => (
              <div className="flex justify-end gap-3">
                <button type="button" className="text-sm font-semibold text-secondary" onClick={() => { setEditing(row.slug); setForm(row); }}>Edit</button>
                <button type="button" className="text-sm text-red-700" onClick={() => setRemoving(row)}>Delete</button>
              </div>
            ),
          },
        ]}
      />
      {form && (
        <Modal full title={editing ? form.name || "Edit destination" : "New destination"} onClose={() => setForm(null)}>
          <form className="grid gap-3" noValidate onSubmit={save}>
            <div className="flex justify-end">
              <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">Save</button>
            </div>
            <section className="grid gap-3 rounded-2xl bg-white p-4 lg:grid-cols-2">
              <Field label="Name" error={errors.name}><TextInput value={form.name} onChange={(event) => { const name = event.target.value; setForm((current) => (current ? { ...current, name, slug: slugify(name) } : current)); }} /></Field>
              <Field label="Slug" error={errors.slug}><TextInput value={form.slug} readOnly /></Field>
              <Field label="Country" error={errors.countryId}>
                <SearchSelect
                  value={form.countryId ? String(form.countryId) : ""}
                  placeholder="Search countries"
                  options={countries.map((item) => ({ value: String(item.id), label: item.name }))}
                  onChange={(value) => set("countryId", value ? Number(value) : undefined)}
                />
              </Field>
              <Field label="Image"><ImageField value={form.image} onChange={(image) => set("image", image)} /></Field>
              <Field label="Summary"><Area value={form.summary} onChange={(event) => set("summary", event.target.value)} /></Field>
              <Field label="Introduction"><Area value={form.introduction} onChange={(event) => set("introduction", event.target.value)} /></Field>
              <Field label="Best time"><Area value={form.bestTime} onChange={(event) => set("bestTime", event.target.value)} /></Field>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Latitude"><TextInput type="number" step="0.0001" value={form.lat} onChange={(event) => set("lat", Number(event.target.value))} /></Field>
                <Field label="Longitude"><TextInput type="number" step="0.0001" value={form.lng} onChange={(event) => set("lng", Number(event.target.value))} /></Field>
              </div>
            </section>
            <RepeatList label="Categories" items={form.categories} onChange={(categories) => set("categories", categories)} />
            <RepeatList label="Highlights" items={form.highlights} onChange={(highlights) => set("highlights", highlights)} />
            <RepeatList label="Things to do" items={form.thingsToDo} onChange={(thingsToDo) => set("thingsToDo", thingsToDo)} />
            <RepeatList label="Travel information" items={form.travelInfo} onChange={(travelInfo) => set("travelInfo", travelInfo)} />
            <ImageGallery value={form.gallery} onChange={(gallery) => set("gallery", gallery)} />
            <Check label="Published" checked={form.published !== false} onChange={(published) => set("published", published)} />
          </form>
        </Modal>
      )}
      {removing && (
        <ConfirmModal
          title={`Delete ${removing.name}?`}
          message="Packages that point at this destination stay listed until you edit them."
          confirmLabel="Delete"
          onClose={() => setRemoving(null)}
          onConfirm={() =>
            run(async () => {
              await api(`/api/admin/destinations/${removing.slug}`, { method: "DELETE" });
              setRemoving(null);
              await load();
            }, "Destination deleted.")
          }
        />
      )}
    </div>
  );
}
