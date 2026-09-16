import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isDashboardRequest } from "@/lib/dashboard-auth";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isDashboardRequest(req)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { status } = (body ?? {}) as { status?: unknown };
  if (status !== "pending" && status !== "verified") {
    return NextResponse.json({ error: "status must be 'pending' or 'verified'." }, { status: 422 });
  }

  try {
    const updated = await prisma.contribution.update({
      where: { id: params.id },
      data: { status },
    });
    return NextResponse.json({ ok: true, id: updated.id, status: updated.status });
  } catch {
    return NextResponse.json({ error: "Contribution not found." }, { status: 404 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isDashboardRequest(req)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    await prisma.contribution.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Contribution not found." }, { status: 404 });
  }
}
