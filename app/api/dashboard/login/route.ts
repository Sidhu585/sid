import { NextRequest, NextResponse } from "next/server";
import { DASHBOARD_COOKIE_NAME, checkDashboardCredentials, createSessionToken } from "@/lib/dashboard-auth";

// Basic in-memory rate limiting to slow down naive credential guessing.
// Resets on server restart — acceptable for this MVP's threat model.
const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 5 * 60_000;
const MAX_ATTEMPTS = 10;

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || now > entry.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "local";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { id, password } = (body ?? {}) as { id?: unknown; password?: unknown };
  if (typeof id !== "string" || id.length === 0 || typeof password !== "string" || password.length === 0) {
    return NextResponse.json({ error: "ID and password are required." }, { status: 400 });
  }

  let isValid = false;
  try {
    isValid = checkDashboardCredentials(id, password);
  } catch {
    return NextResponse.json(
      { error: "Dashboard credentials are not configured on the server yet." },
      { status: 500 }
    );
  }

  if (!isValid) {
    return NextResponse.json({ error: "Incorrect ID or password." }, { status: 401 });
  }

  const token = createSessionToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(DASHBOARD_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return res;
}
