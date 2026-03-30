import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import Input from "../components/Input";
import Card from "../components/Card";
import Logo from "../components/Logo";
import { 
  UserPlus, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  ShieldCheck,
  Globe
} from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [msg, setMsg] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const res = await api.post("/auth/register", { 
        name, 
        email, 
        password, 
        role: "student" 
      });
      
      // Use useAuth login to update global state
      login(res.data.user, res.data.token);

      const r = res.data.user?.role;
      if (r === "counselor") navigate("/counselor");
      else if (r === "admin") navigate("/admin");
      else navigate("/student");
    } catch (err: any) {
      console.error("Registration Error:", err);
      const errorData = err?.response?.data;
      if (errorData?.errors) {
        setMsg(errorData.errors.map((e: any) => e.msg).join(". "));
      } else {
        setMsg(errorData?.message || "Registration failed. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[100px]" />
      </div>

      <Card className="w-full max-w-lg p-10 shadow-2xl relative z-10 border-t-8 border-t-primary animate-in zoom-in-95 duration-300">
        <div className="text-center mb-10">
          <Link to="/" className="inline-block mb-10 transform hover:scale-105 transition-all">
            <Logo type="full" />
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-4">
              <UserPlus className="w-3 h-3" /> Identity Initialization
          </div>
          <h1 className="text-3xl font-black text-text-main uppercase tracking-tighter">Create Account</h1>
          <p className="mt-2 text-sm font-medium text-text-muted">
            Join the secure network for academic emotional intelligence.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-6">
          <div className="relative group">
            <User className="absolute left-4 top-[45px] -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="pl-11 h-14 rounded-2xl"
              required
            />
          </div>

          <div className="relative group">
            <Mail className="absolute left-4 top-[45px] -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
            <Input
              label="Institutional Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@university.edu"
              className="pl-11 h-14 rounded-2xl"
              required
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-[45px] -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
            <Input
              label="System Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="pl-11 h-14 rounded-2xl"
              required
            />
          </div>

          {msg && (
            <div className="p-4 rounded-2xl bg-status-error/5 border border-status-error/10 text-status-error text-xs font-black text-center uppercase tracking-widest animate-in shake-in-1">
              {msg}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-16 rounded-2xl text-base font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 group"
          >
            {loading ? "Provisioning..." : "Initialize Profile"}
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>

          <p className="text-center text-xs font-bold text-text-muted uppercase tracking-widest">
            Already registered?{" "}
            <Link to="/login" className="text-primary hover:text-primary-dark transition-colors font-black">
              Authenticate
            </Link>
          </p>
        </form>
        
        <div className="mt-10 pt-8 border-t border-border-light/50 flex items-center justify-center gap-6">
            <div className="flex items-center gap-2 text-[10px] font-black text-text-muted uppercase tracking-tighter">
                <ShieldCheck className="w-3.5 h-3.5 text-status-success" /> Encrypted
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black text-text-muted uppercase tracking-tighter">
                <Globe className="w-3.5 h-3.5 text-secondary" /> Institutional
            </div>
        </div>
      </Card>
    </div>
  );
}
