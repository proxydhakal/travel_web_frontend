import { FormEvent, useEffect, useState } from "react";
import type { Testimonial } from "../types";
import { api } from "./api";
import { useNotify } from "./notify";
import { Area, Check, Field, TextInput } from "./ui";
import { ConfirmModal, DataTable, Modal } from "./widgets";

const empty = (): Testimonial => ({ id: "", name: "", country: "", rating: 5, trip: "", quote: "", source: "Guest", date: "", published: true });

export function TestimonialsAdmin() {
  const [rows, setRows] = useState<Testimonial[]>([]);
  const [form, setForm] = useState<Testimonial | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [removing, setRemoving] = useState<Testimonial | null>(null);
  const { run } = useNotify();
  const load = () => api<Testimonial[]>("/api/admin/testimonials").then(setRows);
  useEffect(() => {
    load();
  }, []);

  const save = (event: FormEvent) => {
    event.preventDefault();
    if (!form) return;
    run(async () => {
      if (editing) await api(`/api/admin/testimonials/${editing}`, { method: "PUT", body: JSON.stringify(form) });
      else await api("/api/admin/testimonials", { method: "POST", body: JSON.stringify(form) });
      setForm(null);
      setEditing(null);
      await load();
    }, "Quote saved.");
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">Testimonials</h1>
        <button type="button" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white" onClick={() => { setEditing(null); setForm(empty()); }}>
          New quote
        </button>
      </div>
      <DataTable
        rows={rows}
        rowKey={(row) => row.id}
        searchText={(row) => `${row.name} ${row.country} ${row.trip} ${row.quote}`}
        columns={[
          { key: "name", label: "Guest", sortValue: (row) => row.name, render: (row) => <span className="font-semibold">{row.name}</span> },
          { key: "trip", label: "Trip", sortValue: (row) => row.trip, render: (row) => row.trip },
          { key: "rating", label: "Rating", sortValue: (row) => row.rating, render: (row) => row.rating },
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
        <Modal full title={editing ? form.name || "Edit quote" : "New quote"} onClose={() => setForm(null)}>
          <form className="grid gap-3 lg:grid-cols-2" onSubmit={save}>
            <div className="lg:col-span-2 flex justify-end">
              <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">Save</button>
            </div>
            <Field label="Name"><TextInput value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></Field>
            <Field label="Country"><TextInput value={form.country} onChange={(event) => setForm({ ...form, country: event.target.value })} /></Field>
            <Field label="Trip"><TextInput value={form.trip} onChange={(event) => setForm({ ...form, trip: event.target.value })} /></Field>
            <Field label="Rating"><TextInput type="number" step="0.1" value={form.rating} onChange={(event) => setForm({ ...form, rating: Number(event.target.value) })} /></Field>
            <div className="lg:col-span-2">
              <Field label="Quote"><Area value={form.quote} onChange={(event) => setForm({ ...form, quote: event.target.value })} /></Field>
            </div>
            <Check label="Published" checked={form.published !== false} onChange={(published) => setForm({ ...form, published })} />
          </form>
        </Modal>
      )}
      {removing && (
        <ConfirmModal
          title={`Delete the quote from ${removing.name}?`}
          message="It will leave the public recommendations."
          confirmLabel="Delete"
          onClose={() => setRemoving(null)}
          onConfirm={() =>
            run(async () => {
              await api(`/api/admin/testimonials/${removing.id}`, { method: "DELETE" });
              setRemoving(null);
              await load();
            }, "Quote deleted.")
          }
        />
      )}
    </div>
  );
}
