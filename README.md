# Kalėdų Dekoras

Kalėdinių lempučių parduotuvė: pardavimas, nuoma sezonui ir montavimas su nuėmimu po švenčių.

## Paleidimas

```bash
npm install
npm run dev
```

Atidarykite [http://localhost:3000](http://localhost:3000).

## Kur ką keisti

| Ką keisti                                        | Failas                    |
| ------------------------------------------------ | ------------------------- |
| Telefonas, el. paštas, darbo laikas, socialiniai tinklai | `lib/site.ts`             |
| Lemputės, pirkimo ir nuomos kainos               | `lib/data/products.ts`    |
| Žingsniai, DUK, nuotraukų galerija               | `lib/data/services.ts`    |
| Kainos pavyzdys Montavimo puslapyje (metrai, €/m) | `lib/data/priceExample.ts` |
| Spalvos ir šriftai                               | `app/globals.css` (`@theme`) |

## Puslapiai

- `/` — pradžia
- `/installation` — montavimas ir nuėmimas
- `/shop` — lempučių pirkimas
- `/rent` — lempučių nuoma sezonui
- `/shop/[slug]` — lemputės puslapis (`?mode=rent` atidaro su pažymėta nuoma)
- `/contact` — kontaktai ir užklausos forma

## Užklausos forma ir krepšelis

Užklausos forma ir krepšelio „Pateikti užsakymą“ neturi serverio dalies: paspaudus „Siųsti užklausą“, lankytojo el. pašto programoje atsidaro paruoštas laiškas į `lib/site.ts` nurodytą adresą (su krepšelio turiniu). Jei norite, kad užklausos būtų siunčiamos automatiškai, prijunkite el. pašto paslaugą (pvz., Resend) per Server Action.
