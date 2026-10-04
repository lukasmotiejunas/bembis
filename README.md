# Kalėdų Dekoras

Kalėdinių lempučių el. parduotuvė: pirkimas, nuoma sezonui, montavimas ir nuėmimas po švenčių.
Mokėjimai — Stripe, apmokėti užsakymai patenka į Google Sheets.

## Paleidimas

```bash
npm install
cp .env.example .env.local   # ir įrašykite raktus (žr. „Mokėjimai ir užsakymai“)
npm run dev
```

Atidarykite [http://localhost:3000](http://localhost:3000).

## Kur ką keisti

| Ką keisti                                                | Failas                       |
| -------------------------------------------------------- | ---------------------------- |
| Telefonas, el. paštas, darbo laikas, socialiniai tinklai | `lib/site.ts`                |
| Lemputės (viena pirkimui, viena nuomai), kainos, garantija | `lib/data/products.ts`       |
| Montavimo ir nuėmimo kaina (€/m), pristatymo kaina        | `lib/data/pricing.ts`        |
| Žingsniai, DUK, nuotraukų galerija                       | `lib/data/services.ts`       |
| Kainos pavyzdys Montavimo puslapyje                      | `lib/data/priceExample.ts`   |
| Spalvos ir šriftai                                       | `app/globals.css` (`@theme`) |

## Puslapiai

- `/` — pradžia
- `/installation` — montavimas ir nuėmimas
- `/shop` — dekoracijos: šiltos baltos lemputės pirkimui ir spalvotos — nuomai (`/rent` nukreipia čia)
- `/shop/[slug]` — lemputės puslapis
- `/checkout` — užsakymas: prekės, paslaugos (montavimas ir nuėmimas atskirai), kontaktai, apmokėjimas
- `/checkout/success` — užsakymas apmokėtas
- `/contact` — kontaktai ir užklausos forma (atidaro el. laišką)

## Mokėjimai ir užsakymai

```
Krepšelis → /checkout → Stripe apmokėjimo puslapis → /checkout/success
                                   │
                                   └─ apmokėta → Stripe webhook → /api/stripe/webhook → Google Sheets
```

Kainas visada perskaičiuoja serveris pagal `lib/data/*` — naršyklėje jų pakeisti negalima.
Į Google Sheets užsakymas patenka **tik** kai Stripe patvirtina apmokėjimą.

### 1. Stripe

1. Susikurkite paskyrą [stripe.com](https://stripe.com). Testiniam režimui įmonės duomenų nereikia.
2. **Developers → API keys** (įjungtas *Test mode*) → nukopijuokite **Secret key** (`sk_test_...`) → `STRIPE_SECRET_KEY`.
3. **Developers → Webhooks → Add endpoint** (naujoje sąsajoje *Event destinations → Add destination*):
   - URL: `https://kaledudekoras.lt/api/stripe/webhook`
   - Įvykiai: `checkout.session.completed` ir `checkout.session.async_payment_succeeded`
   - Nukopijuokite **Signing secret** (`whsec_...`) → `STRIPE_WEBHOOK_SECRET`.
4. Neprivaloma: **Settings → Branding** — įkelkite `brand/zenklas.png`, spalvos `#122a1f` ir `#f4b03e`.

Testiniame režime mokėkite kortele `4242 4242 4242 4242`, bet kokia būsima data ir bet kokiu CVC.

### 2. Google Sheets

Žr. [`integrations/google-sheets/README.md`](integrations/google-sheets/README.md) → `GOOGLE_SHEETS_WEBHOOK_URL` ir `GOOGLE_SHEETS_SECRET`.

### 3. Vercel

**Settings → Environment Variables** → įrašykite visus 4 kintamuosius iš `.env.example` → **Deployments → Redeploy**.

### Bandymas savo kompiuteryje

Stripe negali pasiekti `localhost`, todėl webhook'us persiųskite su [Stripe CLI](https://docs.stripe.com/stripe-cli):

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Komanda parodys `whsec_...` — įrašykite jį į `.env.local` kaip `STRIPE_WEBHOOK_SECRET`.

### Tikri mokėjimai

Stripe aktyvuokite paskyrą (įmonės ir banko duomenys), išjunkite *Test mode*, Vercel pakeiskite `STRIPE_SECRET_KEY`
į `sk_live_...` ir sukurkite tokį patį webhook'ą *live* režime (jo `whsec_...` bus kitas). Testinis pranešimas
apmokėjimo puslapyje dings automatiškai.
