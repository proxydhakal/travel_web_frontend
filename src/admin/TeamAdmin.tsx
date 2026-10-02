import { FormEvent, useEffect, useState } from "react";
import { api } from "./api";
import { useNotify } from "./notify";
import { Area, Check, Field, TextInput } from "./ui";
import { ConfirmModal, DataTable, ImageField, Modal } from "./widgets";

type Member = { id?: number; name: string; role: string; bio: string; image: string; sortOrder: number; published: boolean };

const empty = (): Member => ({ name: "", role: "", bio: "", image: "", sortOrder: 0, published: true });

export function TeamAdmin() {
  const [rows, setRows] = useState<Member[]>([]);
  const [form, setForm] = useState<Member | null>(null);
  const [removing, setRemoving] = useState<Member | null>(null);
  const { errors, run } = useNotify();
  const load = () => api<Member[]>("/api/admin/team").then(setRows);
  useEffect(() => {
    load();
  }, []);

  const save = (event: FormEvent) => {
    event.preventDefault();
    if (!form) return;
    run(async () => {
      if (form.id) await api(`/api/admin/team/${form.id}`, { method: "PUT", body: JSON.stringify(form) });
      else await api("/api/admin/team", { method: "POST", body: JSON.stringify(form) });
      setForm(null);
      await load();
    }, "Team member saved.");
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">Team</h1>
        <button type="button" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white" onClick={() => setForm(empty())}>
          New member
        </button>
      </div>
      <DataTable
        rows={rows}
        rowKey={(row) => String(row.id)}
        searchText={(row) => `${row.name} ${row.role} ${row.bio}`}
        columns={[
          { key: "name", label: "Name", sortValue: (row) => row.name, render: (row) => <span className="font-semibold">{row.name}</span> },
          { key: "role", label: "Role", sortValue: (row) => row.role, render: (row) => row.role },
          { key: "order", label: "Order", sortValue: (row) => row.sortOrder, render: (row) => row.sortOrder },
          { key: "status", label: "Status", sortValue: (row) => (row.published ? "Live" : "Draft"), render: (row) => (row.published ? "Live" : "Draft") },
          {
            key: "actions",
            label: "",
            render: (row) => (
              <div className="flex justify-end gap-3">
                <button type="button" className="text-sm font-semibold text-secondary" onClick={() => setForm(row)}>Edit</button>
                <button type="button" className="text-sm text-red-700" onClick={() => setRemoving(row)}>Delete</button>
              </div>
            ),
          },
        ]}
      />
      {form && (
        <Modal full title={form.id ? form.name || "Edit member" : "New member"} onClose={() => setForm(null)}>
          <form className="grid gap-3 lg:grid-cols-2" noValidate onSubmit={save}>
            <div className="lg:col-span-2 flex justify-end">
              <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">Save</button>
            </div>
            <Field label="Name" error={errors.name}><TextInput value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></Field>
            <Field label="Role" error={errors.role}><TextInput value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })} /></Field>
            <Field label="Bio" error={errors.bio}><Area value={form.bio} onChange={(event) => setForm({ ...form, bio: event.target.value })} /></Field>
            <Field label="Order"><TextInput type="number" value={form.sortOrder} onChange={(event) => setForm({ ...form, sortOrder: Number(event.target.value) })} /></Field>
            <Field label="Photo" error={errors.image}><ImageField value={form.image} onChange={(image) => setForm({ ...form, image })} /></Field>
            <Check label="Published" checked={form.published} onChange={(published) => setForm({ ...form, published })} />
          </form>
        </Modal>
      )}
      {removing && (
        <ConfirmModal
          title={`Remove ${removing.name}?`}
          message="They will leave the public team page."
          confirmLabel="Delete"
          onClose={() => setRemoving(null)}
          onConfirm={() =>
            run(async () => {
              await api(`/api/admin/team/${removing.id}`, { method: "DELETE" });
              setRemoving(null);
              await load();
            }, "Team member removed.")
          }
        />
      )}
    </div>
  );
}
