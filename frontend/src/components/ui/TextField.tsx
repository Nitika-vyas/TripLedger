import { InputHTMLAttributes } from "react";
import { FieldError } from "react-hook-form";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: FieldError;
}

export function TextField({ label, error, className = "", ...rest }: TextFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        className={`rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition-shadow placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 ${
          error ? "border-red-400 focus:ring-red-500/40" : "border-gray-300 focus:border-indigo-500"
        } ${className}`}
        {...rest}
      />
      {error && <span className="text-xs text-red-600">{error.message}</span>}
    </div>
  );
}
