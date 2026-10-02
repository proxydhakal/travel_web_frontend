import { FormEvent, useEffect, useState } from "react";
import { SearchSelect } from "../components/SearchSelect";
import { api } from "./api";
import type { StaffUser } from "./AdminApp";
import { useNotify } from "./notify";
import { Check, Field, TextInput } from "./ui";
import { ConfirmModal, DataTable, Modal } from "./widgets";

type Draft = { id?: number; name: string; email: string; password: string; role: "admin" | "editor"; active: boolean };

const blank = (): Draft => ({ name: "", email: "", password: "", role: "editor", active: true });

export function UsersAdmin() {
  const [rows, setRows] = useState<StaffUser[]>([]);
  const [form, setForm] = useState<Draft | null>(null);
  const [removing, setRemoving] = useState<StaffUser | null>(null);
  const { errors, run } = useNotify();
  const load = () => api<StaffUser[]>("/api/admin/users").then(setRows);
  useEffect(() => {
    load();
  }, []);

  const save = (event: FormEvent) => {
    event.preventDefault();
    if (!form) return;
    run(async () => {
      if (form.id) {
        await api(`/api/admin/users/${form.id}`, {
          method: "PUT",
          body: JSON.stringify({
            name: form.name,
            role: form.role,
            active: form.active,
            ...(form.password ? { password: form.password } : {}),
          }),
        });
      } else {
        await api("/api/admin/users", { method: "POST", body: JSON.stringify(form) });
      }
      setForm(null);
      await load();
    }, form.id ? "User updated." : "User created.");
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Users</h1>
          <p className="text-sm text-muted">Admins manage accounts. Editors can change content and read inquiries.</p>
        </div>
        <button type="button" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white" onClick={() => setForm(blank())}>
          New user
        </button>
      </div>
      <DataTable
        rows={rows}
        rowKey={(row) => String(row.id)}
        searchText={(row) => `${row.name} ${row.email} ${row.role}`}
        columns={[
          { key: "name", label: "Name", sortValue: (row) => row.name, render: (row) => <span className="font-semibold">{row.name}</span> },
          { key: "email", label: "Email", sortValue: (row) => row.email, render: (row) => row.email },
          { key: "role", label: "Role", sortValue: (row) => row.role, render: (row) => row.role },
          { key: "status", label: "Status", sortValue: (row) => (row.active ? "Active" : "Inactive"), render: (row) => (row.active ? "Active" : "Inactive") },
          {
            key: "actions",
            label: "",
            render: (row) => (
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  className="text-sm font-semibold text-secondary"
                  onClick={() => setForm({ id: row.id, name: row.name, email: row.email, password: "", role: row.role, active: row.active })}
                >
                  Edit
                </button>
                <button type="button" className="text-sm text-red-700" onClick={() => setRemoving(row)}>Delete</button>
              </div>
            ),
          },
        ]}
      />
      {form && (
        <Modal full title={form.id ? "Edit user" : "New user"} onClose={() => setForm(null)}>
          <form className="grid gap-3 lg:grid-cols-2" noValidate onSubmit={save}>
            <div className="flex justify-end lg:col-span-2">
              <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">Save</button>
            </div>
            <Field label="Name" error={errors.name}><TextInput value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></Field>
            <Field label="Email" error={errors.email}>
              <TextInput type="email" value={form.email} disabled={Boolean(form.id)} onChange={(event) => setForm({ ...form, email: event.target.value })} />
            </Field>
            <Field label={form.id ? "New password" : "Password"} error={errors.password}>
              <TextInput type="password" value={form.password} placeholder={form.id ? "Leave blank to keep the current password" : ""} onChange={(event) => setForm({ ...form, password: event.target.value })} />
            </Field>
            <Field label="Role" error={errors.role}>
              <SearchSelect
                value={form.role}
                options={[{ value: "editor", label: "Editor" }, { value: "admin", label: "Admin" }]}
                onChange={(role) => setForm({ ...form, role: role === "admin" ? "admin" : "editor" })}
              />
            </Field>
            <Check label="Active" checked={form.active} onChange={(active) => setForm({ ...form, active })} />
          </form>
        </Modal>
      )}
      {removing && (
        <ConfirmModal
          title={`Delete ${removing.name}?`}
          message="They will no longer be able to sign in. Your own account cannot be deleted."
          confirmLabel="Delete"
          onClose={() => setRemoving(null)}
          onConfirm={() =>
            run(async () => {
              await api(`/api/admin/users/${removing.id}`, { method: "DELETE" });
              setRemoving(null);
              await load();
            }, "User deleted.")
          }
        />
      )}
    </div>
  );
}
