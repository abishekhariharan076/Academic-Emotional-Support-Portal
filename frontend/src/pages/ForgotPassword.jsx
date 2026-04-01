import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../services/api";
import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");

        try {
            const res = await api.post("/auth/forgot-password", { email });
            setMessage(res.data.message);
        } catch (err) {
            setError(err?.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-canvas px-4">
            <Card className="w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-text-main">Reset Password</h1>
                    <p className="text-text-body mt-2">Enter your email and we'll send you a link to reset your password.</p>
                </div>

                {message ? (
                    <div className="text-center space-y-4">
                        <div className="p-4 bg-status-success/10 text-status-success rounded-xl font-medium">
                            {message}
                        </div>
                        <Link to="/login" className="block text-primary hover:text-primary-hover font-medium">
                            Return to Login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Email Address"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@example.com"
                            required
                        />

                        {error && (
                            <p className="text-status-error text-sm font-medium">{error}</p>
                        )}

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Processing..." : "Send Reset Link"}
                        </Button>

                        <div className="text-center">
                            <Link to="/login" className="text-sm text-text-muted hover:text-primary transition-colors">
                                Back to Login
                            </Link>
                        </div>
                    </form>
                )}
            </Card>
        </div>
    );
}
