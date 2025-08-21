"use client";
import { useEffect, useState } from "react";
import axios from "axios";

type Service = { id: string; name: string };
type Incident = { id: string; title: string; status: string; description?: string | null };

export default function IncidentsPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  async function refresh() {
    const [sv, inc] = await Promise.all([
      axios.get("/api/services").then(r => r.data.services),
      axios.get("/api/incidents").then(r => r.data.incidents),
    ]);
    setServices(sv);
    setIncidents(inc);
  }

  useEffect(() => { refresh(); }, []);

  async function createIncident(e: React.FormEvent) {
    e.preventDefault();
    await axios.post("/api/incidents", { title, description, serviceIds: selected });
    setTitle("");
    setDescription("");
    setSelected([]);
    await refresh();
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-xl font-semibold">Incidents</h1>
      <form onSubmit={createIncident} className="space-y-2">
        <input className="border px-3 py-2 rounded w-full" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea className="border px-3 py-2 rounded w-full" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <div className="flex flex-wrap gap-2">
          {services.map((s) => (
            <label key={s.id} className="inline-flex items-center gap-2 border rounded px-2 py-1">
              <input type="checkbox" checked={selected.includes(s.id)} onChange={(e) => {
                setSelected((prev) => e.target.checked ? [...prev, s.id] : prev.filter((id) => id !== s.id));
              }} />
              {s.name}
            </label>
          ))}
        </div>
        <button className="px-4 py-2 rounded bg-black text-white">Create</button>
      </form>

      <div className="space-y-2">
        {incidents.map((i) => (
          <div key={i.id} className="rounded border p-3">
            <div className="flex items-center justify-between">
              <div className="font-medium">{i.title}</div>
              <div className="text-sm">{i.status}</div>
            </div>
            <div className="text-sm text-gray-600">{i.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}


