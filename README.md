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

