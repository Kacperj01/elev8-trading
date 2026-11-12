-- Mentorship applications from the ELEV8 Trading website.
-- Run this once in Supabase: Dashboard > SQL Editor > New query > paste > Run.
-- Visitors can only ADD an application. Nobody can read, change or delete them through the public key;
-- you see them in Dashboard > Table Editor > mentorship_applications.

create table if not exists public.mentorship_applications (
  id            bigint generated always as identity primary key,
  created_at    timestamptz not null default now(),
  name          text not null check (char_length(name) between 1 and 80),
  email         text not null check (char_length(email) <= 200 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  handle        text check (char_length(handle) <= 80),
  level         text not null check (level in ('beginner', 'intermediate', 'advanced')),
  goals         text not null check (char_length(goals) between 1 and 1500),
  age_confirmed boolean not null check (age_confirmed),
  consent       boolean not null check (consent),
  status        text not null default 'new' check (status in ('new', 'contacted', 'accepted', 'declined'))
);

alter table public.mentorship_applications enable row level security;

-- Only insert, only these columns. No select, update or delete for the public key.
revoke all on table public.mentorship_applications from anon, authenticated;
grant insert (name, email, handle, level, goals, age_confirmed, consent)
  on table public.mentorship_applications to anon, authenticated;

drop policy if exists "Anyone can apply" on public.mentorship_applications;
create policy "Anyone can apply" on public.mentorship_applications
  for insert to anon, authenticated with check (true);

-- Spam limits: one application per email per day, and at most 30 applications an hour in total.
create or replace function public.mentorship_application_limits()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  new.email := lower(trim(new.email));
  if exists (select 1 from public.mentorship_applications
             where email = new.email and created_at > now() - interval '1 day') then
    raise exception 'already applied';
  end if;
  if (select count(*) from public.mentorship_applications
      where created_at > now() - interval '1 hour') >= 30 then
    raise exception 'too many applications';
  end if;
  return new;
end $$;

drop trigger if exists mentorship_application_limits on public.mentorship_applications;
create trigger mentorship_application_limits before insert on public.mentorship_applications
  for each row execute function public.mentorship_application_limits();

-- Keep applications for 12 months at most (as the privacy policy says). Run this now and then,
-- or schedule it with pg_cron:
-- delete from public.mentorship_applications where created_at < now() - interval '12 months';
