import { useMemo, useState, type ReactNode } from "react";
import { useDropzone } from "react-dropzone";
import { api } from "./api";

export function Modal({
  title,
  onClose,
  children,
  full = false,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  full?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/50 p-4 sm:p-8" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`max-h-[90vh] w-full overflow-auto rounded-2xl bg-white p-5 shadow-floating ${full ? "max-w-5xl" : "max-w-2xl"}`}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-primary">{title}</h2>
          <button type="button" className="rounded-lg border border-line px-3 py-1.5 text-sm" onClick={onClose}>
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function ConfirmModal({
  title,
  message,
  confirmLabel,
  onConfirm,
  onClose,
}: {
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-ink/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-floating" role="dialog" aria-modal="true">
        <h2 className="text-xl font-bold text-primary">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-muted">{message}</p>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" className="rounded-lg border border-line px-4 py-2 text-sm" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

type Column<T> = { key: string; label: string; render: (row: T) => ReactNode; sortValue?: (row: T) => string | number };

export function DataTable<T>({
  rows,
  columns,
  searchText,
  rowKey,
}: {
  rows: T[];
  columns: Column<T>[];
  searchText: (row: T) => string;
  rowKey?: (row: T) => string;
}) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const pageSize = 8;
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((row) => searchText(row).toLowerCase().includes(term));
  }, [rows, query, searchText]);
  const sorted = useMemo(() => {
    const column = columns.find((item) => item.key === sortKey && item.sortValue);
    if (!column?.sortValue) return filtered;
    const valueOf = column.sortValue;
    return [...filtered].sort((left, right) => {
      const a = valueOf(left);
      const b = valueOf(right);
      const result = typeof a === "number" && typeof b === "number" ? a - b : String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: "base" });
      return sortDir === "asc" ? result : -result;
    });
  }, [filtered, columns, sortKey, sortDir]);
  const pages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, pages - 1);
  const view = sorted.slice(safePage * pageSize, safePage * pageSize + pageSize);
  const toggleSort = (key: string) => {
    if (sortKey === key) setSortDir((current) => (current === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(0);
  };

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-subtle">
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setPage(0);
          }}
          placeholder="Search this table"
          className="w-full max-w-xs rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-secondary"
        />
        <p className="text-xs text-muted">{sorted.length} rows</p>
      </div>
      <div className="overflow-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-[#f7f9fb] text-xs uppercase tracking-wide text-muted">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3 font-semibold" aria-sort={sortKey === column.key ? (sortDir === "asc" ? "ascending" : "descending") : "none"}>
                  {column.sortValue ? (
                    <button type="button" className="inline-flex items-center gap-1 uppercase tracking-wide" onClick={() => toggleSort(column.key)}>
                      {column.label}
                      <span aria-hidden="true">{sortKey === column.key ? (sortDir === "asc" ? "↑" : "↓") : "↕"}</span>
                    </button>
                  ) : (
                    column.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {view.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-muted">
                  No rows match.
                </td>
              </tr>
            )}
            {view.map((row, index) => (
              <tr key={rowKey ? rowKey(row) : index} className="border-t border-line">
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-3 align-middle">
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-end gap-2 border-t border-line px-4 py-3 text-sm">
        <button type="button" className="rounded-lg border border-line px-3 py-1 disabled:opacity-40" disabled={safePage === 0} onClick={() => setPage((current) => current - 1)}>
          Previous
        </button>
        <span className="text-muted">
          {safePage + 1} / {pages}
        </span>
        <button type="button" className="rounded-lg border border-line px-3 py-1 disabled:opacity-40" disabled={safePage + 1 >= pages} onClick={() => setPage((current) => current + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}

const imageAccept = { "image/jpeg": [], "image/png": [], "image/webp": [], "image/svg+xml": [] };

async function uploadImage(file: File) {
  const body = new FormData();
  body.append("file", file);
  const saved = await api<{ url: string }>("/api/admin/uploads", { method: "POST", body });
  return saved.url;
}

export function ImageField({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [preview, setPreview] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: imageAccept,
    multiple: false,
    onDrop: (accepted) => {
      const next = accepted[0];
      if (!next) return;
      setFile(next);
      setError("");
      const reader = new FileReader();
      reader.onload = () => setPreview(String(reader.result || ""));
      reader.readAsDataURL(next);
    },
  });
  const shown = preview || value;

  const upload = async () => {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      onChange(await uploadImage(file));
      setPreview("");
      setFile(null);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid gap-3">
      <div
        {...getRootProps()}
        className={`relative grid min-h-48 cursor-pointer place-items-center overflow-hidden rounded-2xl border-2 border-dashed ${isDragActive ? "border-secondary bg-tertiary/50" : "border-line bg-[#f7f9fb]"}`}
      >
        <input {...getInputProps()} />
        {shown ? <img src={shown} alt="" className="h-56 w-full object-cover" /> : (
          <div className="px-6 py-10 text-center">
            <p className="text-sm font-semibold text-ink">Drop an image here</p>
            <p className="mt-1 text-xs text-muted">or click to browse. You will see it before it is uploaded.</p>
          </div>
        )}
        {preview && <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-white">Preview</span>}
      </div>
      {preview && (
        <div className="flex flex-wrap gap-2">
          <button type="button" className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white disabled:opacity-60" disabled={busy} onMouseDown={(event) => event.preventDefault()} onClick={upload}>
            {busy ? "Uploading…" : "Upload image"}
          </button>
          <button type="button" className="rounded-lg border border-line bg-white px-3 py-2 text-sm" onMouseDown={(event) => event.preventDefault()} onClick={() => { setPreview(""); setFile(null); }}>
            Discard preview
          </button>
        </div>
      )}
      {value && !preview && <p className="text-xs text-muted">Saved image: {value}</p>}
      {error && <p className="text-xs text-red-700">{error}</p>}
    </div>
  );
}

export function ImageGallery({ value, onChange }: { value: string[]; onChange: (urls: string[]) => void }) {
  const [pending, setPending] = useState<{ name: string; preview: string; file: File }[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const saved = value.filter(Boolean);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: imageAccept,
    onDrop: (accepted) => {
      accepted.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => setPending((current) => [...current, { name: file.name, preview: String(reader.result || ""), file }]);
        reader.readAsDataURL(file);
      });
    },
  });

  const upload = async () => {
    setBusy(true);
    setError("");
    try {
      const urls: string[] = [];
      for (const item of pending) urls.push(await uploadImage(item.file));
      onChange([...saved, ...urls]);
      setPending([]);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid gap-3 rounded-2xl border border-line bg-white p-4">
      <p className="text-sm font-semibold">Gallery images</p>
      <div className="grid gap-3 sm:grid-cols-3">
        {saved.map((url) => (
          <figure key={url} className="overflow-hidden rounded-xl border border-line">
            <img src={url} alt="" className="h-28 w-full object-cover" />
            <button type="button" className="block w-full px-2 py-1 text-xs text-red-700" onMouseDown={(event) => event.preventDefault()} onClick={() => onChange(saved.filter((item) => item !== url))}>
              Remove
            </button>
          </figure>
        ))}
        {pending.map((item) => (
          <figure key={item.preview} className="overflow-hidden rounded-xl border border-secondary">
            <img src={item.preview} alt="" className="h-28 w-full object-cover" />
            <p className="px-2 py-1 text-xs text-primary">Preview</p>
          </figure>
        ))}
      </div>
      <div {...getRootProps()} className={`cursor-pointer rounded-2xl border-2 border-dashed px-4 py-6 text-center text-sm ${isDragActive ? "border-secondary bg-tertiary/50" : "border-line bg-[#f7f9fb]"}`}>
        <input {...getInputProps()} />
        Drop more photos here, or click to choose them. Previews stay local until you upload.
      </div>
      {pending.length > 0 && (
        <div className="flex gap-2">
          <button type="button" className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white disabled:opacity-60" disabled={busy} onMouseDown={(event) => event.preventDefault()} onClick={upload}>
            {busy ? "Uploading…" : `Upload ${pending.length} preview${pending.length === 1 ? "" : "s"}`}
          </button>
          <button type="button" className="rounded-lg border border-line px-3 py-2 text-sm" onMouseDown={(event) => event.preventDefault()} onClick={() => setPending([])}>
            Discard previews
          </button>
        </div>
      )}
      {error && <p className="text-xs text-red-700">{error}</p>}
    </div>
  );
}
