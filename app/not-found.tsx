import Link from "next/link";
import { Bulb } from "@/components/Lights";

export default function NotFound() {
  return (
    <section className="container-page flex flex-col items-center py-28 text-center">
      <Bulb id="not-found-bulb" color="#59665f" className="h-24 w-16 opacity-60" />
      <h1 className="mt-6 text-4xl font-semibold text-pine-900 sm:text-5xl">Šis puslapis užgeso</h1>
      <p className="mt-4 max-w-md text-lg text-stone">Tokio puslapio neradome. Grįžkite į pradžią arba peržiūrėkite mūsų lemputes.</p>
      <div className="mt-8 flex gap-3">
        <Link href="/" className="btn btn-dark">
          Į pradžią
        </Link>
        <Link href="/kaledines-lemputes" className="btn btn-outline">
          Lemputės
        </Link>
      </div>
    </section>
  );
}
