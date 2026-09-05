import {
  LayoutDashboard,
  AlertTriangle,
  RefreshCw,
  BarChart3,
  ClipboardList,
  Settings,
  LogOut,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { signOut } from "../../services/authService";

import "../../css/sidebar.css";

type SidebarProps = {
  open: boolean;
  onClose: () => void;
};

function Sidebar({ open, onClose }: SidebarProps) {
  const navigate = useNavigate();

  function handleLogout() {
    signOut();
    onClose();
    navigate("/login", { replace: true });
  }

  return (
    <>
      {open && <button className="sidebar-overlay" onClick={onClose} aria-label="Close navigation" />}
      <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <img className="logo-icon" src="/recoverai-mark.svg" alt="RecoverAI logo" />

        <div>
          <h2>RecoverAI</h2>
          <span>AI-powered recovery</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav" onClick={onClose}>
        <NavLink to="/" className="nav-item">
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/at-risk-payments" className="nav-item">
          <AlertTriangle size={20} />
          <span>At-Risk Payments</span>
        </NavLink>

        <NavLink to="/recovery-center" className="nav-item">
          <RefreshCw size={20} />
          <span>Recovery Center</span>
        </NavLink>

        <NavLink to="/analytics" className="nav-item">
          <BarChart3 size={20} />
          <span>Analytics</span>
        </NavLink>

        <NavLink to="/audit-trail" className="nav-item">
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
        <button className="nav-item nav-button" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Log out</span>
        </button>
      </div>
      </aside>
    </>
  );
}

export default Sidebar;
