import { INSTALLATION_SERVICE } from "../inquiry";
import { validateCheckout } from "./checkout";
import { buildOrder, describeOrderInquiry } from "./order";

/** Kainos ir prekės gaunamos iš serverio katalogo; naršyklės įvertis nesiunčiamas kaip pasiūlymas. */
export function prepareOrderInquiry(raw: unknown) {
  const parsed = validateCheckout(raw);
  if (parsed.ok === false) return { ok: false as const, error: parsed.error };
  const order = buildOrder(parsed.value.items, parsed.value.services);
  if (!order.products.length)
    return { ok: false as const, error: "Krepšelis tuščias." };
  const customer = parsed.value.customer;
  const formData = new FormData();
  formData.set("name", customer.name);
  formData.set("phone", customer.phone);
  formData.set("email", customer.email);
  formData.set("address", `${customer.address}, ${customer.city}`);
  formData.append("services", "Lempučių pirkimas");
  if (order.serviceRequested) formData.append("services", INSTALLATION_SERVICE);
  formData.set(
    "message",
    [
      describeOrderInquiry(order),
      customer.installDate &&
        `Pageidaujama montavimo data: ${customer.installDate}.`,
      customer.notes && `Kliento pastabos: ${customer.notes}`,
    ]
      .filter(Boolean)
      .join("\n")
      .slice(0, 2000),
  );
  return { ok: true as const, formData };
}
