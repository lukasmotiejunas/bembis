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
| Helovyno dizaino spalvos ir piešiniai                    | `app/halloween.css`, `components/halloween/` |

## Puslapiai

- `/` — pradžia
- `/montavimas` — kalėdinių lempučių montavimas ir nuėmimas
- `/nuoma` — kalėdinių lempučių nuoma
- `/kaledines-lemputes` — bendras katalogas: 8 lauko LED girliandų prekės ir 60 Helovyno dekoracijų viename sąraše
- `/kaledines-lemputes/[slug]` — lemputės puslapis
- `/helovyno-dekoracijos` — nukreipia į bendrą parduotuvės katalogą
- `/helovyno-dekoracijos/[slug]` — dekoracijos nuotraukos, kaina ir pristatymas per 4 dienas visoje Lietuvoje
- `/checkout` — užsakymas: prekės, paslaugos (montavimas ir nuėmimas atskirai), kontaktai, apmokėjimas
- `/checkout/success` — užsakymas apmokėtas
- `/kontaktai` — kontaktai ir užklausos forma (užklausa ateina el. paštu ir įrašoma į Google Sheets)
- `/admin` — administravimas: svetainės dizainas (Kalėdinis arba Helovynas). Paieškos sistemoms nerodomas.

Seni adresai (`/installation`, `/shop`, `/rent`, `/contact`) nuolat nukreipiami į naujus.

## Helovyno prekių importas

Katalogas laikomas `lib/data/halloweenProducts.ts`, originalios tiekėjų nuotraukos — `public/products/halloween/`.
Pardavimo kainos paimtos iš lentelės „pirmi 60“ paskutinio stulpelio „mūsų kaina“; tiekėjo savikainos kataloge neviešinamos.
Importuotos visos 60 prekių su originaliomis tiekėjų nuotraukomis ir lietuviškais aprašymais.
Jos pateikiamos po 8 lauko LED girliandų prekėmis tame pačiame `/kaledines-lemputes` kataloge.
Bendro katalogo paieška, kategorijos ir kainų rūšiavimas — `components/shop/ProductCatalog.tsx`;
pradiniame vaizde rodomos visos 68 prekės.
Tiekėjo nurodomų matmenų neatitikimų atvejais dydis prekės pavadinime praleistas.

Privatus vietinis `.data/halloween-import/fulfilment-map.json` susieja svetainės prekių kodus su tiekėjo nuorodomis
ir lentelės eilutėmis. Stripe mokėjimo metaduomenyse išsaugomi prekių kodai ir kiekiai; naujoms prekėms naudojamas
tas pats serverio perskaičiuojamų kainų apmokėjimas. Papildomų Stripe produktų kurti nereikia.

Pakartotiniam importui `scripts/import-halloween-products.py` priima patikrintų prekių JSON su vietiniais
originalių nuotraukų failais. Jam reikalingas Python su Pillow. Prieš skelbiant būtina palyginti kainas su pradiniu
lapu, patikrinti produktų nuotraukas ir paleisti prekybos testus, lint bei gamybinį build.

## Administravimas: Kalėdinis arba Helovyno dizainas

`/admin` puslapyje pasirenkamas vienas iš dviejų dizainų. Išsaugojus jį iškart mato visi lankytojai — visi puslapiai
sugeneruojami iš naujo, o krepšelis, kainos ir užsakymai nesikeičia.

- **Kalėdinis** — numatytasis, toks kaip buvo: tie patys tekstai ir spalvos.
- **Helovynas** — naktinės spalvos, moliūgų ir vaiduoklių girliandos, šikšnosparniai, mėnulis, voratinkliai, kapinių
  siluetas apačioje ir Helovyno tekstai. Nuotraukos nudažomos nakties spalvomis. Kainos, garantija, pristatymas ir prekių
  aprašymai lieka tie patys. Tekstai yra šalia kalėdinių (`copy` objektai komponentuose, `halloween*` sąrašai
  `lib/data/services.ts`).

Įjungimas:

1. `ADMIN_PASSWORD` (bent 8 simboliai) — `.env.local` ir Vercel → Settings → Environment Variables. Pakeitus slaptažodį,
   visi prisijungę atjungiami.
2. Vercel'yje pasirinkimui išsaugoti reikia duomenų bazės: **Vercel → Storage → Upstash for Redis → Connect Project**
   (užtenka nemokamo plano). Kintamieji `KV_REST_API_URL` ir `KV_REST_API_TOKEN` įrašomi automatiškai — perkurkite diegimą.
   Kompiuteryje Redis nereikia: pasirinkimas įrašomas į `.data/site-theme.json`.
3. Atidarykite `/admin`, prisijunkite, pasirinkite dizainą ir spauskite **Išsaugoti dizainą**.

Jei pasirinkimo nepavyksta perskaityti, svetainė rodoma kalėdiniu dizainu.

## Laimės ratas

Pirmą kartą per dieną atėjus į svetainę, po sekundės parodomas laimės ratas (išskyrus apmokėjimo ir
administravimo puslapius). Kad jau sukta ar atsisakyta šiandien, įsimenama naršyklės `localStorage`
(`laimes-ratas`), todėl kitą dieną ratas rodomas vėl.

- **Visi prizai tikri.** Prizai ir tikimybės — `lib/data/wheel.ts`: −3 % (45 %), −5 % (30 %), −7 % (17 %),
  −10 % (8 %). Kiekvieno prizo plotas rate lygus jo tikimybei, o kur ratas sustos, parenka serveris
  (`spinWheel` faile `app/checkout/actions.ts`). Keičiant prizus, keiskite tik šį failą.
- **Kodas.** Laimėjus išduodamas kodas, pvz. `RATAS5-2NAGGM-BF6K6F`. Jis iškart pritaikomas krepšeliui, o
  apmokėjimo puslapyje jį galima įvesti ir ranka. Kodą pasirašo serveris (`lib/discount.ts`), todėl jo
  neįmanoma atspėti ar pakeisti procento. Galioja 7 dienas.
- **Nuolaida** skaičiuojama nuo dabartinių kainų ir tik prekėms (ne pristatymui). Serveris kodą patikrina dar
  kartą apmokant. Stripe nuolaida įskaičiuojama į prekių kainas, o kodas įrašomas į užsakymą, Google Sheets
  stulpelį „Nuolaida“ ir pranešimo laišką.
- Kodai veikia, kai nustatytas `STRIPE_SECRET_KEY` arba `DISCOUNT_CODE_SECRET`; be jų ratas nerodomas.
- Vienas sukimas per dieną ribojamas naršyklėje, todėl išvalius naršyklės duomenis galima sukti dar kartą.
  Prizai nedideli, todėl tai priimtina.

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

Vercel **Production** aplinkoje nustatykite `STRIPE_PAYMENT_MODE=live`. Production diegimas atmeta testinius
raktus, o live režimas reikalauja webhook parašo rakto. Abu raktai turi priklausyti **Bembis** live paskyrai;
Lumo paskyros ir kaledudekoras sandbox raktai tam netinka. Preview ir vietiniams bandymams naudokite
`STRIPE_PAYMENT_MODE=test` su sandbox raktais. Šie kintamieji yra serverio paslaptys, be `NEXT_PUBLIC_`.
Po pakeitimo perkurkite Production diegimą. Payout bankas konfigūruojamas tik Stripe, jo IBAN kode nelaikomas.

Laikinas 1 € patikros produktas pašalintas po sėkmingo realaus mokėjimo. Ankstesnių patikros
apmokėjimų atpažinimas paliktas, kad jų patvirtinimo puslapiai ir pakartotiniai webhook pranešimai
nesukurtų prekių pristatymo pažadų. Vercel likęs `PAYMENT_TEST_ENABLED` kintamasis nebenaudojamas.
