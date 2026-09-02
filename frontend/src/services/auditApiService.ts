import axios from "axios";

import type { AuditEvent } from "../data/audit";

const API_URL =
  "http://127.0.0.1:8000/api";

export async function getAuditEvents(): Promise<
  AuditEvent[]
> {

  const response = await axios.get(
    `${API_URL}/audit-events/`
  );

  return response.data;

}
