"use client";

import { useState } from "react";
import { useTrips, useCreateTrip, useUpdateTrip, useDeleteTrip, TripFilters } from "@/hooks/useTrips";
import { useCanEditTrips, useCanDeleteTrips } from "@/lib/permissions";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { DataTable, Column } from "@/components/ui/DataTable";
import { TripForm } from "@/components/trips/TripForm";
import { ApiError } from "@/lib/api-client";
import type { Trip, TripStatus } from "@/types/trip";

const STATUS_STYLES: Record<TripStatus, string> = {
  SCHEDULED: "bg-indigo-100 text-indigo-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-gray-100 text-gray-600",
};

const money = (n: number) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function TripsPage() {
  const [filters, setFilters] = useState<TripFilters>({});
  const { data: trips, isLoading } = useTrips(filters);
  const createTrip = useCreateTrip();
  const updateTrip = useUpdateTrip();
  const deleteTrip = useDeleteTrip();
  const canEdit = useCanEditTrips();
  const canDelete = useCanDeleteTrips();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Trip | null>(null);
  const [error, setError] = useState<string | null>(null);

  const openCreate = () => {
    setEditing(null);
    setError(null);
    setModalOpen(true);
  };

  const openEdit = (trip: Trip) => {
    setEditing(trip);
    setError(null);
    setModalOpen(true);
  };

  const handleSubmit = async (payload: Parameters<typeof createTrip.mutateAsync>[0]) => {
    try {
      if (editing) {
        await updateTrip.mutateAsync({ id: editing.id, data: payload });
      } else {
        await createTrip.mutateAsync(payload);
      }
      setModalOpen(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    }
  };

  const handleDelete = (trip: Trip) => {
    if (!confirm(`Delete the trip on ${trip.tripDate.slice(0, 10)} (${trip.route.source} → ${trip.route.destination})?`))
      return;
    deleteTrip.mutate(trip.id, {
      onError: (err) => alert(err instanceof ApiError ? err.message : "Delete failed"),
    });
  };

  const columns: Column<Trip>[] = [
    { header: "Date", render: (t) => new Date(t.tripDate).toLocaleDateString() },
    {
      header: "Route",
      render: (t) => `${t.route.source} → ${t.route.destination}`,
      cellClassName: "px-4 py-3 font-medium text-gray-900",
    },
    { header: "Bus", render: (t) => t.bus.busNumber },
    { header: "Driver", render: (t) => t.driver?.name ?? "—" },
    { header: "Passengers", render: (t) => t.passengerCount ?? "—" },
    { header: "Parcels", render: (t) => t.parcelCount ?? "—" },
    { header: "Income", render: (t) => money(t.totalIncome) },
    { header: "Expense", render: (t) => money(t.totalExpense) },
    {
      header: "Profit",
      render: (t) => (
        <span className={t.profit >= 0 ? "text-green-700" : "text-red-600"}>{money(t.profit)}</span>
      ),
    },
    {
      header: "Status",
      render: (t) => (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[t.status]}`}>
          {t.status}
        </span>
      ),
    },
    ...(canEdit || canDelete
      ? [
          {
            header: "Actions",
            headerClassName: "px-4 py-3 text-right font-medium text-gray-500",
            cellClassName: "px-4 py-3 text-right",
            render: (t: Trip) => (
              <div className="flex justify-end gap-3 text-sm">
                {canEdit && (
                  <button onClick={() => openEdit(t)} className="text-indigo-600 hover:underline">
                    Edit
                  </button>
                )}
                {canDelete && (
                  <button onClick={() => handleDelete(t)} className="text-red-600 hover:underline">
                    Delete
                  </button>
                )}
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Trips</h1>
        {canEdit && <Button onClick={openCreate}>+ Add Trip</Button>}
      </div>

      <div className="flex flex-wrap items-end gap-3 rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">From</label>
          <input
            type="date"
            value={filters.dateFrom ?? ""}
            onChange={(e) => setFilters((f) => ({ ...f, dateFrom: e.target.value }))}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">To</label>
          <input
            type="date"
            value={filters.dateTo ?? ""}
            onChange={(e) => setFilters((f) => ({ ...f, dateTo: e.target.value }))}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Status</label>
          <select
            value={filters.status ?? ""}
            onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value as TripStatus | "" }))}
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm"
          >
            <option value="">All</option>
            <option value="COMPLETED">Completed</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
        {(filters.dateFrom || filters.dateTo || filters.status) && (
          <Button variant="secondary" onClick={() => setFilters({})}>
            Clear filters
          </Button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={trips}
        isLoading={isLoading}
        getRowKey={(t) => t.id}
        emptyMessage="No trips recorded yet."
      />

      <Modal title={editing ? "Edit Trip" : "Add Trip"} isOpen={modalOpen} onClose={() => setModalOpen(false)} size="xl">
        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
        <TripForm initialValues={editing ?? undefined} onSubmit={handleSubmit} onCancel={() => setModalOpen(false)} />
      </Modal>
    </div>
  );
}
