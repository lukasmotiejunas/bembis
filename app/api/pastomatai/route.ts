import { getParcelMachines } from "@/lib/omniva";

/** Lithuanian Omniva parcel machines for the checkout picker. */
export async function GET() {
  try {
    return Response.json(await getParcelMachines(), {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=86400",
      },
    });
  } catch (err) {
    console.error("[pastomatai] Could not load Omniva parcel machines:", err);
    return Response.json(
      { error: "Nepavyko įkelti paštomatų sąrašo." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
