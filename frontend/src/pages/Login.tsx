import React, { FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { User } from "../types";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const isCounselor = queryParams.get("role") === "counselor";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const res = await api.post("/auth/login", { email, password });
      const { token, user } = res.data as { token: string; user: User };

      login(user, token);

      if (user.role === "counselor") navigate("/counselor");
      else if (user.role === "admin") navigate("/admin");
      else navigate("/student");
    } catch (err: any) {
      if (!err.response) {
        setMsg("Server is unreachable. Please ensure the backend is running.");
      } else {
        setMsg(err?.response?.data?.message || "Login failed. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas px-4 py-12">
      <div className="mx-auto max-w-md rounded-[28px] border border-white/60 bg-white/92 p-8 shadow-soft">
        <Link to="/" className="inline-flex text-sm font-semibold text-primary hover:text-primary-hover">
          Back to home
        </Link>

        <div className="mt-6">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-secondary">AESP login</p>
          <h1 className="mt-3 text-3xl font-extrabold text-text-main">
            {isCounselor ? "Counselor login" : "Student login"}
          </h1>
          <p className="mt-2 text-sm leading-6 text-text-body">
            Sign in with your email and password. Google sign-in is temporarily disabled while we stabilize the auth flow.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-text-main">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@university.edu"
              className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-text-main outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
              autoComplete="email"
              required
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-sm font-semibold text-text-main">Password</label>
              <Link to="/forgot-password" className="text-sm font-medium text-primary hover:text-primary-hover">
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-text-main outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
              autoComplete="current-password"
              required
            />
          </div>

          {msg && (
            <div className="rounded-2xl bg-status-error/10 px-4 py-3 text-sm font-medium text-status-error">
              {msg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-text-muted">
          Don't have an account?{" "}
          <Link to="/register" className="font-semibold text-primary hover:text-primary-hover">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
