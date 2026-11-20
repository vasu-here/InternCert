create table if not exists public.certificates (
  certificate_id text primary key,
  intern_name text not null,
  branch text not null,
  aicte_id text not null,
  email text not null,
  phone text not null,
  internship_domain text not null,
  duration text not null,
  start_date date not null,
  end_date date not null,
  project_title text not null,
  created_at timestamptz not null default now(),
  constraint certificate_dates_valid check (end_date >= start_date)
);

alter table public.certificates enable row level security;

revoke all on table public.certificates from anon, authenticated;
grant insert on table public.certificates to authenticated;

drop policy if exists "Admins can create certificates" on public.certificates;
create policy "Admins can create certificates"
  on public.certificates
  for insert
  to authenticated
  with check ((select auth.uid()) is not null);

create or replace function public.verify_certificate(p_certificate_id text)
returns table (
  certificate_id text,
  intern_name text,
  branch text,
  aicte_id text,
  email text,
  phone text,
  internship_domain text,
  duration text,
  start_date date,
  end_date date,
  project_title text
)
language sql
security definer
set search_path = ''
as $$
  select
    c.certificate_id,
    c.intern_name,
    c.branch,
    c.aicte_id,
    case
      when position('@' in c.email) > 2 then
        left(split_part(c.email, '@', 1), 1)
        || '***'
        || right(split_part(c.email, '@', 1), 1)
        || substring(c.email from position('@' in c.email))
      else '***'
    end,
    case
      when length(regexp_replace(c.phone, '[^0-9]', '', 'g')) > 3 then
        '+***' || right(regexp_replace(c.phone, '[^0-9]', '', 'g'), 3)
      else '***'
    end,
    c.internship_domain,
    c.duration,
    c.start_date,
    c.end_date,
    c.project_title
  from public.certificates as c
  where c.certificate_id = p_certificate_id
  limit 1;
$$;

revoke all on function public.verify_certificate(text) from public;
grant execute on function public.verify_certificate(text) to anon, authenticated;
