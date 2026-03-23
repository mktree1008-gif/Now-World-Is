-- Profiles table
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  preferred_locale text default 'en',
  avatar_url text,
  created_at timestamptz not null default now()
);

-- Favorites table
create table if not exists public.favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  iso2 text not null,
  note text,
  created_at timestamptz not null default now(),
  primary key (user_id, iso2)
);

alter table public.profiles enable row level security;
alter table public.favorites enable row level security;

create policy if not exists "profiles_select_own"
on public.profiles for select
to authenticated
using (auth.uid() = user_id);

create policy if not exists "profiles_upsert_own"
on public.profiles for insert
to authenticated
with check (auth.uid() = user_id);

create policy if not exists "profiles_update_own"
on public.profiles for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy if not exists "favorites_select_own"
on public.favorites for select
to authenticated
using (auth.uid() = user_id);

create policy if not exists "favorites_insert_own"
on public.favorites for insert
to authenticated
with check (auth.uid() = user_id);

create policy if not exists "favorites_delete_own"
on public.favorites for delete
to authenticated
using (auth.uid() = user_id);
