import { FormEvent, useEffect, useState } from "react";
import { api } from "./api";
import { useNotify } from "./notify";
import { Area, Field, TextInput } from "./ui";
import { Modal } from "./widgets";

export function ContactPageAdmin() {
  const [form, setForm] = useState({ heading: "", intro: "" });
  const [open, setOpen] = useState(false);
  const { errors, run } = useNotify();
  useEffect(() => {
    api<{ contactPage?: { heading: string; intro: string } }>("/api/admin/settings").then((data) => {
      if (data.contactPage) setForm(data.contactPage);
    });
  }, []);

  const save = (event: FormEvent) => {
    event.preventDefault();
    run(async () => {
      const saved = await api<{ heading: string; intro: string }>("/api/admin/settings/contact", { method: "PUT", body: JSON.stringify(form) });
      setForm(saved);
      setOpen(false);
    }, "Contact page saved.");
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Contact page</h1>
          <p className="text-sm text-muted">Phone, email, and address come from the company profile. This text sits above the form.</p>
        </div>
        <button type="button" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white" onClick={() => setOpen(true)}>Edit</button>
      </div>
      <div className="rounded-2xl bg-white p-4">
        <p className="text-lg font-bold text-primary">{form.heading || "No heading yet"}</p>
        <p className="mt-2 text-sm leading-6 text-muted">{form.intro || "No introduction yet."}</p>
      </div>
      {open && (
      <Modal full title="Edit contact page" onClose={() => setOpen(false)}>
    <form onSubmit={save} className="grid gap-3" noValidate>
      <div className="flex justify-end">
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">Save</button>
      </div>
      <Field label="Heading" error={errors.heading}><TextInput value={form.heading} onChange={(event) => setForm({ ...form, heading: event.target.value })} /></Field>
      <Field label="Introduction" error={errors.intro}><Area value={form.intro} onChange={(event) => setForm({ ...form, intro: event.target.value })} /></Field>
    </form>
      </Modal>
      )}
    </div>
  );
}
