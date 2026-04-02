import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Card from "../components/Card";
import Button from "../components/Button";
import Badge from "../components/Badge";
import MoodTrendChart from "../components/MoodTrendChart";
import { CheckIn, SupportRequest, User } from "../types";

const moodMeta: Record<number, { emoji: string; label: string; tone: string }> = {
  1: { emoji: "1", label: "Overwhelmed", tone: "text-status-error" },
  2: { emoji: "2", label: "Stressed", tone: "text-secondary" },
  3: { emoji: "3", label: "Steady", tone: "text-text-main" },
  4: { emoji: "4", label: "Good", tone: "text-primary" },
  5: { emoji: "5", label: "Thriving", tone: "text-status-success" },
};

const resourceThemes = ["Stress", "Sleep", "Focus", "Anxiety"];

export default function StudentDashboardEnhanced() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [support, setSupport] = useState<SupportRequest[]>([]);
  const [counselors, setCounselors] = useState<User[]>([]);
  const [range, setRange] = useState<"7D" | "30D">("7D");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [checkInsRes, supportRes, counselorRes] = await Promise.all([
          api.get("/checkins/my"),
          api.get("/support/my"),
          api.get("/counselor/all"),
        ]);
        setCheckIns(checkInsRes.data || []);
        setSupport(supportRes.data || []);
        setCounselors(counselorRes.data || []);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const latestCheckIn = checkIns[0];
  const activeSupport = support.filter((item) => item.status !== "resolved");
  const respondedSupport = support.filter((item) => item.status === "responded");

  const chartData = useMemo(() => {
    const limit = range === "7D" ? 7 : 30;
    return [...checkIns]
      .reverse()
      .map((item) => ({
        label: new Date(item.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        mood: item.moodLevel,
      }))
      .slice(-limit);
  }, [checkIns, range]);

  const moodAverage = useMemo(() => {
    if (!checkIns.length) return null;
    const recent = checkIns.slice(0, 7);
    const total = recent.reduce((sum, item) => sum + item.moodLevel, 0);
    return (total / recent.length).toFixed(1);
  }, [checkIns]);

  const strongestFocus = useMemo(() => {
    const allMatches = checkIns
      .map((item) => item.message?.match(/\[Factors: ([^\]]+)\]/)?.[1] || "")
      .flatMap((value) => value.split(",").map((factor) => factor.trim()).filter(Boolean));

    if (!allMatches.length) {
      return "No repeated factor yet";
    }

    const counts = allMatches.reduce<Record<string, number>>((acc, factor) => {
      acc[factor] = (acc[factor] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  }, [checkIns]);

  const recommendation = useMemo(() => {
    if (!latestCheckIn) {
      return {
        title: "Begin with a simple check-in",
        text: "A first entry gives you a baseline and unlocks trend tracking in the dashboard.",
        action: "/checkin",
        cta: "Create first check-in",
      };
    }

    if (latestCheckIn.moodLevel <= 2) {
      return {
        title: "You may want support sooner",
        text: "Your latest mood suggests a harder day. Consider sending a counselor request while the context is fresh.",
        action: "/support",
        cta: "Open support requests",
      };
    }

    return {
      title: "Keep the streak thoughtful",
      text: "You are building a useful record. Add another check-in later this week to keep your trend honest.",
      action: "/checkin",
      cta: "Log another check-in",
    };
  }, [latestCheckIn]);

  const headerMood = latestCheckIn ? moodMeta[latestCheckIn.moodLevel] : null;

  return (
    <div className="space-y-8">
      <section className="section-shell mesh-highlight overflow-hidden p-6 sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="space-y-5">
            <Badge variant="secondary">Student dashboard</Badge>
            <div>
              <h1 className="text-3xl font-extrabold sm:text-4xl">
                Welcome back, {user?.name?.split(" ")[0] || "Student"}.
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-text-body">
                This space helps you understand your recent emotional pattern, decide whether to ask for help, and keep support resources close.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to="/checkin">
                <Button size="lg" className="w-full sm:w-auto">New check-in</Button>
              </Link>
              <Link to="/support">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">Ask for support</Button>
              </Link>
            </div>
          </div>

          <Card className="border-none bg-white/85 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-text-muted">Current pulse</p>
            <div className="mt-4 flex items-end justify-between gap-4">
              <div>
                <p className={`text-4xl font-extrabold ${headerMood?.tone || "text-text-main"}`}>
                  {headerMood?.label || "No check-ins yet"}
                </p>
                <p className="mt-2 text-sm text-text-body">
                  {latestCheckIn
                    ? `Last check-in on ${new Date(latestCheckIn.createdAt).toLocaleDateString()}`
                    : "Start with a private reflection to populate your dashboard."}
                </p>
              </div>
              <div className="rounded-[28px] bg-primary/10 px-5 py-4 text-4xl font-extrabold text-primary">
                {headerMood?.emoji || "-"}
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <Card className="border-none bg-white/85">
          <p className="text-sm font-semibold text-text-muted">Recent average</p>
          <p className="mt-3 text-4xl font-extrabold text-primary">{moodAverage || "-"}</p>
          <p className="mt-3 text-sm text-text-body">Average mood across your last seven check-ins.</p>
        </Card>
        <Card className="border-none bg-white/85">
          <p className="text-sm font-semibold text-text-muted">Open support</p>
          <p className="mt-3 text-4xl font-extrabold text-primary">{activeSupport.length}</p>
          <p className="mt-3 text-sm text-text-body">Requests still active or waiting on follow-up.</p>
        </Card>
        <Card className="border-none bg-white/85">
          <p className="text-sm font-semibold text-text-muted">Counselor replies</p>
          <p className="mt-3 text-4xl font-extrabold text-primary">{respondedSupport.length}</p>
          <p className="mt-3 text-sm text-text-body">Requests that already have a counselor response.</p>
        </Card>
        <Card className="border-none bg-white/85">
          <p className="text-sm font-semibold text-text-muted">Recurring factor</p>
          <p className="mt-3 text-2xl font-extrabold text-primary">{strongestFocus}</p>
          <p className="mt-3 text-sm text-text-body">The theme showing up most often in recent check-ins.</p>
        </Card>
      </section>

      <section className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="border-none bg-white/90">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-extrabold">Well-being trend</h2>
              <p className="mt-2 text-sm text-text-muted">Use your recent entries to notice drift, recovery, or pressure building over time.</p>
            </div>
            <div className="flex rounded-full bg-surface-strong p-1">
              <button
                type="button"
                onClick={() => setRange("7D")}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${range === "7D" ? "bg-white text-primary shadow-soft" : "text-text-muted"}`}
              >
                7 days
              </button>
              <button
                type="button"
                onClick={() => setRange("30D")}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${range === "30D" ? "bg-white text-primary shadow-soft" : "text-text-muted"}`}
              >
                30 days
              </button>
            </div>
          </div>

          <div className="mt-8">
            {chartData.length ? (
              <MoodTrendChart data={chartData} />
            ) : (
              <div className="flex h-[300px] items-center justify-center rounded-[24px] border border-dashed border-border bg-surface-strong text-sm text-text-muted">
                Add a few check-ins to unlock your mood trend.
              </div>
            )}
          </div>
        </Card>

        <div className="space-y-5">
          <Card className="border-none bg-primary p-6 text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/85">Recommended next step</p>
            <h2 className="mt-4 text-2xl font-extrabold text-white">{recommendation.title}</h2>
            <p className="mt-3 text-sm leading-6 text-white/95">{recommendation.text}</p>
            <Link to={recommendation.action} className="mt-6 inline-block">
              <Button variant="secondary">{recommendation.cta}</Button>
            </Link>
          </Card>

          <Card className="border-none bg-white/90">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold">Recent check-ins</h2>
                <p className="mt-1 text-sm text-text-muted">Your latest reflections at a glance.</p>
              </div>
              <Link to="/checkin/history" className="text-sm font-semibold text-primary">View history</Link>
            </div>

            <div className="mt-5 space-y-3">
              {loading ? (
                <p className="text-sm text-text-muted">Loading dashboard data...</p>
              ) : checkIns.length === 0 ? (
                <div className="rounded-[24px] bg-surface-strong p-5 text-sm text-text-muted">
                  No check-ins yet. Your first one will create a baseline for mood trends.
                </div>
              ) : (
                checkIns.slice(0, 4).map((item) => (
                  <div key={item._id} className="rounded-[24px] border border-border-light bg-surface p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold text-text-main">{moodMeta[item.moodLevel]?.label || "Mood logged"}</p>
                        <p className="mt-1 text-xs text-text-muted">{new Date(item.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="rounded-2xl bg-primary/10 px-3 py-2 text-xl font-bold text-primary">
                        {moodMeta[item.moodLevel]?.emoji || "-"}
                      </div>
                    </div>
                    {item.message && (
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-text-body">{item.message.replace(/\[Factors: [^\]]+\]\s*/g, "")}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="border-none bg-white/90">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold">Available counselors</h2>
              <p className="mt-1 text-sm text-text-muted">People in your campus support network.</p>
            </div>
            <Badge variant="primary">{counselors.length} available</Badge>
          </div>
          <div className="mt-5 space-y-3">
            {counselors.length === 0 ? (
              <div className="rounded-[24px] bg-surface-strong p-5 text-sm text-text-muted">
                No counselors are listed yet for your domain.
              </div>
            ) : (
              counselors.map((counselor) => (
                <div key={counselor.id} className="flex items-center justify-between rounded-[24px] border border-border-light bg-surface p-4">
                  <div>
                    <p className="font-semibold text-text-main">{counselor.name}</p>
                    <p className="mt-1 text-sm text-text-muted">Available for supportive follow-up</p>
                  </div>
                  <div className="h-3 w-3 rounded-full bg-status-success" />
                </div>
              ))
            )}
          </div>
        </Card>

        <Card className="border-none bg-white/90">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold">Recommended themes</h2>
              <p className="mt-1 text-sm text-text-muted">Start with the resource categories students usually need first.</p>
            </div>
            <Link to="/reference" className="text-sm font-semibold text-primary">Open library</Link>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {resourceThemes.map((theme) => (
              <div key={theme} className="rounded-[24px] border border-border-light bg-surface-strong p-5">
                <p className="text-lg font-bold text-text-main">{theme}</p>
                <p className="mt-2 text-sm leading-6 text-text-body">
                  Practical guidance, reflection prompts, and coping strategies tailored to this area.
                </p>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
