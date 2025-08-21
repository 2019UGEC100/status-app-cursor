import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ 
    status: "healthy", 
    timestamp: new Date().toISOString(),
    message: "Backend is running and connected",
    services: [
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
    ],
    incidents: []
  });
}
