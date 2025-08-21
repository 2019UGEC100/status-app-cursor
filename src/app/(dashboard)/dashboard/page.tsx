"use client";

import { useEffect, useState } from "react";

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
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isConnected, setIsConnected] = useState(false);

  const checkConnection = async () => {
    try {
      console.log('🔄 Checking connection to /api/health...');
      const timestamp = Date.now();
      const healthRes = await fetch(`/api/health?t=${timestamp}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      console.log('📡 Health response status:', healthRes.status);
      
      if (healthRes.ok) {
        console.log('✅ Connection successful - backend is healthy');
        setLastUpdate(new Date());
        setIsConnected(true);
      } else {
        console.error('❌ Connection failed with status:', healthRes.status);
        setIsConnected(false);
      }
    } catch (error) {
      console.error('💥 Connection check failed:', error);
      setIsConnected(false);
    }
  };

  useEffect(() => {
    console.log('🚀 Dashboard mounted - starting connection monitoring');
    
    // Initial connection check
    checkConnection();
    
    // Check connection every 5 seconds
    const interval = setInterval(checkConnection, 5000);
    
    // Force a check after 2 seconds
    const forceCheck = setTimeout(checkConnection, 2000);
    
    return () => {
      console.log('🛑 Dashboard unmounting - cleaning up');
      clearInterval(interval);
      clearTimeout(forceCheck);
    };
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
          <button 
            onClick={checkConnection}
            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
          >
            Test Connection
          </button>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">Demo Mode</h3>
        <p className="text-blue-700 text-sm">
          This is a demo dashboard showing real-time backend connectivity. 
          The connection indicator shows if the backend API is responding.
        </p>
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

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Interview Demo Instructions:</h3>
        <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
          <li>Click "Test Connection" to manually verify backend connectivity</li>
          <li>Watch the green "Connected" indicator show real-time status</li>
          <li>Use browser dev tools to block network requests and show disconnection</li>
          <li>Unblock to demonstrate reconnection capability</li>
        </ol>
      </div>
    </div>
  );
}


