import { relations } from "drizzle-orm/_relations";
import { boolean, index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./auth-schema";

export const invitations = pgTable(
  "invitations",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull(),
    name: text("name"),
    role: text("role").default("user").notNull(),
    tokenHash: text("token_hash").notNull().unique(),
    expiresAt: timestamp("expires_at").notNull(),
    acceptedAt: timestamp("accepted_at"),
    createdBy: text("created_by")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    revoked: boolean("revoked").default(false).notNull(),
  },
  (table) => [
    index("invitations_email_idx").on(table.email),
    index("invitations_createdBy_idx").on(table.createdBy),
    index("invitations_tokenHash_idx").on(table.tokenHash),
  ],
);

export const invitationsRelations = relations(invitations, ({ one }) => ({
  creator: one(users, {
    fields: [invitations.createdBy],
    references: [users.id],
  }),
}));
