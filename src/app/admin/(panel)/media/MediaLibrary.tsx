"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { uploadMedia } from "@/components/admin/upload";

export function MediaUploader() {
  const router = useRouter();
  const [over, setOver] = useState(false);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  async function handle(files: FileList | null) {
    if (!files?.length) return;
    setError("");
    const list = Array.from(files);
    for (let i = 0; i < list.length; i++) {
      setBusy(`Uploading ${i + 1} of ${list.length}…`);
      try {
        await uploadMedia(list[i]);
      } catch (err) {
        setError(`${list[i].name}: ${(err as Error).message}`);
      }
    }
    setBusy("");
    router.refresh();
  }

  return (
    <div
      className="dropzone"
      data-over={over}
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        void handle(e.dataTransfer.files);
      }}
    >
      <p>{busy || "Drop images or PDFs here, or"}</p>
      {!busy ? (
        <label className="button button--quiet button--small" style={{ marginTop: "0.75rem", cursor: "pointer" }}>
          Choose files
          <input type="file" multiple hidden accept="image/*,application/pdf" onChange={(e) => void handle(e.target.files)} />
        </label>
      ) : null}
      {error ? <p className="afield__error" style={{ marginTop: "0.75rem" }}>{error}</p> : null}
    </div>
  );
}

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="button button--quiet button--small"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
    >
      {copied ? "Copied" : "Copy link"}
    </button>
  );
}
