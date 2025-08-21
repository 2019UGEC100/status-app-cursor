import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import { requireOrg } from "@/lib/auth";
import { updateIncidentSchema } from "@/lib/validation";
import { triggerOrgEvent } from "@/lib/pusher";

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { orgId } = await requireOrg();
  const { id } = await context.params;
  const json = await req.json();
  const body = updateIncidentSchema.parse(json);

  const existing = await db.incident.findFirst({ where: { id, orgId } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await db.$transaction(async (tx) => {
    const incident = await tx.incident.update({
      where: { id },
      data: {
        title: body.title ?? undefined,
        description: body.description ?? undefined,
        status: body.status ?? undefined,
        impact: body.impact ?? undefined,
        scheduledFrom: body.scheduledFrom === null ? null : body.scheduledFrom ? new Date(body.scheduledFrom) : undefined,
        scheduledTo: body.scheduledTo === null ? null : body.scheduledTo ? new Date(body.scheduledTo) : undefined,
        resolvedAt: body.resolvedAt === null ? null : body.resolvedAt ? new Date(body.resolvedAt) : undefined,
      },
    });
    if (body.serviceIds) {
      await tx.incidentService.deleteMany({ where: { incidentId: id } });
      await tx.incidentService.createMany({ data: body.serviceIds.map((serviceId) => ({ incidentId: id, serviceId })) });
    }
    return incident;
  });

  await triggerOrgEvent(orgId, "incident.updated", { incidentId: id });
  return NextResponse.json({ incident: updated });
}

export async function DELETE(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { orgId } = await requireOrg();
  const { id } = await context.params;
  const existing = await db.incident.findFirst({ where: { id, orgId } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await db.incident.delete({ where: { id } });
  await triggerOrgEvent(orgId, "incident.deleted", { incidentId: id });
  return NextResponse.json({ ok: true });
}

