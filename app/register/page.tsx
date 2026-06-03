"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

const roles = [
  { value: "ld_admin", label: "L&D Admin" },
  { value: "sme", label: "Subject Matter Expert" },
  { value: "instructor", label: "Instructor" },
  { value: "learner", label: "Learner" },
  { value: "manager", label: "Manager" },
];

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("learner");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Registration failed.");
      setLoading(false);
      return;
    }

    // Auto sign-in after registration
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Account created but sign-in failed. Please sign in manually.");
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
          <h1>Create account</h1>
          <p className="lead">
            Register to start building AI-powered training programs.
          </p>

          <form className="form-panel" onSubmit={handleSubmit}>
            {error ? <p className="field-error">{error}</p> : null}
            <label>
              Full name
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Smith"
                required
              />
            </label>
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@company.com"
                required
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                minLength={6}
                required
              />
            </label>
            <label>
              Role
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="form-select"
              >
                {roles.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </label>
            <button className="button primary" type="submit" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>
        </div>

        <div className="login-footer">
          <span>Already have an account? </span>
          <Link href="/login">Sign in</Link>
        </div>
      </section>
    </main>
  );
}
