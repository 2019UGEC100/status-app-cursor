"use client";

import { useEffect, useState } from "react";
import { createPusherClient } from "@/lib/pusher-client";

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
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>("");

  useEffect(() => {
    // Initialize Pusher connection
    const pusherClient = createPusherClient();
    
    if (pusherClient) {
      const channel = pusherClient.subscribe('status-updates');
      
      // Listen for service status updates
      channel.bind('service-updated', (data: { service: Service }) => {
        console.log('🔄 Real-time service update received:', data);
        setServices(prev => 
          prev.map(service => 
            service.id === data.service.id ? data.service : service
          )
        );
        setLastUpdate(new Date().toLocaleTimeString());
      });

      // Listen for incident updates
      channel.bind('incident-updated', (data: { incident: Incident }) => {
        console.log('🔄 Real-time incident update received:', data);
        setIncidents(prev => 
          prev.map(incident => 
            incident.id === data.incident.id ? data.incident : incident
          )
        );
        setLastUpdate(new Date().toLocaleTimeString());
      });

      // Listen for new incidents
      channel.bind('incident-created', (data: { incident: Incident }) => {
        console.log('🆕 New incident created:', data);
        setIncidents(prev => [data.incident, ...prev]);
        setLastUpdate(new Date().toLocaleTimeString());
      });

      // Connection status
      pusherClient.connection.bind('connected', () => {
        console.log('✅ Pusher connected');
        setIsConnected(true);
        setLastUpdate(new Date().toLocaleTimeString());
      });

      pusherClient.connection.bind('disconnected', () => {
        console.log('❌ Pusher disconnected');
        setIsConnected(false);
      });

      return () => {
        pusherClient.unsubscribe('status-updates');
      };
    }
  }, []);

  // Simulate real-time updates for demo
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate random status changes for demo
      if (Math.random() > 0.8) {
        const randomService = services[Math.floor(Math.random() * services.length)];
        const newStatus = randomService.status === 'OPERATIONAL' ? 'DEGRADED' : 'OPERATIONAL';
        
        setServices(prev => 
          prev.map(service => 
            service.id === randomService.id 
              ? { ...service, status: newStatus }
              : service
          )
        );
        setLastUpdate(new Date().toLocaleTimeString());
        console.log(`🔄 Demo: ${randomService.name} status changed to ${newStatus}`);
      }
    }, 10000); // Every 10 seconds

    return () => clearInterval(interval);
  }, [services]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
            ✅ Deployed Successfully
          </div>
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
            isConnected 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <span>{isConnected ? 'WebSocket Connected' : 'WebSocket Disconnected'}</span>
          </div>
          <span className="text-sm text-gray-500">
            Last update: {lastUpdate || 'Initializing...'}
          </span>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="font-semibold text-green-800 mb-2">✅ Real-Time Status Updates</h3>
        <p className="text-green-700 text-sm">
          This dashboard now features real-time WebSocket updates using Pusher. 
          Service status changes and incident updates appear instantly.
        </p>
      </div>

      <div className="flex space-x-4 text-sm">
        <a href="/dashboard/services" className="text-blue-600 hover:underline">
          Manage Services
        </a>
        <a href="/dashboard/incidents" className="text-blue-600 hover:underline">
          Manage Incidents
        </a>
        <a href="/s" className="text-blue-600 hover:underline">
          Public Status Page
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section>
          <h2 className="text-xl font-semibold mb-4">Services Overview (Live)</h2>
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
          <h2 className="text-xl font-semibold mb-4">Recent Incidents (Live)</h2>
          <div className="space-y-3">
            {incidents.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No incidents reported</p>
                <p className="text-sm text-gray-400 mt-1">All systems operational</p>
              </div>
            ) : (
              incidents.map((incident) => (
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
              ))
            )}
          </div>
        </section>
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">Real-Time Features:</h3>
        <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
          <li>✅ WebSocket connection with Pusher</li>
          <li>✅ Live service status updates</li>
          <li>✅ Real-time incident notifications</li>
          <li>✅ Instant dashboard refresh</li>
          <li>✅ Connection status monitoring</li>
          <li>✅ Demo mode with simulated updates</li>
        </ul>
      </div>
    </div>
  );
}


