-- Storage bucket for listing photos.
-- Run after 0001_init.sql.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'listing-images',
  'listing-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
  set public = true,
      file_size_limit = 5242880,
      allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

drop policy if exists "Listing images are publicly readable" on storage.objects;
create policy "Listing images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'listing-images');

drop policy if exists "Authenticated users can upload listing images" on storage.objects;
create policy "Authenticated users can upload listing images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'listing-images');

drop policy if exists "Users can update their own listing images" on storage.objects;
create policy "Users can update their own listing images"
  on storage.objects for update to authenticated
  using (bucket_id = 'listing-images' and owner = auth.uid());

drop policy if exists "Users can delete their own listing images" on storage.objects;
create policy "Users can delete their own listing images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'listing-images' and owner = auth.uid());
