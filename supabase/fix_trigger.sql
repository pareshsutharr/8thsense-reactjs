create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
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
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1), '8thSense client'),
    new.email,
    new.raw_user_meta_data ->> 'phone_number',
    new.raw_user_meta_data ->> 'avatar_url',
    coalesce(new.raw_user_meta_data ->> 'role', 'client')
  )
  on conflict (id) do update
  set email = excluded.email,
      username = coalesce(public.profiles.username, excluded.username),
      avatar_url = coalesce(public.profiles.avatar_url, excluded.avatar_url),
      role = coalesce(excluded.role, public.profiles.role),
      updated_at = now();

  return new;
end;
$$;
