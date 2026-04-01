import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import Card from "../components/Card";
import Badge from "../components/Badge";
import Button from "../components/Button";
import { CheckIn } from "../types";
import { Calendar, Clock, Inbox, ExternalLink, MessageSquare } from "lucide-react";

export default function CheckInHistory() {
    const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await api.get("/checkins/my");
                setCheckIns(res.data);
            } catch (err) {
                console.error("Failed to fetch history");
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const getMoodEmoji = (level: number) => {
        const moods = ['😟', '😐', '🙂', '😊', '🤩'];
        return moods[level - 1] || '😐';
    };

    const getMoodLabel = (level: number) => {
        const labels = ['Stressed', 'Okay', 'Good', 'Great', 'Amazing'];
        return labels[level - 1] || 'Unknown';
    };

    const getStatusBadge = (status: string) => {
        if (status === 'reviewed') return <Badge variant="success">Reviewed</Badge>;
        return <Badge variant="neutral">Open</Badge>;
    };

    const getMediaUrl = (path: string) => {
        const base = api.defaults.baseURL || "";
        return `${base.replace('/api', '')}${path}`;
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-text-main">Check-In History</h1>
                    <p className="text-text-body mt-1">A timeline of your emotional well-being journeys.</p>
                </div>
                <Link to="/checkin">
                    <Button className="w-full sm:w-auto flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> New Check-In
                    </Button>
                </Link>
            </div>

            <div className="space-y-6">
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-40 bg-surface animate-pulse rounded-2xl border border-border-light" />
                        ))}
                    </div>
                ) : checkIns.length === 0 ? (
                    <Card className="py-16 text-center">
                        <div className="w-16 h-16 bg-canvas rounded-full flex items-center justify-center mx-auto mb-4 text-text-muted">
                            <Inbox className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold text-text-main">No check-ins yet</h3>
                        <p className="text-text-muted mt-1 max-w-xs mx-auto">
                            Start sharing how you feel to track your progress and get support.
                        </p>
                    </Card>
                ) : (
                    checkIns.map((item) => (
                        <Card key={item._id} className="relative overflow-hidden group">
                            {/* Accent Bar */}
                            <div className={`absolute left-0 top-0 bottom-0 w-1.5 transition-colors duration-300 ${
                                item.moodLevel >= 4 ? 'bg-status-success' : 
                                item.moodLevel <= 2 ? 'bg-status-error' : 'bg-primary/40'
                            }`} />

                            <div className="flex flex-col lg:flex-row gap-6">
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="text-4xl bg-canvas p-4 rounded-2xl flex items-center justify-center h-16 w-16 shadow-inner ring-1 ring-border-light group-hover:scale-105 transition-transform duration-300">
                                                {getMoodEmoji(item.moodLevel)}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3">
                                                    <h3 className="text-xl font-extrabold text-text-main">{getMoodLabel(item.moodLevel)}</h3>
                                                    {getStatusBadge(item.status)}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-text-muted mt-0.5">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    <span>
                                                        {new Date(item.createdAt).toLocaleString(undefined, {
                                                            weekday: 'short',
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {item.message && (
                                        <div className="p-4 bg-canvas rounded-xl text-sm text-text-body font-medium italic border border-border-light/50 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-2 opacity-5">
                                                <MessageSquare className="w-8 h-8" />
                                            </div>
                                            <p className="relative z-10 leading-relaxed whitespace-pre-wrap">"{item.message}"</p>
                                        </div>
                                    )}

                                    {item.attachments && item.attachments.length > 0 && (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4">
                                            {item.attachments.map((file, idx) => (
                                                <div key={idx} className="relative group/media rounded-xl overflow-hidden border border-border-light bg-canvas aspect-square shadow-sm hover:shadow-md transition-all">
                                                    {file.fileType === 'video' ? (
                                                        <video 
                                                            className="w-full h-full object-cover" 
                                                            src={getMediaUrl(file.url)}
                                                            preload="metadata"
                                                        />
                                                    ) : (
                                                        <img 
                                                            className="w-full h-full object-cover" 
                                                            src={getMediaUrl(file.url)}
                                                            alt={file.originalName}
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/f3f4f6/6b7280?text=Image+Missing';
                                                            }}
                                                        />
                                                    )}
                                                    <div 
                                                        className="absolute inset-0 bg-black/40 opacity-0 group-hover/media:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                                                        onClick={() => window.open(getMediaUrl(file.url), '_blank')}
                                                    >
                                                        <ExternalLink className="text-white w-6 h-6 transform scale-75 group-hover/media:scale-100 transition-transform" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {item.counselorNote && (
                                    <div className="lg:w-1/3 bg-status-success/5 border border-status-success/10 p-5 rounded-2xl relative overflow-hidden animate-in slide-in-from-right-4 duration-500">
                                        <div className="absolute top-0 right-0 p-3 text-status-success/10 rotate-12">
                                            <CheckCircle className="w-16 h-16" />
                                        </div>
                                        <h4 className="text-xs font-black text-status-success uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                            Counselor Feedback
                                        </h4>
                                        <p className="text-sm text-text-main font-medium leading-relaxed italic relative z-10">
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

// Dummy icon for feedback area
function CheckCircle({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    );
}
