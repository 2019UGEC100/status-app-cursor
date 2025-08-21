import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const services = await db.service.findMany({ orderBy: { createdAt: "asc" } });
  const incidents = await db.incident.findMany({ orderBy: { createdAt: "desc" }, include: { updates: true } });
  return NextResponse.json({ services, incidents });
}

