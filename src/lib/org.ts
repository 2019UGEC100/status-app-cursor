import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function ensureOrganizationExists() {
  const { orgId } = await auth();
  if (!orgId) return null;

  try {
    const name = "Organization";

    await db.organization.upsert({
      where: { id: orgId },
      create: { id: orgId, name },
      update: { name },
    });
  } catch {
    // Fallback: ensure row exists with minimal data
    await db.organization.upsert({
      where: { id: orgId },
      create: { id: orgId, name: "Organization" },
      update: {},
    });
  }
  return orgId;
}


