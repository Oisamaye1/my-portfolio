"use client";

import { useState } from "react";
import { uploadMedia } from "./upload";

type Props = {
  id: string;
  name: string;
  value: string;
  kind: "image" | "file";
  onChange: (value: string) => void;
  describedBy?: string;
};

export function MediaField({ id, name, value, kind, onChange, describedBy }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function upload(file: File) {
    setUploading(true);
    setError("");
    try {
      onChange(await uploadMedia(file));
    } catch (err) {
      setError(`Upload failed: ${(err as Error).message}`);
    } finally {
      setUploading(false);
    }
  }

  const isImage = kind === "image";
  return (
    <div className="imgfield">
      <div className="imgfield__preview" aria-hidden="true">
        {value && isImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" />
        ) : value ? (
          <span>{value.split("/").pop()}</span>
        ) : (
          <span>{isImage ? "No image" : "No file"}</span>
        )}
      </div>
      <div className="imgfield__controls">
        <input
          id={id}
          name={name}
          type="url"
          value={value}
          placeholder="https://"
          onChange={(e) => onChange(e.target.value)}
          aria-describedby={describedBy}
        />
        <div className="imgfield__buttons">
          <label className="button button--quiet button--small" style={{ cursor: uploading ? "progress" : "pointer" }}>
            {uploading ? "Uploading…" : isImage ? "Upload image" : "Upload file"}
            <input
              type="file"
              hidden
              accept={isImage ? "image/*" : "application/pdf,image/*"}
              disabled={uploading}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void upload(f);
                e.target.value = "";
              }}
            />
          </label>
          {value ? (
            <button type="button" className="button button--quiet button--small" onClick={() => onChange("")}>
              Remove
            </button>
          ) : null}
        </div>
        {error ? <span className="afield__error">{error}</span> : null}
      </div>
    </div>
  );
}
