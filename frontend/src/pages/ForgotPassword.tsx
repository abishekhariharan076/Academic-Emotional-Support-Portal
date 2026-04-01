import React, { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";
import Logo from "../components/Logo";
import { 
  KeyRound, 
  Mail, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle,
  ShieldQuestion
} from "lucide-react";

export default function ForgotPassword() {
    const [email, setEmail] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [error, setError] = useState<string>("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");

        try {
            const res = await api.post("/auth/forgot-password", { email });
            setMessage(res.data.message || "Recovery link dispatched to your inbox.");
        } catch (err: any) {
            setError(err?.response?.data?.message || "Protocol failure. Verify institutional email.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-canvas px-6 py-12 relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-full h-full pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px]" />
            </div>

            <Card className="w-full max-w-md p-10 shadow-2xl relative z-10 border-t-8 border-t-indigo-500 animate-in zoom-in-95 duration-300">
                <div className="text-center mb-10">
                    <Link to="/" className="inline-block mb-10 transform hover:scale-105 transition-all">
                        <Logo type="full" />
                    </Link>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-4">
                        <ShieldQuestion className="w-3.5 h-3.5" /> Access Recovery
                    </div>
                    <h1 className="text-3xl font-black text-text-main uppercase tracking-tighter">Reset Password</h1>
                    <p className="text-text-muted mt-2 text-sm font-medium">Verify your institutional identity to receive a secure recovery downlink.</p>
                </div>

                {message ? (
                    <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-4">
                        <div className="p-6 bg-status-success/5 border border-status-success/10 rounded-2xl flex flex-col items-center">
                            <div className="w-12 h-12 bg-status-success/10 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle2 className="w-6 h-6 text-status-success" />
                            </div>
                            <p className="text-sm font-black text-status-success uppercase tracking-widest text-center">{message}</p>
                        </div>
                        <Link to="/login">
                            <Button variant="outline" className="w-full h-12 rounded-2xl font-black uppercase tracking-widest text-[10px]">
                                Return to Authentication
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="relative group">
                            <Mail className="absolute left-4 top-[45px] -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
                            <Input
                                label="Verification Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@university.edu"
                                className="pl-11 h-14 rounded-2xl shadow-inner bg-canvas"
                                required
                            />
                        </div>

                        {error && (
                            <div className="p-4 rounded-2xl bg-status-error/5 border border-status-error/10 flex items-center gap-3 animate-in shake-in-1">
                                <AlertCircle className="w-4 h-4 text-status-error shrink-0" />
                                <p className="text-[10px] font-black text-status-error uppercase tracking-widest leading-relaxed">{error}</p>
                            </div>
                        )}

                        <Button type="submit" className="w-full h-16 rounded-2xl shadow-xl shadow-indigo-500/20 font-black uppercase tracking-[0.2em] group" disabled={loading}>
                            {loading ? "Processing..." : "Dispatch Recovery"}
                            <KeyRound className="w-4 h-4 ml-2 group-hover:rotate-45 transition-transform" />
                        </Button>

                        <div className="text-center pt-4">
                            <Link to="/login" className="inline-flex items-center gap-2 text-xs font-black text-text-muted hover:text-primary transition-all uppercase tracking-widest">
                                <ArrowLeft className="w-3 h-3" /> Back to Secure Login
                            </Link>
                        </div>
                    </form>
                )}
            </Card>
        </div>
    );
}
