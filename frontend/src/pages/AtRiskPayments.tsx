import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import type { Payment } from "../types/payment";
import { getPayments } from "../services/paymentService";
import "../css/payments.css";
import "../css/at-risk-payments.css";

function AtRiskPayments() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");

  const [riskFilter, setRiskFilter] = useState("all");

  const [statusFilter, setStatusFilter] = useState("all");
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    async function loadPayments() {
      try {
        setPayments(await getPayments());
      } catch (error) {
        console.error("Failed to load payments:", error);
      }
    }

    loadPayments();
  }, []);

  const atRiskPayments: Payment[] = payments.filter(
    (payment) => payment.status === "at_risk"
  );

  const filteredPayments = atRiskPayments.filter((payment) => {
    const matchesSearch =
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customer.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRisk =
      riskFilter === "all" || payment.riskLevel === riskFilter;

    const matchesStatus =
      statusFilter === "all" || payment.recoveryStatus === statusFilter;

    return matchesSearch && matchesRisk && matchesStatus;
  });

  const revenueAtRisk = atRiskPayments.reduce(
    (total, payment) => total + Number(payment.amount),
    0
  );

  const highPriority = atRiskPayments.filter(
    (payment) => payment.riskLevel === "high"
  ).length;

  return (
    <div className="payments-page">
      {/* Page Title */}
      <div className="page-title">
        <div>
          <h1>At-Risk Payments</h1>
          <p>Payments requiring recovery action.</p>
        </div>
      </div>

      {/* Summary */}
      <div className="payment-summary">
        <div className="summary-item">
          <span>Total At Risk</span>
          <strong>{atRiskPayments.length}</strong>
        </div>

        <div className="summary-item">
          <span>Revenue at Risk</span>
          <strong>₹{revenueAtRisk.toLocaleString("en-IN")}</strong>
        </div>

        <div className="summary-item">
          <span>High Priority</span>
          <strong>{highPriority}</strong>
        </div>
      </div>

      <div className="payment-controls">
        <input
          type="text"
          placeholder="Search by Payment ID or Customer"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />

        <select
          value={riskFilter}
          onChange={(event) => setRiskFilter(event.target.value)}
        >
          <option value="all">All Risk Levels</option>
          <option value="high">High Risk</option>
          <option value="medium">Medium Risk</option>
          <option value="low">Low Risk</option>
        </select>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="waiting">Waiting</option>
          <option value="in_progress">In Progress</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* Table */}
      <div className="payments-table-container">
        <table className="payments-table">
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Payment Method</th>
              <th>Failure Reason</th>
              <th>Risk</th>
              <th>AI Recommendation</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredPayments.length > 0 ? (
              filteredPayments.map((payment) => (
                <tr
                  key={payment.id}
                  className="payment-row"
                  onClick={() => navigate(`/payments/${payment.id}`)}
                >
                  <td>{payment.id}</td>

                  <td>{payment.customer}</td>

                  <td>₹{payment.amount.toLocaleString("en-IN")}</td>

                  <td>{payment.paymentMethod}</td>

                  <td>{payment.failureReason}</td>

                  <td>
                    <span className={`risk-badge ${payment.riskLevel}`}>
                      {payment.riskLevel}
                    </span>
                  </td>

                  <td>{payment.recommendedAction}</td>

                  <td>
                    <span className={`status-badge ${payment.recoveryStatus ?? "pending"}`}>
                      {(payment.recoveryStatus ?? "pending").replace("_", " ")}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="no-payments">
                  No payments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AtRiskPayments;
