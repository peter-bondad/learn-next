"use client";

import { createContext, useContext } from "react";

import type { Session } from "@/lib/auth";

interface SessionProviderProps {
  session: Session;
  children: React.ReactNode;
}

const SessionContext = createContext<Session | null>(null);

export function SessionProvider({ session, children }: SessionProviderProps) {
  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const session = useContext(SessionContext);

  if (!session) {
    throw new Error("useSession must be used inside SessionProvider");
  }

  return session;
}
