import { useEffect, useState } from "react";

import { getAuditEvents } from "../services/auditApiService";
import type { AuditEvent } from "../types/audit";

import "../css/audit.css";

function AuditTrail() {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAuditEvents() {
      try {
        const data = await getAuditEvents();
        setEvents(data);
      } catch (error) {
        console.error("Failed to load audit events:", error);
      } finally {
        setLoading(false);
      }
    }

    loadAuditEvents();
  }, []);

  if (loading) {
    return <div className="audit-page">Loading audit events...</div>;
  }

  return (
    <div className="audit-page">
      <div className="audit-header">
        <h1>Audit Trail</h1>
        <p>Complete history of AI decisions and recovery actions.</p>
      </div>

      <div className="audit-section">
        <h2>Live Recovery Events</h2>

        {events.length === 0 ? (
          <div className="audit-empty">No audit events found.</div>
        ) : (
          events.map((event) => (
            <div className="audit-event" key={event.id}>
              <div className="audit-event-icon">✓</div>

              <div className="audit-event-content">
                <div className="audit-event-top">
                  <h3 className="audit-event-title">{event.event}</h3>
                  <span className="audit-event-time">{event.timestamp}</span>
                </div>

                <p className="audit-event-description">
                  {event.description}
                </p>

                <span className="audit-payment-id">{event.paymentId}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AuditTrail;
