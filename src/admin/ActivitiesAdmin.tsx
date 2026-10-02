import { FormEvent, useEffect, useState } from "react";
import { SearchSelect } from "../components/SearchSelect";
import type { Activity, Country } from "../types";
import { slugify } from "../utils/format";
import { api } from "./api";
import { useNotify } from "./notify";
import { Area, Check, Field, TextInput } from "./ui";
import { ConfirmModal, DataTable, ImageField, Modal } from "./widgets";

const empty = (): Activity => ({ slug: "", name: "", countryId: undefined, image: "", summary: "", description: "", published: true });

export function ActivitiesAdmin() {
  const [rows, setRows] = useState<Activity[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [form, setForm] = useState<Activity | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [removing, setRemoving] = useState<Activity | null>(null);
  const { errors, run } = useNotify();

  const load = () => api<Activity[]>("/api/admin/activities").then(setRows);
  useEffect(() => {
    load();
    api<Country[]>("/api/admin/countries").then(setCountries);
  }, []);

  const countryName = (id?: number | null) => countries.find((item) => item.id === id)?.name || "—";

  const save = (event: FormEvent) => {
    event.preventDefault();
    if (!form) return;
    run(async () => {
      if (editing) await api(`/api/admin/activities/${editing}`, { method: "PUT", body: JSON.stringify(form) });
      else await api("/api/admin/activities", { method: "POST", body: JSON.stringify(form) });
      setForm(null);
      setEditing(null);
      await load();
    }, "Activity saved.");
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Activities</h1>
          <p className="text-sm text-muted">Each activity belongs to one country and can contain many packages.</p>
        </div>
        <button type="button" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white" onClick={() => { setEditing(null); setForm(empty()); }}>
          New activity
        </button>
      </div>
      <DataTable
        rows={rows}
        searchText={(row) => `${row.name} ${countryName(row.countryId)}`}
        rowKey={(row) => row.slug}
        columns={[
          { key: "name", label: "Activity", sortValue: (row) => row.name, render: (row) => <span className="font-semibold">{row.name}</span> },
          { key: "country", label: "Country", sortValue: (row) => countryName(row.countryId), render: (row) => countryName(row.countryId) },
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
        <Modal full title={editing ? form.name || "Edit activity" : "New activity"} onClose={() => setForm(null)}>
          <form className="grid gap-3 lg:grid-cols-2" noValidate onSubmit={save}>
            <Field label="Name" error={errors.name}><TextInput value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value, slug: slugify(event.target.value) })} /></Field>
            <Field label="Slug" error={errors.slug}><TextInput value={form.slug} readOnly /></Field>
            <Field label="Country" error={errors.countryId}>
              <SearchSelect
                value={form.countryId ? String(form.countryId) : ""}
                placeholder="Search countries"
                options={countries.map((item) => ({ value: String(item.id), label: item.name }))}
                onChange={(value) => setForm({ ...form, countryId: value ? Number(value) : undefined })}
              />
            </Field>
            <Field label="Image" error={errors.image}><ImageField value={form.image} onChange={(image) => setForm({ ...form, image })} /></Field>
            <Field label="Summary" error={errors.summary}><Area value={form.summary} onChange={(event) => setForm({ ...form, summary: event.target.value })} /></Field>
            <Field label="Description" error={errors.description}><Area value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></Field>
            <Check label="Published" checked={form.published !== false} onChange={(published) => setForm({ ...form, published })} />
            <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">Save</button>
          </form>
        </Modal>
      )}
      {removing && (
        <ConfirmModal
          title={`Delete ${removing.name}?`}
          message="Packages that use this activity stay listed until you edit them."
          confirmLabel="Delete"
          onClose={() => setRemoving(null)}
          onConfirm={() =>
            run(async () => {
              await api(`/api/admin/activities/${removing.slug}`, { method: "DELETE" });
              setRemoving(null);
              await load();
            }, "Activity deleted.")
          }
        />
      )}
    </div>
  );
}
