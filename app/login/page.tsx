"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

const demoAccounts = [
  { email: "admin@company.com", password: "admin123", label: "L&D Admin", desc: "Full access — create projects, generate, approve, export" },
  { email: "sarah@company.com", password: "sme123", label: "SME", desc: "Review, comment, approve TOC and artifacts" },
  { email: "james@company.com", password: "instructor123", label: "Instructor", desc: "View content, resolve alerts, view reports" },
  { email: "ananya@company.com", password: "learner123", label: "Learner", desc: "View assigned learning content" },
  { email: "michael@company.com", password: "manager123", label: "Manager", desc: "View and export reports" }
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false
    });

    if (result?.error) {
      setError("Invalid email or password.");
      setLoading(false);
    } else {
      window.location.href = "/projects";
    }
  }

  async function handleDemoLogin(account: typeof demoAccounts[number]) {
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email: account.email,
      password: account.password,
      redirect: false
    });

    if (result?.error) {
      setError("Login failed.");
      setLoading(false);
    } else {
      window.location.href = "/projects";
    }
  }

  return (
    <main className="main">
      <section className="login-container">
        <div className="login-panel">
          <p className="eyebrow">Corporate L&D Platform</p>
          <h1>Sign in</h1>
          <p className="lead">
            Enter your credentials or select a demo account to explore the platform.
          </p>

          <form className="form-panel" onSubmit={handleSubmit}>
            {error ? <p className="field-error">{error}</p> : null}
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@company.com"
                required
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
            </label>
            <button className="button primary" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>

        <div className="demo-accounts">
          <h2>Demo accounts</h2>
          <p className="muted">Click any account to sign in instantly.</p>
          <div className="demo-account-grid">
            {demoAccounts.map((account) => (
              <button
                key={account.email}
                className="demo-account-card"
                onClick={() => handleDemoLogin(account)}
                disabled={loading}
                type="button"
              >
                <strong>{account.label}</strong>
                <small>{account.desc}</small>
                <span className="muted">{account.email}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="login-footer">
          <span>Don&apos;t have an account? </span>
          <Link href="/register">Create account</Link>
          <span style={{ margin: "0 8px" }}>|</span>
          <Link href="/">Back to overview</Link>
        </div>
      </section>
    </main>
  );
}
