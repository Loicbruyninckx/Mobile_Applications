## Over het project

Bierapp is een app voor studenten die met vrienden op café gaan. Je rate de speciaalbieren die je drinkt en ziet wat je vrienden lekker vonden en waar.

- **Live PWA:** https://bierapp-loic.vercel.app

### Schermen

| Scherm | Wat je er doet |
| --- | --- |
| Inloggen / registreren | Een account maken of inloggen |
| Home | De groepsfeed: recente ratings van je vrienden, je week in cijfers, je topbier en het populairste café |
| Toevoegen | Een bier zoeken of toevoegen en het een score (1–5), een review en een café geven |
| Mijn ratings | Al je ratings, sorteerbaar op score of datum |
| Groepen | Een groep maken, je uitnodigingscode delen of een groep joinen met een code |
| Groepsdetail | De leden van een groep, en de uitnodigingscode die je met één tik kopieert |
| Profiel | Je profiel bekijken en uitloggen |


## Inloggen voor de lector

Gebruik dit demo-account op de live PWA:

| |                |
| --- |----------------|
| E-mail | `loic@test.be` |
| Wachtwoord | `Loic1234!`    |

Het account zit in een groep met een paar ratings, zodat de feed meteen gevuld is. Je kan ook zelf een account aanmaken via *Registreren*.


## Het idee

### Probleem

Studenten proeven op café veel verschillende speciaalbieren, maar vergeten welke ze lekker vonden en kiezen telkens opnieuw op gevoel. Moeten ze samen een café kiezen, dan wordt dat eindeloos discussiëren in de groepschat. Zo geven ze geld uit aan bieren die ze niet lekker vinden en verliezen ze tijd met plannen.


### Doelgroep

- **Gebruikers:** studenten van 18 tot 25 jaar die in vriendengroepen op café gaan en graag speciaalbier drinken.
- **Twee types gebruikers:**
  - *de bierliefhebber*, die alles wil bijhouden en zijn persoonlijke top wil zien;
  - *de groepsplanner*, die vooral wil weten waar de groep naartoe gaat.
- **Gebruikscontext:** op café, met de gsm in één hand en vaak een slechte verbinding. Daarom moet raten snel gaan, met grote knoppen onderaan het scherm.

### Wat ik bouw

1. **Account:** registreren, inloggen en uitloggen.
2. **Bier raten:** naam, brouwerij, stijl, score van 1 tot 5, een korte review en het café.
3. **Mijn ratings:** je persoonlijke lijst en top, sorteerbaar.
4. **Vriendengroepen:** een groep maken en joinen met een uitnodigingscode van 6 tekens.
5. **Groepsfeed:** de ratings van je groepsleden op het startscherm.

### Concurrenten

| Alternatief | Nadeel voor deze doelgroep |
| --- | --- |
| **Untappd** | Een publiek sociaal netwerk voor bierfanaten: veel functies en veel vreemden |
| **Notities-app op je gsm** | Niet gedeeld met je vrienden en niet sorteerbaar |

**Verschil:** Untappd is een publiek netwerk voor bierfanaten. Bierapp is privé en draait rond je eigen vriendengroep en de cafés waar jullie samen komen.

## Roadmap
**Opdracht 1 – PWA:** account, bier raten, mijn ratings, groepen, groepsfeed 
**Opdracht 2 – native app:** foto van je bier met locatie, groep joinen via QR-code, meldingen

## Lokaal starten

Maak in de hoofdmap een bestand `.env` met de gegevens van je Supabase-project (*Project Settings → API*):

   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://<jouw-project>.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=<jouw-anon-public-key>
   ```

   `.env` staat in `.gitignore`, dus deze sleutels komen nooit op GitHub.


### Starten

```sh
npm run web
```


## Tests

De E2E-tests staan in [`cypress/e2e/`](cypress/e2e/) en dekken drie scenario's met in totaal 8 tests:

| Bestand | Wat er getest wordt |
| --- | --- |
| `login.cy.ts` | Inloggen, een fout wachtwoord en uitloggen |
| `rate-beer.cy.ts` | Een bier raten (het verschijnt in Mijn ratings en de feed), en niet opslaan zonder score |
| `join-group.cy.ts` | Een groep joinen met een geldige code, een ongeldige code en een code van een groep waar je al in zit |

### Eenmalig klaarzetten

1. Maak in Supabase onder *Authentication* twee testaccounts aan: `test1@test.be` en `test2@test.be`.
2. Voer [`supabase/seed.sql`](supabase/seed.sql) uit in de *SQL Editor*. Dat maakt de testgroep aan.
3. Maak in de hoofdmap een bestand `cypress.env.json` met de wachtwoorden. Ook dit bestand staat in `.gitignore`.

   ```json
   {
     "TEST1_EMAIL": "test1@test.be",
     "TEST1_PASSWORD": "Test1234!",
     "TEST2_EMAIL": "test2@test.be",
     "TEST2_PASSWORD": "Test1234!"
   }
   ```

