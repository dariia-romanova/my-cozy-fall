-- Run once in the Supabase SQL editor.
create table if not exists public.items (
  id uuid primary key,
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.items enable row level security;
grant select, insert, update, delete on public.items to authenticated;

drop policy if exists "own items" on public.items;
create policy "own items" on public.items
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

insert into storage.buckets (id, name, public)
values ('photos', 'photos', false)
on conflict (id) do nothing;

drop policy if exists "own photos" on storage.objects;
create policy "own photos" on storage.objects
  for all to authenticated
  using (bucket_id = 'photos' and (storage.foldername(name))[1] = (select auth.uid())::text)
  with check (bucket_id = 'photos' and (storage.foldername(name))[1] = (select auth.uid())::text);
