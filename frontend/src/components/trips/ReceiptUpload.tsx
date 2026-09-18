"use client";

import { useRef, useState } from "react";
import { apiClient, ApiError, API_ORIGIN } from "@/lib/api-client";

interface ReceiptUploadProps {
  value?: string;
  onChange: (url: string | undefined) => void;
}

const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_TYPES = "image/jpeg,image/png,image/webp,application/pdf";

/** Upload/replace/remove control for a single expense row's receipt file. */
export function ReceiptUpload({ value, onChange }: ReceiptUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setError(null);
    if (file.size > MAX_SIZE_BYTES) {
      setError("File is too large (max 5MB)");
      return;
    }
    setIsUploading(true);
    try {
      const result = await apiClient.upload<{ url: string }>("/uploads/receipt", file);
      onChange(result.url);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  if (value) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <a
          href={`${API_ORIGIN}${value}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 hover:underline"
        >
          View receipt
        </a>
        <button type="button" onClick={() => onChange(undefined)} className="text-gray-400 hover:text-red-600">
          Remove
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES}
        disabled={isUploading}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
        className="text-sm text-gray-600 file:mr-2 file:rounded-md file:border-0 file:bg-gray-100 file:px-2 file:py-1 file:text-xs file:text-gray-700 hover:file:bg-gray-200"
      />
      {isUploading && <span className="text-xs text-gray-400">Uploading…</span>}
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
