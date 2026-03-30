import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Card from "../components/Card";
import Button from "../components/Button";
import Badge from "../components/Badge";
import { 
  Users, 
  MessageSquare, 
  CheckCircle, 
  AlertTriangle, 
  ExternalLink, 
  RefreshCw,
  Inbox,
  ArrowRight,
  ShieldAlert,
  Info
} from "lucide-react";
import { User, CheckIn, SupportRequest } from "../types";

export default function CounselorDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [support, setSupport] = useState<SupportRequest[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState<string>("");

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [checkRes, supportRes, studentRes] = await Promise.all([
        api.get("/counselor/checkins"),
        api.get("/support"),
        api.get("/counselor/students"),
      ]);

      const fetchedCheckIns: CheckIn[] = checkRes.data || [];
      setCheckIns(fetchedCheckIns);
      setSupport(supportRes.data || []);
      setStudents(studentRes.data || []);

      // Initialize notes
      const initialNotes: Record<string, string> = {};
      fetchedCheckIns.forEach((c) => {
        initialNotes[c._id] = c.counselorNote || "";
      });
      setNotes(initialNotes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const pendingCheckIns = useMemo(() => checkIns.filter((c) => c.status === "open").length, [checkIns]);
  const pendingSupport = useMemo(() => support.filter((r) => r.status === "pending").length, [support]);

  const markReviewed = async (id: string) => {
    try {
      const res = await api.put(
        `/counselor/checkins/${id}`,
        { counselorNote: notes[id] || "" }
      );
      setCheckIns((prev) => prev.map((c) => (c._id === id ? { ...c, ...res.data } : c)));
      setMsg("Check-in reviewed successfully.");
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      setMsg("Failed to update check-in.");
    }
  };

  const getMoodBadge = (level: number) => {
    const variants: Record<number, any> = {
      1: "error",
      2: "warning",
      3: "neutral",
      4: "info",
      5: "success"
    };
    return <Badge variant={variants[level] || "neutral"}>Mood {level}/5</Badge>;
  };

  const getMediaUrl = (path: string) => {
    const base = api.defaults.baseURL || "";
    return `${base.replace('/api', '')}${path}`;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main flex items-center gap-3">
            Counselor Dashboard
            <div className="h-6 w-[2px] bg-border-light hidden md:block" />
            <span className="text-sm font-medium text-text-muted hidden md:block">{user?.domain}</span>
          </h1>
          <p className="text-text-body mt-1">Real-time overview of student well-being and active requests.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={fetchAll} className="flex items-center gap-2">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
        </div>
      </div>

      {msg && (
        <div className="p-4 bg-status-success/10 text-status-success rounded-xl border border-status-success/20 animate-in slide-in-from-top-2">
          {msg}
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-primary/40 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 text-primary/5 -rotate-12 group-hover:rotate-0 transition-transform">
            <CheckCircle className="w-16 h-16" />
          </div>
          <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-2">Pending Check-Ins</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-text-main">{pendingCheckIns}</span>
            <span className="text-sm font-bold text-text-muted italic">need review</span>
          </div>
        </Card>

        <Card 
          className="border-l-4 border-l-secondary cursor-pointer hover:shadow-lg transition-all group relative overflow-hidden" 
          onClick={() => navigate('/support')}
        >
          <div className="absolute top-0 right-0 p-4 text-secondary/5 rotate-12 group-hover:rotate-0 transition-transform">
            <Inbox className="w-16 h-16" />
          </div>
          <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-2">Support Inbox</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-text-main">{pendingSupport}</span>
            <span className="text-sm font-bold text-text-muted italic">unread requests</span>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm font-bold text-secondary">
            Go to Inbox <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Card>

        <Card className="bg-primary/5 border-primary/10 border-l-4 border-l-primary">
          <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-3">Counselor Lens</h3>
          <ul className="text-sm text-text-body space-y-2">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              Focus on low mood entries first.
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              Maintain supportive, open dialog.
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              Flag safety concerns immediately.
            </li>
          </ul>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main: Check-In Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-lg font-black text-text-main uppercase tracking-tight">Recent Check-Ins</h2>
            <Badge variant="neutral">{checkIns.length} Total</Badge>
          </div>

          {loading ? (
             <div className="space-y-4">
                {[1, 2, 3].map(i => <div key={i} className="h-48 bg-surface animate-pulse rounded-2xl border border-border-light" />)}
             </div>
          ) : checkIns.length === 0 ? (
            <Card className="py-16 text-center text-text-muted">
              <div className="w-16 h-16 bg-canvas rounded-full flex items-center justify-center mx-auto mb-4">
                <Info className="w-8 h-8 opacity-20" />
              </div>
              <p className="font-bold">No student check-ins found for this period.</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {checkIns.map(checkIn => {
                const isReviewed = checkIn.status === "reviewed";
                const student = checkIn.userId as User;
                return (
                  <Card key={checkIn._id} className={`transition-all duration-300 relative overflow-hidden ${!isReviewed ? 'ring-1 ring-secondary/20 shadow-sm' : 'opacity-80 bg-canvas/50'}`}>
                    {!isReviewed && (
                      <div className="absolute top-0 left-0 bottom-0 w-1 bg-secondary shadow-[0_0_8px_rgba(var(--secondary),0.5)]" />
                    )}
                    
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-4 items-center">
                        <div className="flex flex-col items-center">
                         {getMoodBadge(checkIn.moodLevel)}
                        </div>
                        <div>
                          <p className="text-sm font-extrabold text-text-main">
                            {checkIn.anonymous ? "Anonymous Student" : student?.name || "Student"}
                          </p>
                          <p className="text-[10px] uppercase font-black text-text-muted tracking-widest mt-0.5">
                            {new Date(checkIn.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant={isReviewed ? "success" : "warning"}>
                        {isReviewed ? "Checked" : "Action Needed"}
                      </Badge>
                    </div>

                    {checkIn.message && (
                      <div className="bg-canvas/50 border border-border-light p-4 rounded-xl mb-4 text-sm text-text-body italic relative">
                        <div className="absolute top-0 right-0 p-2 opacity-5">
                          <MessageSquare className="w-6 h-6" />
                        </div>
                        <p className="relative z-10 whitespace-pre-wrap leading-relaxed">"{checkIn.message}"</p>
                      </div>
                    )}

                    {checkIn.attachments && checkIn.attachments.length > 0 && (
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-6">
                        {checkIn.attachments.map((file, idx) => (
                          <div key={idx} className="relative group/media rounded-xl overflow-hidden border border-border-light bg-canvas aspect-square shadow-sm hover:shadow-md transition-all">
                            {file.fileType === 'video' ? (
                              <video 
                                className="w-full h-full object-cover" 
                                src={getMediaUrl(file.url)}
                              />
                            ) : (
                              <img 
                                className="w-full h-full object-cover" 
                                src={getMediaUrl(file.url)}
                                alt={file.originalName}
                              />
                            )}
                            <div 
                              className="absolute inset-0 bg-black/40 opacity-0 group-hover/media:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                              onClick={() => window.open(getMediaUrl(file.url), '_blank')}
                            >
                              <ExternalLink className="text-white w-5 h-5" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row items-end gap-4 mt-2">
                      <div className="flex-1 w-full">
                        <textarea
                          className="w-full px-4 py-2.5 rounded-xl border border-border-light bg-surface text-text-body text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none min-h-[44px] transition-all resize-none"
                          placeholder={isReviewed ? "Clinical summary recorded." : "Add a private counselor note..."}
                          value={notes[checkIn._id] || ""}
                          onChange={(e) => setNotes({ ...notes, [checkIn._id]: e.target.value })}
                          disabled={isReviewed}
                        />
                      </div>
                      {!isReviewed && (
                        <div className="flex gap-2 w-full sm:w-auto">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => navigate('/reference')}
                            className="flex-1 sm:flex-none border-dashed"
                          >
                            Suggest Resource
                          </Button>
                          <Button size="sm" onClick={() => markReviewed(checkIn._id)} className="flex-1 sm:flex-none shadow-md">
                            Review
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="relative overflow-hidden">
             <div className="absolute top-0 right-0 p-3 text-primary/5 -rotate-6">
                <Users className="w-12 h-12" />
             </div>
            <h3 className="font-black text-text-main mb-4 flex items-center justify-between border-b border-border-light pb-3">
              Institutional Roster
              <Badge variant="info" className="ml-2">{students.length}</Badge>
            </h3>
            <div className="max-h-[360px] overflow-y-auto space-y-2 custom-scrollbar pr-1">
              {students.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-xs text-text-muted font-bold uppercase tracking-widest italic">No enrollees found</p>
                </div>
              ) : (
                students.map(s => (
                  <div
                    key={s.id || (s as any)._id}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-canvas transition-all border border-transparent hover:border-border-light group cursor-default"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-extrabold text-text-main truncate group-hover:text-primary transition-colors">{s.name}</p>
                      <p className="text-[10px] text-text-muted truncate font-bold">{s.email}</p>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center border border-border-light group-hover:bg-primary/10 transition-colors">
                      <ArrowRight className="w-3 h-3 text-text-muted group-hover:text-primary" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card className="bg-status-error/5 border-status-error/20">
            <h3 className="font-black text-status-error mb-3 flex items-center gap-2 uppercase tracking-tighter">
              <ShieldAlert className="w-5 h-5" /> Safety Protocols
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-surface rounded-xl border border-status-error/10 shadow-sm relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-2 opacity-5">
                    <AlertTriangle className="w-8 h-8" />
                 </div>
                <p className="text-xs font-black text-status-error uppercase mb-1">Emergency Handle</p>
                <p className="text-xs text-text-body font-medium leading-relaxed">
                  Flag keywords: "pain", "harm", "end". Trigger campus response if detected.
                </p>
              </div>
              <div className="p-4 bg-surface rounded-xl border border-primary/10 shadow-sm">
                <p className="text-xs font-black text-primary uppercase mb-1">Privacy Mandate</p>
                <p className="text-xs text-text-body font-medium leading-relaxed">
                  Anonymous data must remain siloed unless specific risk thresholds are hit.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
