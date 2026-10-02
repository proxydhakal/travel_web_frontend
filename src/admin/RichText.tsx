import { useEffect, useRef, useState } from "react";

type Editor = {
  setData: (value: string) => void;
  getData: () => string;
  destroy: () => Promise<void>;
  model: { document: { on: (event: string, callback: () => void) => void } };
  ui: { view: { editable: { element: HTMLElement | null } } };
};

declare global {
  interface Window {
    ClassicEditor?: { create: (element: HTMLElement, config?: object) => Promise<Editor> };
    CKEDITOR?: { ClassicEditor: { create: (element: HTMLElement, config?: object) => Promise<Editor> } };
  }
}

const SCRIPT = "https://cdn.ckeditor.com/ckeditor5/41.4.2/super-build/ckeditor.js";

const toolbar = [
  "heading",
  "|",
  "bold",
  "italic",
  "underline",
  "strikethrough",
  "removeFormat",
  "|",
  "fontSize",
  "fontColor",
  "fontBackgroundColor",
  "|",
  "alignment",
  "|",
  "bulletedList",
  "numberedList",
  "outdent",
  "indent",
  "|",
  "uploadImage",
  "link",
  "blockQuote",
  "insertTable",
  "horizontalLine",
  "|",
  "undo",
  "redo",
  "sourceEditing",
];

function uploadAdapter(editor: { plugins: { get: (name: string) => { createUploadAdapter: (loader: { file: Promise<File> }) => unknown } } }) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) => ({
    upload() {
      return loader.file.then(async (file) => {
        const body = new FormData();
        body.append("file", file);
        const response = await fetch("/api/admin/uploads", { method: "POST", body, credentials: "include" });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          const detail = typeof data.detail === "string" ? data.detail : "Image upload failed.";
          throw new Error(detail);
        }
        return { default: data.url as string };
      });
    },
    abort() {},
  });
}

const removePlugins = [
  "CKBox",
  "CKFinder",
  "Base64UploadAdapter",
  "EasyImage",
  "RealTimeCollaborativeComments",
  "RealTimeCollaborativeTrackChanges",
  "RealTimeCollaborativeRevisionHistory",
  "PresenceList",
  "Comments",
  "TrackChanges",
  "TrackChangesData",
  "RevisionHistory",
  "Pagination",
  "WProofreader",
  "MathType",
  "SlashCommand",
  "Template",
  "DocumentOutline",
  "FormatPainter",
  "TableOfContents",
  "PasteFromOfficeEnhanced",
  "ExportPdf",
  "ExportWord",
  "AIAssistant",
  "MultiLevelList",
  "CaseChange",
  "PoweredBy",
];

export function RichText({ value, onChange }: { value: string; onChange: (html: string) => void }) {
  const host = useRef<HTMLTextAreaElement>(null);
  const editorRef = useRef<Editor | null>(null);
  const onChangeRef = useRef(onChange);
  const valueRef = useRef(value);
  const [failed, setFailed] = useState(false);
  onChangeRef.current = onChange;
  valueRef.current = value;

  useEffect(() => {
    let editor: Editor | null = null;
    let cancelled = false;
    const factory = () => window.CKEDITOR?.ClassicEditor || window.ClassicEditor;
    const start = () => {
      const EditorFactory = factory();
      if (!host.current || !EditorFactory || cancelled) return;
      EditorFactory.create(host.current, {
        toolbar: { items: toolbar, shouldNotGroupWhenFull: true },
        removePlugins,
        extraPlugins: [uploadAdapter],
        image: {
          toolbar: ["imageStyle:inline", "imageStyle:block", "imageStyle:side", "|", "toggleImageCaption", "imageTextAlternative"],
        },
      })
        .then((instance) => {
          if (cancelled) {
            instance.destroy();
            return;
          }
          editor = instance;
          editorRef.current = instance;
          const editable = instance.ui.view.editable.element;
          if (editable) {
            editable.style.minHeight = "180px";
            editable.style.resize = "vertical";
            editable.style.overflow = "auto";
          }
          instance.setData(valueRef.current || "");
          instance.model.document.on("change:data", () => onChangeRef.current(instance.getData()));
        })
        .catch(() => setFailed(true));
    };

    if (factory()) start();
    else {
      let script = document.getElementById("ckeditor5") as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement("script");
        script.id = "ckeditor5";
        script.src = SCRIPT;
        script.async = true;
        document.body.appendChild(script);
      }
      script.addEventListener("load", start);
      script.addEventListener("error", () => setFailed(true));
    }

    return () => {
      cancelled = true;
      editorRef.current = null;
      editor?.destroy();
    };
  }, []);

  useEffect(() => {
    const instance = editorRef.current;
    if (!instance) return;
    if ((value || "") !== instance.getData()) instance.setData(value || "");
  }, [value]);

  if (failed) {
    return <textarea className="min-h-48 w-full rounded-lg border border-line px-3 py-2 text-sm" value={value} onChange={(event) => onChange(event.target.value)} />;
  }

  return (
    <div className="eh-richtext">
      <textarea ref={host} defaultValue="" />
    </div>
  );
}
