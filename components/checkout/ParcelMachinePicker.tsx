"use client";
import { useEffect, useState } from "react";
import { Check, Loader2, MapPin, Search } from "lucide-react";
import { ParcelMachine, searchParcelMachines } from "@/lib/data/delivery";

const SHOWN = 100;

// One request per visit; reopening the picker reuses the list.
let request: Promise<ParcelMachine[]> | null = null;
function loadParcelMachines() {
  request ??= fetch("/api/pastomatai")
    .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
    .catch((err) => {
      request = null;
      throw err;
    });
  return request;
}

export default function ParcelMachinePicker({
  value,
  onChange,
}: {
  value: ParcelMachine | null;
  onChange: (machine: ParcelMachine) => void;
}) {
  const [machines, setMachines] = useState<ParcelMachine[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [editing, setEditing] = useState(!value);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let active = true;
    loadParcelMachines().then(
      (list) => active && setMachines(list),
      () => active && setFailed(true),
    );
    return () => {
      active = false;
    };
  }, [attempt]);

  if (value && !editing)
    return (
      <div className="flex items-start gap-3 rounded-2xl border-[1.5px] border-pine-900 bg-white p-4 sm:gap-4">
        <span className="hidden size-10 shrink-0 items-center justify-center rounded-xl bg-glow-soft sm:flex">
          <MapPin className="size-5 text-glow-deep" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold tracking-wide text-stone uppercase">
            Pasirinktas paštomatas
          </p>
          <p className="mt-0.5 font-bold text-pine-900">{value.name}</p>
          <p className="text-sm text-stone">{value.address}</p>
          {value.note && (
            <p className="mt-1.5 text-xs leading-relaxed text-stone">
              {value.note}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="-mt-1 -mr-1 shrink-0 rounded-full px-2 py-1.5 text-sm font-bold text-pine-900 underline-offset-4 hover:underline"
        >
          Keisti
        </button>
      </div>
    );

  const results = machines ? searchParcelMachines(machines, query) : [];
  return (
    <div>
      <label
        htmlFor="parcel-search"
        className="mb-1.5 block text-sm font-bold text-pine-900"
      >
        Pasirinkite paštomatą<span className="text-glow-deep"> *</span>
      </label>
      <div className="relative">
        <Search
          className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-stone"
          aria-hidden="true"
        />
        <input
          id="parcel-search"
          type="search"
          autoComplete="off"
          placeholder="Miestas, gatvė ar prekybos centras"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="field pl-11"
        />
      </div>
      <div className="mt-2 max-h-80 overflow-y-auto rounded-2xl border border-sand bg-white">
        {failed ? (
          <div role="alert" className="p-5 text-sm text-pine-900">
            Nepavyko įkelti Omniva paštomatų sąrašo.{" "}
            <button
              type="button"
              onClick={() => {
                setFailed(false);
                setAttempt((n) => n + 1);
              }}
              className="font-bold underline underline-offset-4"
            >
              Bandyti dar kartą
            </button>{" "}
            arba rinkitės kurjerį.
          </div>
        ) : !machines ? (
          <p className="flex items-center gap-2 p-5 text-sm text-stone">
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Įkeliami Omniva paštomatai…
          </p>
        ) : results.length === 0 ? (
          <p className="p-5 text-sm text-stone">
            Paštomato nerado. Pabandykite įvesti miestą ar gatvę.
          </p>
        ) : (
          <ul className="divide-y divide-sand/70">
            {results.slice(0, SHOWN).map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(m);
                    setEditing(false);
                    setQuery("");
                  }}
                  className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-cream focus-visible:bg-cream"
                >
                  <MapPin
                    className="mt-0.5 size-4 shrink-0 text-glow-deep"
                    aria-hidden="true"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-pine-900">
                      {m.name}
                    </span>
                    <span className="block text-sm text-stone">{m.address}</span>
                  </span>
                  {value?.id === m.id && (
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-pine-900"
                      aria-label="Pasirinktas"
                    />
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {machines && (
        <p className="mt-2 text-xs text-stone" aria-live="polite">
          {results.length > SHOWN
            ? `Rodoma ${SHOWN} iš ${results.length}. Įveskite miestą ar gatvę, kad rastumėte greičiau.`
            : `Rasta paštomatų: ${results.length}.`}
        </p>
      )}
      {value && (
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="mt-2 text-sm font-bold text-pine-900 underline-offset-4 hover:underline"
        >
          Palikti {value.name}
        </button>
      )}
    </div>
  );
}
