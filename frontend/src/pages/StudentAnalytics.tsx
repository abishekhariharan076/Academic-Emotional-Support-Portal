import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Card from "../components/Card";
import Button from "../components/Button";
import MoodTrendChart from "../components/MoodTrendChart";
import StatusPieChart from "../components/StatusPieChart";
import { buildMoodTrend, countStatuses } from "../utils/studentCharts";
import { 
  BarChart3, 
  ArrowLeft, 
  Info, 
  TrendingUp, 
  PieChart, 
  Calendar,
  Sparkles
} from "lucide-react";
import { CheckIn } from "../types";

export default function StudentAnalytics() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCheckIns = async () => {
      try {
        const res = await api.get("/checkins/my");
        setCheckIns(res.data || []);
      } catch (err) {
        console.error("Failed to fetch analytics data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCheckIns();
  }, []);

  const chartData = useMemo(() => buildMoodTrend(checkIns, 15), [checkIns]);
  const statusCounts = useMemo(() => countStatuses(checkIns), [checkIns]);

  return (
    <div className="space-y-10 animate-in fade-in duration-500 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-wider mb-4 shadow-sm">
            <BarChart3 className="w-3 h-3" /> Emotional Intelligence Matrix
          </div>
          <h1 className="text-3xl font-black text-text-main uppercase tracking-tight">Your Analytics</h1>
          <p className="text-text-body font-medium mt-2">Deep-dive into your longitudinal mood trends and systemic check-in metrics.</p>
        </div>
        
        <Button
            variant="outline"
            onClick={() => navigate("/student")}
            className="flex items-center gap-2 h-12 px-6 rounded-2xl font-black uppercase tracking-widest text-[10px]"
        >
            <ArrowLeft className="w-4 h-4" /> Back to Pulse
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-8 lg:grid-cols-2">
            <div className="h-80 bg-surface rounded-[32px] animate-pulse border border-border-light shadow-sm" />
            <div className="h-80 bg-surface rounded-[32px] animate-pulse border border-border-light shadow-sm" />
        </div>
      ) : checkIns.length === 0 ? (
        <Card className="py-24 text-center border-4 border-dashed border-border-light rounded-[32px] bg-canvas/30">
          <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <TrendingUp className="w-10 h-10 text-text-muted opacity-20" />
          </div>
          <h3 className="text-lg font-black text-text-main uppercase tracking-tight">No Trend Data</h3>
          <p className="text-text-muted font-bold text-xs uppercase tracking-widest mt-1">Submit your first pulse check-in to begin data aggregation</p>
        </Card>
      ) : (
        <div className="grid gap-8 lg:grid-cols-2">
          <Card className="p-8 rounded-[32px] hover:shadow-2xl transition-all duration-500 bg-surface border-border-light relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 text-primary/5 -rotate-12 group-hover:rotate-0 transition-transform">
                <TrendingUp className="w-20 h-20" />
            </div>
            <div className="flex items-center gap-3 mb-8 relative z-10">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/5">
                    <Calendar className="w-5 h-5" />
                </div>
                <div>
                   <h3 className="text-sm font-black text-text-main uppercase tracking-widest">15-Day Flux</h3>
                   <p className="text-[10px] font-bold text-text-muted uppercase">Mood variation over time</p>
                </div>
            </div>
            <div className="h-[260px] relative z-10">
                <MoodTrendChart data={chartData} />
            </div>
          </Card>

          <Card className="p-8 rounded-[32px] hover:shadow-2xl transition-all duration-500 bg-surface border-border-light relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 text-secondary/5 rotate-12 group-hover:rotate-0 transition-transform">
                <PieChart className="w-20 h-20" />
            </div>
            <div className="flex items-center gap-3 mb-8 relative z-10">
                <div className="w-10 h-10 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/5">
                    <Sparkles className="w-5 h-5" />
                </div>
                <div>
                   <h3 className="text-sm font-black text-text-main uppercase tracking-widest">Counselor Engagement</h3>
                   <p className="text-[10px] font-bold text-text-muted uppercase">Review distribution metrics</p>
                </div>
            </div>
            <div className="h-[260px] relative z-10">
                <StatusPieChart
                    openCount={statusCounts.open}
                    reviewedCount={statusCounts.reviewed}
                />
            </div>
          </Card>

          <div className="lg:col-span-2">
             <Card className="bg-text-main p-8 md:p-10 rounded-[32px] overflow-hidden group relative">
                <div className="absolute inset-0 bg-primary/10 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none" />
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                    <div className="flex items-start gap-6">
                        <div className="w-16 h-16 rounded-3xl bg-white/10 flex items-center justify-center text-white border border-white/5 shadow-2xl">
                            <Info className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2">Longitudinal Context</h3>
                            <p className="text-white/60 text-sm font-medium leading-relaxed max-w-xl">
                                Your analytics are strictly siloed. Counselors can only see individual entries you submit—aggregate trends are reserved for your personal well-being reflection.
                            </p>
                        </div>
                    </div>
                </div>
             </Card>
          </div>
        </div>
      )}
    </div>
  );
}
