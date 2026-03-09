import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import MoodTrendChart from "../components/MoodTrendChart";
import StatusPieChart from "../components/StatusPieChart";
import { buildMoodTrend, countStatuses } from "../utils/studentCharts";

export default function StudentAnalytics() {
  const navigate = useNavigate();
  const [checkIns, setCheckIns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCheckIns = async () => {
      try {
        const res = await api.get("/checkins/my", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setCheckIns(res.data);
      } finally {
        setLoading(false);
      }
    };

    fetchCheckIns();
  }, []);

  const chartData = useMemo(() => buildMoodTrend(checkIns, 15), [checkIns]);
  const statusCounts = useMemo(() => countStatuses(checkIns), [checkIns]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="border-b border-slate-800">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
            <p className="text-sm text-slate-400">
              Mood trends and check-in status overview.
            </p>
          </div>

          <button
            onClick={() => navigate("/student")}
            className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-900"
          >
            Back
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-8">
        {loading ? (
          <p className="text-sm text-slate-400">Loading…</p>
        ) : checkIns.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
            <p className="text-sm text-slate-300">No check-ins yet.</p>
            <p className="mt-1 text-xs text-slate-400">
              Submit a check-in first to see analytics.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            <MoodTrendChart data={chartData} />
            <StatusPieChart
              openCount={statusCounts.open}
              reviewedCount={statusCounts.reviewed}
            />
          </div>
        )}
      </div>
    </div>
  );
}
