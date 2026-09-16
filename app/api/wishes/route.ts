import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getActiveBirthday, getPublicStats } from "@/lib/birthday-data";
import { sanitizeText, validateWish } from "@/lib/validation";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, message } = (body ?? {}) as { name?: unknown; message?: unknown };
  const { valid, errors } = validateWish({ name, message });
  if (!valid) {
    return NextResponse.json({ error: "Please check the form.", fieldErrors: errors }, { status: 422 });
  }

  const birthday = await getActiveBirthday();

  const wish = await prisma.wish.create({
    data: {
      birthdayId: birthday.id,
      name: sanitizeText(name as string),
      message: sanitizeText(message as string),
    },
  });

  const stats = await getPublicStats(birthday.id);

  return NextResponse.json(
    {
      wish: { id: wish.id, name: wish.name, message: wish.message, createdAt: wish.createdAt.toISOString() },
      stats,
    },
    { status: 201 }
  );
}
