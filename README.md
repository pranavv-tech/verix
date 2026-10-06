# verix
Skills you can verify — resume claims checked against real proof

## Supabase setup

The frontend uses Supabase for browser auth and profile persistence. To enable it locally:

1. Copy `frontend/.env.example` to `frontend/.env`.
2. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to your Supabase project values.
3. Run the SQL in `supabase/schema.sql` inside your Supabase project to create the `profiles`, `skills`, `verification_records`, `interview_records`, and `uploaded_files` tables with Row Level Security.

The app continues to work in demo mode if the environment variables are not configured, which keeps the prototype usable without exposing private keys.

## Deploy to Vercel

This repository contains a Vite/React frontend in `frontend/` and a separate Python API in `backend/`. The Vercel configuration supports either the repository root or `frontend/` as the project's Root Directory:

- With the repository root (`.`), Vercel uses the root `vercel.json` to install and build the frontend in `frontend/`.
- With `frontend/`, Vercel uses `frontend/vercel.json` and builds from that directory.

For the repository-root setup, use these Vercel settings:

- **Framework Preset:** Other
- **Root Directory:** `.` (the repository root)
- **Install Command:** `npm --prefix frontend ci`
- **Build Command:** `npm --prefix frontend run build`
- **Output Directory:** `frontend/dist`

The Vercel rewrites serve the SPA entry point for direct requests. App pages are currently selected by React state rather than URL paths, so paths such as `/dashboard` are not individual browser routes.

To enable Supabase authentication and profile persistence, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel's Project Settings → Environment Variables for the Production environment (and Preview if needed). These must be the project's URL and publishable/anon key; never use a Supabase secret or service-role key in a `VITE_` variable. Both variables are optional for the frontend's demo mode.

The Python API is not called by the frontend and is not deployed by this static-site configuration. It remains a separate backend that needs its own hosting and production database configuration if you intend to expose it. That backend reads `DATABASE_URL` (SQLite is only the local default) and `GITHUB_TOKEN` (for its GitHub integration); configure those on the backend host, not on this static frontend deployment.
