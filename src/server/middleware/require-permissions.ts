import { auth } from "@/lib/auth";
import { factory } from "../hono/hono-factory";
import { Permission } from "@/lib/permissions";

export function requirePermissionMiddleware(permissions: Permission) {
  return factory.createMiddleware(async (c, next) => {
    const user = c.get("user");

    if (!user) {
      return c.json({ message: "Unauthorized" }, 401);
    }

    const result = await auth.api.userHasPermission({
      body: {
        userId: user.id,
        permissions,
      },
    });

    if (!result.success) {
      return c.json({ message: "Forbidden" }, 403);
    }

    await next();
  });
}
