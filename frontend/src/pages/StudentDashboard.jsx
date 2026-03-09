import { useEffect, useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../services/api";
import Card from "../components/Card";
import Button from "../components/Button";
import Badge from "../components/Badge";
import MoodTrendChart from "../components/MoodTrendChart";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [loading, setLoading] = useState(true);
  const [checkIns, setCheckIns] = useState([]);
  const [support, setSupport] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const token = localStorage.getItem("token");
        const [checkInsRes, supportRes] = await Promise.all([
          api.get("/checkins/my", { headers: { Authorization: `Bearer ${token}` } }),
          api.get("/support/my", { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setCheckIns(checkInsRes.data || []);
        setSupport(supportRes.data || []);
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
    return [...checkIns].reverse().map(c => ({
      label: new Date(c.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      mood: c.moodLevel
    })).slice(-10); // Last 10
  }, [checkIns]);

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
            <Button variant="secondary" className="bg-white text-text-body border border-border-light hover:bg-gray-50">
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
          <Link to="/checkin" className="text-sm font-medium text-primary hover:text-primary-hover">
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
              <Badge variant="success" className="mt-2">
                {respondedSupport} need response
              </Badge>
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
          <span className="text-sm font-medium text-primary cursor-pointer hover:text-primary-hover">
            Browse Library &rarr;
          </span>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Timeline */}
        <div className="lg:col-span-1 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-text-main">Recent Check-Ins</h2>
            <Link to="/checkin" className="text-sm font-medium text-primary hover:text-primary-hover">View all</Link>
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
        </div>

        {/* Chart */}
        <div className="lg:col-span-2">
          <Card className="h-full min-h-[400px]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-text-main">Your Well-being Trend</h2>
                <p className="text-sm text-text-muted">Last 7 check-ins</p>
              </div>
              {/* Toggle placeholder */}
              <div className="flex bg-canvas rounded-lg p-1">
                <button className="px-3 py-1 text-xs font-medium bg-white shadow rounded-md text-text-main">7D</button>
                <button className="px-3 py-1 text-xs font-medium text-text-muted hover:text-text-main">30D</button>
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
    </div>
  );
}
