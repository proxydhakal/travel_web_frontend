import { FormEvent, useEffect, useState } from "react";
import { slugify } from "../utils/format";
import { api } from "./api";
import { useNotify } from "./notify";
import { RichText } from "./RichText";
import { Area, Check, Field, TextInput } from "./ui";
import { ConfirmModal, DataTable, Modal } from "./widgets";

type Doc = { id?: number; slug: string; title: string; summary: string; body: string; published: boolean };

const blank = (): Doc => ({ slug: "", title: "", summary: "", body: "", published: true });

export function LegalAdmin() {
  const [rows, setRows] = useState<Doc[]>([]);
  const [form, setForm] = useState<Doc | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [removing, setRemoving] = useState<Doc | null>(null);
  const { errors, run } = useNotify();
  const load = () => api<Doc[]>("/api/admin/legal").then(setRows);
  useEffect(() => {
    load();
  }, []);

  const save = (event: FormEvent) => {
    event.preventDefault();
    if (!form) return;
    run(async () => {
      const saved = await api<Doc>(editing ? `/api/admin/legal/${editing}` : "/api/admin/legal", {
        method: editing ? "PUT" : "POST",
        body: JSON.stringify(form),
      });
      setEditing(saved.slug);
      setForm(saved);
      await load();
    }, "Document saved.");
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">Legal documents</h1>
        <button type="button" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white" onClick={() => { setEditing(null); setForm(blank()); }}>
          New document
        </button>
      </div>
      <DataTable
        rows={rows}
        rowKey={(row) => row.slug}
        searchText={(row) => `${row.title} ${row.slug} ${row.summary}`}
        columns={[
          { key: "title", label: "Title", sortValue: (row) => row.title, render: (row) => <span className="font-semibold">{row.title}</span> },
          { key: "slug", label: "Address", sortValue: (row) => row.slug, render: (row) => row.slug },
          { key: "status", label: "Status", sortValue: (row) => (row.published ? "Live" : "Draft"), render: (row) => (row.published ? "Live" : "Draft") },
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
        <Modal full title={editing ? form.title || "Edit document" : "New document"} onClose={() => setForm(null)}>
          <form className="grid gap-3" noValidate onSubmit={save}>
            <div className="flex justify-end">
              <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">Save</button>
            </div>
            <section className="grid gap-3 rounded-2xl bg-white p-4 lg:grid-cols-2">
              <Field label="Title" error={errors.title}><TextInput value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value, slug: slugify(event.target.value) })} /></Field>
              <Field label="Slug" error={errors.slug}><TextInput value={form.slug} readOnly /></Field>
              <div className="lg:col-span-2">
                <Field label="Summary" error={errors.summary}><Area value={form.summary} onChange={(event) => setForm({ ...form, summary: event.target.value })} /></Field>
              </div>
            </section>
            <section className="rounded-2xl bg-white p-4">
              <p className="mb-2 text-sm font-medium">Document</p>
              <RichText value={form.body} onChange={(body) => setForm((current) => (current ? { ...current, body } : current))} />
              {errors.body && <p className="mt-1 text-xs text-red-700">{errors.body}</p>}
            </section>
            <Check label="Published" checked={form.published} onChange={(published) => setForm({ ...form, published })} />
          </form>
        </Modal>
      )}
      {removing && (
        <ConfirmModal
          title={`Delete ${removing.title}?`}
          message="The public legal page for this document will disappear."
          confirmLabel="Delete"
          onClose={() => setRemoving(null)}
          onConfirm={() =>
            run(async () => {
              await api(`/api/admin/legal/${removing.slug}`, { method: "DELETE" });
              setRemoving(null);
              await load();
            }, "Document deleted.")
          }
        />
      )}
    </div>
  );
}
