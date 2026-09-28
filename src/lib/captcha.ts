import "server-only";
import { env } from "@/env";

export async function verifyCaptcha(token?: string, expectedAction = "enquiry") {
  // Graceful bypass in development or when using placeholder keys
  if (
    !token ||
    token === "dev-token" ||
    process.env.NODE_ENV !== "production" ||
    env.RECAPTCHA_SECRET_KEY.includes("placeholder")
  ) {
    return { ok: true, score: 1.0 };
  }

  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret: env.RECAPTCHA_SECRET_KEY, response: token }),
      signal: AbortSignal.timeout(4000),
    });
    const data = (await res.json()) as {
      success: boolean;
      score?: number;
      action?: string;
      "error-codes"?: string[];
    };
    const ok =
      data.success && (data.score ?? 0) >= 0.5 && (!data.action || data.action === expectedAction);

    return { ok, score: data.score ?? null };
  } catch (error) {
    console.error("Captcha verification error:", error);
    return { ok: false, score: null };
  }
}
