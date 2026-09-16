import { createHmac, timingSafeEqual } from "crypto";

/**
 * Auth for the private dashboard: a single shared ID + password pair
 * (DASHBOARD_ID / DASHBOARD_PASSWORD) gates a signed, httpOnly session
 * cookie. No user table, no third-party auth provider. The credentials
 * and signing secret only ever live server-side.
 */

export const DASHBOARD_COOKIE_NAME = "birthday_dashboard_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

function getSecret(): string {
  const secret = process.env.DASHBOARD_SESSION_SECRET;
  if (!secret) {
    throw new Error("DASHBOARD_SESSION_SECRET is not set. Add it to your .env file.");
  }
  return secret;
}

function sign(value: string): string {
  return createHmac("sha256", getSecret()).update(value).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function checkDashboardCredentials(id: string, password: string): boolean {
  const expectedId = process.env.DASHBOARD_ID;
  const expectedPassword = process.env.DASHBOARD_PASSWORD;
  if (!expectedId || !expectedPassword) {
    throw new Error("DASHBOARD_ID / DASHBOARD_PASSWORD are not set. Add them to your .env file.");
  }
  return safeEqual(id, expectedId) && safeEqual(password, expectedPassword);
}

export function createSessionToken(): string {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const payload = `${expiresAt}`;
  const signature = sign(payload);
  return `${payload}.${signature}`;
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const expectedSignature = sign(payload);
  if (!safeEqual(signature, expectedSignature)) return false;

  const expiresAt = Number(payload);
  if (Number.isNaN(expiresAt)) return false;
  return Date.now() < expiresAt;
}

/** Reads and verifies the dashboard session cookie from a Next.js request. */
export function isDashboardRequest(req: {
  cookies: { get(name: string): { value: string } | undefined };
}): boolean {
  const token = req.cookies.get(DASHBOARD_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}
