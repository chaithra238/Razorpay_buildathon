import {
  TrendingUp,
  CircleDollarSign,
  AlertTriangle,
} from "lucide-react";

import "../css/analytics.css";

function Analytics() {
  return (
    <div className="analytics-page">
      {/* Page Title */}
      <div className="page-title">
        <div>
          <h1>Analytics</h1>
          <p>Recovery performance and revenue insights.</p>
        </div>
      </div>

      {/* Top Statistics */}
      <div className="analytics-stats">
        <div className="analytics-stat-card">
          <div className="analytics-icon risk">
            <AlertTriangle size={22} />
          </div>

          <div>
            <span>Total Revenue at Risk</span>
            <strong>₹1,25,000</strong>
            <small>Across 24 payments</small>
          </div>
        </div>

        <div className="analytics-stat-card">
          <div className="analytics-icon recovered">
            <CircleDollarSign size={22} />
          </div>

          <div>
            <span>Total Revenue Recovered</span>
            <strong>₹48,500</strong>
            <small>Across 12 payments</small>
          </div>
        </div>

        <div className="analytics-stat-card">
          <div className="analytics-icon rate">
            <TrendingUp size={22} />
          </div>

          <div>
            <span>Recovery Rate</span>
            <strong>38.8%</strong>
            <small>Current performance</small>
          </div>
        </div>
      </div>

      {/* Main Analytics Grid */}
      <div className="analytics-grid">
        {/* Recovery Performance */}
        <section className="analytics-section">
          <div className="section-header">
            <div>
              <h2>Recovery Performance</h2>
              <p>Recovered revenue over time.</p>
            </div>
          </div>

          <div className="bar-chart">
            <div className="chart-column">
              <div className="bar-wrapper">
                <div className="bar bar-one"></div>
              </div>

              <span>Mon</span>
            </div>

            <div className="chart-column">
              <div className="bar-wrapper">
                <div className="bar bar-two"></div>
              </div>

              <span>Tue</span>
            </div>

            <div className="chart-column">
              <div className="bar-wrapper">
                <div className="bar bar-three"></div>
              </div>

              <span>Wed</span>
            </div>

            <div className="chart-column">
              <div className="bar-wrapper">
                <div className="bar bar-four"></div>
              </div>

              <span>Thu</span>
            </div>

            <div className="chart-column">
              <div className="bar-wrapper">
                <div className="bar bar-five"></div>
              </div>

              <span>Fri</span>
            </div>
          </div>
        </section>

        {/* Failure Reasons */}
        <section className="analytics-section">
          <div className="section-header">
            <div>
              <h2>Failure Reasons</h2>
              <p>Most common payment issues.</p>
            </div>
          </div>

          <div className="reason-list">
            <div className="reason-item">
              <div className="reason-info">
                <span>Bank Timeout</span>
                <strong>40%</strong>
              </div>

              <div className="progress-bar">
                <div className="progress timeout-progress"></div>
              </div>
            </div>

            <div className="reason-item">
              <div className="reason-info">
                <span>Payment Abandoned</span>
                <strong>30%</strong>
              </div>

              <div className="progress-bar">
                <div className="progress abandoned-progress"></div>
              </div>
            </div>

            <div className="reason-item">
              <div className="reason-info">
                <span>Gateway Error</span>
                <strong>20%</strong>
              </div>

              <div className="progress-bar">
                <div className="progress gateway-progress"></div>
              </div>
            </div>

            <div className="reason-item">
              <div className="reason-info">
                <span>Other</span>
                <strong>10%</strong>
              </div>

              <div className="progress-bar">
                <div className="progress other-progress"></div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Recovery Actions */}
      <section className="analytics-section action-performance">
        <div className="section-header">
          <div>
            <h2>Recovery Action Performance</h2>
            <p>Effectiveness of each recovery strategy.</p>
          </div>
        </div>

        <div className="action-table-wrapper">
          <table className="action-table">
            <thead>
              <tr>
                <th>Recovery Action</th>
                <th>Attempts</th>
                <th>Successful</th>
                <th>Success Rate</th>
                <th>Revenue Recovered</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Wait & Retry</td>
                <td>12</td>
                <td>7</td>
                <td>58%</td>
                <td>₹22,000</td>
              </tr>

              <tr>
                <td>Send Reminder</td>
                <td>10</td>
                <td>4</td>
                <td>40%</td>
                <td>₹15,500</td>
              </tr>

              <tr>
                <td>Payment Link</td>
                <td>6</td>
                <td>1</td>
                <td>17%</td>
                <td>₹6,000</td>
              </tr>

              <tr>
                <td>Human Review</td>
                <td>4</td>
                <td>0</td>
                <td>Pending</td>
                <td>₹0</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default Analytics;
