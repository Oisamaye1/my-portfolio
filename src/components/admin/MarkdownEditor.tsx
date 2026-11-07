"use client";

import { useRef, useState } from "react";
import { Markdown } from "@/components/Markdown";
import { uploadMedia } from "./upload";

type Props = {
  id: string;
  name: string;
  value: string;
  rows?: number;
  onChange: (value: string) => void;
  invalid?: boolean;
  describedBy?: string;
};

const TOOLS: { label: string; title: string; wrap?: [string, string]; line?: string }[] = [
  { label: "H2", title: "Heading", line: "## " },
  { label: "B", title: "Bold", wrap: ["**", "**"] },
  { label: "I", title: "Italic", wrap: ["*", "*"] },
  { label: "Link", title: "Link", wrap: ["[", "](https://)"] },
  { label: "List", title: "Bulleted list", line: "- " },
  { label: "Quote", title: "Quote", line: "> " },
  { label: "Code", title: "Code block", wrap: ["\n```\n", "\n```\n"] },
];

export function MarkdownEditor({ id, name, value, rows = 16, onChange, invalid, describedBy }: Props) {
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);

  function apply(tool: (typeof TOOLS)[number]) {
    const el = ref.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e } = el;
    const selected = value.slice(s, e);
    let next: string;
    let cursor: number;
    if (tool.wrap) {
      next = value.slice(0, s) + tool.wrap[0] + selected + tool.wrap[1] + value.slice(e);
      cursor = s + tool.wrap[0].length + selected.length;
    } else {
      const lineStart = value.lastIndexOf("\n", s - 1) + 1;
      next = value.slice(0, lineStart) + tool.line + value.slice(lineStart);
      cursor = e + (tool.line?.length ?? 0);
    }
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(cursor, cursor);
    });
  }

  async function insertImage(file: File) {
    setUploading(true);
    setUploadError("");
    try {
      const url = await uploadMedia(file);
      const el = ref.current;
      const at = el ? el.selectionStart : value.length;
      const alt = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
      const snippet = `\n![${alt}](${url})\n`;
      onChange(value.slice(0, at) + snippet + value.slice(at));
    } catch (err) {
      setUploadError(`Upload failed: ${(err as Error).message}`);
    } finally {
      setUploading(false);
    }
  }

  const words = value.split(/\s+/).filter(Boolean).length;

  return (
    <div className="md">
      <div className="md__bar">
        <div className="md__tabs" role="tablist" aria-label="Editor mode">
          <button type="button" role="tab" aria-selected={tab === "write"} onClick={() => setTab("write")}>
            Write
          </button>
          <button type="button" role="tab" aria-selected={tab === "preview"} onClick={() => setTab("preview")}>
            Preview
          </button>
        </div>
        {tab === "write" ? (
          <div className="md__tools">
            {TOOLS.map((t) => (
              <button key={t.label} type="button" title={t.title} onClick={() => apply(t)}>
                {t.label}
              </button>
            ))}
            <label title="Upload and insert an image">
              {uploading ? "Uploading…" : "Image"}
              <input
                type="file"
                accept="image/*"
                hidden
                disabled={uploading}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void insertImage(f);
                  e.target.value = "";
                }}
              />
            </label>
          </div>
        ) : null}
      </div>
      <textarea
        ref={ref}
        id={id}
        name={name}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        hidden={tab !== "write"}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        spellCheck
      />
      {tab === "preview" ? (
        <div className="md__preview">
          {value.trim() ? <Markdown>{value}</Markdown> : <p className="afield__help" style={{ marginTop: "1rem" }}>Nothing to preview yet.</p>}
        </div>
      ) : null}
      <div className="md__foot">
        <span>{uploadError || "Markdown: ## heading, **bold**, *italic*, - list, [link](https://…)"}</span>
        <span>{words} words</span>
      </div>
    </div>
  );
}
