import {
  ArrowLeft,
  CreditCard,
  AlertTriangle,
  Brain,
  RefreshCw,
  Clock,
} from "lucide-react";

import { useParams, Link } from "react-router-dom";

import { payments } from "../data/payments";
import "../css/payment-details.css";

function PaymentDetails() {
  const { paymentId } = useParams();

  const payment = payments.find((item) => item.id === paymentId);

  if (!payment) {
    return (
      <div className="payment-details-page">
        <h2>Payment not found</h2>

        <Link to="/at-risk-payments">Back to Payments</Link>
      </div>
    );
  }

  return (
    <div className="payment-details-page">
      {/* Back Button + Title */}
      <div className="details-header">
        <div>
          <Link to="/at-risk-payments" className="back-button">
            <ArrowLeft size={18} />
            Back to Payments
          </Link>

          <h1>Payment #{payment.id}</h1>
          <p>Detailed recovery analysis and action history.</p>
        </div>

        <span className={`status-badge ${payment.recoveryStatus ?? "pending"}`}>
          {(payment.recoveryStatus ?? "pending").replace("_", " ")}
        </span>
      </div>

      {/* Payment Overview */}
      <section className="details-section">
        <div className="details-section-header">
          <CreditCard size={20} />
          <h2>Payment Information</h2>
        </div>

        <div className="details-grid">
          <div className="detail-item">
            <span>Customer</span>
            <strong>{payment.customer}</strong>
          </div>

          <div className="detail-item">
            <span>Amount</span>
            <strong>₹{payment.amount.toLocaleString("en-IN")}</strong>
          </div>

          <div className="detail-item">
            <span>Payment Method</span>
            <strong>{payment.paymentMethod}</strong>
          </div>

          <div className="detail-item">
            <span>Transaction Time</span>
            <strong>{payment.transactionTime}</strong>
          </div>
        </div>
      </section>

      {/* Failure Analysis */}
      <section className="details-section">
        <div className="details-section-header">
          <AlertTriangle size={20} />
          <h2>Failure Analysis</h2>
        </div>

        <div className="failure-card">
          <div className="failure-main">
            <span className="failure-label">Failure Reason</span>

            <h3>{payment.failureReason}</h3>

            <p>
              The payment request timed out before receiving a response from the
              bank.
            </p>
          </div>

          <div className="risk-level">
            <span>Recovery Potential</span>
            <strong>{payment.riskLevel}</strong>
          </div>
        </div>
      </section>

      {/* AI Analysis */}
      <section className="details-section ai-analysis">
        <div className="details-section-header">
          <Brain size={20} />
          <h2>AI Recovery Analysis</h2>
        </div>

        <div className="ai-content">
          <div className="ai-result">
            <span className="ai-label">Recommended Action</span>

            <div className="ai-action">
              <RefreshCw size={20} />
              <strong>{payment.recommendedAction}</strong>
            </div>
          </div>

          <div className="ai-explanation">
            <span className="ai-label">Why this action?</span>

            <p>
              This failure appears temporary. Similar bank timeout cases have a
              higher recovery probability after a short waiting period.
            </p>
          </div>
        </div>
      </section>

      {/* Recovery Timeline */}
      <section className="details-section">
        <div className="details-section-header">
          <Clock size={20} />
          <h2>Recovery Timeline</h2>
        </div>

        <div className="timeline">
          <div className="timeline-item">
            <div className="timeline-dot completed"></div>

            <div className="timeline-content">
              <h3>Payment Failed</h3>
              <p>Bank timeout detected.</p>
              <span>10:32 AM</span>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-dot completed"></div>

            <div className="timeline-content">
              <h3>AI Analysis Completed</h3>
              <p>Temporary failure identified.</p>
              <span>10:33 AM</span>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-dot current"></div>

            <div className="timeline-content">
              <h3>Waiting Before Retry</h3>
              <p>Recovery attempt scheduled.</p>
              <span>Next: 10:40 AM</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default PaymentDetails;
