function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase() || "?";
}

export function Avatar({ name, tone = "indigo" }: { name: string; tone?: "indigo" | "violet" }) {
  const toneClasses =
    tone === "violet"
      ? "bg-violet-100 text-violet-700"
      : "bg-indigo-100 text-indigo-700";
  return (
    <div
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${toneClasses}`}
    >
      {initials(name)}
    </div>
  );
}
