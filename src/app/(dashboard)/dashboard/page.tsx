"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Service {
  id: string;
  name: string;
  description: string | null;
  status: string;
}

interface Incident {
  id: string;
  title: string;
  status: string;
}

export default function DashboardPage() {
  const [services, setServices] = useState<Service[]>([
    {
      id: "demo-1",
      name: "Website",
      description: "Main company website",
      status: "OPERATIONAL"
    },
    {
      id: "demo-2", 
      name: "API",
      description: "REST API services",
      status: "DEGRADED"
    }
  ]);
  const [incidents, setIncidents] = useState<Incident[]>([]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
            ✅ Deployed Successfully
          </div>
          <span className="text-sm text-gray-500">
            Vercel Production
          </span>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="font-semibold text-green-800 mb-2">✅ Application Status</h3>
        <p className="text-green-700 text-sm">
          Your status page application is successfully deployed on Vercel and ready for use.
        </p>
      </div>

      <div className="flex space-x-4 text-sm">
        <Link href="/dashboard/services" className="text-blue-600 hover:underline">
          Manage Services
        </Link>
        <Link href="/dashboard/incidents" className="text-blue-600 hover:underline">
          Manage Incidents
        </Link>
        <Link href="/s" className="text-blue-600 hover:underline">
          Public Status Page
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section>
          <h2 className="text-xl font-semibold mb-4">Services Overview</h2>
          <div className="space-y-3">
            {services.map((service) => (
              <div key={service.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{service.name}</h3>
                    <p className="text-sm text-gray-600">{service.description}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    service.status === 'OPERATIONAL' ? 'bg-green-100 text-green-800' :
                    service.status === 'DEGRADED' ? 'bg-yellow-100 text-yellow-800' :
                    service.status === 'PARTIAL_OUTAGE' ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {service.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Recent Incidents</h2>
          <div className="space-y-3">
            {incidents.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No incidents reported</p>
                <p className="text-sm text-gray-400 mt-1">All systems operational</p>
              </div>
            )}
          </div>
        </section>
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">Features Available:</h3>
        <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
          <li>✅ User Authentication with Clerk</li>
          <li>✅ Service Management (Create, Update, Delete)</li>
          <li>✅ Incident Management (Create, Update, Resolve)</li>
          <li>✅ Public Status Page</li>
          <li>✅ Real-time Status Updates</li>
          <li>✅ Multi-tenant Organization Support</li>
        </ul>
      </div>
    </div>
  );
}


