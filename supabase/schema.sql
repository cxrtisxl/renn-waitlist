-- Run this in the Supabase SQL editor (Dashboard → SQL → New query).
-- Creates the waitlist table and a row-level security policy that lets the
-- anon key INSERT new emails but not read, update, or delete anything.

create table if not exists public.waitlist (
  id          bigint generated always as identity primary key,
  email       text not null unique,
  created_at  timestamptz not null default now()
);

alter table public.waitlist enable row level security;

drop policy if exists "anon can insert waitlist" on public.waitlist;
create policy "anon can insert waitlist"
  on public.waitlist
  for insert
  to anon
  with check (true);

grant insert on public.waitlist to anon;
