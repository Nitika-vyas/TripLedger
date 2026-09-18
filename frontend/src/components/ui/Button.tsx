import { ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  isLoading?: boolean;
}

const variantClasses: Record<string, string> = {
  primary:
    "bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 disabled:bg-indigo-300",
  secondary:
    "bg-white text-gray-700 border border-gray-300 shadow-sm hover:bg-gray-50 disabled:text-gray-400",
  danger: "bg-red-600 text-white shadow-sm hover:bg-red-700 disabled:bg-red-300",
  ghost: "text-gray-600 hover:bg-gray-100 disabled:text-gray-300",
};

export function Button({
  variant = "primary",
  isLoading,
  disabled,
  className = "",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
      {...rest}
    >
      {isLoading && <Loader2 size={15} className="animate-spin" />}
      {children}
    </button>
  );
}
