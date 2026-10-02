import { FormEvent, useEffect, useState } from "react";
import { api } from "./api";
import { useNotify } from "./notify";
import { Area, Field, TextInput } from "./ui";
import { ImageField, Modal } from "./widgets";

type About = {
  heroImage: string;
  heading: string;
  paragraphs: string[];
  mission: string;
  vision: string;
  promise: string;
  values: { title: string; text: string }[];
};

const empty: About = { heroImage: "", heading: "", paragraphs: [""], mission: "", vision: "", promise: "", values: [] };

export function AboutAdmin() {
  const [form, setForm] = useState<About>(empty);
  const [open, setOpen] = useState(false);
  const { errors, run } = useNotify();

  useEffect(() => {
    api<{ about?: About }>("/api/admin/settings").then((data) => {
      if (data.about) setForm({ ...empty, ...data.about, paragraphs: data.about.paragraphs?.length ? data.about.paragraphs : [""] });
    });
  }, []);

  const save = (event: FormEvent) => {
    event.preventDefault();
    run(async () => {
      const saved = await api<About>("/api/admin/settings/about", { method: "PUT", body: JSON.stringify({ ...form, paragraphs: form.paragraphs.filter(Boolean) }) });
      setForm({ ...saved, paragraphs: saved.paragraphs.length ? saved.paragraphs : [""] });
      setOpen(false);
    }, "About page saved.");
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">About page</h1>
          <p className="text-sm text-muted">{form.heading || "The public about story."}</p>
        </div>
        <button type="button" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white" onClick={() => setOpen(true)}>Edit</button>
      </div>
      <div className="rounded-2xl bg-white p-4 text-sm leading-6 text-muted">
        {form.paragraphs.filter(Boolean).slice(0, 1).join(" ") || "No story yet."}
      </div>
      {open && (
      <Modal full title="Edit about page" onClose={() => setOpen(false)}>
    <form onSubmit={save} className="grid gap-3" noValidate>
      <div className="flex justify-end">
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">Save</button>
      </div>
      <section className="grid gap-3 rounded-2xl bg-white p-4 lg:grid-cols-2">
      <Field label="Heading" error={errors.heading}><TextInput value={form.heading} onChange={(event) => setForm({ ...form, heading: event.target.value })} /></Field>
      <Field label="Hero image" error={errors.heroImage}><ImageField value={form.heroImage} onChange={(heroImage) => setForm({ ...form, heroImage })} /></Field>
      </section>
      <fieldset className="grid gap-2 rounded-2xl bg-white p-4">
        <legend className="px-1 text-sm font-bold">Story paragraphs</legend>
        {form.paragraphs.map((paragraph, index) => (
          <div key={index} className="grid gap-2">
            <Area value={paragraph} onChange={(event) => setForm({ ...form, paragraphs: form.paragraphs.map((item, itemIndex) => (itemIndex === index ? event.target.value : item)) })} />
            <button type="button" className="justify-self-start text-xs text-red-700" onClick={() => setForm({ ...form, paragraphs: form.paragraphs.filter((_, itemIndex) => itemIndex !== index) })}>Remove</button>
          </div>
        ))}
        <button type="button" className="justify-self-start text-sm font-semibold text-secondary" onClick={() => setForm({ ...form, paragraphs: [...form.paragraphs, ""] })}>Add paragraph</button>
      </fieldset>
      <Field label="Mission" error={errors.mission}><Area value={form.mission} onChange={(event) => setForm({ ...form, mission: event.target.value })} /></Field>
      <Field label="Vision" error={errors.vision}><Area value={form.vision} onChange={(event) => setForm({ ...form, vision: event.target.value })} /></Field>
      <Field label="Promise" error={errors.promise}><Area value={form.promise} onChange={(event) => setForm({ ...form, promise: event.target.value })} /></Field>
      <fieldset className="grid gap-3 rounded-2xl bg-white p-4">
        <legend className="px-1 text-sm font-bold">Values</legend>
        {form.values.map((value, index) => (
          <div key={index} className="grid gap-2">
            <TextInput value={value.title} placeholder="Title" onChange={(event) => setForm({ ...form, values: form.values.map((item, itemIndex) => (itemIndex === index ? { ...item, title: event.target.value } : item)) })} />
            <TextInput value={value.text} placeholder="Text" onChange={(event) => setForm({ ...form, values: form.values.map((item, itemIndex) => (itemIndex === index ? { ...item, text: event.target.value } : item)) })} />
            <button type="button" className="justify-self-start text-xs text-red-700" onClick={() => setForm({ ...form, values: form.values.filter((_, itemIndex) => itemIndex !== index) })}>Remove</button>
          </div>
        ))}
        <button type="button" className="justify-self-start text-sm font-semibold text-secondary" onClick={() => setForm({ ...form, values: [...form.values, { title: "", text: "" }] })}>Add value</button>
      </fieldset>
    </form>
      </Modal>
      )}
    </div>
  );
}
