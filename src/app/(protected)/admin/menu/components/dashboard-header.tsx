import { UserNav } from "./user-nav";
import { getSession } from "@/server/auth/get-session";

export async function DashboardHeader() {
  const session = await getSession();

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-end bg-[#fffaf5]/90 px-8 backdrop-blur">
      <UserNav user={session?.user ?? null} />
    </header>
  );
}
