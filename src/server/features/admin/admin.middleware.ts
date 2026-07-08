import { auth } from "@/lib/auth";

export async function requireAdmin(c: any, next: any) {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    return c.json({ message: "You must be signed in." }, 401);
  }

  if (session.user?.role !== "admin") {
    return c.json(
      { message: "You are not allowed to access this resource." },
      403,
    );
  }

  return await next();
}

export async function requireAuth(c: any, next: any) {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    return c.json({ message: "You must be signed in." }, 401);
  }

  return await next();
}
