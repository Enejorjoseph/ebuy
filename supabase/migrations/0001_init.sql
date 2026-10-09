-- eBuy marketplace schema
-- Run this in the Supabase SQL editor (or via `supabase db push`).

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Profiles (one per auth user, carries the role)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'buyer' check (role in ('buyer', 'seller')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Profiles are viewable by everyone" on public.profiles;
create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Auto-create a profile when a user signs up. Role/name come from signUp metadata.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    case
      when new.raw_user_meta_data ->> 'role' = 'seller' then 'seller'
      else 'buyer'
    end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Categories
-- ---------------------------------------------------------------------------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  emoji text,
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;

drop policy if exists "Categories are viewable by everyone" on public.categories;
create policy "Categories are viewable by everyone"
  on public.categories for select
  using (true);

insert into public.categories (name, emoji) values
  ('Electronics', '📱'),
  ('Audio', '🎧'),
  ('Gaming', '🎮'),
  ('Home', '🏠'),
  ('Fashion', '👕'),
  ('Books', '📚'),
  ('Sports', '⚽'),
  ('Other', '📦')
on conflict (name) do nothing;

-- ---------------------------------------------------------------------------
-- Listings
-- ---------------------------------------------------------------------------
create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  description text,
  price numeric(12, 2) not null check (price >= 0),
  category text,
  condition text check (condition in ('new', 'like_new', 'good', 'fair')),
  image_url text,
  status text not null default 'active' check (status in ('active', 'sold', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists listings_seller_id_idx on public.listings (seller_id);
create index if not exists listings_status_created_idx on public.listings (status, created_at desc);

alter table public.listings enable row level security;

-- Anyone can browse active listings; sellers can always see their own.
drop policy if exists "Listings are viewable" on public.listings;
create policy "Listings are viewable"
  on public.listings for select
  using (status = 'active' or auth.uid() = seller_id);

-- Only sellers may create listings, and only for themselves.
drop policy if exists "Sellers can create listings" on public.listings;
create policy "Sellers can create listings"
  on public.listings for insert
  with check (
    auth.uid() = seller_id
    and exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'seller'
    )
  );

drop policy if exists "Sellers can update their own listings" on public.listings;
create policy "Sellers can update their own listings"
  on public.listings for update
  using (auth.uid() = seller_id)
  with check (auth.uid() = seller_id);

drop policy if exists "Sellers can delete their own listings" on public.listings;
create policy "Sellers can delete their own listings"
  on public.listings for delete
  using (auth.uid() = seller_id);

-- Keep updated_at fresh
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists listings_touch_updated_at on public.listings;
create trigger listings_touch_updated_at
  before update on public.listings
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Backfill: create profiles for any users that signed up before this schema.
-- ---------------------------------------------------------------------------
insert into public.profiles (id, email, full_name, role)
select
  id,
  email,
  nullif(raw_user_meta_data ->> 'full_name', ''),
  case
    when raw_user_meta_data ->> 'role' = 'seller' then 'seller'
    else 'buyer'
  end
from auth.users
on conflict (id) do nothing;
