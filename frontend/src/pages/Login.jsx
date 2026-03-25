import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { api } from "../services/api";
import Button from "../components/Button";
import Input from "../components/Input";
import Card from "../components/Card";
import Logo from "../components/Logo";
import { GoogleLogin } from "@react-oauth/google";

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
      sessionStorage.setItem("token", res.data.token);
      sessionStorage.setItem("user", JSON.stringify(res.data.user));

      const role = res.data.user?.role;
      if (role === "counselor") navigate("/counselor");
      else if (role === "admin") navigate("/admin");
      else navigate("/student");
    } catch (err) {
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

  const handleGoogleSuccess = async (response) => {
    setLoading(true);
    setMsg("");
    try {
      const res = await api.post("/auth/google", { tokenId: response.credential });
      sessionStorage.setItem("token", res.data.token);
      sessionStorage.setItem("user", JSON.stringify(res.data.user));

      const role = res.data.user?.role;
      if (role === "counselor") navigate("/counselor");
      else if (role === "admin") navigate("/admin");
      else navigate("/student");
    } catch (err) {
      console.error("Google Login Error:", err);
      setMsg(err?.response?.data?.message || "Google login failed.");
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

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setMsg("Google Login Failed")}
              useOneTap
              theme="outline"
              shape="pill"
              size="large"
              width="360"
            />
          </div>

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
