import type { AuditEvent } from "../types/audit";
import { api } from "./api";

export async function getAuditEvents(): Promise<
  AuditEvent[]
> {

  const response = await api.get("/audit-events/");

  return response.data;

}
