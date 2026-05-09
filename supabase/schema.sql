-- 8thSense Production - React/Vite/Supabase schema
-- Run this file in Supabase SQL Editor.

create extension if not exists "pgcrypto";

-- Profiles are linked to Supabase Auth users. They support the small logged-in
-- client studio/photo-posting feature and future admin/member workflows.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text,
  display_name text,
  email text,
  phone_number text,
  avatar_url text,
  role text not null default 'client' check (role in ('client', 'admin', 'member')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Keep older databases compatible when this file is rerun after tables already
-- exist. `create table if not exists` does not add new columns.
alter table public.profiles
  add column if not exists username text,
  add column if not exists display_name text,
  add column if not exists email text,
  add column if not exists phone_number text,
  add column if not exists avatar_url text,
  add column if not exists active boolean not null default true,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

alter table public.profiles
  add column if not exists role text;

update public.profiles
set role = 'client'
where role is null;

update public.profiles
set username = coalesce(nullif(username, ''), concat(coalesce(nullif(split_part(email, '@', 1), ''), 'user'), '-', left(id::text, 8)))
where username is null
   or username = '';

alter table public.profiles
  alter column role set default 'client',
  alter column role set not null;

alter table public.profiles
  alter column username set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_role_check'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_role_check
      check (role in ('client', 'admin', 'member'));
  end if;
end;
$$;

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null,
  image_url text,
  cta_text text default 'Request Now',
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  location text,
  description text,
  image_url text not null,
  category text default 'Album',
  featured boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.sliders (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  name text not null,
  description text not null,
  image_url text not null,
  button1_text text default 'Get Quotation',
  button2_text text default 'View Albums',
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  status text not null default 'new' check (status in ('new', 'read', 'replied', 'archived')),
  created_at timestamptz not null default now()
);

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  rating int not null check (rating between 1 and 5),
  message text not null,
  approved boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.quotations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  service text not null,
  details text not null,
  budget text,
  status text not null default 'pending' check (status in ('pending', 'quoted', 'accepted', 'rejected', 'archived')),
  created_at timestamptz not null default now()
);

create table if not exists public.collaboration_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  company text,
  project text not null,
  details text not null,
  budget text,
  timeline text,
  portfolio text,
  img text,
  status text not null default 'pending' check (status in ('pending', 'in_review', 'completed', 'done', 'archived')),
  created_at timestamptz not null default now()
);

create table if not exists public.community_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  author_name text,
  image_url text not null,
  caption text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.community_likes (
  post_id uuid not null references public.community_posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create schema if not exists private;

revoke all on schema private from public;
grant usage on schema private to authenticated;

create or replace function private.is_admin(user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = user_id
      and (
        role = 'admin'
        or lower(email) in ('pareshsutharr@gmail.com', 'pareshsuthar@gmail.com')
      )
  );
$$;

grant execute on function private.is_admin(uuid) to authenticated;

create or replace function public.update_profile_role(target_user_id uuid, target_role text)
returns table (
  id uuid,
  role text
)
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not private.is_admin(auth.uid()) then
    raise exception 'Only admins can update user roles.';
  end if;

  if target_role not in ('client', 'admin', 'member') then
    raise exception 'Invalid role: %', target_role;
  end if;

  if target_user_id = auth.uid() and target_role <> 'admin' then
    raise exception 'You cannot remove your own admin access.';
  end if;

  return query
  update public.profiles
  set role = target_role,
      updated_at = now()
  where profiles.id = target_user_id
  returning profiles.id, profiles.role;

  if not found then
    raise exception 'Profile not found.';
  end if;
end;
$$;

grant execute on function public.update_profile_role(uuid, text) to authenticated;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
before update on public.profiles
for each row execute function public.touch_updated_at();

drop trigger if exists community_posts_touch_updated_at on public.community_posts;
create trigger community_posts_touch_updated_at
before update on public.community_posts
for each row execute function public.touch_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (
    id,
    username,
    display_name,
    email,
    phone_number,
    avatar_url,
    role
  )
  values (
    new.id,
    concat(coalesce(nullif(split_part(new.email, '@', 1), ''), 'user'), '-', left(new.id::text, 8)),
    coalesce(nullif(new.raw_user_meta_data ->> 'full_name', ''), split_part(new.email, '@', 1), '8thSense client'),
    new.email,
    nullif(new.raw_user_meta_data ->> 'phone_number', ''),
    new.raw_user_meta_data ->> 'avatar_url',
    case
      when lower(new.email) in ('pareshsutharr@gmail.com', 'pareshsuthar@gmail.com') then 'admin'
      else 'client'
    end
  )
  on conflict (id) do update
  set email = excluded.email,
      username = coalesce(public.profiles.username, excluded.username),
      avatar_url = coalesce(public.profiles.avatar_url, excluded.avatar_url),
      role = case
        when lower(excluded.email) in ('pareshsutharr@gmail.com', 'pareshsuthar@gmail.com') then 'admin'
        else public.profiles.role
      end,
      updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.services enable row level security;
alter table public.portfolio_items enable row level security;
alter table public.sliders enable row level security;
alter table public.contacts enable row level security;
alter table public.feedback enable row level security;
alter table public.quotations enable row level security;
alter table public.collaboration_requests enable row level security;
alter table public.community_posts enable row level security;
alter table public.community_likes enable row level security;

-- Public website content
drop policy if exists "public active services are readable" on public.services;
create policy "public active services are readable"
on public.services for select
to anon, authenticated
using (active = true);

drop policy if exists "portfolio is publicly readable" on public.portfolio_items;
create policy "portfolio is publicly readable"
on public.portfolio_items for select
to anon, authenticated
using (true);

drop policy if exists "public active sliders are readable" on public.sliders;
create policy "public active sliders are readable"
on public.sliders for select
to anon, authenticated
using (active = true);

drop policy if exists "approved feedback is publicly readable" on public.feedback;
create policy "approved feedback is publicly readable"
on public.feedback for select
to anon, authenticated
using (approved = true);

-- Public lead-capture forms
drop policy if exists "anyone can submit contacts" on public.contacts;
create policy "anyone can submit contacts"
on public.contacts for insert
to anon, authenticated
with check (true);

drop policy if exists "anyone can submit feedback" on public.feedback;
create policy "anyone can submit feedback"
on public.feedback for insert
to anon, authenticated
with check (rating between 1 and 5);

drop policy if exists "anyone can request quotations" on public.quotations;
create policy "anyone can request quotations"
on public.quotations for insert
to anon, authenticated
with check (true);

drop policy if exists "anyone can request collaborations" on public.collaboration_requests;
create policy "anyone can request collaborations"
on public.collaboration_requests for insert
to anon, authenticated
with check (true);

-- Admin access is based on public.profiles.role, not user-editable auth metadata.
drop policy if exists "admins can manage services" on public.services;
create policy "admins can manage services"
on public.services for all
to authenticated
using (
  exists (
    select 1 from public.profiles admin_profile
    where admin_profile.id = auth.uid()
      and admin_profile.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.profiles admin_profile
    where admin_profile.id = auth.uid()
      and admin_profile.role = 'admin'
  )
);

drop policy if exists "admins can manage portfolio" on public.portfolio_items;
create policy "admins can manage portfolio"
on public.portfolio_items for all
to authenticated
using (
  exists (
    select 1 from public.profiles admin_profile
    where admin_profile.id = auth.uid()
      and admin_profile.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.profiles admin_profile
    where admin_profile.id = auth.uid()
      and admin_profile.role = 'admin'
  )
);

drop policy if exists "admins can manage contacts" on public.contacts;
create policy "admins can manage contacts"
on public.contacts for all
to authenticated
using (
  exists (
    select 1 from public.profiles admin_profile
    where admin_profile.id = auth.uid()
      and admin_profile.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.profiles admin_profile
    where admin_profile.id = auth.uid()
      and admin_profile.role = 'admin'
  )
);

drop policy if exists "admins can manage feedback" on public.feedback;
create policy "admins can manage feedback"
on public.feedback for all
to authenticated
using (
  exists (
    select 1 from public.profiles admin_profile
    where admin_profile.id = auth.uid()
      and admin_profile.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.profiles admin_profile
    where admin_profile.id = auth.uid()
      and admin_profile.role = 'admin'
  )
);

drop policy if exists "admins can manage quotations" on public.quotations;
create policy "admins can manage quotations"
on public.quotations for all
to authenticated
using (
  exists (
    select 1 from public.profiles admin_profile
    where admin_profile.id = auth.uid()
      and admin_profile.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.profiles admin_profile
    where admin_profile.id = auth.uid()
      and admin_profile.role = 'admin'
  )
);

drop policy if exists "admins can manage collaboration requests" on public.collaboration_requests;
create policy "admins can manage collaboration requests"
on public.collaboration_requests for all
to authenticated
using (
  exists (
    select 1 from public.profiles admin_profile
    where admin_profile.id = auth.uid()
      and admin_profile.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.profiles admin_profile
    where admin_profile.id = auth.uid()
      and admin_profile.role = 'admin'
  )
);

-- Authenticated profile and community photo posting
drop policy if exists "users can read profiles" on public.profiles;
create policy "users can read profiles"
on public.profiles for select
to authenticated
using (true);

drop policy if exists "users can update own profile" on public.profiles;
create policy "users can update own profile"
on public.profiles for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid() and role in ('client', 'member'));

drop policy if exists "admins can update profiles" on public.profiles;
create policy "admins can update profiles"
on public.profiles for update
to authenticated
using (private.is_admin(auth.uid()))
with check (true);

drop policy if exists "community posts are public" on public.community_posts;
create policy "community posts are public"
on public.community_posts for select
to anon, authenticated
using (true);

drop policy if exists "users can create community posts" on public.community_posts;
create policy "users can create community posts"
on public.community_posts for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "users can update own community posts" on public.community_posts;
create policy "users can update own community posts"
on public.community_posts for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "users can delete own community posts" on public.community_posts;
create policy "users can delete own community posts"
on public.community_posts for delete
to authenticated
using (user_id = auth.uid());

drop policy if exists "admins can manage community posts" on public.community_posts;
create policy "admins can manage community posts"
on public.community_posts for all
to authenticated
using (
  exists (
    select 1 from public.profiles admin_profile
    where admin_profile.id = auth.uid()
      and admin_profile.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.profiles admin_profile
    where admin_profile.id = auth.uid()
      and admin_profile.role = 'admin'
  )
);

drop policy if exists "community likes are public" on public.community_likes;
create policy "community likes are public"
on public.community_likes for select
to anon, authenticated
using (true);

drop policy if exists "users can like community posts" on public.community_likes;
create policy "users can like community posts"
on public.community_likes for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "users can remove own community likes" on public.community_likes;
create policy "users can remove own community likes"
on public.community_likes for delete
to authenticated
using (user_id = auth.uid());

drop policy if exists "admins can manage community likes" on public.community_likes;
create policy "admins can manage community likes"
on public.community_likes for all
to authenticated
using (
  exists (
    select 1 from public.profiles admin_profile
    where admin_profile.id = auth.uid()
      and admin_profile.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.profiles admin_profile
    where admin_profile.id = auth.uid()
      and admin_profile.role = 'admin'
  )
);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('community-posts', 'community-posts', true, 5242880, array['image/png', 'image/jpeg', 'image/webp', 'image/gif'])
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "public community images read access" on storage.objects;
create policy "public community images read access"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'community-posts');

drop policy if exists "users can upload own community images" on storage.objects;
create policy "users can upload own community images"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'community-posts'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "users can update own community images" on storage.objects;
create policy "users can update own community images"
on storage.objects for update
to authenticated
using (
  bucket_id = 'community-posts'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'community-posts'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "users can delete own community images" on storage.objects;
create policy "users can delete own community images"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'community-posts'
  and (storage.foldername(name))[1] = auth.uid()::text
);

grant usage on schema public to anon, authenticated;
grant select on public.services, public.portfolio_items, public.sliders, public.feedback, public.community_posts, public.community_likes to anon, authenticated;
grant insert on public.contacts, public.feedback, public.quotations, public.collaboration_requests to anon, authenticated;
revoke update on public.profiles from authenticated;
grant select on public.profiles to authenticated;
grant update (display_name, username, phone_number, avatar_url, role) on public.profiles to authenticated;
grant select on public.contacts, public.quotations, public.collaboration_requests to authenticated;
grant insert, update, delete on public.services, public.portfolio_items, public.contacts, public.feedback, public.quotations, public.collaboration_requests, public.community_posts to authenticated;
grant insert, update, delete on public.community_likes to authenticated;

insert into public.profiles (id, username, display_name, email, role, active)
select
  users.id,
  concat(coalesce(nullif(split_part(users.email, '@', 1), ''), 'user'), '-', left(users.id::text, 8)),
  coalesce(nullif(users.raw_user_meta_data ->> 'full_name', ''), split_part(users.email, '@', 1), '8thSense Admin'),
  users.email,
  'admin',
  true
from auth.users
where lower(users.email) in ('pareshsutharr@gmail.com', 'pareshsuthar@gmail.com')
on conflict (id) do update
set email = excluded.email,
    username = coalesce(public.profiles.username, excluded.username),
    display_name = coalesce(public.profiles.display_name, excluded.display_name),
    role = 'admin',
    active = true,
    updated_at = now();

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime')
     and not exists (
       select 1
       from pg_publication_tables
       where pubname = 'supabase_realtime'
         and schemaname = 'public'
         and tablename = 'community_posts'
     ) then
    alter publication supabase_realtime add table public.community_posts;
  end if;
end;
$$;

delete from public.portfolio_items where image_url like '/brand/%';
delete from public.sliders where image_url like '/brand/%';
update public.services
set image_url = null
where image_url like '/brand/%';

insert into public.services (title, slug, description, image_url, sort_order)
values
  ('Photography', 'photography', 'Capture the essence of every moment with precision, artistry, and a strong visual story.', 'https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?auto=format&fit=crop&w=2000&q=85', 1),
  ('Videography', 'videography', 'Cinematic films, event videos, campaign shoots, reels, music videos, and corporate stories.', 'https://images.unsplash.com/photo-1520390138845-fd2d229dd553?auto=format&fit=crop&w=2200&q=85', 2),
  ('Social Media Content Creation', 'social-media-content', 'Short-form creative assets, branded visuals, and platform-ready content for modern campaigns.', 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=2200&q=85', 3)
on conflict (slug) do update
set description = excluded.description,
    image_url = excluded.image_url,
    sort_order = excluded.sort_order,
    active = true;

insert into public.portfolio_items (title, location, description, image_url, category, featured, sort_order)
values
  ('Event Coverage', 'Surat', 'Live event coverage with cinematic pacing and clean story edits.', 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=2200&q=85', 'Live moments', true, 1),
  ('Wedding Stories', 'Gujarat', 'Elegant wedding photography and film for celebrations and family stories.', 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2200&q=85', 'Celebration', true, 2),
  ('Portrait Direction', 'Studio', 'Clean portrait direction for founders, creators, teams, and personal brands.', 'https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?auto=format&fit=crop&w=2000&q=85', 'Photography', true, 3),
  ('Video Production', 'Studio', 'Cinematic shooting setups for campaign films and short-form video.', 'https://images.unsplash.com/photo-1520390138845-fd2d229dd553?auto=format&fit=crop&w=2200&q=85', 'Cinematic shoot', false, 4),
  ('Social Campaigns', 'Digital', 'Social-first campaign visuals for Instagram, Facebook, and digital launches.', 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=2200&q=85', 'Digital content', false, 5),
  ('Studio Production', 'Production', 'Controlled production setups for polished branded assets.', 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=2200&q=85', 'Brand visuals', false, 6)
on conflict do nothing;

insert into public.sliders (title, name, description, image_url, button1_text, button2_text, sort_order)
values
  ('SPOTLIGHTING YOUR STORIES', '8thSense Production', 'We capture your story through cinematic visuals and dynamic videos.', 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=2400&q=85', 'Get Quotation', 'View Albums', 1),
  ('VISUALS THAT MOVE PEOPLE', 'Lifestyle Campaign', 'Polished media for brands, creators, events, and campaigns.', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=2400&q=85', 'Collaborate', 'Albums', 2)
on conflict do nothing;
