import { FormEvent, useEffect, useState } from "react";
import { api } from "./api";
import { useNotify } from "./notify";
import { Area, Field, TextInput } from "./ui";
import { ImageField, Modal } from "./widgets";

type Seo = { title: string; description: string; keywords: string; favicon: string; logo: string; ogImage: string };

export function SeoAdmin() {
  const [form, setForm] = useState<Seo>({ title: "", description: "", keywords: "", favicon: "/logo.svg", logo: "/logo.svg", ogImage: "" });
  const [open, setOpen] = useState(false);
  const { errors, run } = useNotify();
  useEffect(() => {
    api<{ seo?: Seo }>("/api/admin/settings").then((data) => {
      if (data.seo) setForm({ ...form, ...data.seo });
    });
  }, []);

  const save = (event: FormEvent) => {
    event.preventDefault();
    run(async () => {
      const saved = await api<Seo>("/api/admin/settings/seo", { method: "PUT", body: JSON.stringify(form) });
      setForm(saved);
      setOpen(false);
    }, "Home page SEO saved.");
  };

  const set = (key: keyof Seo, value: string) => setForm((current) => ({ ...current, [key]: value }));

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Home page SEO</h1>
          <p className="text-sm text-muted">Title, description, keywords, favicon, and logo used across the public site.</p>
        </div>
        <button type="button" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white" onClick={() => setOpen(true)}>Edit</button>
      </div>
      <div className="rounded-2xl bg-white p-4">
        <p className="font-semibold">{form.title || "No title yet"}</p>
        <p className="mt-2 text-sm text-muted">{form.description}</p>
      </div>
      {open && (
      <Modal full title="Edit home page SEO" onClose={() => setOpen(false)}>
    <form onSubmit={save} className="grid gap-3 lg:grid-cols-2" noValidate>
      <div className="flex justify-end lg:col-span-2">
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">Save</button>
      </div>
      <Field label="Home title" error={errors.title}><TextInput value={form.title} onChange={(event) => set("title", event.target.value)} /></Field>
      <Field label="Meta description" error={errors.description}><Area value={form.description} onChange={(event) => set("description", event.target.value)} /></Field>
      <Field label="Meta keywords" error={errors.keywords}><TextInput value={form.keywords} onChange={(event) => set("keywords", event.target.value)} /></Field>
      <Field label="Favicon" error={errors.favicon}><ImageField value={form.favicon} onChange={(favicon) => set("favicon", favicon)} /></Field>
      <Field label="Logo" error={errors.logo}><ImageField value={form.logo} onChange={(logo) => set("logo", logo)} /></Field>
      <Field label="Social image" error={errors.ogImage}><ImageField value={form.ogImage} onChange={(ogImage) => set("ogImage", ogImage)} /></Field>
    </form>
      </Modal>
      )}
    </div>
  );
}
