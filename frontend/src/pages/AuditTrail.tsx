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

function AuditTrailEvents() {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getAuditEvents();
        setEvents(data);
      } catch (err) {
        console.error("Failed to load audit events:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return null;

  if (events.length === 0) return null;

  return (
    <div className="dynamic-audit-section">
      <h2>Live Recovery Events</h2>

      {events.map((audit) => (
        <div className="audit-item" key={audit.id}>
          <div className="audit-content">
            <div className="audit-content-top">
              <h3>{audit.event}</h3>
              <span className="audit-time">{audit.timestamp}</span>
            </div>

            <p>{audit.description}</p>

            <span className="audit-tag">{audit.paymentId}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function AuditTrail() {
  return (
    <div className="audit-page">
      {/* Page Header */}
      <div className="page-title">
        <div>
          <h1>Audit Trail</h1>
          <p>Complete history of AI decisions and recovery actions.</p>
        </div>
      </div>

      <AuditTrailEvents />

      {/* Audit Summary */}
      <div className="audit-summary">
        <div className="audit-summary-card">
          <span>Total Events</span>
          <strong>128</strong>
        </div>

        <div className="audit-summary-card">
          <span>AI Decisions</span>
          <strong>42</strong>
        </div>

        <div className="audit-summary-card">
          <span>Actions Executed</span>
          <strong>32</strong>
        </div>

        <div className="audit-summary-card">
          <span>Policy Blocks</span>
          <strong>3</strong>
        </div>
      </div>

      {/* Audit Timeline */}
      <section className="audit-section">
        <div className="section-header">
          <div>
            <h2>Recent Activity</h2>
            <p>Latest events recorded by RecoverAI.</p>
          </div>
        </div>

        <div className="audit-list">
          {/* Event 1 */}
          <div className="audit-item">
            <div className="audit-icon failure-event">
              <AlertTriangle size={18} />
            </div>

            <div className="audit-content">
              <div className="audit-content-top">
                <h3>Payment Failure Detected</h3>

                <span className="audit-time">Today, 10:32 AM</span>
              </div>

              <p>
                Payment <strong>#PAY-1001</strong> failed because of a bank timeout.
              </p>

              <span className="audit-tag failure-tag">Failure Detected</span>
            </div>
          </div>

          {/* Event 2 */}
          <div className="audit-item">
            <div className="audit-icon ai-event">
              <Brain size={18} />
            </div>

            <div className="audit-content">
              <div className="audit-content-top">
                <h3>AI Analysis Completed</h3>

                <span className="audit-time">Today, 10:33 AM</span>
              </div>

              <p>
                AI identified the failure as temporary and recommended waiting
                before retrying the payment.
              </p>

              <span className="audit-tag ai-tag">AI Recommendation</span>
            </div>
          </div>

          {/* Event 3 */}
          <div className="audit-item">
            <div className="audit-icon policy-event">
              <ShieldCheck size={18} />
            </div>

            <div className="audit-content">
              <div className="audit-content-top">
                <h3>Policy Check Approved</h3>

                <span className="audit-time">Today, 10:33 AM</span>
              </div>

              <p>
                The recommended retry action was within the allowed retry limit
                and approved for execution.
              </p>

              <span className="audit-tag policy-tag">Policy Approved</span>
            </div>
          </div>

          {/* Event 4 */}
          <div className="audit-item">
            <div className="audit-icon action-event">
              <RefreshCw size={18} />
            </div>

            <div className="audit-content">
              <div className="audit-content-top">
                <h3>Recovery Action Scheduled</h3>

                <span className="audit-time">Today, 10:34 AM</span>
              </div>

              <p>
                RecoverAI scheduled a retry attempt after a five-minute waiting
                period.
              </p>

              <span className="audit-tag action-tag">Recovery Action</span>
            </div>
          </div>

          {/* Event 5 */}
          <div className="audit-item">
            <div className="audit-icon success-event">
              <CheckCircle2 size={18} />
            </div>

            <div className="audit-content">
              <div className="audit-content-top">
                <h3>Payment Successfully Recovered</h3>

                <span className="audit-time">Today, 10:40 AM</span>
              </div>

              <p>The retry was successful and ₹5,000 was recovered.</p>

              <span className="audit-tag success-tag">Recovery Successful</span>
            </div>
          </div>

          {/* Event 6 */}
          <div className="audit-item">
            <div className="audit-icon blocked-event">
              <Clock size={18} />
            </div>

            <div className="audit-content">
              <div className="audit-content-top">
                <h3>Action Waiting for Review</h3>

                <span className="audit-time">Today, 11:02 AM</span>
              </div>

              <p>
                A high-value payment exceeded the automatic action threshold and
                was sent for human review.
              </p>

              <span className="audit-tag blocked-tag">Human Approval Required</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AuditTrail;
