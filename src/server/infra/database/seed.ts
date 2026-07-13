import { eq } from "drizzle-orm";
import db from "./client";
import { auth } from "@/lib/auth";
import { users } from "./schemas";
import { env } from "@/lib/env";

async function seedAdmin() {
  const email = env.ADMIN_EMAIL;
  const password = env.ADMIN_PASSWORD;

  const existingAdmin = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (existingAdmin) {
    if (existingAdmin.role !== "admin") {
      await db
        .update(users)
        .set({ role: "admin" })
        .where(eq(users.id, existingAdmin.id));

      console.log("Existing user promoted to admin");
    } else {
      console.log("Admin already exists");
    }

    return;
  }

  const result = await auth.api.signUpEmail({
    body: {
      name: "System Admin",
      email,
      password,
    },
  });

  const userId = result.user.id;

  await db
    .update(users)
    .set({
      role: "admin",
    })
    .where(eq(users.id, userId));

  console.log(`Admin ready: ${email}`);
}

seedAdmin()
  .then(() => {
    console.log("Seed completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
