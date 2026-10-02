import { FormEvent, useEffect, useState } from "react";
import type { Country } from "../types";
import { slugify } from "../utils/format";
import { api } from "./api";
import { useNotify } from "./notify";
import { Area, Check, Field, TextInput } from "./ui";
import { ConfirmModal, DataTable, ImageField, Modal } from "./widgets";

const blank = (): Country => ({ id: 0, slug: "", name: "", summary: "", description: "", image: "", published: true });

export function CountriesAdmin() {
  const [rows, setRows] = useState<Country[]>([]);
  const [form, setForm] = useState<Country | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [removing, setRemoving] = useState<Country | null>(null);
  const { errors, run } = useNotify();
  const load = () => api<Country[]>("/api/admin/countries").then(setRows);
  useEffect(() => {
    load();
  }, []);

  const save = (event: FormEvent) => {
    event.preventDefault();
    if (!form) return;
    run(async () => {
      const saved = await api<Country>(editing ? `/api/admin/countries/${editing}` : "/api/admin/countries", {
        method: editing ? "PUT" : "POST",
        body: JSON.stringify(form),
      });
      setEditing(saved.slug);
      setForm(saved);
      await load();
    }, "Country saved.");
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Countries</h1>
          <p className="text-sm text-muted">A country holds destinations and activities. Activities hold packages.</p>
        </div>
        <button type="button" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white" onClick={() => { setEditing(null); setForm(blank()); }}>
          New country
        </button>
      </div>
      <DataTable
        rows={rows}
        rowKey={(row) => row.slug}
        searchText={(row) => `${row.name} ${row.slug} ${row.summary}`}
        columns={[
          { key: "name", label: "Country", sortValue: (row) => row.name, render: (row) => <span className="font-semibold">{row.name}</span> },
          { key: "slug", label: "Address", sortValue: (row) => row.slug, render: (row) => row.slug },
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
        <Modal full title={editing ? form.name || "Edit country" : "New country"} onClose={() => setForm(null)}>
          <form className="grid gap-3 lg:grid-cols-2" noValidate onSubmit={save}>
            <div className="lg:col-span-2 flex justify-end">
              <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">Save</button>
            </div>
            <Field label="Name" error={errors.name}><TextInput value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value, slug: slugify(event.target.value) })} /></Field>
            <Field label="Slug" error={errors.slug}><TextInput value={form.slug} readOnly /></Field>
            <Field label="Summary" error={errors.summary}><Area value={form.summary} onChange={(event) => setForm({ ...form, summary: event.target.value })} /></Field>
            <Field label="Description" error={errors.description}><Area value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></Field>
            <Field label="Image" error={errors.image}><ImageField value={form.image} onChange={(image) => setForm({ ...form, image })} /></Field>
            <Check label="Published" checked={form.published !== false} onChange={(published) => setForm({ ...form, published })} />
          </form>
        </Modal>
      )}
      {removing && (
        <ConfirmModal
          title={`Delete ${removing.name}?`}
          message="Destinations and activities that belong to this country stay in the catalog until you remove them separately."
          confirmLabel="Delete"
          onClose={() => setRemoving(null)}
          onConfirm={() =>
            run(async () => {
              await api(`/api/admin/countries/${removing.slug}`, { method: "DELETE" });
              setRemoving(null);
              await load();
            }, "Country deleted.")
          }
        />
      )}
    </div>
  );
}
