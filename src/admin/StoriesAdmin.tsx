import { FormEvent, useEffect, useState } from "react";
import type { Story } from "../types";
import { slugify } from "../utils/format";
import { api } from "./api";
import { useNotify } from "./notify";
import { Area, Check, Field, TextInput } from "./ui";
import { ConfirmModal, DataTable, ImageField, Modal } from "./widgets";

const blank = (): Story => ({ slug: "", title: "", date: "", author: "", image: "", excerpt: "", body: [""], published: true });

export function StoriesAdmin() {
  const [rows, setRows] = useState<Story[]>([]);
  const [form, setForm] = useState<Story | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [removing, setRemoving] = useState<Story | null>(null);
  const { run } = useNotify();
  const load = () => api<Story[]>("/api/admin/stories").then(setRows);
  useEffect(() => {
    load();
  }, []);

  const save = (event: FormEvent) => {
    event.preventDefault();
    if (!form) return;
    run(async () => {
      const saved = await api<Story>(editing ? `/api/admin/stories/${editing}` : "/api/admin/stories", {
        method: editing ? "PUT" : "POST",
        body: JSON.stringify({ ...form, body: form.body.filter(Boolean) }),
      });
      setEditing(saved.slug);
      setForm(saved);
      await load();
    }, "Story saved.");
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">Stories</h1>
        <button type="button" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white" onClick={() => { setEditing(null); setForm(blank()); }}>
          New story
        </button>
      </div>
      <DataTable
        rows={rows}
        rowKey={(row) => row.slug}
        searchText={(row) => `${row.title} ${row.author} ${row.excerpt}`}
        columns={[
          { key: "title", label: "Title", sortValue: (row) => row.title, render: (row) => <span className="font-semibold">{row.title}</span> },
          { key: "author", label: "Author", sortValue: (row) => row.author, render: (row) => row.author },
          { key: "date", label: "Date", sortValue: (row) => row.date, render: (row) => row.date },
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
        <Modal full title={editing ? form.title || "Edit story" : "New story"} onClose={() => setForm(null)}>
          <form className="grid gap-3 lg:grid-cols-2" noValidate onSubmit={save}>
            <div className="lg:col-span-2 flex justify-end">
              <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">Save</button>
            </div>
            <Field label="Title"><TextInput value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value, slug: slugify(event.target.value) })} /></Field>
            <Field label="Slug"><TextInput value={form.slug} readOnly /></Field>
            <Field label="Date"><TextInput value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} /></Field>
            <Field label="Author"><TextInput value={form.author} onChange={(event) => setForm({ ...form, author: event.target.value })} /></Field>
            <Field label="Excerpt"><Area value={form.excerpt} onChange={(event) => setForm({ ...form, excerpt: event.target.value })} /></Field>
            <Field label="Image"><ImageField value={form.image} onChange={(image) => setForm({ ...form, image })} /></Field>
            <div className="lg:col-span-2">
              <Field label="Body, one paragraph per line">
                <Area className="min-h-48" value={form.body.join("\n\n")} onChange={(event) => setForm({ ...form, body: event.target.value.split(/\n\s*\n/) })} />
              </Field>
            </div>
            <Check label="Published" checked={form.published !== false} onChange={(published) => setForm({ ...form, published })} />
          </form>
        </Modal>
      )}
      {removing && (
        <ConfirmModal
          title={`Delete ${removing.title}?`}
          message="The story will leave the public blog."
          confirmLabel="Delete"
          onClose={() => setRemoving(null)}
          onConfirm={() =>
            run(async () => {
              await api(`/api/admin/stories/${removing.slug}`, { method: "DELETE" });
              setRemoving(null);
              await load();
            }, "Story deleted.")
          }
        />
      )}
    </div>
  );
}
