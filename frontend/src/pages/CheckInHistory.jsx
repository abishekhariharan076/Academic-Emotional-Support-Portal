import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import Card from "../components/Card";
import Badge from "../components/Badge";
import Button from "../components/Button";

export default function CheckInHistory() {
    const [checkIns, setCheckIns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = sessionStorage.getItem("token");
                const res = await api.get("/checkins/my", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCheckIns(res.data);
            } catch (err) {
                console.error("Failed to fetch history");
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const getMoodEmoji = (level) => {
        const moons = ['😟', '😐', '🙂', '😊', '🤩'];
        return moons[level - 1] || '😐';
    };

    const getMoodLabel = (level) => {
        const labels = ['Stressed', 'Okay', 'Good', 'Great', 'Amazing'];
        return labels[level - 1] || 'Unknown';
    };

    const getStatusBadge = (status) => {
        if (status === 'reviewed') return <Badge variant="success">Reviewed</Badge>;
        return <Badge variant="secondary">Open</Badge>;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-text-main">Check-In History</h1>
                    <p className="text-text-body">A record of your emotional well-being over time.</p>
                </div>
                <Link to="/checkin">
                    <Button>New Check-In</Button>
                </Link>
            </div>

            <div className="space-y-4">
                {loading ? (
                    <p className="text-text-muted font-medium">Loading history...</p>
                ) : checkIns.length === 0 ? (
                    <Card className="py-12 text-center text-text-muted">
                        <div className="text-4xl mb-4">📭</div>
                        <p>You haven't made any check-ins yet.</p>
                    </Card>
                ) : (
                    checkIns.map((item) => (
                        <Card key={item._id} className="p-6">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                <div className="flex gap-4">
                                    <div className="text-3xl bg-canvas p-3 rounded-2xl flex items-center justify-center h-14 w-14">
                                        {getMoodEmoji(item.moodLevel)}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-lg font-bold text-text-main">{getMoodLabel(item.moodLevel)}</h3>
                                            {getStatusBadge(item.status)}
                                        </div>
                                        <p className="text-sm text-text-muted">
                                            {new Date(item.createdAt).toLocaleString(undefined, {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                        {item.message && (
                                            <div className="mt-3 p-3 bg-canvas rounded-xl text-sm text-text-body italic border-l-4 border-primary/20">
                                                "{item.message}"
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {item.counselorNote && (
                                    <div className="md:w-1/3 bg-status-success/5 border border-status-success/10 p-4 rounded-xl">
                                        <p className="text-xs font-bold text-status-success uppercase tracking-wider mb-2">Counselor Feedback</p>
                                        <p className="text-sm text-text-main italic leading-relaxed">
                                            {item.counselorNote}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
