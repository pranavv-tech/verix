# verix
Skills you can verify — resume claims checked against real proof

## Supabase setup

The frontend uses Supabase for browser auth and profile persistence. To enable it locally:

1. Copy `frontend/.env.example` to `frontend/.env`.
2. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to your Supabase project values.
3. Run the SQL in `supabase/schema.sql` inside your Supabase project to create the `profiles`, `skills`, `verification_records`, `interview_records`, and `uploaded_files` tables with Row Level Security.

The app continues to work in demo mode if the environment variables are not configured, which keeps the prototype usable without exposing private keys.
