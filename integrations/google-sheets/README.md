# Užsakymai į Google Sheets

Kai Stripe patvirtina apmokėjimą, svetainė nusiunčia užsakymą į šią lentelę — viena eilutė vienam užsakymui.
Neapmokėti ar atšaukti užsakymai į lentelę nepatenka.

## Diegimas (~5 min., vieną kartą)

1. Sukurkite naują Google Sheets lentelę, pvz. „Kalėdų Dekoras — užsakymai“.
2. Lentelėje atidarykite **Plėtiniai → Apps Script** (*Extensions → Apps Script*).
3. Ištrinkite ten esantį kodą ir įklijuokite viską iš failo [`Code.gs`](./Code.gs).
4. Eilutėje `const SECRET = '...'` įrašykite ilgą atsitiktinį slaptažodį (bent 30 simbolių) ir išsaugokite (⌘S / Ctrl+S).
5. Spauskite **Deploy → New deployment**, pasirinkite tipą **Web app** ir nustatykite:
   - **Execute as:** Me
   - **Who has access:** Anyone
6. Spauskite **Deploy** ir suteikite leidimus (*Authorize access* → jūsų paskyra → *Advanced* → *Go to … (unsafe)* → *Allow*).
   „Unsafe“ reiškia tik tai, kad scenarijaus nepatikrino Google — jį parašėte jūs patys.
7. Nukopijuokite **Web app URL** (baigiasi `/exec`).

Tada įrašykite dvi reikšmes į Vercel (**Settings → Environment Variables**) ir į `.env.local`:

| Kintamasis | Reikšmė |
| --- | --- |
| `GOOGLE_SHEETS_WEBHOOK_URL` | Web app URL iš 7 žingsnio |
| `GOOGLE_SHEETS_SECRET` | tas pats slaptažodis kaip `Code.gs` faile |

## Lentelė

Stulpeliai susikuria patys su pirmu užsakymu: *Gauta, Užsakymo nr., Būsena, Vardas, Telefonas, El. paštas,
Adresas, Miestas, Prekės ir paslaugos, Montavimas, Pageidaujama montavimo data, Nuėmimas po švenčių,
Pastabos, Suma €, Stripe ID*.

Stulpelyje **Būsena** naujas užsakymas pažymimas „Naujas“ — keiskite jį patys (pvz. „Išsiųsta“, „Sumontuota“).
Galite pridėti savo stulpelių ar keisti jų tvarką — scenarijus stulpelius randa pagal pavadinimą.

## Jei keičiate `Code.gs`

**Deploy → Manage deployments → ✏️ → Version: New version → Deploy.** Adresas nepasikeičia.
