create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text not null,
  username text unique,
  avatar_url text,
  bio text,
  role text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.skills (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  skill_name text not null,
  skill_level text,
  verification_status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.verification_records (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  skill_id uuid references public.skills(id) on delete set null,
  skill_name text not null,
  verification_type text not null,
  proof_url text,
  verification_status text not null default 'pending',
  verification_result text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.interview_records (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  interview_id text,
  question text not null,
  answer text,
  score numeric,
  feedback text,
  created_at timestamptz not null default now()
);

create table if not exists public.uploaded_files (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  file_name text not null,
  file_type text,
  storage_path text not null,
  created_at timestamptz not null default now()
);

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
before update on public.profiles
for each row execute procedure public.handle_updated_at();

create trigger skills_updated_at
before update on public.skills
for each row execute procedure public.handle_updated_at();

create trigger verification_records_updated_at
before update on public.verification_records
for each row execute procedure public.handle_updated_at();

alter table public.profiles enable row level security;
alter table public.skills enable row level security;
alter table public.verification_records enable row level security;
alter table public.interview_records enable row level security;
alter table public.uploaded_files enable row level security;

create policy "profiles_are_private" on public.profiles
for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "skills_are_private" on public.skills
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "verification_records_are_private" on public.verification_records
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "interview_records_are_private" on public.interview_records
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "uploaded_files_are_private" on public.uploaded_files
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "profiles_insert_for_self" on public.profiles
for insert with check (auth.uid() = id);

create policy "profiles_update_for_self" on public.profiles
for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "profiles_delete_for_self" on public.profiles
for delete using (auth.uid() = id);
