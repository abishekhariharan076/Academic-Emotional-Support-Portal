import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../services/api";
import Card from "../components/Card";
import Button from "../components/Button";
import Badge from "../components/Badge";
import NotifBadge from "../components/NotifBadge";

export default function CounselorDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  const [checkIns, setCheckIns] = useState([]);
  const [support, setSupport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState({});
  const [msg, setMsg] = useState("");

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [checkRes, supportRes] = await Promise.all([
        api.get("/counselor/checkins", { headers: { Authorization: `Bearer ${token}` } }),
        api.get("/support", { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      setCheckIns(checkRes.data || []);
      setSupport(supportRes.data || []);

      // Initialize notes
      const initialNotes = {};
      (checkRes.data || []).forEach((c) => {
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

  const markReviewed = async (id) => {
    try {
      const res = await api.put(
        `/counselor/checkins/${id}`,
        { counselorNote: notes[id] || "" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCheckIns((prev) => prev.map((c) => (c._id === id ? { ...c, ...res.data } : c)));
      setMsg("Check-in reviewed successfully.");
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      setMsg("Failed to update check-in.");
    }
  };

  const getMoodBadge = (level) => {
    const colors = {
      1: "bg-red-100 text-red-800",
      2: "bg-orange-100 text-orange-800",
      3: "bg-gray-100 text-gray-800",
      4: "bg-blue-100 text-blue-800",
      5: "bg-green-100 text-green-800"
    };
    return <span className={`px-2 py-0.5 rounded text-xs font-bold ${colors[level] || colors[3]}`}>Mood {level}/5</span>;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main">
            Counselor Dashboard
          </h1>
          <p className="text-text-body">Overview of student well-being and requests.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={fetchAll}>Refresh Data</Button>
        </div>
      </div>

      {msg && <div className="p-3 bg-green-50 text-green-700 rounded-lg">{msg}</div>}

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <h3 className="text-sm font-medium text-text-muted">Pending Check-Ins</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-text-main">{pendingCheckIns}</span>
            <span className="text-sm text-text-muted">need review</span>
          </div>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/support')}>
          <h3 className="text-sm font-medium text-text-muted">Support Inbox</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-text-main">{pendingSupport}</span>
            <span className="text-sm text-text-muted">unread requests</span>
          </div>
          <div className="mt-2 text-sm text-primary">Go to Inbox &rarr;</div>
        </Card>

        <Card className="bg-primary/5 border-primary/10">
          <h3 className="text-sm font-medium text-primary">Quick Tips</h3>
          <ul className="mt-2 text-sm text-text-body list-disc list-inside space-y-1">
            <li>Review low mood check-ins first.</li>
            <li>Keep responses supportive and non-clinical.</li>
            <li>Flag emergency risks immediately.</li>
          </ul>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main: Check-In Feed */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-lg font-bold text-text-main">Student Check-Ins</h2>

          {loading ? <p>Loading...</p> : checkIns.length === 0 ? (
            <Card className="py-8 text-center text-text-muted">No check-ins found.</Card>
          ) : (
            <div className="space-y-4">
              {checkIns.map(checkIn => {
                const isReviewed = checkIn.status === "reviewed";
                return (
                  <Card key={checkIn._id} className={`transition-all ${!isReviewed ? 'border-l-4 border-l-secondary' : 'opacity-75'}`}>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex gap-3 items-center">
                        {getMoodBadge(checkIn.moodLevel)}
                        <span className="text-sm font-semibold text-text-main">
                          {checkIn.anonymous ? "Anonymous" : checkIn.userId?.name || "Student"}
                        </span>
                        <span className="text-xs text-text-muted">
                          {new Date(checkIn.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <Badge variant={isReviewed ? "success" : "warning"}>
                        {isReviewed ? "Reviewed" : "Open"}
                      </Badge>
                    </div>

                    {checkIn.message && (
                      <div className="bg-canvas border border-border-light p-3 rounded-lg mb-4 text-sm text-text-body whitespace-pre-wrap">
                        {checkIn.message}
                      </div>
                    )}

                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <input
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 text-text-body text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                          placeholder={isReviewed ? "Note recorded." : "Add a short note..."}
                          value={notes[checkIn._id] || ""}
                          onChange={(e) => setNotes({ ...notes, [checkIn._id]: e.target.value })}
                          disabled={isReviewed}
                        />
                      </div>
                      {!isReviewed && (
                        <Button size="sm" onClick={() => markReviewed(checkIn._id)}>
                          Review
                        </Button>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar: Guidelines */}
        <div className="space-y-6">
          <Card>
            <h3 className="font-bold text-text-main mb-3">Counselor Guidelines</h3>
            <p className="text-sm text-text-body mb-4">
              Remember that AESP is an emotional support tool, not a medical platform.
            </p>
            <div className="space-y-3">
              <div className="p-3 bg-yellow-50 text-yellow-800 rounded-lg text-sm border border-yellow-100">
                <strong>⚠️ Emergency Protocol</strong>
                <p className="mt-1">If a student indicates self-harm or immediate danger, follow campus emergency protocols immediately.</p>
              </div>
              <div className="p-3 bg-blue-50 text-blue-800 rounded-lg text-sm border border-blue-100">
                <strong>Privacy First</strong>
                <p className="mt-1">Respect anonymous check-ins. Do not attempt to identify students unless there is a safety risk.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
