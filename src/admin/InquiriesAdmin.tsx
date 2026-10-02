import { FormEvent, useEffect, useState } from "react";
import { api } from "./api";
import { useSession } from "./AdminApp";
import { useNotify } from "./notify";
import { Area, Field, TextInput } from "./ui";
import { ConfirmModal, DataTable, Modal } from "./widgets";

type Inquiry = {
  id: number;
  kind: string;
  name: string;
  email: string;
  phone: string;
  destination: string;
  travelDate: string;
  travelers: number;
  message: string;
  packageTitle: string;
  status: string;
  emailStatus: string;
  replySubject: string;
  replyBody: string;
  repliedAt: string;
  createdAt: string;
};

export function InquiriesAdmin() {
  const { user } = useSession();
  const [rows, setRows] = useState<Inquiry[]>([]);
  const [open, setOpen] = useState<Inquiry | null>(null);
  const [removing, setRemoving] = useState(false);
  const [subject, setSubject] = useState("");
  const [reply, setReply] = useState("");
  const { errors, run } = useNotify();
  const load = () => api<Inquiry[]>("/api/admin/inquiries").then(setRows);
  useEffect(() => {
    load();
  }, []);

  const mark = (status: string) => {
    if (!open) return;
    run(async () => {
      await api(`/api/admin/inquiries/${open.id}`, { method: "PATCH", body: JSON.stringify({ status }) });
      await load();
      setOpen(null);
    }, "Inquiry updated.");
  };

  const send = (event: FormEvent) => {
    event.preventDefault();
    if (!open) return;
    run(async () => {
      await api(`/api/admin/inquiries/${open.id}/reply`, { method: "POST", body: JSON.stringify({ subject, message: reply }) });
      setSubject("");
      setReply("");
      setOpen(null);
      await load();
    }, "Reply sent.");
  };

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-primary">Inquiries</h1>
        <p className="text-sm text-muted">Contact forms and package booking requests. Replies are sent as HTML email.</p>
      </div>
      <DataTable
        rows={rows}
        rowKey={(row) => String(row.id)}
        searchText={(row) => `${row.name} ${row.email} ${row.kind} ${row.packageTitle} ${row.destination} ${row.status}`}
        columns={[
          { key: "name", label: "Guest", sortValue: (row) => row.name, render: (row) => <span className="font-semibold">{row.name}</span> },
          { key: "kind", label: "Kind", sortValue: (row) => row.kind, render: (row) => <span className="capitalize">{row.kind}</span> },
          { key: "trip", label: "Trip", sortValue: (row) => row.packageTitle || row.destination, render: (row) => row.packageTitle || row.destination || "General" },
          { key: "status", label: "Status", sortValue: (row) => row.status, render: (row) => <span className="uppercase text-secondary">{row.status}</span> },
          { key: "when", label: "Received", sortValue: (row) => row.createdAt || "", render: (row) => (row.createdAt ? row.createdAt.slice(0, 10) : "—") },
          {
            key: "actions",
            label: "",
            render: (row) => (
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm font-semibold text-secondary"
                  onClick={() => {
                    setOpen(row);
                    setSubject(row.replySubject || `Re: your ${row.kind === "booking" ? "booking request" : "enquiry"}`);
                    setReply("");
                  }}
                >
                  Open
                </button>
              </div>
            ),
          },
        ]}
      />
      {open && (
        <Modal full title={open.name} onClose={() => setOpen(null)}>
          <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
            <section className="rounded-2xl bg-white p-4">
              <p className="text-sm text-muted">{open.email} · {open.phone}</p>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <div><dt className="text-muted">Kind</dt><dd className="capitalize">{open.kind}</dd></div>
                <div><dt className="text-muted">Trip</dt><dd>{open.packageTitle || "—"}</dd></div>
                <div><dt className="text-muted">Destination</dt><dd>{open.destination || "—"}</dd></div>
                <div><dt className="text-muted">Date</dt><dd>{open.travelDate || "—"} · {open.travelers} travelers</dd></div>
              </dl>
              <p className="mt-4 text-sm leading-6">{open.message}</p>
              {open.replyBody && (
                <div className="mt-4 rounded-xl bg-sand p-3 text-sm">
                  <p className="text-xs font-semibold uppercase text-muted">Last reply</p>
                  <p className="mt-1 font-semibold">{open.replySubject}</p>
                  <p className="mt-1 whitespace-pre-wrap">{open.replyBody}</p>
                </div>
              )}
            </section>
            <form className="grid gap-3 self-start rounded-2xl bg-white p-4" onSubmit={send} noValidate>
              <Field label="Subject" error={errors.subject}>
                <TextInput value={subject} onChange={(event) => setSubject(event.target.value)} />
              </Field>
              <Field label="Reply" error={errors.message}>
                <Area value={reply} onChange={(event) => setReply(event.target.value)} />
              </Field>
              <button type="submit" className="rounded-lg bg-[#f5b400] px-3 py-2 text-sm font-semibold text-white">Send reply</button>
              <div className="flex flex-wrap gap-2">
                <button type="button" className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white" onClick={() => mark("read")}>Mark read</button>
                <button type="button" className="rounded-lg border border-line px-3 py-2 text-sm" onClick={() => mark("archived")}>Archive</button>
                {user?.role === "admin" && (
                  <button type="button" className="text-sm text-red-700" onClick={() => setRemoving(true)}>Delete</button>
                )}
              </div>
            </form>
          </div>
        </Modal>
      )}
      {open && removing && (
        <ConfirmModal
          title={`Delete inquiry from ${open.name}?`}
          message="The message and any saved reply text will be removed."
          confirmLabel="Delete"
          onClose={() => setRemoving(false)}
          onConfirm={() =>
            run(async () => {
              await api(`/api/admin/inquiries/${open.id}`, { method: "DELETE" });
              setRemoving(false);
              setOpen(null);
              await load();
            }, "Inquiry deleted.")
          }
        />
      )}
    </div>
  );
}
