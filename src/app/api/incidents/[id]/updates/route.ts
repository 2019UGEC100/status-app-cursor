import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import { requireOrg } from "@/lib/auth";
import { createIncidentUpdateSchema } from "@/lib/validation";
import { triggerOrgEvent } from "@/lib/pusher";

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { orgId } = await requireOrg();
  const { id } = await context.params;
  const json = await req.json();
  const body = createIncidentUpdateSchema.parse(json);

  const existing = await db.incident.findFirst({ where: { id, orgId } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const update = await db.incidentUpdate.create({ data: { incidentId: id, message: body.message } });
  await triggerOrgEvent(orgId, "incident.update.created", { incidentId: id, updateId: update.id });
  return NextResponse.json({ update }, { status: 201 });
}

