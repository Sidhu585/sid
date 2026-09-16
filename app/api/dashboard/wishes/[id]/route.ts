import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isDashboardRequest } from "@/lib/dashboard-auth";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isDashboardRequest(req)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    await prisma.wish.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Wish not found." }, { status: 404 });
  }
}
