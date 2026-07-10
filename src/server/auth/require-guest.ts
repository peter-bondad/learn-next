import { redirect } from "next/navigation";
import { getSession } from "./get-session";

export async function requireGuest() {
  const session = await getSession();

  if (session) {
    redirect("/admin/dashboard");
  }
}
