import { FormEvent, useEffect, useState } from "react";
import type { GalleryItem } from "../types";
import { api } from "./api";
import { useNotify } from "./notify";
import { Check, Field, TextInput } from "./ui";
import { ConfirmModal, DataTable, ImageField, Modal } from "./widgets";

const empty = (): GalleryItem => ({ id: "", src: "", alt: "", title: "", category: "Destinations", tall: false, published: true });

export function GalleryAdmin() {
  const [rows, setRows] = useState<GalleryItem[]>([]);
  const [form, setForm] = useState<GalleryItem | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [removing, setRemoving] = useState<GalleryItem | null>(null);
  const { run } = useNotify();
  const load = () => api<GalleryItem[]>("/api/admin/gallery").then(setRows);
  useEffect(() => {
    load();
  }, []);

  const save = (event: FormEvent) => {
    event.preventDefault();
    if (!form) return;
    run(async () => {
      if (editing) await api(`/api/admin/gallery/${editing}`, { method: "PUT", body: JSON.stringify(form) });
      else await api("/api/admin/gallery", { method: "POST", body: JSON.stringify(form) });
      setForm(null);
      setEditing(null);
      await load();
    }, "Photo saved.");
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">Gallery</h1>
        <button type="button" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white" onClick={() => { setEditing(null); setForm(empty()); }}>
          New photo
        </button>
      </div>
      <DataTable
        rows={rows}
        rowKey={(row) => row.id}
        searchText={(row) => `${row.title} ${row.category} ${row.alt}`}
        columns={[
          { key: "title", label: "Title", sortValue: (row) => row.title, render: (row) => <span className="font-semibold">{row.title}</span> },
          { key: "category", label: "Category", sortValue: (row) => row.category, render: (row) => row.category },
          { key: "status", label: "Status", sortValue: (row) => (row.published === false ? "Draft" : "Live"), render: (row) => (row.published === false ? "Draft" : "Live") },
          {
            key: "actions",
            label: "",
            render: (row) => (
              <div className="flex justify-end gap-3">
                <button type="button" className="text-sm font-semibold text-secondary" onClick={() => { setEditing(row.id); setForm(row); }}>Edit</button>
                <button type="button" className="text-sm text-red-700" onClick={() => setRemoving(row)}>Delete</button>
              </div>
            ),
          },
        ]}
      />
      {form && (
        <Modal full title={editing ? form.title || "Edit photo" : "New photo"} onClose={() => setForm(null)}>
          <form className="grid gap-3 lg:grid-cols-2" onSubmit={save}>
            <div className="lg:col-span-2 flex justify-end">
              <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">Save</button>
            </div>
            <Field label="Title"><TextInput value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} /></Field>
            <Field label="Category"><TextInput value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} /></Field>
            <Field label="Alt text"><TextInput value={form.alt} onChange={(event) => setForm({ ...form, alt: event.target.value })} /></Field>
            <Field label="Image"><ImageField value={form.src} onChange={(src) => setForm({ ...form, src })} /></Field>
            <div className="flex items-center gap-4">
              <Check label="Tall" checked={Boolean(form.tall)} onChange={(tall) => setForm({ ...form, tall })} />
              <Check label="Published" checked={form.published !== false} onChange={(published) => setForm({ ...form, published })} />
            </div>
          </form>
        </Modal>
      )}
      {removing && (
        <ConfirmModal
          title={`Delete ${removing.title}?`}
          message="The photo will leave the public gallery."
          confirmLabel="Delete"
          onClose={() => setRemoving(null)}
          onConfirm={() =>
            run(async () => {
              await api(`/api/admin/gallery/${removing.id}`, { method: "DELETE" });
              setRemoving(null);
              await load();
            }, "Photo deleted.")
          }
        />
      )}
    </div>
  );
}
