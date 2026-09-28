import { neon } from "@neondatabase/serverless";
import { hashPassword } from "better-auth/crypto";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL must be defined to seed the admin user.");
}

const db = drizzle({ client: neon(databaseUrl), schema });

async function seedAdmin() {
  const email = (process.env.SEED_ADMIN_EMAIL || "admin@mifaretech.co.uk").trim().toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD || "Mifaretech2026!Admin";
  const name = process.env.SEED_ADMIN_NAME || "System Administrator";

  console.log(`[Seed Admin] Checking existing user for: ${email}`);

  const existingUser = await db.query.user.findFirst({
    where: eq(schema.user.email, email),
  });

  const hashedPassword = await hashPassword(password);

  if (existingUser) {
    console.log(
      `[Seed Admin] User ${email} exists (ID: ${existingUser.id}). Updating role to admin & resetting password...`,
    );

    await db
      .update(schema.user)
      .set({
        role: "admin",
        banned: false,
        name,
        emailVerified: true,
      })
      .where(eq(schema.user.id, existingUser.id));

    const existingAccount = await db.query.account.findFirst({
      where: eq(schema.account.userId, existingUser.id),
    });

    if (existingAccount) {
      await db
        .update(schema.account)
        .set({
          password: hashedPassword,
          updatedAt: new Date(),
        })
        .where(eq(schema.account.id, existingAccount.id));
    } else {
      await db.insert(schema.account).values({
        id: crypto.randomUUID(),
        accountId: existingUser.id,
        providerId: "credential",
        userId: existingUser.id,
        password: hashedPassword,
      });
    }

    console.log(`[Seed Admin] Successfully updated admin account for ${email}!`);
  } else {
    console.log(`[Seed Admin] Creating new admin user ${email}...`);
    const newUserId = crypto.randomUUID();

    await db.insert(schema.user).values({
      id: newUserId,
      email,
      name,
      role: "admin",
      emailVerified: true,
      banned: false,
      twoFactorEnabled: false,
    });

    await db.insert(schema.account).values({
      id: crypto.randomUUID(),
      accountId: newUserId,
      providerId: "credential",
      userId: newUserId,
      password: hashedPassword,
    });

    console.log(`[Seed Admin] Created initial admin user ${email} (ID: ${newUserId})!`);
  }

  console.log("\n=======================================================");
  console.log("   ADMIN USER SEEDED SUCCESSFULLY (DATABASE-BACKED)");
  console.log("=======================================================");
  console.log(`   Email:    ${email}`);
  console.log(`   Password: ${password}`);
  console.log(`   Role:     admin`);
  console.log("=======================================================\n");
}

seedAdmin()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("[Seed Admin] Failed to seed admin user:", err);
    process.exit(1);
  });
