-- NBA Radar - Supabase initial schema
-- Run this file in the Supabase SQL Editor for the project used by the app.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  name text,
  favorite_team_id text,
  favorite_team_abbreviation text,
  favorite_team_name text,
  favorite_team_full_name text,
  favorite_team_logo_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists public.user_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  notify_before_game boolean default true,
  notify_game_start boolean default true,
  notify_final_score boolean default true,
  notify_highlights_available boolean default true,
  theme_mode text default 'system' check (theme_mode in ('system', 'dark')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(user_id)
);

create table if not exists public.saved_games (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  espn_event_id text not null,
  home_team text,
  visitor_team text,
  game_date timestamp with time zone,
  created_at timestamp with time zone default now(),
  unique(user_id, espn_event_id)
);

create table if not exists public.favorite_players (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  player_id text,
  player_name text not null,
  team_abbreviation text,
  image_url text,
  created_at timestamp with time zone default now(),
  unique(user_id, player_name)
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_user_preferences_updated_at on public.user_preferences;
create trigger set_user_preferences_updated_at
before update on public.user_preferences
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.user_preferences enable row level security;
alter table public.saved_games enable row level security;
alter table public.favorite_players enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'profiles' and policyname = 'Users can read own profile') then
    create policy "Users can read own profile"
    on public.profiles
    for select
    using (auth.uid() = id);
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'profiles' and policyname = 'Users can insert own profile') then
    create policy "Users can insert own profile"
    on public.profiles
    for insert
    with check (auth.uid() = id);
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'profiles' and policyname = 'Users can update own profile') then
    create policy "Users can update own profile"
    on public.profiles
    for update
    using (auth.uid() = id);
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'user_preferences' and policyname = 'Users can read own preferences') then
    create policy "Users can read own preferences"
    on public.user_preferences
    for select
    using (auth.uid() = user_id);
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'user_preferences' and policyname = 'Users can insert own preferences') then
    create policy "Users can insert own preferences"
    on public.user_preferences
    for insert
    with check (auth.uid() = user_id);
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'user_preferences' and policyname = 'Users can update own preferences') then
    create policy "Users can update own preferences"
    on public.user_preferences
    for update
    using (auth.uid() = user_id);
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'saved_games' and policyname = 'Users can read own saved games') then
    create policy "Users can read own saved games"
    on public.saved_games
    for select
    using (auth.uid() = user_id);
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'saved_games' and policyname = 'Users can insert own saved games') then
    create policy "Users can insert own saved games"
    on public.saved_games
    for insert
    with check (auth.uid() = user_id);
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'saved_games' and policyname = 'Users can delete own saved games') then
    create policy "Users can delete own saved games"
    on public.saved_games
    for delete
    using (auth.uid() = user_id);
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'favorite_players' and policyname = 'Users can read own favorite players') then
    create policy "Users can read own favorite players"
    on public.favorite_players
    for select
    using (auth.uid() = user_id);
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'favorite_players' and policyname = 'Users can insert own favorite players') then
    create policy "Users can insert own favorite players"
    on public.favorite_players
    for insert
    with check (auth.uid() = user_id);
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'favorite_players' and policyname = 'Users can delete own favorite players') then
    create policy "Users can delete own favorite players"
    on public.favorite_players
    for delete
    using (auth.uid() = user_id);
  end if;
end $$;
