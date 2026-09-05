import { useEffect, useState } from "react";

import {
  TrendingUp,
  CircleDollarSign,
  AlertTriangle,
} from "lucide-react";

import type { Payment } from "../types/payment";
import { getPayments } from "../services/paymentService";

import "../css/analytics.css";

function Analytics() {
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    async function loadPayments() {
      try {
        const data = await getPayments();
        setPayments(data);
      } catch (error) {
        console.error("Failed to load payments:", error);
      }
    }

    loadPayments();
  }, []);

  const atRiskPayments = payments.filter(
    (payment) => payment.status === "at_risk"
  );

  const recoveredPayments = payments.filter(
    (payment) => payment.status === "recovered"
  );

  const totalRevenueAtRisk = atRiskPayments.reduce(
    (total, payment) => total + Number(payment.amount),
    0
  );

  const totalRevenueRecovered = recoveredPayments.reduce(
    (total, payment) => total + Number(payment.amount),
    0
  );

  const recoveryRate =
    payments.length > 0
      ? ((recoveredPayments.length / payments.length) * 100).toFixed(1)
      : "0";

  const failureReasons: Record<string, number> = {};

  atRiskPayments.forEach((payment) => {
    const reason = payment.failureReason || "Other";

    failureReasons[reason] = (failureReasons[reason] || 0) + 1;
  });

  const totalAtRisk = atRiskPayments.length || 1;

  const reasonData = Object.entries(failureReasons).map(
    ([reason, count]) => ({
      reason,
      percentage: Math.round((count / totalAtRisk) * 100),
    })
  );

  return (
    <div className="analytics-page">
      <div className="page-title">
        <div>
          <h1>Analytics</h1>
          <p>Recovery performance and revenue insights.</p>
        </div>
      </div>

      <div className="analytics-stats">
        <div className="analytics-stat-card">
          <div className="analytics-icon risk">
            <AlertTriangle size={22} />
          </div>

          <div>
            <span>Total Revenue at Risk</span>
            <strong>₹{totalRevenueAtRisk.toLocaleString("en-IN")}</strong>
            <small>Across {atRiskPayments.length} payments</small>
          </div>
        </div>

        <div className="analytics-stat-card">
          <div className="analytics-icon recovered">
            <CircleDollarSign size={22} />
          </div>

          <div>
            <span>Total Revenue Recovered</span>
            <strong>₹{totalRevenueRecovered.toLocaleString("en-IN")}</strong>
            <small>Across {recoveredPayments.length} payments</small>
          </div>
        </div>

        <div className="analytics-stat-card">
          <div className="analytics-icon rate">
            <TrendingUp size={22} />
          </div>

          <div>
            <span>Recovery Rate</span>
            <strong>{recoveryRate}%</strong>
            <small>Current performance</small>
          </div>
        </div>
      </div>

      <div className="analytics-grid">
        <section className="analytics-section">
          <div className="section-header">
            <div>
              <h2>Failure Reasons</h2>
              <p>Most common payment issues.</p>
            </div>
          </div>

          <div className="reason-list">
            {reasonData.length === 0 ? (
              <p>No at-risk payment data available.</p>
            ) : (
              reasonData.map((item) => (
                <div className="reason-item" key={item.reason}>
                  <div className="reason-info">
                    <span>{item.reason}</span>
                    <strong>{item.percentage}%</strong>
                  </div>

                  <div className="progress-bar">
                    <div
                      className="progress"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="analytics-section">
          <div className="section-header">
            <div>
              <h2>Recovery Summary</h2>
              <p>Current recovery performance.</p>
            </div>
          </div>

          <div className="reason-list">
            <div className="reason-item">
              <div className="reason-info">
                <span>Total Payments</span>
                <strong>{payments.length}</strong>
              </div>
            </div>

            <div className="reason-item">
              <div className="reason-info">
                <span>At-Risk Payments</span>
                <strong>{atRiskPayments.length}</strong>
              </div>
            </div>

            <div className="reason-item">
              <div className="reason-info">
                <span>Recovered Payments</span>
                <strong>{recoveredPayments.length}</strong>
              </div>
            </div>

            <div className="reason-item">
              <div className="reason-info">
                <span>Recovery Rate</span>
                <strong>{recoveryRate}%</strong>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="analytics-section action-performance">
        <div className="section-header">
          <div>
            <h2>Recovery Action Performance</h2>
            <p>Recovery decisions generated by RecoverAI.</p>
          </div>
        </div>

        <div className="action-table-wrapper">
          <table className="action-table">
            <thead>
              <tr>
                <th>Metric</th>
                <th>Value</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Total Payments Analyzed</td>
                <td>{payments.length}</td>
              </tr>

              <tr>
                <td>Payments Recovered</td>
                <td>{recoveredPayments.length}</td>
              </tr>

              <tr>
                <td>Payments At Risk</td>
                <td>{atRiskPayments.length}</td>
              </tr>

              <tr>
                <td>Revenue Recovered</td>
                <td>₹{totalRevenueRecovered.toLocaleString("en-IN")}</td>
              </tr>

              <tr>
                <td>Recovery Rate</td>
                <td>{recoveryRate}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default Analytics;
