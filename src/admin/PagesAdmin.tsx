import { FormEvent, useEffect, useState } from "react";
import { SearchSelect } from "../components/SearchSelect";
import { slugify } from "../utils/format";
import { api } from "./api";
import { useNotify } from "./notify";
import { RichText } from "./RichText";
import { Area, Field, TextInput } from "./ui";
import { ConfirmModal, DataTable, ImageField, Modal } from "./widgets";

type CmsPage = {
  id?: number;
  group: string;
  slug: string;
  title: string;
  cover: string;
  excerpt: string;
  body: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  sortOrder: number;
  published: boolean;
};

const blank = (): CmsPage => ({
  group: "company",
  slug: "",
  title: "",
  cover: "",
  excerpt: "",
  body: "",
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
  sortOrder: 0,
  published: false,
});

export function PagesAdmin() {
  const [rows, setRows] = useState<CmsPage[]>([]);
  const [form, setForm] = useState<CmsPage | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [removing, setRemoving] = useState<CmsPage | null>(null);
  const { errors, run } = useNotify();
  const load = () => api<CmsPage[]>("/api/admin/pages").then(setRows);
  useEffect(() => {
    load();
  }, []);

  const save = (event: FormEvent, published: boolean) => {
    event.preventDefault();
    if (!form) return;
    const payload = { ...form, published };
    run(async () => {
      const saved = await api<CmsPage>(editing ? `/api/admin/pages/${editing}` : "/api/admin/pages", {
        method: editing ? "PUT" : "POST",
        body: JSON.stringify(payload),
      });
      setEditing(saved.slug);
      setForm(saved);
      await load();
    }, published ? "Page published." : "Draft saved.");
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Pages</h1>
          <p className="text-sm text-muted">Company and travel-guide pages, each with a cover, title, and search listing.</p>
        </div>
        <button type="button" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white" onClick={() => { setEditing(null); setForm(blank()); }}>
          New page
        </button>
      </div>
      <DataTable
        rows={rows}
        searchText={(row) => `${row.title} ${row.group} ${row.slug}`}
        rowKey={(row) => row.slug}
        columns={[
          { key: "title", label: "Title", sortValue: (row) => row.title, render: (row) => <span className="font-semibold">{row.title}</span> },
          { key: "group", label: "Menu", sortValue: (row) => row.group, render: (row) => (row.group === "guide" ? "Travel guides" : "Company") },
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
        <Modal full title={editing ? form.title || "Edit page" : "New page"} onClose={() => setForm(null)}>
          <form className="grid gap-4" noValidate onSubmit={(event) => save(event, true)}>
            <div className="flex flex-wrap justify-end gap-2">
              <button type="button" className="rounded-lg border border-line bg-white px-4 py-2 text-sm font-semibold" onClick={(event) => save(event, false)}>Save draft</button>
              <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">Publish</button>
            </div>
            <section className="grid gap-3 rounded-2xl bg-white p-4 lg:grid-cols-2">
              <Field label="Title" error={errors.title}><TextInput value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value, slug: slugify(event.target.value) })} /></Field>
              <Field label="Slug" error={errors.slug}><TextInput value={form.slug} readOnly /></Field>
              <Field label="Menu" error={errors.group}>
                <SearchSelect
                  value={form.group}
                  options={[{ value: "company", label: "Company" }, { value: "guide", label: "Travel guides" }]}
                  onChange={(group) => setForm({ ...form, group: group || "company" })}
                />
              </Field>
              <Field label="Order"><TextInput type="number" value={form.sortOrder} onChange={(event) => setForm({ ...form, sortOrder: Number(event.target.value) })} /></Field>
              <Field label="Short summary" error={errors.excerpt}><Area value={form.excerpt} onChange={(event) => setForm({ ...form, excerpt: event.target.value })} /></Field>
              <Field label="Cover image" error={errors.cover}><ImageField value={form.cover} onChange={(cover) => setForm({ ...form, cover })} /></Field>
            </section>
            <section className="rounded-2xl bg-white p-4">
              <p className="mb-2 text-sm font-semibold">Page content</p>
              <RichText value={form.body} onChange={(body) => setForm((current) => (current ? { ...current, body } : current))} />
              {errors.body && <p className="mt-1 text-xs text-red-700">{errors.body}</p>}
            </section>
            <section className="grid gap-3 rounded-2xl bg-white p-4">
              <h2 className="text-sm font-bold">Search listing</h2>
              <Field label="Meta title" error={errors.metaTitle}><TextInput value={form.metaTitle} onChange={(event) => setForm({ ...form, metaTitle: event.target.value })} /></Field>
              <Field label="Meta description" error={errors.metaDescription}><Area value={form.metaDescription} onChange={(event) => setForm({ ...form, metaDescription: event.target.value })} /></Field>
              <Field label="Meta keywords" error={errors.metaKeywords}><TextInput value={form.metaKeywords} onChange={(event) => setForm({ ...form, metaKeywords: event.target.value })} /></Field>
            </section>
          </form>
        </Modal>
      )}
      {removing && (
        <ConfirmModal
          title={`Delete ${removing.title}?`}
          message="It will leave the Company or Travel guides menu."
          confirmLabel="Delete"
          onClose={() => setRemoving(null)}
          onConfirm={() =>
            run(async () => {
              await api(`/api/admin/pages/${removing.slug}`, { method: "DELETE" });
              setRemoving(null);
              await load();
            }, "Page deleted.")
          }
        />
      )}
    </div>
  );
}
