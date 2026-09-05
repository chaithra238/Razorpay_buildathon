import { Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { signIn } from "../services/authService";
import "../css/auth.css";

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    signIn();
    navigate("/", { replace: true });
  }

  return (
    <main className="auth-page">
      <section className="auth-brand-panel">
        <img className="auth-logo" src="/recoverai-mark.svg" alt="RecoverAI logo" />
        <span className="auth-kicker">RecoverAI</span>
        <h1>Recover revenue with clarity.</h1>
        <p>One calm workspace for failed payments, intelligent decisions, and measurable recovery.</p>
        <div className="auth-proof"><ShieldCheck size={18} /> Policy-aware automation</div>
      </section>

      <section className="auth-card">
        <div className="auth-card-header">
          <span className="mobile-brand"><img src="/recoverai-mark.svg" alt="RecoverAI logo" /> RecoverAI</span>
          <h2>Welcome back</h2>
          <p>Sign in to access your merchant dashboard.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Email address
            <span className="input-shell"><Mail size={17} /><input type="email" placeholder="you@business.com" required /></span>
          </label>

          <label>
            Password
            <span className="input-shell"><LockKeyhole size={17} /><input type={showPassword ? "text" : "password"} placeholder="Enter your password" required minLength={8} /><button type="button" className="input-action" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span>
          </label>

          <div className="auth-options"><label className="checkbox-label"><input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} /> Remember me</label><button type="button" className="text-link">Forgot password?</button></div>
          <p className="auth-note">Demo mode: use any valid email and a password with at least 8 characters.</p>
          <button className="primary-button" type="submit">Sign in</button>
        </form>

        <p className="auth-footer">Don't have an account? <Link to="/register">Create an account</Link></p>
      </section>
    </main>
  );
}

export default Login;
