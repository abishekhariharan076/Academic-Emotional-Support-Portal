import { useEffect, useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../services/api";
import Card from "../components/Card";
import Button from "../components/Button";
import Badge from "../components/Badge";
import Chat from "../components/Chat";
import MoodTrendChart from "../components/MoodTrendChart";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [loading, setLoading] = useState(true);
  const [checkIns, setCheckIns] = useState([]);
  const [support, setSupport] = useState([]);
  const [counselors, setCounselors] = useState([]);
  const [activeRecipient, setActiveRecipient] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [range, setRange] = useState('7D');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const token = localStorage.getItem("token");
        const [checkInsRes, supportRes, counselorRes] = await Promise.all([
          api.get("/checkins/my", { headers: { Authorization: `Bearer ${token}` } }),
          api.get("/support/my", { headers: { Authorization: `Bearer ${token}` } }),
          api.get("/counselor/all", { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setCheckIns(checkInsRes.data || []);
        setSupport(supportRes.data || []);
        setCounselors(counselorRes.data || []);
      } catch (e) {
        console.error("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const latestCheckIn = checkIns[0];
  const pendingSupport = support.filter(s => s.status !== 'resolved').length;
  const respondedSupport = support.filter(s => s.status === 'responded').length;

  // Prepare chart data (reverse to show oldest to newest)
  const chartData = useMemo(() => {
    const limit = range === '7D' ? 7 : 30;
    return [...checkIns].reverse().map(c => ({
      label: new Date(c.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      mood: c.moodLevel
    })).slice(-limit);
  }, [checkIns, range]);

  const getMoodEmoji = (level) => {
    const moons = ['😟', '😐', '🙂', '😊', '🤩'];
    return moons[level - 1] || '😐';
  };

  const getMoodLabel = (level) => {
    const labels = ['Stressed', 'Okay', 'Good', 'Great', 'Amazing'];
    return labels[level - 1] || 'Unknown';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main">
            Good morning, {user?.name?.split(' ')[0] || "Student"}
          </h1>
          <p className="text-text-body">Your check-ins help track well-being over time.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/checkin">
            <Button>New Check-In</Button>
          </Link>
          <Link to="/support">
            <Button variant="secondary">
              Create Support Request
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex flex-col justify-between h-40">
          <div>
            <h3 className="text-sm font-medium text-text-muted">Current Mood</h3>
            <div className="mt-2 flex items-center gap-3">
              <span className="text-4xl">{latestCheckIn ? getMoodEmoji(latestCheckIn.moodLevel) : '—'}</span>
              <div>
                <p className="text-lg font-bold text-text-main">
                  {latestCheckIn ? getMoodLabel(latestCheckIn.moodLevel) : 'No data'}
                </p>
                <p className="text-xs text-text-muted">
                  {latestCheckIn ? new Date(latestCheckIn.createdAt).toLocaleDateString() : 'Start your first check-in'}
                </p>
              </div>
            </div>
          </div>
          <Link to="/checkin/history" className="text-sm font-medium text-primary hover:text-primary-hover">
            View History &rarr;
          </Link>
        </Card>

        <Card className="flex flex-col justify-between h-40">
          <div>
            <h3 className="text-sm font-medium text-text-muted">Support Requests</h3>
            <div className="mt-4 flex items-end gap-2">
              <span className="text-3xl font-bold text-text-main">{pendingSupport}</span>
              <span className="text-sm text-text-muted mb-1">active</span>
            </div>
            {respondedSupport > 0 && (
              <div className="mt-2 flex items-center justify-between">
                <Badge variant="success">
                  {respondedSupport} new responses
                </Badge>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="text-primary p-0 h-auto"
                  onClick={() => {
                    const latestResponded = support.find(s => s.status === 'responded');
                    if (latestResponded) {
                      setSelectedRequest(latestResponded);
                      setShowChat(true);
                    }
                  }}
                >
                  Chat &rarr;
                </Button>
              </div>
            )}
            {respondedSupport === 0 && pendingSupport === 0 && (
              <p className="mt-2 text-sm text-text-muted">No active requests</p>
            )}
          </div>
          <Link to="/support" className="text-sm font-medium text-primary hover:text-primary-hover">
            View All &rarr;
          </Link>
        </Card>

        <Card className="flex flex-col justify-between h-40">
          <div>
            <h3 className="text-sm font-medium text-text-muted">Resources for you</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {['Stress', 'Sleep', 'Focus', 'Anxiety'].map(tag => (
                <span key={tag} className="px-2 py-1 bg-secondary/10 text-secondary text-xs rounded-md font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <Link to="/resources" className="text-sm font-medium text-primary cursor-pointer hover:text-primary-hover">
            Browse Library &rarr;
          </Link>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Timeline */}
        <div className="lg:col-span-1 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-text-main">Recent Check-Ins</h2>
            <Link to="/checkin/history" className="text-sm font-medium text-primary hover:text-primary-hover">View all</Link>
          </div>

          <div className="space-y-4">
            {loading ? (
              <p className="text-text-muted text-sm">Loading...</p>
            ) : checkIns.length === 0 ? (
              <Card className="text-center py-8">
                <div className="text-4xl mb-2">📝</div>
                <p className="text-text-main font-medium">No check-ins yet</p>
                <p className="text-text-muted text-sm mt-1">Track your mood to see trends here.</p>
              </Card>
            ) : (
              checkIns.slice(0, 4).map((checkIn) => (
                <Card key={checkIn._id} className="p-4 flex items-start gap-4 hover:shadow-md transition-shadow">
                  <div className="text-2xl bg-canvas p-2 rounded-xl">
                    {getMoodEmoji(checkIn.moodLevel)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className="font-medium text-text-main">{getMoodLabel(checkIn.moodLevel)}</p>
                      <span className="text-xs text-text-muted whitespace-nowrap">
                        {new Date(checkIn.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {checkIn.message && (
                      <p className="text-sm text-text-body truncate mt-1">{checkIn.message}</p>
                    )}
                  </div>
                </Card>
              ))
            )}
          </div>

          <Card className="mt-6">
            <h2 className="text-sm font-bold text-text-main mb-4 uppercase tracking-wider">Your Counselors</h2>
            <div className="space-y-3">
              {counselors.length === 0 ? (
                <p className="text-xs text-text-muted">No counselors available.</p>
              ) : (
                counselors.map(c => (
                  <div
                    key={c._id}
                    className="flex items-center justify-between group cursor-pointer"
                    onClick={() => setActiveRecipient(c)}
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-text-main truncate group-hover:text-primary transition-colors">{c.name}</p>
                      <p className="text-[10px] text-text-muted">Available for support</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Chart */}
        <div className="lg:col-span-3">
          <Card className="h-full min-h-[400px]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-text-main">Your Well-being Trend</h2>
                <p className="text-sm text-text-muted">Last {range === '7D' ? '7' : '30'} check-ins</p>
              </div>
              {/* Toggle */}
              <div className="flex bg-canvas rounded-lg p-1">
                <button 
                  onClick={() => setRange('7D')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${range === '7D' ? 'bg-white shadow text-text-main' : 'text-text-muted hover:text-text-main'}`}
                >
                  7D
                </button>
                <button 
                  onClick={() => setRange('30D')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${range === '30D' ? 'bg-white shadow text-text-main' : 'text-text-muted hover:text-text-main'}`}
                >
                  30D
                </button>
              </div>
            </div>

            {chartData.length > 0 ? (
              <MoodTrendChart data={chartData} />
            ) : (
              <div className="h-64 flex items-center justify-center text-text-muted">
                Not enough data for trend analysis
              </div>
            )}
          </Card>
        </div>
      </div>
      {/* Chat Overlay */}
      {showChat && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative w-full max-w-lg">
            <Chat 
              supportRequestId={selectedRequest._id} 
              onClose={() => setShowChat(false)} 
            />
          </div>
        </div>
      )}
    </div>
  );
}
