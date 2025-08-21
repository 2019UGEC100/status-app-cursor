import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireOrg } from "@/lib/auth";
import { ensureOrganizationExists } from "@/lib/org";
import { createServiceSchema } from "@/lib/validation";

export async function GET() {
  try {
    const { orgId } = await requireOrg();
    await ensureOrganizationExists();
    const services = await db.service.findMany({
      where: { orgId },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json({ services });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    const status = message.includes("Unauthorized") ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(req: Request) {
  try {
    const { orgId } = await requireOrg();
    await ensureOrganizationExists();
    const json = await req.json();
    const body = createServiceSchema.parse(json);
    const created = await db.service.create({
      data: {
        orgId,
        name: body.name,
        description: body.description,
      },
    });
    return NextResponse.json({ service: created }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

