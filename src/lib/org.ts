import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function ensureOrganizationExists() {
  const { orgId } = await auth();
  if (!orgId) return null;

  try {
    const name = "Organization";
    const slug = null as string | null;

    await db.organization.upsert({
      where: { id: orgId },
      create: { id: orgId, name, slug: undefined },
      update: { name, slug: undefined },
    });
  } catch (_err) {
    // Fallback: ensure row exists with minimal data
    await db.organization.upsert({
      where: { id: orgId },
      create: { id: orgId, name: "Organization" },
      update: {},
    });
  }
  return orgId;
}


