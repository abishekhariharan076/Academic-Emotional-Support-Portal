import React, { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { api } from "../services/api";
import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";
import Logo from "../components/Logo";
import { 
  Key, 
  Lock, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle,
  ArrowRight
} from "lucide-react";

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();

    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [error, setError] = useState<string>("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return setError("Credential mismatch. Passwords must be identical.");
        }

        setLoading(true);
        setMessage("");
        setError("");

        try {
            await api.post("/auth/reset-password", { token, password });
            setMessage("Security credentials updated. Re-authenticating...");
            setTimeout(() => navigate("/login"), 3000);
        } catch (err: any) {
            setError(err?.response?.data?.message || "Invalid or expired recovery token.");
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-canvas px-6">
                <Card className="p-10 text-center max-w-md border-t-8 border-t-status-error animate-in zoom-in-95 duration-300 shadow-2xl">
                    <div className="w-16 h-16 bg-status-error/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertTriangle className="w-8 h-8 text-status-error" />
                    </div>
                    <h2 className="text-xl font-black text-text-main uppercase tracking-tighter mb-2">Invalid Protocol</h2>
                    <p className="text-status-error font-bold text-xs uppercase tracking-widest leading-relaxed mb-8">Verification token missing or corrupt. Please re-initiate recovery.</p>
                    <Button className="w-full h-12 rounded-2xl font-black uppercase tracking-widest text-[10px]" onClick={() => navigate("/forgot-password")}>
                        Re-initiate Recovery
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-canvas px-6 py-12 relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px]" />
            </div>

            <Card className="w-full max-w-md p-10 shadow-2xl relative z-10 border-t-8 border-t-primary animate-in zoom-in-95 duration-300">
                <div className="text-center mb-10">
                    <Link to="/" className="inline-block mb-10 transform hover:scale-105 transition-all">
                        <Logo type="full" />
                    </Link>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-4">
                        <ShieldCheck className="w-3.5 h-3.5" /> Security Overhaul
                    </div>
                    <h1 className="text-3xl font-black text-text-main uppercase tracking-tighter">Set New Credentials</h1>
                    <p className="text-text-muted mt-2 text-sm font-medium">Establish a robust new password to secure your institutional uplink.</p>
                </div>

                {message ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        <div className="p-6 bg-status-success/5 border border-status-success/10 rounded-2xl flex flex-col items-center">
                            <div className="w-12 h-12 bg-status-success/10 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle className="w-6 h-6 text-status-success" />
                            </div>
                            <p className="text-[10px] font-black text-status-success uppercase tracking-widest text-center leading-relaxed">
                                {message}
                            </p>
                        </div>
                        <div className="h-1.5 w-full bg-canvas rounded-full overflow-hidden">
                            <div className="h-full bg-status-success animate-[progress_3s_linear]" />
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="relative group">
                            <Lock className="absolute left-4 top-[45px] -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
                            <Input
                                label="New Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-11 h-14 rounded-2xl shadow-inner bg-canvas"
                                required
                                minLength={6}
                            />
                        </div>

                        <div className="relative group">
                            <Lock className="absolute left-4 top-[45px] -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
                            <Input
                                label="Confirm New Password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="pl-11 h-14 rounded-2xl shadow-inner bg-canvas"
                                required
                            />
                        </div>

                        {error && (
                            <div className="p-4 rounded-2xl bg-status-error/5 border border-status-error/10 flex items-center gap-3 animate-in shake-in-1">
                                <AlertTriangle className="w-4 h-4 text-status-error shrink-0" />
                                <p className="text-[10px] font-black text-status-error uppercase tracking-widest leading-relaxed">{error}</p>
                            </div>
                        )}

                        <Button type="submit" className="w-full h-16 rounded-2xl shadow-xl shadow-primary/20 font-black uppercase tracking-[0.2em] group" disabled={loading}>
                            {loading ? "Updating Registry..." : "Finalize Reset"}
                            <Key className="w-4 h-4 ml-2 group-hover:rotate-45 transition-transform" />
                        </Button>
                        
                        <div className="text-center pt-4">
                            <Link to="/login" className="text-xs font-black text-text-muted hover:text-primary transition-all uppercase tracking-widest flex items-center justify-center gap-2">
                                Abandon Reset <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>
                    </form>
                )}
            </Card>
        </div>
    );
}
