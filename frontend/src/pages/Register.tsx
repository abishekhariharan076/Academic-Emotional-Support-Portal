import React, { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { User } from "../types";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
        role: "student",
      });

      const { token, user } = res.data as { token: string; user: User };
      login(user, token);

      if (user.role === "counselor") navigate("/counselor");
      else if (user.role === "admin") navigate("/admin");
      else navigate("/student");
    } catch (err: any) {
      const errorData = err?.response?.data;
      if (errorData?.errors) {
        setMsg(errorData.errors.map((item: any) => item.message || item.msg).join(". "));
      } else {
        setMsg(errorData?.message || "Registration failed. Please check your details.");
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
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-secondary">AESP registration</p>
          <h1 className="mt-3 text-3xl font-extrabold text-text-main">Create your account</h1>
          <p className="mt-2 text-sm leading-6 text-text-body">
            Register with your institutional email to access the student support portal.
          </p>
        </div>

        <form onSubmit={submit} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-text-main">Full name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-text-main outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-text-main">Institutional email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@university.edu"
              className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-text-main outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-text-main">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-text-main outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
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
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-text-muted">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-primary hover:text-primary-hover">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
