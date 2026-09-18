import { ReactNode } from "react";
import { Inbox, Loader2 } from "lucide-react";

export interface Column<T> {
  header: string;
  render: (row: T) => ReactNode;
  /** Defaults to a standard body-cell style; override for e.g. the primary/bold column. */
  cellClassName?: string;
  headerClassName?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[] | undefined;
  isLoading: boolean;
  getRowKey: (row: T) => string;
  emptyMessage?: string;
}

const DEFAULT_CELL = "px-4 py-3 text-gray-600";
const DEFAULT_HEADER = "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500";

/**
 * Generic list table shared by every list page (super-admin read-only views
 * and tenant-facing CRUD pages) so the loading/empty/row markup lives in one
 * place instead of being copy-pasted per resource.
 */
export function DataTable<T>({ columns, data, isLoading, getRowKey, emptyMessage = "No records found." }: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50/80">
            <tr>
              {columns.map((col) => (
                <th key={col.header} className={col.headerClassName ?? DEFAULT_HEADER}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-gray-400">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 size={20} className="animate-spin text-indigo-500" />
                    <span className="text-sm">Loading…</span>
                  </div>
                </td>
              </tr>
            )}
            {!isLoading && data?.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-gray-400">
                  <div className="flex flex-col items-center gap-2">
                    <Inbox size={22} className="text-gray-300" />
                    <span className="text-sm">{emptyMessage}</span>
                  </div>
                </td>
              </tr>
            )}
            {data?.map((row) => (
              <tr key={getRowKey(row)} className="transition-colors hover:bg-indigo-50/40">
                {columns.map((col) => (
                  <td key={col.header} className={col.cellClassName ?? DEFAULT_CELL}>
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
