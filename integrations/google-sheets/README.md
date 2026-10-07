# Užsakymai ir užklausos → Google Sheets ir el. paštas

Tas pats standalone Google Apps Script priima apmokėtus Stripe užsakymus į „Užsakymai“ ir kontaktų užklausas į „Užklausos“, tada siunčia jų pranešimus bendram gavėjų sąrašui. Apps Script savybė `NOTIFICATION_EMAILS` turi pirmenybę prieš aplikacijos `INQUIRY_EMAILS`. Jei klientas nurodo el. paštą, jis nustatomas kaip `replyTo`, o ne pranešimo gavėjas.

## Esamo projekto atnaujinimas

1. Prieš keičiant skriptą išsaugokite esamo kodo kopiją. Išlaikykite `ORDERS_SHEET_ID`, projekto Script Property `ORDERS_WEBHOOK_SECRET` ir esamą Web app diegimą.
2. `Code.gs` yra sujungta šio projekto versija: ji naudoja `SpreadsheetApp.openById(ORDERS_SHEET_ID)`, išlaiko užsakymų formatavimą ir deduplikaciją pagal `Stripe ID`.
3. Įklijuokite kodą į esamą Apps Script projektą ir išsaugokite. Paslapties į kodą nekelkite. **Project Settings → Script Properties** nustatykite `NOTIFICATION_EMAILS`: visas verslo gavėjų sąrašas, atskirtas kableliais. Išlaikykite esamą `ORDERS_WEBHOOK_SECRET`.
4. Redaktoriuje paleiskite `setupInquiries`. Ji paruošia „Užklausos“ stulpelius ir paprašo `MailApp` leidimo siųsti laiškus. Esamų užsakymų nekeičia.
5. **Deploy → Manage deployments → Edit → Version: New version → Deploy.** Atnaujinus esamą diegimą, `/exec` adresas išlieka. Vykdymas: esamo projekto savininko vardu; prieiga: esama vieša Web app prieiga, užklausos tikrinamos pagal paslaptį.

Google siunčia iš tos paskyros, kuriai priklauso diegimas. `MailApp` leidžia siųsti laiškus, bet nesuteikia skriptui prieigos prie Gmail gautųjų.

Užsakymo laišką Apps Script gali sudaryti iš esamo `fields` turinio, todėl pranešimai veikia ir su ankstesne svetainės versija. Šiam atnaujinimui pakanka paskelbti esamo Apps Script diegimo naują versiją ir nustatyti gavėjų savybę. Naujesnis aplikacijos kodas pats sudaro tekstinį ir HTML laišką ir reikalauja `emailed: true` atsakymo. Jį galima paskelbti vėliau įprastu būdu.

## Naujas standalone projektas

Nurodykite savo lentelės ID konstantai `ORDERS_SHEET_ID`. Paleiskite `setupIntegration`, kad būtų paruošti užsakymų stulpeliai ir sukurta `ORDERS_WEBHOOK_SECRET` Script Property, tada `setupInquiries`. Sukurkite Web app diegimą, vykdomą savininko vardu ir pasiekiamą svetainei. Paslaptį iš projekto nustatymų saugiai nukopijuokite į aplikacijos aplinkos kintamąjį.

## Aplikacijos nustatymai

| Kintamasis | Reikšmė |
| --- | --- |
| `GOOGLE_SHEETS_WEBHOOK_URL` | Esamo Apps Script Web app adresas, baigiasi `/exec` |
| `GOOGLE_SHEETS_SECRET` | Ta pati reikšmė kaip Script Property `ORDERS_WEBHOOK_SECRET` |
| `INQUIRY_EMAILS` | Verslo ir asmeninio pašto adresai, atskirti kableliais |

Apps Script projekto `NOTIFICATION_EMAILS` nustatykite tokiu pačiu sąrašu; ši savybė vienodai taikoma užklausoms ir apmokėtiems užsakymams, įskaitant užklausas iš senesnio svetainės diegimo.

Reikšmes laikykite `.env.local` ir Vercel projekto nustatymuose. Į Git jų nekelkite. Vercel produkcinis diegimas turi naudoti dabartinius kontaktų formos failus: senos Git versijos „Redeploy“ neįtraukia neįkomituotų pakeitimų. Juos galima įdiegti oficialiu Vercel CLI iš vietinio projekto arba paskelbti dabartinius failus per susietos GitHub saugyklos `main` šaką.

## Tikrinimas ir klaidos

- Bandomąją užklausą pateikite per veikiančios svetainės `/kontaktai` formą ir patikrinkite įrašą „Užklausos“ bei laišką sutarto gavėjo pašto dėžutėje.
- Sėkmingas užklausos atsakymas yra `{ ok: true, recorded: true, emailed: true }` — `MailApp.sendEmail` baigė darbą. Tai savaime nepatvirtina laiško gavimo pašto dėžutėje.
- Jei laiško siuntimas nepavyksta, įrašas lieka lentelėje, o aplikacija gauna klaidą ir parodo atsarginį susisiekimo būdą. Pakartotinis formos pateikimas gali sukurti dar vieną užklausos įrašą.
- Užsakymams reikia `Stripe ID`; pakartotinis to paties mokėjimo pranešimas naujos eilutės nesukuria. Kontaktų integracijos tikrinimui tikro mokėjimo nereikia.
- „Užsakymai“ gauna stulpelį **Pristatymas**: Omniva paštomatas (pavadinimas, adresas, kodas), kurjerio adresas arba „Atvešime montavimo metu“. Kol atnaujintas skriptas neįdiegtas, pristatymas vis tiek matomas stulpelyje „Prekės ir paslaugos“ ir užsakymo laiške.
- „Užsakymai“ gauna papildomą stulpelį **Pranešimas išsiųstas**. `Taip` įrašoma po sėkmingo siuntimo. Jei laiškas nepavyksta, eilutė lieka, atsakymas yra klaida, o Stripe pakartotinis webhook bando siųsti dar kartą. Jau pažymėtam užsakymui įprasti pakartojimai laiško nebesiunčia. Retu atveju, kai siuntimas pavyksta, bet nutrūksta būsenos įrašymas, pakartojimas gali išsiųsti antrą laišką: el. pašto siuntimas ir lentelės atnaujinimas nėra viena transakcija.
- Google taiko dienos gavėjų kvotą. `setupInquiries` vykdymo žurnale pateikia likusį kiekį.
