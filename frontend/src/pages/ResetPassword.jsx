import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../services/api";
import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return setError("Passwords do not match");
        }

        setLoading(true);
        setMessage("");
        setError("");

        try {
            await api.post("/auth/reset-password", { token, password });
            setMessage("Password successfully reset. You can now log in.");
            setTimeout(() => navigate("/login"), 3000);
        } catch (err) {
            setError(err?.response?.data?.message || "Invalid or expired token.");
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-canvas px-4">
                <Card className="p-8 text-center max-w-md">
                    <p className="text-status-error font-medium">Invalid reset link. Please request a new one.</p>
                    <Button className="mt-4" onClick={() => navigate("/forgot-password")}>Go to Forgot Password</Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-canvas px-4">
            <Card className="w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-text-main">Set New Password</h1>
                    <p className="text-text-body mt-2">Please enter your new password below.</p>
                </div>

                {message ? (
                    <div className="p-4 bg-status-success/10 text-status-success rounded-xl font-medium text-center">
                        {message}
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="New Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                        <Input
                            label="Confirm New Password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />

                        {error && (
                            <p className="text-status-error text-sm font-medium">{error}</p>
                        )}

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Updating..." : "Reset Password"}
                        </Button>
                    </form>
                )}
            </Card>
        </div>
    );
}
