import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { api } from "../services/api";
import Button from "../components/Button";
import Input from "../components/Input";
import Card from "../components/Card";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Determine role context from query param (e.g., ?role=counselor)
  const queryParams = new URLSearchParams(location.search);
  const roleParam = queryParams.get("role");
  const isCounselor = roleParam === "counselor";

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      const role = res.data.user?.role;
      if (role === "counselor") navigate("/counselor");
      else if (role === "admin") navigate("/admin");
      else navigate("/student");
    } catch (err) {
      setMsg(err?.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md p-8 shadow-lg">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold text-xl mx-auto mb-4">
              AE
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-text-main">
            {isCounselor ? "Counselor Login" : "Student Login"}
          </h1>
          <p className="mt-2 text-sm text-text-body">
            Welcome back. Please enter your details.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-6">
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
              <Link to="/forgot-password" className="text-xs font-medium text-primary hover:text-primary-hover">
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
