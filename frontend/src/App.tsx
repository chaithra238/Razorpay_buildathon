import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";

import "./css/layout.css";

import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";

import Dashboard from "./pages/Dashboard";
import AtRiskPayments from "./pages/AtRiskPayments";
import PaymentDetails from "./pages/PaymentDetails";
import RecoveryCenter from "./pages/RecoveryCenter";
import Analytics from "./pages/Analytics";
import AuditTrail from "./pages/AuditTrail";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AUTH_CHANGE_EVENT, isAuthenticated } from "./services/authService";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(isAuthenticated);

  useEffect(() => {
    const updateAuthState = () => setAuthenticated(isAuthenticated());
    window.addEventListener(AUTH_CHANGE_EVENT, updateAuthState);

    return () => window.removeEventListener(AUTH_CHANGE_EVENT, updateAuthState);
  }, []);

  const protectedRoutes = (
    <>
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/at-risk-payments" element={<AtRiskPayments />} />
      <Route path="/payments/:paymentId" element={<PaymentDetails />} />
      <Route path="/recovery" element={<RecoveryCenter />} />
      <Route path="/recovery-center" element={<RecoveryCenter />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/audit" element={<AuditTrail />} />
      <Route path="/audit-trail" element={<AuditTrail />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </>
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="*"
          element={
            authenticated ? (
              <div className="app-shell">
                <Sidebar
                  open={sidebarOpen}
                  onClose={() => setSidebarOpen(false)}
                />
                <main className="main-content">
                  <Header onMenuClick={() => setSidebarOpen(true)} />
                  <div className="page-content">
                    <Routes>{protectedRoutes}</Routes>
                  </div>
                </main>
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
