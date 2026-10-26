-- =====================================================================
-- Bierapp – initieel datamodel
-- Eenmalig uitvoeren in Supabase → SQL Editor op een leeg project.
-- =====================================================================


-- ---------------------------------------------------------------------
-- 1. Tabellen
-- ---------------------------------------------------------------------

-- Eén profiel per account (id = auth.users.id).
create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  username    text not null check (char_length(username) between 3 and 30),
  avatar_url  text,
  created_at  timestamptz not null default now()
);
-- Uniek zonder onderscheid hoofd/kleine letters ("Loic" = "loic").
create unique index profiles_username_unique on public.profiles (lower(username));

-- Gedeelde biercatalogus.
create table public.beers (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name) between 1 and 100),
  brewery     text,
  style       text,
  abv         numeric(4, 1) check (abv is null or abv between 0 and 100),
  created_by  uuid default auth.uid() references public.profiles (id) on delete set null,
  created_at  timestamptz not null default now()
);
-- Voorkomt dubbele bieren ("Westmalle Tripel" van "Westmalle" maar één keer).
create unique index beers_name_brewery_unique
  on public.beers (lower(name), lower(coalesce(brewery, '')));

-- Gedeelde cafécatalogus.
create table public.cafes (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name) between 1 and 100),
  city        text not null check (char_length(city) between 1 and 100),
  created_by  uuid default auth.uid() references public.profiles (id) on delete set null,
  created_at  timestamptz not null default now()
);
create unique index cafes_name_city_unique on public.cafes (lower(name), lower(city));

-- Genereert een unieke uitnodigingscode van 6 tekens.
-- Alfabet zonder tekens die op elkaar lijken (geen 0/O, 1/I/L).
-- Security definer: de functie moet ALLE groepen zien om te checken of
-- een code al bestaat, ook groepen waar de gebruiker geen lid van is.
create function public.generate_invite_code()
returns text
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  alphabet constant text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  new_code text;
begin
  loop
    new_code := '';
    for i in 1..6 loop
      new_code := new_code || substr(alphabet, floor(random() * length(alphabet))::int + 1, 1);
    end loop;
    exit when not exists (select 1 from public.groups where invite_code = new_code);
  end loop;
  return new_code;
end;
$$;

create table public.groups (
  id           uuid primary key default gen_random_uuid(),
  name         text not null check (char_length(name) between 1 and 50),
  photo_url    text,
  invite_code  text not null unique default public.generate_invite_code()
               check (invite_code ~ '^[A-Z0-9]{6}$'),
  created_by   uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  created_at   timestamptz not null default now()
);

create table public.group_members (
  group_id   uuid not null references public.groups (id) on delete cascade,
  user_id    uuid not null references public.profiles (id) on delete cascade,
  joined_at  timestamptz not null default now(),
  primary key (group_id, user_id)
);

-- Geen unique op (user_id, beer_id): hetzelfde bier meerdere keren raten mag.
create table public.ratings (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  beer_id     uuid not null references public.beers (id),
  cafe_id     uuid references public.cafes (id) on delete set null,
  score       smallint not null check (score between 1 and 5),
  review      text check (review is null or char_length(review) <= 500),
  photo_url   text,
  created_at  timestamptz not null default now()
);

-- Met welke groepen een rating gedeeld is.
create table public.rating_shares (
  rating_id  uuid not null references public.ratings (id) on delete cascade,
  group_id   uuid not null references public.groups (id) on delete cascade,
  primary key (rating_id, group_id)
);


-- ---------------------------------------------------------------------
-- 2. Indexen voor de queries die de app vaak doet
-- ---------------------------------------------------------------------

create index ratings_user_created_idx on public.ratings (user_id, created_at desc);  -- Mijn ratings
create index ratings_beer_idx         on public.ratings (beer_id);
create index rating_shares_group_idx  on public.rating_shares (group_id);           -- Groepsfeed
create index group_members_user_idx   on public.group_members (user_id);            -- Mijn groepen


-- ---------------------------------------------------------------------
-- 3. Helperfuncties voor RLS
-- Security definer = de functie draait met de rechten van de eigenaar en
-- omzeilt dus RLS binnenin. Zo vermijden we oneindige recursie wanneer
-- een policy dezelfde (of een verwante) tabel moet lezen.
-- search_path = '' zodat niemand een functie kan "kapen" met een eigen
-- tabel of functie met dezelfde naam.
-- ---------------------------------------------------------------------

-- Is de ingelogde gebruiker lid van groep gid?
create function public.is_group_member(gid uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.group_members
    where group_id = gid and user_id = (select auth.uid())
  );
$$;

-- Is rating rid van de ingelogde gebruiker?
create function public.owns_rating(rid uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.ratings
    where id = rid and user_id = (select auth.uid())
  );
$$;

-- Zit de ingelogde gebruiker samen met other_user in minstens één groep?
create function public.shares_group_with(other_user uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.group_members me
    join public.group_members other on other.group_id = me.group_id
    where me.user_id = (select auth.uid()) and other.user_id = other_user
  );
$$;


-- ---------------------------------------------------------------------
-- 4. Triggers
-- ---------------------------------------------------------------------

-- Maakt automatisch een profiel aan bij registratie.
-- De app geeft de username mee via signUp({ options: { data: { username } } }).
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    coalesce(
      nullif(trim(new.raw_user_meta_data ->> 'username'), ''),
      'user_' || left(new.id::text, 8)
    )
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Wie een groep maakt, wordt automatisch lid.
create function public.add_creator_as_member()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.group_members (group_id, user_id)
  values (new.id, new.created_by);
  return new;
end;
$$;

create trigger on_group_created
  after insert on public.groups
  for each row execute function public.add_creator_as_member();


-- ---------------------------------------------------------------------
-- 5. Groep joinen met een code
-- Security definer: een niet-lid mag de groep via RLS nog niet zien,
-- dus deze functie zoekt de groep op met verhoogde rechten.
-- Geeft het group_id terug zodat de app naar het groepsdetail kan gaan.
-- ---------------------------------------------------------------------

create function public.join_group_by_code(code text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  found_group_id  uuid;
begin
  if current_user_id is null then
    raise exception 'Niet ingelogd' using errcode = '42501';
  end if;

  select id into found_group_id
  from public.groups
  where invite_code = upper(trim(code));

  if found_group_id is null then
    raise exception 'Ongeldige code' using errcode = 'P0002';
  end if;

  -- Al lid? Dan gebeurt er niets (geen fout).
  insert into public.group_members (group_id, user_id)
  values (found_group_id, current_user_id)
  on conflict do nothing;

  return found_group_id;
end;
$$;


-- ---------------------------------------------------------------------
-- 6. Rechten op functies
-- Standaard mag iedereen (ook anon) elke functie uitvoeren. Dat zetten we
-- strakker: helpers en join enkel voor ingelogde gebruikers, triggers
-- voor niemand (triggers hebben geen execute-recht nodig).
-- ---------------------------------------------------------------------

revoke execute on function
  public.is_group_member(uuid),
  public.owns_rating(uuid),
  public.shares_group_with(uuid),
  public.join_group_by_code(text),
  public.generate_invite_code()
from public, anon;

grant execute on function
  public.is_group_member(uuid),
  public.owns_rating(uuid),
  public.shares_group_with(uuid),
  public.join_group_by_code(text),
  public.generate_invite_code()
to authenticated;

revoke execute on function
  public.handle_new_user(),
  public.add_creator_as_member()
from public, anon, authenticated;


-- ---------------------------------------------------------------------
-- 7. Row Level Security
-- Alle policies gelden enkel voor de rol "authenticated": wie niet is
-- ingelogd, ziet en doet niets. Geen policy = niet toegestaan.
-- (select auth.uid()) i.p.v. auth.uid(): Postgres rekent het één keer
-- uit per query i.p.v. per rij (aanbeveling van Supabase).
-- ---------------------------------------------------------------------

alter table public.profiles      enable row level security;
alter table public.beers         enable row level security;
alter table public.cafes         enable row level security;
alter table public.groups        enable row level security;
alter table public.group_members enable row level security;
alter table public.ratings       enable row level security;
alter table public.rating_shares enable row level security;

-- profiles ------------------------------------------------------------
create policy "profiles_select_self_or_groupmates" on public.profiles
  for select to authenticated
  using (id = (select auth.uid()) or public.shares_group_with(id));

create policy "profiles_insert_self" on public.profiles
  for insert to authenticated
  with check (id = (select auth.uid()));

create policy "profiles_update_self" on public.profiles
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

create policy "profiles_delete_self" on public.profiles
  for delete to authenticated
  using (id = (select auth.uid()));

-- beers (lezen + toevoegen; wijzigen/verwijderen kan niemand) ----------
create policy "beers_select_all" on public.beers
  for select to authenticated
  using (true);

create policy "beers_insert_own" on public.beers
  for insert to authenticated
  with check (created_by = (select auth.uid()));

-- cafes (zelfde regels als beers) --------------------------------------
create policy "cafes_select_all" on public.cafes
  for select to authenticated
  using (true);

create policy "cafes_insert_own" on public.cafes
  for insert to authenticated
  with check (created_by = (select auth.uid()));

-- groups ----------------------------------------------------------------
-- created_by staat erbij omdat bij insert(...).select() de SELECT-policy
-- gecontroleerd wordt; de maker moet zijn nieuwe groep dan al kunnen zien.
create policy "groups_select_member_or_creator" on public.groups
  for select to authenticated
  using (public.is_group_member(id) or created_by = (select auth.uid()));

create policy "groups_insert_own" on public.groups
  for insert to authenticated
  with check (created_by = (select auth.uid()));

create policy "groups_update_creator" on public.groups
  for update to authenticated
  using (created_by = (select auth.uid()))
  with check (created_by = (select auth.uid()));

create policy "groups_delete_creator" on public.groups
  for delete to authenticated
  using (created_by = (select auth.uid()));

-- group_members ----------------------------------------------------------
-- Bewust GEEN insert-policy: lid worden kan alleen via de trigger
-- (maker) of join_group_by_code (met geldige code).
create policy "group_members_select_same_group" on public.group_members
  for select to authenticated
  using (public.is_group_member(group_id));

create policy "group_members_delete_self" on public.group_members
  for delete to authenticated
  using (user_id = (select auth.uid()));

-- ratings ------------------------------------------------------------------
create policy "ratings_select_own_or_shared" on public.ratings
  for select to authenticated
  using (
    user_id = (select auth.uid())
    or exists (
      select 1 from public.rating_shares rs
      where rs.rating_id = ratings.id
        and public.is_group_member(rs.group_id)
    )
  );

create policy "ratings_insert_own" on public.ratings
  for insert to authenticated
  with check (user_id = (select auth.uid()));

create policy "ratings_update_own" on public.ratings
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "ratings_delete_own" on public.ratings
  for delete to authenticated
  using (user_id = (select auth.uid()));

-- rating_shares --------------------------------------------------------------
-- owns_rating() i.p.v. een subquery op ratings: anders lezen ratings en
-- rating_shares elkaars policies in een eindeloze lus.
create policy "rating_shares_select_owner_or_member" on public.rating_shares
  for select to authenticated
  using (public.owns_rating(rating_id) or public.is_group_member(group_id));

create policy "rating_shares_insert_own_to_my_group" on public.rating_shares
  for insert to authenticated
  with check (public.owns_rating(rating_id) and public.is_group_member(group_id));

create policy "rating_shares_delete_own" on public.rating_shares
  for delete to authenticated
  using (public.owns_rating(rating_id));


-- ---------------------------------------------------------------------
-- 8. Storage: bucket "photos"
-- Privé bucket: lezen enkel voor ingelogde gebruikers (via signed URL).
-- Uploaden, vervangen en verwijderen enkel in je eigen map: {user_id}/...
-- In photo_url / avatar_url bewaar je het PAD, bv. "<user_id>/abc.jpg".
-- ---------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('photos', 'photos', false)
on conflict (id) do nothing;

create policy "photos_select_authenticated" on storage.objects
  for select to authenticated
  using (bucket_id = 'photos');

create policy "photos_insert_own_folder" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "photos_update_own_folder" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  )
  with check (
    bucket_id = 'photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "photos_delete_own_folder" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
