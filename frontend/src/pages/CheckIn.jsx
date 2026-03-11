import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import Badge from "../components/Badge";

export default function CheckIn() {
  const navigate = useNavigate();
  const [moodLevel, setMoodLevel] = useState(3);
  const [selectedFactors, setSelectedFactors] = useState([]);
  const [message, setMessage] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Mood options
  const moods = [
    { level: 1, label: "Overwhelmed", numeric: "1", color: "bg-status-error/10 text-status-error border-status-error/20" },
    { level: 2, label: "Stressed", numeric: "2", color: "bg-orange-500/10 text-orange-600 border-orange-500/20" },
    { level: 3, label: "Okay", numeric: "3", color: "bg-gray-500/10 text-gray-600 border-gray-500/20" },
    { level: 4, label: "Good", numeric: "4", color: "bg-primary/10 text-primary border-primary/20" },
    { level: 5, label: "Great", numeric: "5", color: "bg-status-success/10 text-status-success border-status-success/20" },
  ];

  // Factor options
  const factors = [
    "Academics", "Sleep", "Family", "Social", "Health", "Finances", "Motivation", "Other"
  ];

  const toggleFactor = (factor) => {
    if (selectedFactors.includes(factor)) {
      setSelectedFactors(selectedFactors.filter(f => f !== factor));
    } else {
      setSelectedFactors([...selectedFactors, factor]);
    }
  };

  const submitCheckIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    // Combine factors into message since backend doesn't support them natively yet
    const factorString = selectedFactors.length > 0
      ? `[Factors: ${selectedFactors.join(', ')}]\n\n`
      : "";
    const finalMessage = factorString + message;

    try {
      await api.post(
        "/checkins",
        { moodLevel, message: finalMessage, anonymous },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      navigate("/student");
    } catch (err) {
      setMsg(err?.response?.data?.message || "Failed to submit check-in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-text-main">Emotional Check-In</h1>
        <p className="text-text-body mt-1">Take a moment to reflect. Your response helps us support you.</p>
      </div>

      <Card>
        <form onSubmit={submitCheckIn} className="space-y-8">

          {/* Step 1: Mood */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-text-main uppercase tracking-wide">
              1. How are you feeling today?
            </label>
            <div className="grid grid-cols-5 gap-2 md:gap-4">
              {moods.map((m) => (
                <button
                  key={m.level}
                  type="button"
                  onClick={() => setMoodLevel(m.level)}
                  className={`
                    flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300
                    ${moodLevel === m.level
                      ? `${m.color} ring-4 ring-primary/5 scale-105 shadow-md z-10 font-bold`
                      : "bg-surface border-border-light text-text-muted hover:bg-gray-50 opacity-60 hover:opacity-100"
                    }
                  `}
                >
                  <span className="text-3xl md:text-4xl font-black mb-1.5">{m.numeric}</span>
                  <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Factors */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-text-main uppercase tracking-wide">
              2. What's affecting you? <span className="text-text-muted font-normal normal-case">(Select all that apply)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {factors.map(factor => (
                <button
                  key={factor}
                  type="button"
                  onClick={() => toggleFactor(factor)}
                  className={`
                    px-3 py-1.5 rounded-full text-sm font-medium transition-colors border
                    ${selectedFactors.includes(factor)
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-text-body border-border hover:border-primary/50"
                    }
                  `}
                >
                  {factor}
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Message */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-text-main uppercase tracking-wide">
              3. Anything else on your mind? <span className="text-text-muted font-normal normal-case">(Optional)</span>
            </label>
            <textarea
              className="w-full px-3 py-2 rounded-xl border border-border-light text-text-body focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none min-h-[100px]"
              placeholder="Share your thoughts here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          {/* Step 4: Privacy */}
          <div className="p-4 bg-secondary/5 rounded-xl border border-secondary/10">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
              />
              <div>
                <span className="block text-sm font-medium text-text-main">Submit anonymously</span>
                <span className="block text-xs text-text-muted mt-0.5">
                  Your name will be hidden from the counselor view. We still see this usage in aggregate data.
                </span>
              </div>
            </label>
          </div>

          {msg && (
            <div className="p-3 rounded-lg bg-status-error/10 text-status-error text-sm font-medium text-center">
              {msg}
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="ghost"
              className="flex-1"
              onClick={() => navigate('/student')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-[2]"
              size="lg"
            >
              {loading ? "Submitting..." : "Submit Check-In"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
