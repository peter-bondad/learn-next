import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coffee House",
  description: "Modern coffee-themed authentication experience",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
