do $$
declare
  test1_id  uuid;
  test2_id  uuid;
  testgroep_id  uuid;
begin
  select id into test1_id from auth.users where email = 'test1@test.be';
  select id into test2_id from auth.users where email = 'test2@test.be';

  if test1_id is null then
    raise exception 'test1@test.be bestaat niet: maak het account eerst aan in Authentication';
  end if;
  if test2_id is null then
    raise exception 'test2@test.be bestaat niet: maak het account eerst aan in Authentication';
  end if;

  insert into public.profiles (id, username)
  values (test1_id, 'test1'), (test2_id, 'test2')
  on conflict (id) do update set username = excluded.username;

  insert into public.beers (name, brewery, style, abv, created_by)
  values ('Testbier', 'Testbrouwerij', 'Tripel', 8.0, test1_id)
  on conflict ((lower(name)), (lower(coalesce(brewery, '')))) do nothing;

  insert into public.cafes (name, city, created_by)
  values ('Testcafé', 'Leuven', test1_id)
  on conflict ((lower(name)), (lower(city))) do nothing;

  insert into public.groups (name, invite_code, created_by)
  values ('Testgroep', 'TEST01', test1_id)
  on conflict (invite_code) do update
    set name = excluded.name, created_by = excluded.created_by
  returning id into testgroep_id;

  insert into public.group_members (group_id, user_id)
  values (testgroep_id, test1_id)
  on conflict do nothing;

  delete from public.group_members gm
  where gm.group_id = testgroep_id and gm.user_id = test2_id;

  raise notice 'Seed klaar: Testgroep % (code TEST01)', testgroep_id;
end;
$$;
