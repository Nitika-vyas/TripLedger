# TripLedger

**Every Trip. Every Rupee. Complete Control.**

TripLedger is a Bus Travel Expense & Profit Management SaaS platform that
helps transport operators manage daily trips, track expenses, monitor
income, and analyze profitability—all from one centralized dashboard. It's
multi-tenant: each bus transport company gets its own isolated data, with a
platform-wide super admin able to onboard tenants and view (read-only)
across all of them.

- `frontend/` — Next.js 16 (App Router, TypeScript, Tailwind)
- `backend/` — Express + TypeScript + Prisma ORM + MySQL

See `plan.md`-style design in the conversation history / project plan for the
full architecture. This README covers local setup only.

## Prerequisites

- Node.js 18+ (tested with v25)
- MySQL running locally (this project was set up against XAMPP's MySQL on
  `localhost:3306`)

## First-time setup

1. Start MySQL (e.g. via the XAMPP Control Panel).
2. Create the database once:
   ```
   mysql -u root -e "CREATE DATABASE IF NOT EXISTS travel_profitability;"
   ```
3. Install dependencies:
   ```
   npm install            # root (concurrently)
   npm install --prefix backend
   npm install --prefix frontend
   ```
4. Configure env vars (already created for local dev, review before real use):
   - `backend/.env` — `DATABASE_URL`, JWT secrets, seed admin credentials.
   - `frontend/.env.local` — `NEXT_PUBLIC_API_URL` (defaults to
     `http://localhost:4000/api`).
5. Run the initial migration and seed data:
   ```
   cd backend
   npx prisma migrate dev --name init
   npm run prisma:seed
   ```
   This creates:
   - A `SUPER_ADMIN` user (`SEED_SUPER_ADMIN_EMAIL` / `SEED_SUPER_ADMIN_PASSWORD`
     in `backend/.env`) — manages tenants only, no business data access.
   - A demo tenant "Demo Bus Company" with a `COMPANY_ADMIN` user
     (`SEED_DEMO_ADMIN_EMAIL` / `SEED_DEMO_ADMIN_PASSWORD`).

## Running the app

From the project root:
```
npm run dev
```
This runs both apps concurrently:
- Backend API on http://localhost:4000 (health check: `GET /health`)
- Frontend on http://localhost:3000

Or run them individually with `npm run dev --prefix backend` /
`npm run dev --prefix frontend`.

## Useful commands

- `npx prisma studio` (from `backend/`) — browse/edit DB data visually.
- `npx prisma migrate dev --name <change>` (from `backend/`) — create a new
  migration after editing `prisma/schema.prisma`.

## Build status

- **Phase 1 — Scaffolding, Auth, Multi-tenancy: done.** Signup, login,
  JWT access/refresh tokens, RBAC (`COMPANY_ADMIN` / `MANAGER` / `DATA_ENTRY`
  / `SUPER_ADMIN`), tenant isolation, and the protected dashboard shell are
  implemented and verified end-to-end (curl + browser).
- **Phase 2 — Master Data CRUD: done.** Buses, Drivers, Conductors, and
  Routes each have full tenant-scoped REST endpoints (list/get/create/
  update/delete with uniqueness checks, cross-entity FK validation, and
  friendly 409s when deleting a record still referenced by trips) plus
  matching frontend list pages with create/edit modals. `COMPANY_ADMIN` /
  `MANAGER` can manage; `DATA_ENTRY` gets read-only views. Verified via curl
  (CRUD, validation, RBAC, tenant isolation) and a frontend type-check.
- **Super Admin — Tenant management: done.** `POST /api/super-admin/tenants`
  lets a super admin create a tenant + its first `COMPANY_ADMIN` user
  directly (auto-generating a temporary password when none is supplied, shown
  once in the response). Frontend has a separate `/super-admin/tenants` area
  (list + create modal + per-tenant detail/users page + activate/deactivate),
  gated on `globalRole === "SUPER_ADMIN"` and kept apart from the regular
  tenant dashboard shell. Verified via curl (create, duplicate-email 409,
  RBAC) and a frontend type-check.
- **Super Admin — Cross-tenant business data: done.** Read-only endpoints
  under `/api/super-admin/{buses,drivers,conductors,routes,trips}` (no
  create/update/delete — managing a tenant's own fleet data stays that
  tenant's job) return records across *all* tenants with the owning tenant
  attached, filterable by `?tenantId=`. The super admin sidebar now has
  Overview, Tenants, Buses, Drivers, Conductors, Routes, and Trips, each
  business-data page showing a Tenant column and a tenant filter dropdown.
  Verified via curl (cross-tenant listing, RBAC) and a frontend type-check.
- **Phase 3 — Trip Entry + Expenses + Income: done.** `POST/PATCH /api/trips`
  create/update a trip together with its `TripIncome` (ticket sales + other
  income) and a replaceable list of `TripExpense` rows (fuel/toll/parking/
  food/driver allowance/repairs/other) in one transaction; `GET /api/trips`
  returns each trip with computed `totalIncome`/`totalExpense`/`profit`.
  Recording trips is open to `COMPANY_ADMIN`/`MANAGER`/`DATA_ENTRY` (it's
  literally the data-entry job); deleting a trip is admin/manager-only.
  Frontend Trips page has a date-range + status filter bar, a table with
  per-trip profit, and a create/edit modal with a dynamic expense-row list
  (`useFieldArray`). Verified via curl (create/update/delete, profit math,
  bad-FK 400, tenant isolation) and a frontend type-check.
- **Users module (tenant team management): done.** `COMPANY_ADMIN`-only
  `/api/users` CRUD lets a company admin invite `MANAGER`/`DATA_ENTRY`/
  co-`COMPANY_ADMIN` users (auto-generating a temporary password when none
  is given, shown once), edit role/phone/active status, reset a user's
  password, and delete — blocked from touching their own account to avoid
  self-lockout. Frontend has a Users page (hidden from non-admins in the
  sidebar and redirected away if navigated to directly) with the same
  create-then-show-credentials flow as the super-admin Tenants page.
  Verified via curl (create, duplicate-email 409, self-modify 400, RBAC 403,
  new user can log in) and a frontend type-check.
- **Phase 4 — Dashboard KPIs + Reports export: done.** `GET /api/dashboard/
  summary` (defaults to the current month) aggregates trips in a date range
  into totals (trips/income/expense/net profit), a daily income-vs-expense
  trend, and top-5 routes/buses by profit — all derived from `trips.service`'s
  `listTrips` (reused, not reimplemented) so dashboard numbers and the Trips
  list can never drift apart. `GET /api/reports/trips/export` generates the
  same filtered trip set as CSV, Excel (`exceljs`), or PDF (`pdfkit`, with a
  totals line and pagination). Frontend: Dashboard has a preset/custom date
  range picker, real KPI cards, a recharts income/expense area chart, and
  two "top by profit" lists; Reports has the same filter bar, a live summary,
  Export Excel/PDF/CSV buttons (`apiClient.download` triggers a real browser
  save), and the filtered trips table. Verified via curl (totals math,
  tenant isolation, 401, custom range, all three export formats produce
  valid files) and a frontend type-check.
- Found and fixed along the way: `defaultDateRange()` built local `Date`
  objects but formatted them with `.toISOString()` (UTC), silently shifting
  "today" back a day in timezones ahead of UTC (e.g. IST) — worth remembering
  if a future date computation looks off by one.

### Shared building blocks (de-duplication)

All nine list pages (4 tenant-facing CRUD + 5 super-admin read-only) share
the same table/loading/empty-state markup instead of repeating it:

- `frontend/src/components/ui/DataTable.tsx` — generic `columns` + `data`
  table primitive used everywhere.
- `frontend/src/components/super-admin/ResourceListPage.tsx` — title +
  tenant filter + `DataTable` shell for the read-only super-admin pages.
- `frontend/src/components/master-data/ManagedResourceListPage.tsx` — title
  + "Add" button + `DataTable` + create/edit modal + Edit/Deactivate/Delete
  actions for the tenant-facing CRUD pages; each page only supplies its
  columns, resource hooks (from `createResourceHooks`), and form component.
- `backend/src/lib/super-admin-query.ts` — shared `where`-clause builder
  (tenantId/isActive/search) for the super-admin cross-tenant services.
- `backend/src/lib/list-handler.ts` — wraps a `(query) => Promise<T[]>`
  service function as an Express handler, so the super-admin routes file
  registers all five resources from one small config object instead of five
  near-identical controller functions.
All four planned phases (Scaffolding/Auth, Master Data, Trip Entry, Dashboard/
Reports) plus the super-admin tenant-management and cross-tenant-visibility
work are now built and verified end-to-end.

### Passenger / parcel counts on trips

`Trip.passengerCount` and `Trip.parcelCount` (both optional, non-negative
integers) capture how many passengers rode and how many parcels were carried
on a trip. Set via the Trip form, validated server-side (`trips.schema.ts`),
shown as columns on the tenant Trips page, the Reports table, the
super-admin cross-tenant Trips view, and included in the CSV/Excel report
exports (omitted from the PDF export to keep its already-tight landscape
table within the page width). Verified via curl (create, update, negative
value rejected with 400, present in CSV output) and a frontend type-check.

### Expense receipt uploads

Each expense row on a trip can attach a receipt (JPEG/PNG/WEBP/PDF, 5MB max).
- `POST /api/uploads/receipt` (multipart, tenant-scoped) saves the file under
  `backend/uploads/receipts/<tenantId>/<random-name><ext>` (`backend/src/lib/
  uploads.ts`) and returns its public `/uploads/...` URL; `TripExpense.
  receiptUrl` stores that URL. Files are served via a plain `express.static`
  mount — acceptable for MVP scope since filenames are unguessable, but
  revisit with an authenticated stream endpoint if receipts need stricter
  access control later.
- Frontend: `ReceiptUpload` (used per expense row in `TripForm`) uploads
  immediately on file selection via `apiClient.upload` (a dedicated
  multipart helper, separate from the JSON `request()` path) and stores the
  returned URL in that row's `receiptUrl` field for submission with the rest
  of the trip.
- Verified via curl: disallowed file type → 400, valid upload → 201 + URL,
  the file is fetchable back, unauthenticated upload → 401, and a full
  upload-then-create-trip flow persists `receiptUrl` on the expense record.

### Known gotcha for future modules

Express 5 exposes `req.query` as a getter-only property — reassigning it
(`req.query = ...`) throws at runtime. The `validate` middleware
(`backend/src/middleware/validate.middleware.ts`) already works around this
for query-param validation; follow the same pattern if you add new
query-validated routes.
