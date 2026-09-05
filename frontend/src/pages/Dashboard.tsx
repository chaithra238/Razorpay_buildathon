import {
  AlertTriangle,
  CircleDollarSign,
  TrendingUp,
  Activity,
} from "lucide-react";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getDashboardStats,
  type DashboardStats,
} from "../services/dashboardService";

import { getPayments } from "../services/paymentService";

import type { Payment } from "../types/payment";
import { getAuditEvents } from "../services/auditApiService";

import type { AuditEvent } from "../types/audit";

import "../css/dashboard.css";

function Dashboard() {
  const [stats, setStats] =
    useState<DashboardStats | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [payments, setPayments] =
    useState<Payment[]>([]);

  const [auditEvents, setAuditEvents] =
    useState<AuditEvent[]>([]);

  useEffect(() => {

    async function fetchDashboardData() {

      try {

        const [
          statsData,
          paymentsData,
          auditData,
        ] = await Promise.all([
          getDashboardStats(),
          getPayments(),
          getAuditEvents(),
        ]);

        setStats(statsData);

        setPayments(paymentsData);

        setAuditEvents(auditData);

      } catch (error) {

        console.error(
          "Failed to load dashboard data:",
          error
        );

      } finally {

        setLoading(false);

      }

    }

    fetchDashboardData();

  }, []);

  const atRiskPayments = payments.filter(
    (payment) =>
      payment.status === "at_risk"
  );

  const previewPayments =
    atRiskPayments.slice(0, 3);

  const recentActivities =
    auditEvents.slice(0, 5);

  if (loading) {
    return (
      <div className="dashboard">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="dashboard">
        <p>Unable to load dashboard data.</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Page Title */}
      <div className="page-title">
        <div>
          <h1>Dashboard</h1>
          <p>Monitor and recover revenue at risk.</p>
        </div>

        <Link className="dashboard-button" to="/recovery-center">
          View Recovery Center
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon risk-icon">
            <AlertTriangle size={22} />
          </div>

          <div>
              <p className="stat-label">Payments at Risk</p>
              <h2>{stats.atRiskPayments}</h2>
              <span className="stat-subtext">Active payments requiring recovery</span>
            </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon recovered-icon">
            <CircleDollarSign size={22} />
          </div>

          <div>
            <p className="stat-label">Revenue Recovered</p>
            <h2>₹{stats.totalRecoveredAmount.toLocaleString("en-IN")}</h2>
            <span className="stat-subtext">Across {stats.recoveredPayments} payments</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon rate-icon">
            <TrendingUp size={22} />
          </div>

          <div>
            <p className="stat-label">Recovery Rate</p>
            <h2>{stats.recoveryRate}%</h2>
            <span className="stat-subtext">Current recovery performance</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon active-icon">
            <Activity size={22} />
          </div>

          <div>
            <p className="stat-label">Active Cases</p>
            <h2>{stats.atRiskPayments}</h2>
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

            <Link className="text-button" to="/at-risk-payments">View All</Link>
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

  {previewPayments.length > 0 ? (

    previewPayments.map((payment) => (

      <tr key={payment.id}>

        <td>
          {payment.customer}
        </td>

        <td>
          ₹{payment.amount.toLocaleString("en-IN")}
        </td>

        <td>
          {payment.failureReason}
        </td>

        <td>

          <span className="recommendation">

            {payment.failureReason ===
            "Bank Timeout"
              ? "Retry"
              : payment.failureReason ===
                "Payment Abandoned"
              ? "Send Reminder"
              : "Human Review"}

          </span>

        </td>

      </tr>

    ))

  ) : (

    <tr>

      <td
        colSpan={4}
        style={{
          textAlign: "center",
        }}
      >

        No at-risk payments found.

      </td>

    </tr>

  )}

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
              <strong>{stats.paymentsAnalyzed}</strong>
            </div>

            <div className="recovery-row">
              <span>Recovery attempts</span>
              <strong>{stats.recoveryAttempts}</strong>
            </div>

            <div className="recovery-row">
              <span>Successful recoveries</span>
              <strong>{stats.successfulRecoveries}</strong>
            </div>

            <div className="recovery-row">
              <span>Revenue recovered</span>
              <strong>
                ₹{stats.totalRecoveredAmount.toLocaleString("en-IN")}
              </strong>
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

  {recentActivities.length > 0 ? (

    recentActivities.map((activity) => (

      <div
        className="activity-item"
        key={activity.id}
      >

        <div
          className={`activity-dot ${
            activity.type === "success"
              ? "success"
              : activity.type === "review"
              ? "warning"
              : "pending"
          }`}
        ></div>

        <div>

          <h3>
            {activity.event}
          </h3>

          <p>
            {activity.description}
          </p>

        </div>

        <span>
          {activity.timestamp}
        </span>

      </div>

    ))

  ) : (

    <p>
      No recent recovery activity.
    </p>

  )}

        </div>
      </section>
    </div>
  );
}

export default Dashboard;
