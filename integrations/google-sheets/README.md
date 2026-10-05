# Užsakymai ir užklausos → Google Sheets ir el. paštas

Tas pats standalone Google Apps Script priima apmokėtus Stripe užsakymus į „Užsakymai“ ir kontaktų užklausas į „Užklausos“. Užklausos laiškas siunčiamas gavėjams iš `INQUIRY_EMAILS`; jei klientas nurodo el. paštą, jis nustatomas kaip `replyTo`.

## Esamo projekto atnaujinimas

1. Prieš keičiant skriptą išsaugokite esamo kodo kopiją. Išlaikykite `ORDERS_SHEET_ID`, projekto Script Property `ORDERS_WEBHOOK_SECRET` ir esamą Web app diegimą.
2. `Code.gs` yra sujungta šio projekto versija: ji naudoja `SpreadsheetApp.openById(ORDERS_SHEET_ID)`, išlaiko užsakymų formatavimą ir deduplikaciją pagal `Stripe ID`.
3. Įklijuokite kodą į esamą Apps Script projektą ir išsaugokite. Paslapties į kodą nekelkite.
4. Redaktoriuje paleiskite `setupInquiries`. Ji paruošia „Užklausos“ stulpelius ir paprašo `MailApp` leidimo siųsti laiškus. Esamų užsakymų nekeičia.
5. **Deploy → Manage deployments → Edit → Version: New version → Deploy.** Atnaujinus esamą diegimą, `/exec` adresas išlieka. Vykdymas: esamo projekto savininko vardu; prieiga: esama vieša Web app prieiga, užklausos tikrinamos pagal paslaptį.

Google siunčia iš tos paskyros, kuriai priklauso diegimas. `MailApp` leidžia siųsti laiškus, bet nesuteikia skriptui prieigos prie Gmail gautųjų.

## Naujas standalone projektas

Nurodykite savo lentelės ID konstantai `ORDERS_SHEET_ID`. Paleiskite `setupIntegration`, kad būtų paruošti užsakymų stulpeliai ir sukurta `ORDERS_WEBHOOK_SECRET` Script Property, tada `setupInquiries`. Sukurkite Web app diegimą, vykdomą savininko vardu ir pasiekiamą svetainei. Paslaptį iš projekto nustatymų saugiai nukopijuokite į aplikacijos aplinkos kintamąjį.

## Aplikacijos nustatymai

| Kintamasis | Reikšmė |
| --- | --- |
| `GOOGLE_SHEETS_WEBHOOK_URL` | Esamo Apps Script Web app adresas, baigiasi `/exec` |
| `GOOGLE_SHEETS_SECRET` | Ta pati reikšmė kaip Script Property `ORDERS_WEBHOOK_SECRET` |
| `INQUIRY_EMAILS` | Verslo ir asmeninio pašto adresai, atskirti kableliais |

Reikšmes laikykite `.env.local` ir Vercel projekto nustatymuose. Į Git jų nekelkite. Vercel produkcinis diegimas turi naudoti dabartinius kontaktų formos failus: senos Git versijos „Redeploy“ neįtraukia neįkomituotų pakeitimų. Juos galima įdiegti oficialiu Vercel CLI iš vietinio projekto arba paskelbti dabartinius failus per susietos GitHub saugyklos `main` šaką.

## Tikrinimas ir klaidos

- Bandomąją užklausą pateikite per veikiančios svetainės `/contact` formą ir patikrinkite įrašą „Užklausos“ bei laišką sutarto gavėjo pašto dėžutėje.
- Sėkmingas užklausos atsakymas yra `{ ok: true, recorded: true, emailed: true }` — `MailApp.sendEmail` baigė darbą. Tai savaime nepatvirtina laiško gavimo pašto dėžutėje.
- Jei laiško siuntimas nepavyksta, įrašas lieka lentelėje, o aplikacija gauna klaidą ir parodo atsarginį susisiekimo būdą. Pakartotinis formos pateikimas gali sukurti dar vieną užklausos įrašą.
- Užsakymams reikia `Stripe ID`; pakartotinis to paties mokėjimo pranešimas naujos eilutės nesukuria. Kontaktų integracijos tikrinimui tikro mokėjimo nereikia.
- Google taiko dienos gavėjų kvotą. `setupInquiries` vykdymo žurnale pateikia likusį kiekį.
