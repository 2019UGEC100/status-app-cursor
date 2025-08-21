import { db } from "@/lib/db";

export default async function PublicStatusPage() {
  // Demo page: shows all orgs' services and incidents
  const services = await db.service.findMany({ orderBy: { createdAt: "asc" } });
  const incidents = await db.incident.findMany({ orderBy: { createdAt: "desc" }, include: { updates: true } });
  const overall = services.every((s) => s.status === "OPERATIONAL") ? "All systems operational" : "Some systems impacted";
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Status</h1>
      <div className="rounded border p-4 bg-green-50 border-green-200">{overall}</div>
      <section>
        <h2 className="font-medium mb-2">Services</h2>
        <div className="space-y-2">
          {services.map((s) => (
            <div key={s.id} className="flex items-center justify-between rounded border p-3">
              <div>
                <div className="font-medium">{s.name}</div>
                <div className="text-sm text-gray-600">{s.description}</div>
              </div>
              <div className="text-sm">{s.status}</div>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="font-medium mb-2">Incidents</h2>
        <div className="space-y-2">
          {incidents.map((i) => (
            <div key={i.id} className="rounded border p-3">
              <div className="flex items-center justify-between">
                <div className="font-medium">{i.title}</div>
                <div className="text-sm">{i.status}</div>
              </div>
              <div className="text-sm text-gray-600">{i.description}</div>
              <ul className="mt-2 space-y-1 text-sm list-disc pl-5">
                {i.updates.map((u) => (
                  <li key={u.id}>{u.message}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}


