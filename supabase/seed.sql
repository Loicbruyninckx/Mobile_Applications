-- =====================================================================
-- Bierapp – testdata voor de Cypress E2E-tests
-- Uitvoeren in Supabase → SQL Editor, NA 001_init.sql.
--
-- Vereist: de accounts test1@test.be en test2@test.be bestaan al in
-- Authentication. Dit script maakt ze niet aan, het zoekt ze op.
--
-- Herhaalbaar: twee keer uitvoeren geeft geen dubbele rijen.
-- De SQL Editor draait als "postgres" en omzeilt dus RLS.
-- =====================================================================

do $$
declare
  test1_id  uuid;
  test2_id  uuid;
  testgroep_id  uuid;
begin
  -- 1. Testaccounts opzoeken ----------------------------------------------
  select id into test1_id from auth.users where email = 'test1@test.be';
  select id into test2_id from auth.users where email = 'test2@test.be';

  if test1_id is null then
    raise exception 'test1@test.be bestaat niet: maak het account eerst aan in Authentication';
  end if;
  if test2_id is null then
    raise exception 'test2@test.be bestaat niet: maak het account eerst aan in Authentication';
  end if;

  -- 2. Profielen met vaste usernames ---------------------------------------
  -- Normaal maakt de trigger het profiel al aan bij registratie;
  -- on conflict zet dan enkel de username juist.
  insert into public.profiles (id, username)
  values (test1_id, 'test1'), (test2_id, 'test2')
  on conflict (id) do update set username = excluded.username;

  -- 3. Testbier --------------------------------------------------------------
  -- Conflict-doel = de unieke index beers_name_brewery_unique.
  insert into public.beers (name, brewery, style, abv, created_by)
  values ('Testbier', 'Testbrouwerij', 'Tripel', 8.0, test1_id)
  on conflict ((lower(name)), (lower(coalesce(brewery, '')))) do nothing;

  -- 4. Testcafé --------------------------------------------------------------
  -- Conflict-doel = de unieke index cafes_name_city_unique.
  insert into public.cafes (name, city, created_by)
  values ('Testcafé', 'Leuven', test1_id)
  on conflict ((lower(name)), (lower(city))) do nothing;

  -- 5. Testgroep met vaste code ----------------------------------------------
  -- "do update" i.p.v. "do nothing" zodat returning altijd het id geeft
  -- en naam en maker altijd kloppen, ook als iemand ze wijzigde.
  insert into public.groups (name, invite_code, created_by)
  values ('Testgroep', 'TEST01', test1_id)
  on conflict (invite_code) do update
    set name = excluded.name, created_by = excluded.created_by
  returning id into testgroep_id;

  -- 6. Lidmaatschap -----------------------------------------------------------
  -- test1 is lid. Bij een nieuwe groep doet de trigger dit al;
  -- deze regel vangt het geval op dat test1 de groep ooit verliet.
  insert into public.group_members (group_id, user_id)
  values (testgroep_id, test1_id)
  on conflict do nothing;

  -- test2 is GEEN lid. De join-test maakt test2 lid, dus na elke testrun
  -- zet dit script de begintoestand terug.
  delete from public.group_members gm
  where gm.group_id = testgroep_id and gm.user_id = test2_id;

  raise notice 'Seed klaar: Testgroep % (code TEST01)', testgroep_id;
end;
$$;
