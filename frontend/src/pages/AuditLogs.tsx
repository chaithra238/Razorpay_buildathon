import {
  AlertTriangle,
  Brain,
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  Clock,
} from "lucide-react";

import { useEffect, useState } from "react";

import type { AuditEvent } from "../types/audit";

import { getAuditEvents } from "../services/auditApiService";

import "../css/audit.css";

function AuditLogs() {

  const [auditEvents, setAuditEvents] =
    useState<AuditEvent[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    async function fetchAuditEvents() {

      try {

        const data =
          await getAuditEvents();

        setAuditEvents(data);

      }

      catch (error) {

        console.error(
          "Failed to load audit events:",
          error
        );

      }

      finally {

        setLoading(false);

      }

    }

    fetchAuditEvents();

  }, []);

  return (
    <div className="audit-page">
      <div className="page-title">
        <div>
          <h1>Audit Logs</h1>
          <p>Recorded events from RecoverAI.</p>
        </div>
      </div>

      {loading ? (

        <div className="dynamic-audit-section">

          <p>
            Loading audit events...
          </p>

        </div>

      ) : auditEvents.length > 0 ? (

        <div className="dynamic-audit-section">

          <h2>Events</h2>

          {auditEvents.map((audit) => (

            <div
              className="audit-item"
              key={audit.id}
            >

              <div className="audit-content">

                <div className="audit-content-top">

                  <h3>
                    {audit.event}
                  </h3>

                  <span className="audit-time">

                    {audit.timestamp}

                  </span>

                </div>

                <p>
                  {audit.description}
                </p>

                <span className="audit-tag">

                  {audit.paymentId}

                </span>

              </div>

            </div>

          ))}

        </div>

      ) : (

        <div className="dynamic-audit-section">

          <h2>
            No audit events
          </h2>

          <p>
            No events have been recorded yet.
          </p>

        </div>

      )}

    </div>
  );

}

export default AuditLogs;
