import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const services = await db.service.findMany({ orderBy: { createdAt: "asc" } });
    const incidents = await db.incident.findMany({ orderBy: { createdAt: "desc" }, include: { updates: true } });
    return NextResponse.json({ services, incidents });
  } catch (error) {
    // Database tables don't exist yet - return empty data
    return NextResponse.json({ services: [], incidents: [] });
  }
}

