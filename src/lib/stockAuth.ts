import { createHash, timingSafeEqual } from "crypto";

const COOKIE_NAME = "stock_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 jours

function expectedSessionValue(): string {
  const password = process.env.STOCK_PASSWORD;
  if (!password) {
    throw new Error("STOCK_PASSWORD manquant dans .env.local");
  }
  return createHash("sha256").update(`${password}:smoak-stock`).digest("hex");
}

export function checkStockPassword(candidate: string): boolean {
  return candidate === process.env.STOCK_PASSWORD;
}

export function stockSessionCookie() {
  return {
    name: COOKIE_NAME,
    value: expectedSessionValue(),
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  };
}

export function isValidStockSession(cookieValue: string | undefined): boolean {
  if (!cookieValue) return false;
  const expected = Buffer.from(expectedSessionValue());
  const actual = Buffer.from(cookieValue);
  if (expected.length !== actual.length) return false;
  return timingSafeEqual(expected, actual);
}

export { COOKIE_NAME as STOCK_COOKIE_NAME };
