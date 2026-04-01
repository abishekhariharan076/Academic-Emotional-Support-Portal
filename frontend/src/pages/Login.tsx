import React, { useState, FormEvent } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import Input from "../components/Input";
import Card from "../components/Card";
import Logo from "../components/Logo";
import { User } from "../types";

export default function Login() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID_HERE";
  const hasGoogleClientId =
    googleClientId !== "YOUR_GOOGLE_CLIENT_ID_HERE" && googleClientId.trim().length > 0;
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Determine role context from query param (e.g., ?role=counselor)
  const queryParams = new URLSearchParams(location.search);
  const roleParam = queryParams.get("role");
  const isCounselor = roleParam === "counselor";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const res = await api.post("/auth/login", { email, password });
      const { token, user } = res.data as { token: string; user: User };
      
      login(user, token);

      const role = user?.role;
      if (role === "counselor") navigate("/counselor");
      else if (role === "admin") navigate("/admin");
      else navigate("/student");
    } catch (err: any) {
      console.error("Full Login Error:", err);
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
    <div className="min-h-screen bg-canvas flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md p-8 shadow-lg">
        <div className="text-center mb-8">
          <Link to="/" className="block mb-10 transform hover:scale-[1.02] transition-transform">
            <Logo type="full" />
          </Link>
          <h1 className="text-2xl font-bold text-text-main">
            {isCounselor ? "Counselor Login" : "Student Login"}
          </h1>
          <p className="mt-2 text-sm text-text-body">
            Welcome back. Please enter your details.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@university.edu"
            required
            autoComplete="email"
          />

          <div>
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
            <div className="flex justify-end mt-1">
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:text-primary-hover"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          {msg && (
            <div className="p-3 rounded-lg bg-status-error/10 text-status-error text-sm font-medium text-center">
              {msg}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-canvas px-2 text-text-muted">Or continue with</span>
            </div>
          </div>

          {hasGoogleClientId ? (
            <div className="rounded-lg bg-secondary/10 p-3 text-sm font-medium text-text-body">
              Google sign-in is configured, but it is temporarily disabled here while we stabilize the login page. Please use email and password for now.
            </div>
          ) : (
            <div className="rounded-lg bg-secondary/10 p-3 text-sm font-medium text-text-body">
              Google sign-in is not configured yet. Add `VITE_GOOGLE_CLIENT_ID` in the frontend env file to enable it.
            </div>
          )}

          <p className="text-center text-sm text-text-muted">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold text-primary hover:text-primary-hover transition-colors">
              create an account
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
}
