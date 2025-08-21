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
  const [services, setServices] = useState<Service[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isConnected, setIsConnected] = useState(true);

  const fetchData = async () => {
    try {
      // Use the existing health endpoint for connectivity check
      const healthRes = await fetch('/api/health');
      
      if (healthRes.ok) {
        // Simulate some demo data for the interview
        setServices([
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
        setIncidents([]);
        setLastUpdate(new Date());
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setIsConnected(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Real-time updates every 5 seconds
    const interval = setInterval(fetchData, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
            isConnected 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
          <span className="text-sm text-gray-500">
            Last update: {lastUpdate.toLocaleTimeString()}
          </span>
        </div>
      </div>

      <div className="flex space-x-4 text-sm">
        <Link href="/dashboard/services" className="text-blue-600 hover:underline">
          Services
        </Link>
        <Link href="/dashboard/incidents" className="text-blue-600 hover:underline">
          Incidents
        </Link>
        <Link href="/s" className="text-blue-600 hover:underline">
          Public Page
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section>
          <h2 className="text-xl font-semibold mb-4">Services</h2>
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
            {services.length === 0 && (
              <p className="text-gray-500">No services yet.</p>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Recent Incidents</h2>
          <div className="space-y-3">
            {incidents.map((incident) => (
              <div key={incident.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{incident.title}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    incident.status === 'RESOLVED' ? 'bg-green-100 text-green-800' :
                    incident.status === 'MONITORING' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {incident.status}
                  </span>
                </div>
              </div>
            ))}
            {incidents.length === 0 && (
              <p className="text-gray-500">No incidents yet.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}


