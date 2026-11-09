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


## Starten

```sh
npm run web
```

