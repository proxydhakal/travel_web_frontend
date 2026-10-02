import { FormEvent, useEffect, useState } from "react";
import type { Company, MenuColumn, Reason, Social } from "../content/ContentContext";
import { api } from "./api";
import { useNotify } from "./notify";
import { Field, TextInput } from "./ui";
import { Modal } from "./widgets";

type Settings = { company: Company; socials: Social[]; destinationMenu: MenuColumn[]; reasons: Reason[] };

export function SettingsAdmin() {
  const [form, setForm] = useState<Settings | null>(null);
  const [open, setOpen] = useState(false);
  const { errors, run } = useNotify();

  useEffect(() => {
    api<Settings>("/api/admin/settings").then(setForm);
  }, []);

  if (!form) return <p className="text-sm text-muted">Loading company profile…</p>;

  const company = form.company;
  const setCompany = (key: keyof Company, value: string) =>
    setForm({ ...form, company: { ...company, [key]: key === "since" || key === "lat" || key === "lng" ? Number(value) : value } });

  const save = (event: FormEvent) => {
    event.preventDefault();
    run(async () => {
      const saved = await api<Settings>("/api/admin/settings", { method: "PUT", body: JSON.stringify(form) });
      setForm(saved);
      setOpen(false);
    }, "Company profile saved.");
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Company profile</h1>
          <p className="text-sm text-muted">These details appear in the header, footer, and contact card.</p>
        </div>
        <button type="button" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white" onClick={() => setOpen(true)}>Edit profile</button>
      </div>
      <dl className="grid gap-3 rounded-2xl bg-white p-4 sm:grid-cols-2">
        {([
          ["Legal name", company.name],
          ["Owner", company.owner],
          ["Email", company.email],
          ["Phone", company.phone],
          ["Address", company.address],
          ["Hours", company.hours],
        ] as const).map(([label, value]) => (
          <div key={label}>
            <dt className="text-xs uppercase tracking-wide text-muted">{label}</dt>
            <dd className="mt-1 text-sm font-semibold">{value}</dd>
          </div>
        ))}
      </dl>
      {open && (
      <Modal full title="Edit company profile" onClose={() => setOpen(false)}>
    <form onSubmit={save} className="grid gap-4" noValidate>
      <div className="flex justify-end">
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">Save</button>
      </div>
      <div className="grid gap-3 rounded-2xl bg-white p-4 sm:grid-cols-2">
        {(
          [
            ["name", "Legal name"],
            ["short", "Short name"],
            ["slogan", "Slogan"],
            ["owner", "Owner"],
            ["ownerRole", "Owner role"],
            ["phone", "Phone"],
            ["phoneLabel", "Phone label"],
            ["phoneAlt", "Second phone"],
            ["phoneAltLabel", "Second phone label"],
            ["email", "Email"],
            ["address", "Address"],
            ["license", "License"],
            ["regd", "Registration"],
            ["hours", "Office hours"],
            ["reviews", "Review count"],
            ["travelers", "Travelers hosted"],
          ] as const
        ).map(([key, label]) => (
          <Field key={key} label={label} error={errors[key]}>
            <TextInput value={String(company[key] ?? "")} onChange={(event) => setCompany(key, event.target.value)} />
          </Field>
        ))}
        <Field label="Since" error={errors.since}>
          <TextInput value={company.since} onChange={(event) => setCompany("since", event.target.value)} />
        </Field>
        <Field label="Latitude" error={errors.lat}>
          <TextInput value={company.lat} onChange={(event) => setCompany("lat", event.target.value)} />
        </Field>
        <Field label="Longitude" error={errors.lng}>
          <TextInput value={company.lng} onChange={(event) => setCompany("lng", event.target.value)} />
        </Field>
      </div>

      <fieldset className="grid gap-3 rounded-2xl bg-white p-4">
        <legend className="px-1 text-sm font-bold">Social links</legend>
        {form.socials.map((item, index) => (
          <div key={index} className="grid gap-2 sm:grid-cols-[1fr_2fr_auto]">
            <TextInput value={item.label} placeholder="Label" onChange={(event) => setForm({ ...form, socials: form.socials.map((row, rowIndex) => (rowIndex === index ? { ...row, label: event.target.value } : row)) })} />
            <TextInput value={item.href} placeholder="https://" onChange={(event) => setForm({ ...form, socials: form.socials.map((row, rowIndex) => (rowIndex === index ? { ...row, href: event.target.value } : row)) })} />
            <button type="button" className="text-sm text-red-700" onClick={() => setForm({ ...form, socials: form.socials.filter((_, rowIndex) => rowIndex !== index) })}>Remove</button>
          </div>
        ))}
        <button type="button" className="justify-self-start text-sm font-semibold text-secondary" onClick={() => setForm({ ...form, socials: [...form.socials, { label: "", href: "" }] })}>Add link</button>
      </fieldset>

      <fieldset className="grid gap-3 rounded-2xl bg-white p-4">
        <legend className="px-1 text-sm font-bold">Reasons to travel with you</legend>
        {form.reasons.map((item, index) => (
          <div key={index} className="grid gap-2">
            <TextInput value={item.title} placeholder="Title" onChange={(event) => setForm({ ...form, reasons: form.reasons.map((row, rowIndex) => (rowIndex === index ? { ...row, title: event.target.value } : row)) })} />
            <TextInput value={item.text} placeholder="Text" onChange={(event) => setForm({ ...form, reasons: form.reasons.map((row, rowIndex) => (rowIndex === index ? { ...row, text: event.target.value } : row)) })} />
            <button type="button" className="justify-self-start text-sm text-red-700" onClick={() => setForm({ ...form, reasons: form.reasons.filter((_, rowIndex) => rowIndex !== index) })}>Remove</button>
          </div>
        ))}
        <button type="button" className="justify-self-start text-sm font-semibold text-secondary" onClick={() => setForm({ ...form, reasons: [...form.reasons, { title: "", text: "" }] })}>Add reason</button>
      </fieldset>

      <fieldset className="grid gap-4 rounded-2xl bg-white p-4">
        <legend className="px-1 text-sm font-bold">Destination menu</legend>
        {form.destinationMenu.map((column, columnIndex) => (
          <div key={columnIndex} className="grid gap-2 rounded-xl border border-line p-3">
            <TextInput
              value={column.title}
              placeholder="Column title"
              onChange={(event) =>
                setForm({
                  ...form,
                  destinationMenu: form.destinationMenu.map((item, index) => (index === columnIndex ? { ...item, title: event.target.value } : item)),
                })
              }
            />
            {column.links.map((link, linkIndex) => (
              <div key={linkIndex} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                <TextInput
                  value={link.label}
                  placeholder="Label"
                  onChange={(event) =>
                    setForm({
                      ...form,
                      destinationMenu: form.destinationMenu.map((item, index) =>
                        index === columnIndex
                          ? { ...item, links: item.links.map((entry, entryIndex) => (entryIndex === linkIndex ? { ...entry, label: event.target.value } : entry)) }
                          : item,
                      ),
                    })
                  }
                />
                <TextInput
                  value={link.to}
                  placeholder="/packages"
                  onChange={(event) =>
                    setForm({
                      ...form,
                      destinationMenu: form.destinationMenu.map((item, index) =>
                        index === columnIndex
                          ? { ...item, links: item.links.map((entry, entryIndex) => (entryIndex === linkIndex ? { ...entry, to: event.target.value } : entry)) }
                          : item,
                      ),
                    })
                  }
                />
                <button
                  type="button"
                  className="text-sm text-red-700"
                  onClick={() =>
                    setForm({
                      ...form,
                      destinationMenu: form.destinationMenu.map((item, index) =>
                        index === columnIndex ? { ...item, links: item.links.filter((_, entryIndex) => entryIndex !== linkIndex) } : item,
                      ),
                    })
                  }
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="justify-self-start text-sm font-semibold text-secondary"
              onClick={() =>
                setForm({
                  ...form,
                  destinationMenu: form.destinationMenu.map((item, index) => (index === columnIndex ? { ...item, links: [...item.links, { label: "", to: "/" }] } : item)),
                })
              }
            >
              Add link
            </button>
          </div>
        ))}
        <button type="button" className="justify-self-start text-sm font-semibold text-secondary" onClick={() => setForm({ ...form, destinationMenu: [...form.destinationMenu, { title: "", links: [{ label: "", to: "/" }] }] })}>
          Add column
        </button>
        {errors.destinationMenu && <p className="text-xs text-red-700">{errors.destinationMenu}</p>}
      </fieldset>
    </form>
      </Modal>
      )}
    </div>
  );
}
