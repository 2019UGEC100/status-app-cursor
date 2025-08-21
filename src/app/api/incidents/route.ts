import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireOrg } from "@/lib/auth";
import { createIncidentSchema } from "@/lib/validation";
import { triggerOrgEvent } from "@/lib/pusher";

export async function GET() {
  const { orgId } = await requireOrg();
  const incidents = await db.incident.findMany({
    where: { orgId },
    orderBy: { createdAt: "desc" },
    include: { services: true, updates: true },
  });
  return NextResponse.json({ incidents });
}

export async function POST(req: Request) {
  const { orgId } = await requireOrg();
  const json = await req.json();
  const body = createIncidentSchema.parse(json);
  const incident = await db.$transaction(async (tx) => {
    const created = await tx.incident.create({
      data: {
        orgId,
        title: body.title,
        description: body.description,
        status: body.status ?? "OPEN",
        impact: body.impact ?? "MINOR",
        scheduledFrom: body.scheduledFrom ? new Date(body.scheduledFrom) : undefined,
        scheduledTo: body.scheduledTo ? new Date(body.scheduledTo) : undefined,
      },
    });
    if (body.serviceIds?.length) {
      await tx.incidentService.createMany({
        data: body.serviceIds.map((serviceId) => ({ incidentId: created.id, serviceId })),
      });
    }
    return created;
  });

  await triggerOrgEvent(orgId, "incident.created", { incidentId: incident.id });
  return NextResponse.json({ incident }, { status: 201 });
}

