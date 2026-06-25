"use client";

import { useState } from "react";
import { Button, Input, Label } from "@fosl/ui";

export function ImageUploadField({
  label = "Product image",
  onUploaded,
}: {
  label?: string;
  onUploaded?: (url: string) => void;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    const formData = new FormData();
    formData.set("file", file);

    try {
      const res = await fetch("/api/v1/uploads", { method: "POST", body: formData });
      const json = (await res.json()) as { data?: { url: string }; error?: string };
      if (!res.ok) {
        setError(json.error ?? "Upload failed.");
        return;
      }
      const url = json.data?.url ?? null;
      if (url) {
        setPreview(url);
        onUploaded?.(url);
      }
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <Label htmlFor="imageUpload">{label}</Label>
      <Input
        id="imageUpload"
        type="file"
        accept="image/*"
        className="mt-1"
        disabled={uploading}
        onChange={(e) => void handleChange(e)}
      />
      {uploading && <p className="mt-1 text-xs text-slate-500">Uploading…</p>}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      {preview && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt="Uploaded preview" className="mt-3 h-32 w-32 rounded-md border object-cover" />
      )}
    </div>
  );
}
