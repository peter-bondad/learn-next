import { pgEnum } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["admin", "user"]);

export const invitationStatusEnum = pgEnum("invitation_status", [
  "pending",

  "accepted",

  "revoked",

  "expired",
]);
