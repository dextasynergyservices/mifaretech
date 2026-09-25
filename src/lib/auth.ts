import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin, twoFactor } from "better-auth/plugins";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { env } from "@/env";
// import { sendPasswordResetEmail } from "@/lib/email/send";

export const auth = betterAuth({
  appName: "Mifaretech Admin",
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  trustedOrigins: [env.NEXT_PUBLIC_SITE_URL],
  database: drizzleAdapter(db, { provider: "pg", schema }),

  emailAndPassword: {
    enabled: true,
    disableSignUp: true, // staff are created by an admin, never self-registered
    minPasswordLength: 12,
    maxPasswordLength: 128,
    // sendResetPassword: async ({ user, url }) => {
    //   await sendPasswordResetEmail(user.email, url);
    // },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // refresh daily
    cookieCache: { enabled: true, maxAge: 5 * 60 }, // fewer DB hits
  },

  rateLimit: {
    enabled: true,
    window: 60,
    max: 60,
    storage: "database", // uses the rate_limit table, no Redis needed
    customRules: { "/sign-in/email": { window: 60, max: 5 } },
  },

  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
    defaultCookieAttributes: { httpOnly: true, sameSite: "lax" },
  },

  plugins: [
    admin({ defaultRole: "editor", adminRoles: ["admin"] }),
    twoFactor({ issuer: "Mifaretech" }),
    nextCookies(), // must be last
  ],
});
