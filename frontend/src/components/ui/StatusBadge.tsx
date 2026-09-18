export function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
        isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-green-500" : "bg-gray-400"}`}
      />
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}
