import type { ReactNode, SelectHTMLAttributes } from "react";

export function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="grid gap-1 text-sm font-medium text-ink">
      {label}
      {children}
      {error && <span className="text-xs font-normal text-red-700">{error}</span>}
    </label>
  );
}

export const inputClass = "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm font-normal outline-none focus:border-secondary";

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputClass} ${props.readOnly ? "cursor-default bg-[#f7f9fb] text-muted" : ""}`} />;
}

export function Area(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputClass} min-h-24`} />;
}

export function Lines({ label, value, onChange }: { label: string; value: string[]; onChange: (next: string[]) => void }) {
  return (
    <Field label={label}>
      <Area value={value.join("\n")} onChange={(event) => onChange(event.target.value.split("\n"))} />
    </Field>
  );
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={inputClass} />;
}

export function RepeatList({
  label,
  items,
  onChange,
  placeholder,
  error,
}: {
  label: string;
  items: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  error?: string;
}) {
  return (
    <fieldset className="grid gap-2 rounded-2xl border border-line bg-white p-4">
      <legend className="px-1 text-sm font-semibold">{label}</legend>
      {items.map((item, index) => (
        <div key={index} className="flex gap-2">
          <TextInput
            value={item}
            placeholder={placeholder}
            onChange={(event) => onChange(items.map((value, itemIndex) => (itemIndex === index ? event.target.value : value)))}
          />
          <button type="button" className="text-sm text-red-700" onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}>
            Remove
          </button>
        </div>
      ))}
      <button type="button" className="justify-self-start text-sm font-semibold text-secondary" onClick={() => onChange([...items, ""])}>
        Add
      </button>
      {error && <p className="text-xs text-red-700">{error}</p>}
    </fieldset>
  );
}

export function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (next: boolean) => void }) {
  return (
    <label className="inline-flex items-center gap-2 text-sm font-medium">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      {label}
    </label>
  );
}
