// Server only: Omniva's public list of parcel machines, cached for a day.
import { parseParcelMachines } from "./data/delivery";

const LOCATIONS_URL = "https://www.omniva.ee/locations.json";

export async function getParcelMachines() {
  const res = await fetch(LOCATIONS_URL, { next: { revalidate: 86400 } });
  if (!res.ok) throw new Error(`Omniva responded ${res.status}`);
  const machines = parseParcelMachines(await res.json());
  if (!machines.length) throw new Error("Omniva returned no Lithuanian parcel machines");
  return machines;
}

export async function findParcelMachine(id: string) {
  return (await getParcelMachines()).find((m) => m.id === id) ?? null;
}
