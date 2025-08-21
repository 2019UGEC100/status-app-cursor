import { auth, currentUser } from "@clerk/nextjs/server";

export async function requireOrg() {
  const { userId, orgId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  if (!orgId) throw new Error("No active organization selected");
  return { userId, orgId };
}

export async function getActiveOrganization() {
  const { orgId } = await auth();
  if (!orgId) return null;
  return { id: orgId } as { id: string };
}

export async function requireAdmin() {
  const session = await auth();
  if (!session.userId) throw new Error("Unauthorized");
  const emailsEnv = process.env.ADMIN_EMAILS || ""; // comma-separated
  const allowed = emailsEnv
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  const email = session.sessionClaims?.email as string | undefined;
  if (!email || (allowed.length > 0 && !allowed.includes(email.toLowerCase()))) {
    throw new Error("Forbidden");
  }
  return session;
}

export async function isAdmin(): Promise<boolean> {
  const session = await auth();
  if (!session.userId) return false;
  const user = await currentUser();
  const emailsEnv = process.env.ADMIN_EMAILS || "";
  const allowed = emailsEnv
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  const email =
    user?.primaryEmailAddress?.emailAddress ||
    user?.emailAddresses?.[0]?.emailAddress ||
    ((session.sessionClaims?.email as string | undefined) || undefined);
  if (!email) return false;
  if (allowed.length === 0) return true;
  return allowed.includes(email.toLowerCase());
}

