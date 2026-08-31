import { BrowserRouter, Routes, Route } from "react-router-dom";

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

function App() {
  return (
    <BrowserRouter>
      <Sidebar />

      <main className="main-content">
        <Header />

        <div className="page-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />

            <Route
              path="/at-risk-payments"
              element={<AtRiskPayments />}
            />

            <Route
              path="/payments/:paymentId"
              element={<PaymentDetails />}
            />

            <Route
              path="/recovery"
              element={<RecoveryCenter />}
            />

            <Route
              path="/analytics"
              element={<Analytics />}
            />

            <Route
              path="/audit"
              element={<AuditTrail />}
            />

            <Route
              path="/settings"
              element={<Settings />}
            />
          </Routes>
        </div>
      </main>
    </BrowserRouter>
  );
}

export default App;
