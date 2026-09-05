import { useEffect, useState } from "react";

import {
  RefreshCw,
  Mail,
  UserCheck,
} from "lucide-react";

import { getPayments } from "../services/paymentService";
import type { Payment } from "../types/payment";
import type { RecoveryDecision } from "../services/recoveryEngine";

import {
  analyzeRecovery,
  executeRecovery,
} from "../services/recoveryService";
import type { PolicyResult } from "../services/policyEngine";

import "../css/recovery.css";

function RecoveryCenter() {
  const [selectedPaymentId, setSelectedPaymentId] = useState("");

  const [apiPayments, setApiPayments] = useState<Payment[]>([]);

  const [loadingPayments, setLoadingPayments] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(
    null
  );

  const [decision, setDecision] = useState<RecoveryDecision | null>(null);

  const [policyResult, setPolicyResult] = useState<PolicyResult | null>(null);

  const [executionStatus, setExecutionStatus] = useState<string | null>(null);

  const [executing, setExecuting] = useState(false);

  const [recoveryResult, setRecoveryResult] = useState<{
    success: boolean;
    message: string;
    recoveredAmount: number;
  } | null>(null);

  useEffect(() => {

    const loadPayments = async () => {

      try {

        const data = await getPayments();

        setApiPayments(data);

      } catch (error) {

        console.error("Failed to load payments:", error);

        setLoadingError(
          "Unable to contact backend API. Using mock data. Is the Django server running?"
        );

      } finally {

        setLoadingPayments(false);

      }

    };

    loadPayments();

  }, []);

  const handleAnalyzeRecovery = async () => {

    setExecutionStatus(null);
    setRecoveryResult(null);

    const payment = apiPayments.find((item) => item.id === selectedPaymentId);

    if (!payment) {
      return;
    }

    try {

      const response = await analyzeRecovery(payment.id);

      setSelectedPayment(response.payment);

      setDecision(response.decision);

      setPolicyResult(response.policy);

    } catch (error) {

      console.error("Recovery analysis failed:", error);

    }

  };

  const handleExecuteRecovery = async () => {

    if (!selectedPayment) {
      return;
    }

    try {

      setExecuting(true);

      const response = await executeRecovery(selectedPayment.id);

      alert(response.message);

      if (response.success) {

        setSelectedPayment({
          ...selectedPayment,

          status: "recovered",

          recovered: true,
        });

      }

    } catch (error) {

      console.error("Recovery execution failed:", error);

      alert("Failed to execute recovery.");

    } finally {

      setExecuting(false);

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

      {loadingError && <div className="error-banner">{loadingError}</div>}

      <div className="recovery-selector">
        <div>
          <label>Select At-Risk Payment</label>

          <select
            value={selectedPaymentId}
            onChange={(event) => setSelectedPaymentId(event.target.value)}
            disabled={loadingPayments}
          >
            <option value="">
              {loadingPayments ? "Loading payments..." : "Select a payment"}
            </option>

            {apiPayments
              .filter((payment) => payment.status === "at_risk")
              .map((payment) => (
                <option key={payment.id} value={payment.id}>
                  {payment.id} — {payment.customer} — ₹
                  {payment.amount.toLocaleString("en-IN")}
                </option>
              ))}
          </select>
        </div>

        <button onClick={handleAnalyzeRecovery} disabled={!selectedPaymentId || loadingPayments}>
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
              disabled={executing}
            >
              {executing
                ? "Executing..."
                : policyResult.allowed
                ? "Execute Recovery Action"
                : "Request Human Approval"}
            </button>

            {executionStatus && (
              <div className="execution-status">{executionStatus}</div>
            )}

            {recoveryResult && (
              <div
                className={
                  recoveryResult.success ? "recovery-success" : "recovery-pending"
                }
              >
                <h3>
                  {recoveryResult.success
                    ? "Recovery Successful"
                    : "Recovery Pending"}
                </h3>

                <p>{recoveryResult.message}</p>

                {recoveryResult.success && (
                  <strong>
                    ₹{recoveryResult.recoveredAmount.toLocaleString("en-IN")} Recovered
                  </strong>
                )}
              </div>
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
