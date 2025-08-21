import { z } from "zod";

export const createServiceSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export const updateServiceSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(["OPERATIONAL", "DEGRADED", "PARTIAL_OUTAGE", "MAJOR_OUTAGE", "MAINTENANCE"]).optional(),
  message: z.string().optional(), // for history entry when status changes
});

export const createIncidentSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(["OPEN", "MONITORING", "RESOLVED", "SCHEDULED"]).optional(),
  impact: z.enum(["NONE", "MINOR", "MAJOR", "CRITICAL"]).optional(),
  scheduledFrom: z.string().datetime().optional(),
  scheduledTo: z.string().datetime().optional(),
  serviceIds: z.array(z.string()).default([]),
});

export const updateIncidentSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(["OPEN", "MONITORING", "RESOLVED", "SCHEDULED"]).optional(),
  impact: z.enum(["NONE", "MINOR", "MAJOR", "CRITICAL"]).optional(),
  scheduledFrom: z.string().datetime().nullable().optional(),
  scheduledTo: z.string().datetime().nullable().optional(),
  resolvedAt: z.string().datetime().nullable().optional(),
  serviceIds: z.array(z.string()).optional(),
});

export const createIncidentUpdateSchema = z.object({
  message: z.string().min(1),
});

