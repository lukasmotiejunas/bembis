import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { emailHref, site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Slapukų informacija",
  description: "Kaip Kalėdų Dekoro svetainėje naudojami statistikos slapukai ir kaip pakeisti savo pasirinkimą.",
  path: "/slapukai",
});

export default function CookiesPage() {
  return (
    <section className="container-page max-w-3xl py-16 sm:py-24">
      <h1 className="font-display text-4xl font-semibold text-pine-900 sm:text-5xl">Slapukų informacija</h1>
      <div className="mt-8 space-y-6 leading-relaxed text-stone">
        <p>Svetainėje naudojame „Google Analytics“, kad suprastume lankomumą: kada ir kiek žmonių apsilanko, kuriuos puslapius peržiūri ir kiek laiko juose praleidžia.</p>
        <h2 className="text-2xl font-semibold text-pine-900">Statistika — tik su jūsų sutikimu</h2>
        <p>„Google Analytics“ įjungiamas tik pasirinkus „Leisti statistiką“. Pasirinkus „Tik būtini“, Analytics neįkeliamas. Svetainės naršymas, krepšelis ir užklausų forma veikia ir atsisakius statistikos.</p>
        <p>Analitikai perduodami aplankytų puslapių adresai be URL parametrų, jų pavadinimai ir techninė informacija apie naršyklę bei įrenginį. Formų laukai, vardas, el. paštas, telefonas ir mokėjimų identifikatoriai į Analytics nesiunčiami. Reklamos suasmeninimo funkcijos neįjungiamos.</p>
        <p>Statistikos slapukai <code>_ga</code> ir <code>_ga_…</code> padeda atskirti apsilankymus. Jų galiojimas nustatytas iki 180 dienų. Slapukų pasirinkimas jūsų naršyklės vietinėje saugykloje įsimenamas 180 dienų.</p>
        <p>Duomenis apdoroja „Google“. Plačiau apie tai — <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" className="font-semibold text-pine-900 underline underline-offset-4">kaip „Google“ naudoja partnerių svetainių duomenis</a>.</p>
        <h2 className="text-2xl font-semibold text-pine-900">Kaip pakeisti pasirinkimą?</h2>
        <p>Bet kurio puslapio apačioje spauskite „Slapukų nustatymai“. Atsisakius statistikos, tolesnis Analytics sekimas sustabdomas, o šios svetainės Analytics slapukai pašalinami.</p>
        <p>Su slapukais ar svetainės duomenimis susijusiais klausimais rašykite <a href={emailHref} className="font-semibold text-pine-900 underline underline-offset-4">{site.email}</a>.</p>
        <Link href="/" className="btn btn-outline">Grįžti į pradžią</Link>
      </div>
    </section>
  );
}
