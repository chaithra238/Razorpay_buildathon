import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { signIn } from "../services/authService";
import "../css/auth.css";

function Register() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmation) {
      setError("Passwords do not match.");
      return;
    }
    signIn(businessName);
    navigate("/", { replace: true });
  }

  return (
    <main className="auth-page auth-page-register">
      <section className="auth-brand-panel"><img className="auth-logo" src="/recoverai-mark.svg" alt="RecoverAI logo" /><span className="auth-kicker">RecoverAI</span><h1>Build a healthier recovery loop.</h1><p>Turn payment failures into thoughtful next steps for your customers and your team.</p></section>
      <section className="auth-card auth-card-wide">
        <div className="auth-card-header"><span className="mobile-brand"><img src="/recoverai-mark.svg" alt="RecoverAI logo" /> RecoverAI</span><h2>Create merchant account</h2><p>Start managing revenue at risk with RecoverAI.</p></div>
        <form onSubmit={handleSubmit} className="auth-form register-form">
          <div className="form-section"><span className="form-section-title">Business information</span><label>Business name<input type="text" value={businessName} onChange={(event) => setBusinessName(event.target.value)} placeholder="Acme Commerce" required /></label><label>Business email<input type="email" placeholder="finance@acme.com" required /></label></div>
          <div className="form-section"><span className="form-section-title">Merchant information</span><label>Full name<input type="text" placeholder="Your name" required /></label><label>Email address<input type="email" placeholder="you@business.com" required /></label><label>Phone number<input type="tel" placeholder="+91 98765 43210" required /></label></div>
          <div className="form-section"><span className="form-section-title">Account security</span><label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} placeholder="At least 8 characters" /></label><label>Confirm password<input type="password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} required placeholder="Repeat your password" /></label><label>GSTIN <span className="optional">Optional</span><input type="text" placeholder="22AAAAA0000A1Z5" /></label></div>
          <label className="checkbox-label"><input type="checkbox" required /> I agree to the Terms and Privacy Policy.</label>
          {error && <p className="form-error">{error}</p>}
          <button className="primary-button" type="submit">Create account</button>
        </form>
        <p className="auth-footer">Already have an account? <Link to="/login">Sign in</Link></p>
      </section>
    </main>
  );
}

export default Register;
