import React, { useState, FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import Badge from "../components/Badge";
import { Upload, Video, Image as ImageIcon, X } from "lucide-react";

interface MoodOption {
  level: number;
  label: string;
  numeric: string;
  color: string;
}

type Factor = "Academics" | "Sleep" | "Family" | "Social" | "Health" | "Finances" | "Motivation" | "Other";

export default function CheckIn() {
  const navigate = useNavigate();
  const [moodLevel, setMoodLevel] = useState<number>(3);
  const [selectedFactors, setSelectedFactors] = useState<Factor[]>([]);
  const [message, setMessage] = useState<string>("");
  const [anonymous, setAnonymous] = useState<boolean>(false);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [msg, setMsg] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Mood options
  const moods: MoodOption[] = [
    { level: 1, label: "Overwhelmed", numeric: "1", color: "bg-status-error/10 text-status-error border-status-error/20" },
    { level: 2, label: "Stressed", numeric: "2", color: "bg-orange-500/10 text-orange-600 border-orange-500/20" },
    { level: 3, label: "Okay", numeric: "3", color: "bg-gray-500/10 text-gray-600 border-gray-500/20" },
    { level: 4, label: "Good", numeric: "4", color: "bg-primary/10 text-primary border-primary/20" },
    { level: 5, label: "Great", numeric: "5", color: "bg-status-success/10 text-status-success border-status-success/20" },
  ];

  // Factor options
  const factors: Factor[] = [
    "Academics", "Sleep", "Family", "Social", "Health", "Finances", "Motivation", "Other"
  ];

  const toggleFactor = (factor: Factor) => {
    if (selectedFactors.includes(factor)) {
      setSelectedFactors(selectedFactors.filter(f => f !== factor));
    } else {
      setSelectedFactors([...selectedFactors, factor]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    if (mediaFiles.length + files.length > 5) {
      setMsg("You can only upload up to 5 files.");
      return;
    }
    setMediaFiles([...mediaFiles, ...files]);
  };

  const removeFile = (index: number) => {
    setMediaFiles(mediaFiles.filter((_, i) => i !== index));
  };

  const submitCheckIn = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    const formData = new FormData();
    formData.append("moodLevel", moodLevel.toString());
    formData.append("anonymous", anonymous.toString());
    
    // Combine factors into message
    const factorString = selectedFactors.length > 0
      ? `[Factors: ${selectedFactors.join(', ')}]\n\n`
      : "";
    formData.append("message", factorString + message);

    mediaFiles.forEach((file) => {
      formData.append("media", file);
    });

    try {
      await api.post(
        "/checkins",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      navigate("/student");
    } catch (err: any) {
      setMsg(err?.response?.data?.message || "Failed to submit check-in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in slide-in-from-bottom-2 duration-500">
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
                      : "bg-surface text-text-body border-border hover:border-primary/50"
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
              className="w-full px-3 py-2 rounded-xl border border-border-light bg-surface text-text-body focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none min-h-[100px] transition-all"
              placeholder="Share your thoughts here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          {/* Step 4: Media Upload */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-text-main uppercase tracking-wide">
              4. Photos or Videos <span className="text-text-muted font-normal normal-case">(Optional, max 5)</span>
            </label>
            <div className="p-4 border-2 border-dashed border-border-light rounded-xl hover:border-primary/50 transition-colors bg-surface/50">
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="hidden"
                id="media-upload"
              />
              <label htmlFor="media-upload" className="cursor-pointer flex flex-col items-center justify-center gap-2 py-4">
                <div className="w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center text-primary">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="text-sm font-medium text-text-main">Click to upload media</div>
                <div className="text-xs text-text-muted">Supports images and videos up to 50MB</div>
              </label>
            </div>
            {mediaFiles.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                {mediaFiles.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-canvas border border-border-light rounded-xl shadow-sm animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="text-primary p-2 bg-primary/5 rounded-lg">
                        {file.type.startsWith('video') ? (
                          <Video className="w-4 h-4" />
                        ) : (
                          <ImageIcon className="w-4 h-4" />
                        )}
                      </div>
                      <span className="text-xs font-medium text-text-main truncate">{file.name}</span>
                    </div>
                    <button type="button" onClick={() => removeFile(idx)} className="p-1.5 text-status-error hover:bg-status-error/5 rounded-lg transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Privacy Toggle */}
          <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
              />
              <div>
                <span className="block text-sm font-bold text-text-main">Submit anonymously</span>
                <span className="block text-xs text-text-muted mt-0.5">
                  Your name will be hidden from the counselor view. We still see this usage in aggregate data.
                </span>
              </div>
            </label>
          </div>

          {msg && (
            <div className="p-4 rounded-xl bg-status-error/10 text-status-error text-sm font-medium text-center animate-in shake-1">
              {msg}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              className="flex-1 order-2 sm:order-1"
              onClick={() => navigate('/student')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-[2] order-1 sm:order-2"
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
