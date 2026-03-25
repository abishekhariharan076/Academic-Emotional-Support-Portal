import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../services/api";
import Button from "../components/Button";
import Input from "../components/Input";
import Card from "../components/Card";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const role = "student";
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const res = await api.post("/auth/register", { name, email, password, role });
      sessionStorage.setItem("token", res.data.token);
      sessionStorage.setItem("user", JSON.stringify(res.data.user));

      const r = res.data.user?.role;
      if (r === "counselor") navigate("/counselor");
      else if (r === "admin") navigate("/admin");
      else navigate("/student");
    } catch (err) {
      console.error("Full Registration Error:", err);
      const errorData = err?.response?.data;
      if (errorData?.errors) {
        setMsg(errorData.errors.map((e) => e.msg).join(". "));
      } else {
        setMsg(errorData?.message || "Registration failed. Please check your connection or backend URL.");
      }
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
          <h1 className="text-2xl font-bold text-text-main">Create an account</h1>
          <p className="mt-2 text-sm text-text-body">
            Join the community to start your journey.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-5">
          <Input
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            required
          />

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@university.edu"
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          {/* Role selection removed: All signups are students */}

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
            {loading ? "Creating account..." : "Create account"}
          </Button>

          <p className="text-center text-sm text-text-muted">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-primary hover:text-primary-hover transition-colors">
              Sign in
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
}
