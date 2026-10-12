import { cookies } from "next/headers";
import { ADMIN_COOKIE, adminPassword, verifySessionToken } from "@/lib/admin";

/** Every admin page and action checks this — the actions are public endpoints like any form. */
export async function hasAdminSession() {
  const password = adminPassword();
  if (!password) return false;
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  return verifySessionToken(token, password);
}
