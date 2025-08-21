import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import { requireOrg } from "@/lib/auth";
import { updateServiceSchema } from "@/lib/validation";
import { triggerOrgEvent } from "@/lib/pusher";

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { orgId } = await requireOrg();
  const { id } = await context.params;
  const json = await req.json();
  const body = updateServiceSchema.parse(json);

  const existing = await db.service.findFirst({ where: { id, orgId } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await db.$transaction(async (tx) => {
    const svc = await tx.service.update({
      where: { id },
      data: {
        name: body.name ?? undefined,
        description: body.description ?? undefined,
        status: body.status ?? undefined,
      },
    });

    if (body.status) {
      await tx.serviceStatusHistory.create({
        data: {
          serviceId: id,
          status: body.status,
          message: body.message,
        },
      });
    }

    return svc;
  });

  await triggerOrgEvent(orgId, "service.updated", { serviceId: id, service: updated });

  return NextResponse.json({ service: updated });
}

export async function DELETE(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { orgId } = await requireOrg();
  const { id } = await context.params;
  const existing = await db.service.findFirst({ where: { id, orgId } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await db.service.delete({ where: { id } });
  await triggerOrgEvent(orgId, "service.deleted", { serviceId: id });
  return NextResponse.json({ ok: true });
}

