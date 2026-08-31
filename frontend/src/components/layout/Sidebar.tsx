import {
  LayoutDashboard,
  AlertTriangle,
  RefreshCw,
  BarChart3,
  ClipboardList,
  Settings,
} from "lucide-react";

import { NavLink } from "react-router-dom";

import "../../css/sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">R</div>

        <div>
          <h2>RecoverAI</h2>
          <span>Revenue Recovery</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <NavLink to="/" className="nav-item">
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/at-risk-payments" className="nav-item">
          <AlertTriangle size={20} />
          <span>At-Risk Payments</span>
        </NavLink>

        <NavLink to="/recovery" className="nav-item">
          <RefreshCw size={20} />
          <span>Recovery Center</span>
        </NavLink>

        <NavLink to="/analytics" className="nav-item">
          <BarChart3 size={20} />
          <span>Analytics</span>
        </NavLink>

        <NavLink to="/audit" className="nav-item">
          <ClipboardList size={20} />
          <span>Audit Trail</span>
        </NavLink>
      </nav>

      {/* Bottom Navigation */}
      <div className="sidebar-bottom">
        <NavLink to="/settings" className="nav-item">
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>
      </div>
    </aside>
  );
}

export default Sidebar;
