import { factory } from "@/server/hono/hono-factory";
import { container } from "@/server/container";
import { env } from "@/lib/env";

export const expireInvitationsController = factory.createHandlers(async (c) => {
  const authorization = c.req.header("authorization");

  if (authorization !== `Bearer ${env.CRON_SECRET}`) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  const expiredCount = await container.invitationService.expireInvitations();

  if (env.NODE_ENV === "development")
    console.log("Expired invitations : ", expiredCount);

  return c.json({
    message: "Expired invitations processed successfully.",
    expiredCount,
  });
});
