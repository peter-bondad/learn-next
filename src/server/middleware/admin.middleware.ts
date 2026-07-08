import type { Context, Next } from "hono";
import type { Env } from "@/server/types/hono-types";
import { auth } from "@/lib/auth";

export async function requireAdmin(c: Context<Env>, next: Next) {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) {
    c.set("user", null);
    c.set("session", null);

    return c.json({ message: "Unauthorized" }, 401);
  }

  if (session.user.role !== "admin") {
    return c.json({ message: "Forbidden" }, 403);
  }

  c.set("user", session.user);
  c.set("session", session.session);

  await next();
}
