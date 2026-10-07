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
| Telefonas, el. paštas, aptarnaujama teritorija, socialiniai tinklai | `lib/site.ts`                |
| Lemputės (viena pirkimui, viena nuomai), kainos, garantija | `lib/data/products.ts`       |
| Montavimo ir nuėmimo kaina (€/m), pristatymo kaina        | `lib/data/pricing.ts`        |
| Žingsniai, DUK, nuotraukų galerija                       | `lib/data/services.ts`       |
| Kainos pavyzdys Montavimo puslapyje                      | `lib/data/priceExample.ts`   |
| Spalvos ir šriftai                                       | `app/globals.css` (`@theme`) |

## Puslapiai

- `/` — pradžia
- `/montavimas` — kalėdinių lempučių montavimas ir nuėmimas
- `/nuoma` — kalėdinių lempučių nuoma
- `/kaledines-lemputes` — dekoracijos: šiltos baltos lemputės pirkimui ir spalvotos — nuomai
- `/kaledines-lemputes/[slug]` — lemputės puslapis
- `/checkout` — užsakymas: prekės, paslaugos (montavimas ir nuėmimas atskirai), kontaktai, apmokėjimas
- `/checkout/success` — užsakymas apmokėtas
- `/kontaktai` — kontaktai ir užklausos forma (užklausa ateina el. paštu ir įrašoma į Google Sheets)

Seni adresai (`/installation`, `/shop`, `/rent`, `/contact`) nuolat nukreipiami į naujus.

## SEO

- Kiekvienas puslapis turi savo pavadinimą, aprašymą ir pagrindinį adresą (`pageMetadata` faile `lib/seo.ts`).
- Struktūrizuoti duomenys Google (`lib/seo.ts`): verslas (LocalBusiness), paslaugos, prekės su kainomis ir garantija,
  DUK, „duonos trupiniai“.
- `/sitemap.xml` ir `/robots.txt` generuojami automatiškai (`app/sitemap.ts`, `app/robots.ts`).
- Dalinimosi paveikslėlis — `app/opengraph-image.png`.
- Pagrindinis adresas — `site.url` faile `lib/site.ts` (`https://www.kaledudekoras.lt`). Miestai, kuriuose dirbate — `site.serviceTowns`.

## Google Analytics 4

`NEXT_PUBLIC_GA_MEASUREMENT_ID` nustatykite į šios svetainės Web duomenų srauto ID (`G-…`) savo `.env.local` ir Vercel **Production** aplinkoje. ID yra viešas, o Next.js jį įterpia surinkimo metu, todėl po pakeitimo reikalingas naujas diegimas. Vietinio serverio ir Vercel peržiūros adresų apsilankymai nesiunčiami — matuojamas tik `site.url` domenas.

- Analytics įkeliamas tik lankytojui paspaudus **Leisti statistiką**. **Tik būtini** neįkelia Google žymos.
- Puslapio apačioje yra **Slapukų nustatymai**, o `/slapukai` paaiškina šį pasirinkimą. Atsisakius jau įjungtos statistikos, žyma išjungiama, Analytics slapukai pašalinami ir puslapis perkraunamas.
- Pasirinkimas bei statistikos slapukai galioja iki 180 dienų. Reklamos sutikimai visada išjungti.
- `page_view` siunčiamas vieną kartą atidarius puslapį ir pereinant į kitą puslapį per Next.js navigaciją. URL parametrai ir fragmentai pašalinami, kad nepatektų mokėjimų ID ar kontaktiniai duomenys. Formų turinys nesiunčiamas.
- GA4 Web duomenų srauto **Enhanced measurement** išjunkite: aplikacija pati siunčia puslapių peržiūras. Tai apsaugo nuo dvigubo SPA puslapių skaičiavimo ir automatinio formų bei kitų nepageidaujamų įvykių rinkimo.
- Google Analytics **Realtime** rodo naujus apsilankymus; **Reports → Engagement → Pages and screens** — aplankytus puslapius. Istorinių ataskaitų duomenys gali pasirodyti vėliau. Lankytojų skaičiavimas apima sutikusius lankytojus ir gali būti ribojamas naršyklių blokavimo priemonių.

Patikra: `npm run test:analytics`, `npm run lint`, `npm run build`. Naršyklėje patikrinkite pasirinkimo įsiminimą, atsisakymą, sutikimo atšaukimą ir perėjimus tarp puslapių; GA4 realiuoju laiku patikrinkite, kad įvykiai patenka į tinkamą nuosavybę.

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

### 2. Google Sheets ir užklausų laiškai

Žr. [`integrations/google-sheets/README.md`](integrations/google-sheets/README.md) → `GOOGLE_SHEETS_WEBHOOK_URL`,
`GOOGLE_SHEETS_SECRET` ir `INQUIRY_EMAILS` (kam siųsti užklausas iš kontaktų formos).

### 3. Vercel

**Settings → Environment Variables** → įrašykite visus kintamuosius iš `.env.example` → **Deployments → Redeploy**.

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
