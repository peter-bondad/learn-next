import { requireGuest } from "@/server/auth/require-guest";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BrewFlow",
  description: "Coffee shop management platform",
};

export default async function GuestLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireGuest();
  return <>{children}</>;
}
