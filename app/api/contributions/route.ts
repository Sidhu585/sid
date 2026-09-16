import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getActiveBirthday, getPublicStats } from "@/lib/birthday-data";
import { sanitizeText, validateContribution } from "@/lib/validation";

/**
 * Records a contribution the visitor claims to have made via UPI. This is
 * NEVER treated as a verified payment — there is no bank/UPI integration
 * here, intentionally. Every row is created with status "pending" and only
 * the organizer, from the private dashboard, can mark it verified
 * or remove it if it looks fake.
 */
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, amount, message } = (body ?? {}) as {
    name?: unknown;
    amount?: unknown;
    message?: unknown;
  };

  const { valid, errors } = validateContribution({ name, amount, message });
  if (!valid) {
    return NextResponse.json({ error: "Please check the form.", fieldErrors: errors }, { status: 422 });
  }

  const birthday = await getActiveBirthday();

  const contribution = await prisma.contribution.create({
    data: {
      birthdayId: birthday.id,
      contributorName: sanitizeText(name as string),
      amount: Math.round(Number(amount)),
      message: message ? sanitizeText(message as string) : null,
      status: "pending",
    },
  });

  const stats = await getPublicStats(birthday.id);

  return NextResponse.json(
    {
      contribution: { id: contribution.id, status: contribution.status },
      stats,
    },
    { status: 201 }
  );
}
