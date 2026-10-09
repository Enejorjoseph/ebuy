-- Seed the special admin account role.
-- Run after 0003_admin.sql. The auth user itself is created separately
-- (email: admin@ebuy.local).

update public.profiles
  set role = 'admin'
  where email = 'admin@ebuy.local';
