create table if not exists public.community_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.community_posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists community_comments_touch_updated_at on public.community_comments;
create trigger community_comments_touch_updated_at
before update on public.community_comments
for each row execute function public.touch_updated_at();

alter table public.community_comments enable row level security;

drop policy if exists "community comments are public" on public.community_comments;
create policy "community comments are public"
on public.community_comments for select
to anon, authenticated
using (true);

drop policy if exists "users can create community comments" on public.community_comments;
create policy "users can create community comments"
on public.community_comments for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "users can update own community comments" on public.community_comments;
create policy "users can update own community comments"
on public.community_comments for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "users can delete own community comments" on public.community_comments;
create policy "users can delete own community comments"
on public.community_comments for delete
to authenticated
using (user_id = auth.uid());

grant select on public.community_comments to anon, authenticated;
grant insert, update, delete on public.community_comments to authenticated;

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime')
     and not exists (
       select 1
       from pg_publication_tables
       where pubname = 'supabase_realtime'
         and schemaname = 'public'
         and tablename = 'community_comments'
     ) then
    alter publication supabase_realtime add table public.community_comments;
  end if;
end;
$$;
