import { useState } from "react";

import {
  RefreshCw,
  Mail,
  UserCheck,
  SearchCheck,
  Brain,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

import { payments } from "../data/payments";
import type { Payment } from "../types/payment";
import {
  analyzePayment,
  type RecoveryDecision,
} from "../services/recoveryEngine";
import {
  validateRecoveryAction,
  type PolicyResult,
} from "../services/policyEngine";

import "../css/recovery.css";

function RecoveryCenter() {
  const [selectedPaymentId, setSelectedPaymentId] = useState("");

  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(
    null
  );

  const [decision, setDecision] = useState<RecoveryDecision | null>(null);

  const [policyResult, setPolicyResult] = useState<PolicyResult | null>(null);

  const [executionStatus, setExecutionStatus] = useState<string | null>(null);

  const handleAnalyzeRecovery = () => {
    setExecutionStatus(null);

    const payment = payments.find((item) => item.id === selectedPaymentId);

    if (!payment) {
      return;
    }

    const recoveryDecision = analyzePayment(payment);

    const policy = validateRecoveryAction(payment, recoveryDecision);

    setSelectedPayment(payment);
    setDecision(recoveryDecision);
    setPolicyResult(policy);
  };

  const handleExecuteRecovery = () => {
    if (!policyResult || !decision) {
      return;
    }

    if (!policyResult.allowed) {
      setExecutionStatus("Recovery action requires human approval.");
      return;
    }

    if (decision.recommendedAction === "Wait and Retry") {
      setExecutionStatus(
        "Retry scheduled successfully. Payment recovery is now in progress."
      );
    } else if (decision.recommendedAction === "Send Reminder") {
      setExecutionStatus("Payment reminder scheduled successfully.");
    } else {
      setExecutionStatus("Recovery workflow initiated successfully.");
    }
  };

  return (
    <div className="recovery-page">
      {/* Page Header */}
      <div className="page-title">
        <div>
          <h1>Recovery Center</h1>
          <p>Monitor active revenue recovery workflows.</p>
        </div>
      </div>

      <div className="recovery-selector">
        <div>
          <label>Select At-Risk Payment</label>

          <select
            value={selectedPaymentId}
            onChange={(event) => setSelectedPaymentId(event.target.value)}
          >
            <option value="">Select a payment</option>

            {payments
              .filter((payment) => payment.status === "at_risk")
              .map((payment) => (
                <option key={payment.id} value={payment.id}>
                  {payment.id} — {payment.customer} — ₹
                  {payment.amount.toLocaleString("en-IN")}
                </option>
              ))}
          </select>
        </div>

        <button onClick={handleAnalyzeRecovery} disabled={!selectedPaymentId}>
          Analyze Recovery
        </button>
      </div>

      {selectedPayment && decision && policyResult && (
        <section className="recovery-result">
          <h2>Recovery Analysis</h2>

          <div className="result-row">
            <span>Payment</span>
            <strong>{selectedPayment.id}</strong>
          </div>

          <div className="result-row">
            <span>Failure Reason</span>
            <strong>{selectedPayment.failureReason}</strong>
          </div>

          <div className="result-row">
            <span>AI Diagnosis</span>
            <strong>{decision.diagnosis}</strong>
          </div>

          <div className="result-row">
            <span>Recommended Action</span>
            <strong>{decision.recommendedAction}</strong>
          </div>

          <div className="result-row">
            <span>Confidence</span>
            <strong>{decision.confidence}</strong>
          </div>

          <div className="result-row">
            <span>Policy Status</span>
            <strong className={policyResult.allowed ? "allowed" : "blocked"}>
              {policyResult.allowed ? "Allowed" : "Human Approval Required"}
            </strong>
          </div>

          <div className="policy-reason">
            <strong>Policy Explanation:</strong>
            <p>{policyResult.reason}</p>
          </div>

          <div className="recovery-action-section">
            <button
              className="execute-recovery-button"
              onClick={handleExecuteRecovery}
            >
              {policyResult.allowed
                ? "Execute Recovery Action"
                : "Request Human Approval"}
            </button>

            {executionStatus && (
              <div className="execution-status">{executionStatus}</div>
            )}
          </div>
        </section>
      )}

      {/* Recovery Summary */}
      <div className="recovery-stats">
        <div className="recovery-stat-card">
          <span>Active Recoveries</span>
          <strong>24</strong>
        </div>

        <div className="recovery-stat-card">
          <span>In Progress</span>
          <strong>15</strong>
        </div>

        <div className="recovery-stat-card">
          <span>Awaiting Review</span>
          <strong>4</strong>
        </div>

        <div className="recovery-stat-card">
          <span>Recovered Today</span>
          <strong>₹18,500</strong>
        </div>
      </div>

      {/* Active Recoveries */}
      <section className="recovery-section">
        <div className="section-header">
          <div>
            <h2>Active Recovery Cases</h2>
            <p>Payments currently being processed.</p>
          </div>
        </div>

        <div className="recovery-table-wrapper">
          <table className="recovery-table">
            <thead>
              <tr>
                <th>Payment</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Recovery Action</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>#PAY-1001</td>
                <td>Rahul Sharma</td>
                <td>₹5,000</td>

                <td>
                  <span className="recovery-action retry-action">
                    <RefreshCw size={15} />
                    Wait & Retry
                  </span>
                </td>

                <td>
                  <span className="workflow-status waiting">Waiting</span>
                </td>
              </tr>

              <tr>
                <td>#PAY-1002</td>
                <td>Anjali Nair</td>
                <td>₹8,500</td>

                <td>
                  <span className="recovery-action reminder-action">
                    <Mail size={15} />
                    Send Reminder
                  </span>
                </td>

                <td>
                  <span className="workflow-status progress">In Progress</span>
                </td>
              </tr>

              <tr>
                <td>#PAY-1003</td>
                <td>Vikram Rao</td>
                <td>₹12,000</td>

                <td>
                  <span className="recovery-action review-action">
                    <UserCheck size={15} />
                    Human Review
                  </span>
                </td>

                <td>
                  <span className="workflow-status pending">Pending</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Bottom Section */}
      <div className="recovery-bottom-grid">
        {/* Workflow */}
        <section className="recovery-section">
          <div className="section-header">
            <div>
              <h2>Recovery Workflow</h2>
              <p>How RecoverAI processes a case.</p>
            </div>
          </div>

          <div className="workflow-list">
            <div className="workflow-step completed">
              <div className="workflow-icon">
                <SearchCheck size={18} />
              </div>

              <div>
                <h3>Detect</h3>
                <p>Identify revenue at risk.</p>
              </div>
            </div>

            <div className="workflow-step completed">
              <div className="workflow-icon">
                <Brain size={18} />
              </div>

              <div>
                <h3>Analyze</h3>
                <p>Understand the failure reason.</p>
              </div>
            </div>

            <div className="workflow-step completed">
              <div className="workflow-icon">
                <ShieldCheck size={18} />
              </div>

              <div>
                <h3>Policy Check</h3>
                <p>Validate the recommended action.</p>
              </div>
            </div>

            <div className="workflow-step current">
              <div className="workflow-icon">
                <RefreshCw size={18} />
              </div>

              <div>
                <h3>Execute</h3>
                <p>Perform the recovery action.</p>
              </div>
            </div>

            <div className="workflow-step">
              <div className="workflow-icon">
                <CheckCircle2 size={18} />
              </div>

              <div>
                <h3>Verify</h3>
                <p>Confirm the final payment result.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Rules */}
        <section className="recovery-section">
          <div className="section-header">
            <div>
              <h2>Recovery Rules</h2>
              <p>Current policy boundaries.</p>
            </div>
          </div>

          <div className="rules-list">
            <div className="rule-item">
              <span>Maximum Retry Attempts</span>
              <strong>3</strong>
            </div>

            <div className="rule-item">
              <span>Retry Interval</span>
              <strong>5 Minutes</strong>
            </div>

            <div className="rule-item">
              <span>High Value Threshold</span>
              <strong>₹10,000</strong>
            </div>

            <div className="rule-item">
              <span>High Value Action</span>
              <strong>Human Review</strong>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default RecoveryCenter;
