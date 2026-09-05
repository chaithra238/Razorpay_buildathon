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
  analyzePayment,
  approveRecovery,
  completeRecovery,
  getRecoveryCase,
  type AnalyzePaymentResponse,
  executeRecovery,
} from "../services/recoveryService";
import type { PolicyResult } from "../services/policyEngine";

import "../css/recovery.css";

function RecoveryCenter() {
  const [selectedPaymentId, setSelectedPaymentId] = useState("");

  const [analysisResult, setAnalysisResult] =
    useState<AnalyzePaymentResponse | null>(null);

  const [analyzing, setAnalyzing] = useState(false);

  const [error, setError] = useState("");

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

  const [completing, setCompleting] = useState(false);

  const [approving, setApproving] = useState(false);

  const [recoveryMessage, setRecoveryMessage] = useState("");

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

  async function handleAnalyzePayment(paymentId: string) {
    try {
      setAnalyzing(true);
      setError("");
      setSelectedPaymentId(paymentId);

      const result = await analyzePayment(paymentId);

      setAnalysisResult(result);
    } catch (analysisError) {
      console.error("AI analysis failed:", analysisError);
      setError("Unable to analyze this payment. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  }

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

  const handleLegacyExecuteRecovery = async () => {

    if (!selectedPayment) {
      return;
    }

    try {

      setExecuting(true);

      const response = await executeRecovery(selectedPayment.id);

      setExecutionStatus(response.message);

    } catch (error) {

      console.error("Recovery execution failed:", error);

      setExecutionStatus("Failed to execute recovery.");

    } finally {

      setExecuting(false);

    }

  };

  async function handleExecuteRecovery() {
    if (!analysisResult) return;

    try {
      setExecuting(true);
      setRecoveryMessage("");

      const result = await executeRecovery(analysisResult.payment_id);

      setRecoveryMessage(result.message);
      setAnalysisResult({
        ...analysisResult,
        recovery_status: result.recovery_status,
      });
    } catch (error) {
      console.error("Recovery execution failed:", error);
      setRecoveryMessage("Unable to execute recovery action.");
    } finally {
      setExecuting(false);
    }
  }

  async function loadRecoveryCase(paymentId: string) {
    try {
      const result = await getRecoveryCase(paymentId);

      setSelectedPaymentId(paymentId);
      setError("");
      setAnalysisResult({
        message: "Stored recovery analysis loaded",
        payment_id: result.payment_id,
        customer: result.customer,
        created: false,
        risk_analysis: {
          risk_score: result.risk_score,
          risk_level: result.risk_level,
          reasons: result.diagnosis
            .replace("Risk factors: ", "")
            .split(", "),
        },
        recovery_decision: {
          recommended_action: result.recommended_action,
          confidence: Number(result.confidence),
          requires_human_approval: result.requires_human_approval,
          reason: result.policy_reason,
        },
        recovery_status: result.recovery_status,
      });
    } catch (error) {
      console.log("No existing recovery case found.", error);
    }
  }

  async function handleCompleteRecovery() {
    if (!analysisResult) return;

    try {
      setCompleting(true);
      setRecoveryMessage("");

      const result = await completeRecovery(analysisResult.payment_id);

      setRecoveryMessage(result.message);
      setAnalysisResult({
        ...analysisResult,
        recovery_status: result.recovery_status,
      });
    } catch (error) {
      console.error("Complete recovery failed:", error);
      setRecoveryMessage("Unable to complete recovery.");
    } finally {
      setCompleting(false);
    }
  }

  async function handleApproveRecovery() {
    if (!analysisResult) return;

    try {
      setApproving(true);
      setRecoveryMessage("");

      const result = await approveRecovery(analysisResult.payment_id);

      setRecoveryMessage(result.message);
      setAnalysisResult({
        ...analysisResult,
        recovery_status: result.recovery_status,
      });
    } catch (error) {
      console.error("Recovery approval failed:", error);
      setRecoveryMessage("Unable to approve recovery.");
    } finally {
      setApproving(false);
    }
  }

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

          <div className="result-row diagnosis-row">
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
              onClick={handleLegacyExecuteRecovery}
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
                <th>AI Analysis</th>
              </tr>
            </thead>

            <tbody>
              {apiPayments.filter((payment) => payment.status === "at_risk").map((payment) => {
                const isReview = payment.failureReason === "Gateway Error";
                const isReminder = payment.failureReason === "Payment Abandoned";

                return (
                  <tr key={payment.id}>
                    <td>#{payment.id}</td>
                    <td>{payment.customer}</td>
                    <td>₹{payment.amount.toLocaleString("en-IN")}</td>

                    <td>
                      <span className={`recovery-action ${isReview ? "review-action" : isReminder ? "reminder-action" : "retry-action"}`}>
                        {isReview ? <UserCheck size={15} /> : isReminder ? <Mail size={15} /> : <RefreshCw size={15} />}
                        {isReview ? "Human Review" : isReminder ? "Send Reminder" : "Wait & Retry"}
                      </span>
                    </td>

                    <td>
                      <span className={`workflow-status ${payment.recoveryStatus === "in_progress" ? "progress" : payment.recoveryStatus === "pending" ? "pending" : "waiting"}`}>
                        {(payment.recoveryStatus ?? "waiting").replace("_", " ")}
                      </span>
                    </td>

                    <td>
                      <button
                        onClick={() => handleAnalyzePayment(payment.id)}
                        disabled={analyzing}
                        className="analyze-button"
                      >
                        {analyzing && selectedPaymentId === payment.id ? "Analyzing..." : "Analyze with AI"}
                      </button>
                      <button
                        onClick={() => loadRecoveryCase(payment.id)}
                        className="view-analysis-button"
                      >
                        View Saved Analysis
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {error && <div className="ai-error">{error}</div>}

      {analysisResult && (
        <section className="ai-analysis-panel">
          <div className="ai-analysis-header">
            <div>
              <h2>AI Recovery Analysis</h2>
              <p>
                Intelligent analysis for payment <strong>{analysisResult.payment_id}</strong>
              </p>
            </div>

            <span className={`risk-badge ${analysisResult.risk_analysis.risk_level}`}>
              {analysisResult.risk_analysis.risk_level.toUpperCase()} RISK
            </span>
          </div>

          <div className="ai-metrics">
            <div className="ai-metric-card">
              <span>Risk Score</span>
              <strong>{analysisResult.risk_analysis.risk_score}/100</strong>
            </div>

            <div className="ai-metric-card">
              <span>AI Confidence</span>
              <strong>{analysisResult.recovery_decision.confidence}%</strong>
            </div>

            <div className="ai-metric-card">
              <span>Recommended Action</span>
              <strong>{analysisResult.recovery_decision.recommended_action}</strong>
            </div>
          </div>

          <div className="ai-explanation">
            <h3>Why is this payment at risk?</h3>
            <ul>
              {analysisResult.risk_analysis.reasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </div>

          <div className="ai-recommendation">
            <h3>AI Recovery Recommendation</h3>
            <p>{analysisResult.recovery_decision.reason}</p>
          </div>

          <div className="human-approval">
            <strong>Human Approval:</strong>{" "}
            {analysisResult.recovery_decision.requires_human_approval ? "Required" : "Not Required"}
          </div>

          <div className="recovery-action-section legacy-recovery-action">
            <h3>Recovery Action</h3>
            <p>
              Current Status: <strong>{analysisResult.recovery_status}</strong>
            </p>

            {analysisResult.recovery_decision.requires_human_approval ? (
              <>
                {analysisResult.recovery_status === "human_review" && (
                  <div className="approval-required">
                    <p>⚠️ AI recommends human approval before proceeding.</p>
                    <button
                      className="approve-recovery-button"
                      onClick={handleApproveRecovery}
                      disabled={approving}
                    >
                      {approving ? "Approving..." : "Approve Recovery"}
                    </button>
                  </div>
                )}

                {analysisResult.recovery_status === "in_progress" && (
                  <button
                    className="complete-recovery-button"
                    onClick={handleCompleteRecovery}
                    disabled={completing}
                  >
                    {completing
                      ? "Completing Recovery..."
                      : "Complete Recovery"}
                  </button>
                )}

                {analysisResult.recovery_status === "recovered" && (
                  <div className="recovery-success">
                    ✅ Payment successfully recovered!
                  </div>
                )}
              </>
            ) : (
              <>
                {analysisResult.recovery_status === "waiting" && (
                  <button
                    className="execute-recovery-button"
                    onClick={handleExecuteRecovery}
                    disabled={executing}
                  >
                    {executing
                      ? "Executing Recovery..."
                      : "Approve & Execute Recovery"}
                  </button>
                )}

                {analysisResult.recovery_status === "in_progress" && (
                  <button
                    className="complete-recovery-button"
                    onClick={handleCompleteRecovery}
                    disabled={completing}
                  >
                    {completing
                      ? "Completing Recovery..."
                      : "Complete Recovery"}
                  </button>
                )}

                {analysisResult.recovery_status === "recovered" && (
                  <div className="recovery-success">
                    ✅ Payment successfully recovered!
                  </div>
                )}
              </>
            )}

            {recoveryMessage && (
              <p className="recovery-message">{recoveryMessage}</p>
            )}
          </div>
        </section>
      )}

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
