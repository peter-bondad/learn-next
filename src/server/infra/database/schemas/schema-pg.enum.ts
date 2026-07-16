import { pgEnum } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["owner", "manager", "staff"]);

export const invitationStatusEnum = pgEnum("invitation_status", [
  "pending",
  "processing",
  "accepted",
  "revoked",
  "expired",
]);

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "paid",
  "preparing",
  "ready",
  "completed",
  "cancelled",
]);
