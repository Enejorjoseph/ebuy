-- Admin role + admin management policies.
-- Run after 0001_init.sql and 0002_storage.sql.

-- ---------------------------------------------------------------------------
-- Allow the 'admin' role on profiles.
-- ---------------------------------------------------------------------------
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles
  add constraint profiles_role_check
  check (role in ('buyer', 'seller', 'admin'));

-- ---------------------------------------------------------------------------
-- Helper: is the current user an admin?
-- SECURITY DEFINER so it can read profiles without tripping RLS recursion.
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ---------------------------------------------------------------------------
-- Admins can update any profile (used to promote/demote users).
-- ---------------------------------------------------------------------------
drop policy if exists "Admins can update any profile" on public.profiles;
create policy "Admins can update any profile"
  on public.profiles for update
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Listings: admins can see and manage everything.
-- ---------------------------------------------------------------------------
drop policy if exists "Listings are viewable" on public.listings;
create policy "Listings are viewable"
  on public.listings for select
  using (status = 'active' or auth.uid() = seller_id or public.is_admin());

drop policy if exists "Admins can create listings" on public.listings;
create policy "Admins can create listings"
  on public.listings for insert
  with check (public.is_admin());

drop policy if exists "Admins can update listings" on public.listings;
create policy "Admins can update listings"
  on public.listings for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete listings" on public.listings;
create policy "Admins can delete listings"
  on public.listings for delete
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Admins can manage listing images owned by anyone.
-- ---------------------------------------------------------------------------
drop policy if exists "Admins can update listing images" on storage.objects;
create policy "Admins can update listing images"
  on storage.objects for update to authenticated
  using (bucket_id = 'listing-images' and public.is_admin());

drop policy if exists "Admins can delete listing images" on storage.objects;
create policy "Admins can delete listing images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'listing-images' and public.is_admin());

-- ---------------------------------------------------------------------------
-- Make yourself an admin (edit the email, then run just this line):
-- update public.profiles set role = 'admin' where email = 'you@example.com';
-- ---------------------------------------------------------------------------
