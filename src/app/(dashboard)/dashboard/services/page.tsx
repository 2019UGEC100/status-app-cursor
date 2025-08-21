"use client";
import { useEffect, useState } from "react";
import axios from "axios";

type Service = {
  id: string;
  name: string;
  description?: string | null;
  status: string;
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  async function fetchServices() {
    const { data } = await axios.get("/api/services");
    setServices(data.services);
  }

  useEffect(() => {
    fetchServices();
  }, []);

  async function createService(e: React.FormEvent) {
    e.preventDefault();
    await axios.post("/api/services", { name, description });
    setName("");
    setDescription("");
    await fetchServices();
  }

  async function updateStatus(id: string, status: string) {
    await axios.patch(`/api/services/${id}`, { status });
    await fetchServices();
  }

  async function remove(id: string) {
    await axios.delete(`/api/services/${id}`);
    await fetchServices();
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-xl font-semibold">Services</h1>
      <form onSubmit={createService} className="flex gap-2">
        <input className="border px-3 py-2 rounded w-48" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="border px-3 py-2 rounded flex-1" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <button className="px-4 py-2 rounded bg-black text-white">Add</button>
      </form>
      <div className="space-y-2">
        {services.map((s) => (
          <div key={s.id} className="rounded border p-3 flex items-center justify-between">
            <div>
              <div className="font-medium">{s.name}</div>
              <div className="text-sm text-gray-600">{s.description}</div>
            </div>
            <div className="flex items-center gap-2">
              <select className="border rounded px-2 py-1" value={s.status} onChange={(e) => updateStatus(s.id, e.target.value)}>
                {['OPERATIONAL','DEGRADED','PARTIAL_OUTAGE','MAJOR_OUTAGE','MAINTENANCE'].map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
              <button onClick={() => remove(s.id)} className="text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


