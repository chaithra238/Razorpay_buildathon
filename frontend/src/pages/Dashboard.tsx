import {
  AlertTriangle,
  CircleDollarSign,
  TrendingUp,
  Activity,
} from "lucide-react";

import { payments } from "../data/payments";
import "../css/dashboard.css";

function Dashboard() {
  const atRiskPayments = payments.filter(
    (payment) => payment.status === "at_risk"
  );

  const recoveredPayments = payments.filter(
    (payment) => payment.status === "recovered"
  );

  const totalRevenueAtRisk = atRiskPayments.reduce(
    (total, payment) => total + payment.amount,
    0
  );

  const totalRevenueRecovered = recoveredPayments.reduce(
    (total, payment) => total + payment.amount,
    0
  );

  return (
    <div className="dashboard">
      {/* Page Title */}
      <div className="page-title">
        <div>
          <h1>Dashboard</h1>
          <p>Monitor and recover revenue at risk.</p>
        </div>

        <button className="dashboard-button">
          View Recovery Center
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon risk-icon">
            <AlertTriangle size={22} />
          </div>

          <div>
            <p className="stat-label">Revenue at Risk</p>
            <h2>₹{totalRevenueAtRisk.toLocaleString("en-IN")}</h2>
            <span className="stat-subtext">{atRiskPayments.length} active payments</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon recovered-icon">
            <CircleDollarSign size={22} />
          </div>

          <div>
            <p className="stat-label">Revenue Recovered</p>
            <h2>₹{totalRevenueRecovered.toLocaleString("en-IN")}</h2>
            <span className="stat-subtext">Across {recoveredPayments.length} payments</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon rate-icon">
            <TrendingUp size={22} />
          </div>

          <div>
            <p className="stat-label">Recovery Rate</p>
            <h2>38.8%</h2>
            <span className="stat-subtext">Current recovery performance</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon active-icon">
            <Activity size={22} />
          </div>

          <div>
            <p className="stat-label">Active Cases</p>
            <h2>{atRiskPayments.length}</h2>
            <span className="stat-subtext">Awaiting recovery</span>
          </div>
        </div>
      </div>

      {/* Main Dashboard Section */}
      <div className="dashboard-main">
        {/* At Risk Payments */}
        <section className="dashboard-section payments-preview">
          <div className="section-header">
            <div>
              <h2>At-Risk Payments</h2>
              <p>Payments requiring recovery action</p>
            </div>

            <button className="text-button">View All</button>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Failure Reason</th>
                  <th>AI Recommendation</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>Rahul Sharma</td>
                  <td>₹5,000</td>
                  <td>Bank Timeout</td>
                  <td>
                    <span className="recommendation retry">Retry</span>
                  </td>
                </tr>

                <tr>
                  <td>Anjali Nair</td>
                  <td>₹8,500</td>
                  <td>Payment Abandoned</td>
                  <td>
                    <span className="recommendation reminder">Send Reminder</span>
                  </td>
                </tr>

                <tr>
                  <td>Vikram Rao</td>
                  <td>₹12,000</td>
                  <td>Payment Failed</td>
                  <td>
                    <span className="recommendation review">Human Review</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Recovery Summary */}
        <section className="dashboard-section recovery-summary">
          <div className="section-header">
            <div>
              <h2>Recovery Performance</h2>
              <p>Current batch summary</p>
            </div>
          </div>

          <div className="recovery-summary-content">
            <div className="recovery-row">
              <span>Payments analyzed</span>
              <strong>100</strong>
            </div>

            <div className="recovery-row">
              <span>Recovery attempts</span>
              <strong>32</strong>
            </div>

            <div className="recovery-row">
              <span>Successful recoveries</span>
              <strong>12</strong>
            </div>

            <div className="recovery-row">
              <span>Revenue recovered</span>
              <strong>₹48,500</strong>
            </div>
          </div>
        </section>
      </div>

      {/* Recent Activity */}
      <section className="dashboard-section activity-section">
        <div className="section-header">
          <div>
            <h2>Recent Recovery Activity</h2>
            <p>Latest actions performed by RecoverAI</p>
          </div>
        </div>

        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-dot success"></div>

            <div>
              <h3>Payment recovered successfully</h3>
              <p>₹5,000 payment from Rahul Sharma was recovered.</p>
            </div>

            <span>2 min ago</span>
          </div>

          <div className="activity-item">
            <div className="activity-dot pending"></div>

            <div>
              <h3>AI recommended a reminder</h3>
              <p>Payment from Anjali Nair was marked as abandoned.</p>
            </div>

            <span>8 min ago</span>
          </div>

          <div className="activity-item">
            <div className="activity-dot warning"></div>

            <div>
              <h3>Payment sent for human review</h3>
              <p>High-value payment requires manual approval.</p>
            </div>

            <span>15 min ago</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
