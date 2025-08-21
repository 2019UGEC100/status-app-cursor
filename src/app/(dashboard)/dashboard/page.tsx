import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export default async function DashboardPage() {
  const { userId, orgId } = await auth();
  if (!userId) redirect(process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || "/sign-in");
  const admin = await isAdmin();
  if (!admin) return <div className="p-6">Forbidden: your account is not allowed to access the dashboard.</div>;
  if (!orgId) return <div className="p-6">Select or create an organization from the Clerk org switcher.</div>;

  const [services, incidents] = await Promise.all([
    db.service.findMany({ where: { orgId }, orderBy: { createdAt: "asc" } }),
    db.incident.findMany({ where: { orgId }, orderBy: { createdAt: "desc" }, include: { services: true } }),
  ]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <nav className="space-x-3">
          <Link href="/dashboard/services" className="underline">Services</Link>
          <Link href="/dashboard/incidents" className="underline">Incidents</Link>
          <Link href="/s" className="underline">Public Page</Link>
        </nav>
      </header>
      <section>
        <h2 className="font-medium mb-2">Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {services.map((s) => (
            <div key={s.id} className="rounded border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{s.name}</div>
                  <div className="text-sm text-gray-500">{s.description}</div>
                </div>
                <div className="text-sm">{s.status}</div>
              </div>
            </div>
          ))}
          {!services.length && <div className="text-sm text-gray-500">No services yet.</div>}
        </div>
      </section>
      <section>
        <h2 className="font-medium mb-2">Recent Incidents</h2>
        <div className="space-y-2">
          {incidents.map((i) => (
            <div key={i.id} className="rounded border p-4">
              <div className="flex items-center justify-between">
                <div className="font-medium">{i.title}</div>
                <div className="text-sm">{i.status}</div>
              </div>
              <div className="text-sm text-gray-600">{i.description}</div>
            </div>
          ))}
          {!incidents.length && <div className="text-sm text-gray-500">No incidents yet.</div>}
        </div>
      </section>
    </div>
  );
}


