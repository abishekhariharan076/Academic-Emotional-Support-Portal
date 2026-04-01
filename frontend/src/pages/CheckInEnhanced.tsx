import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import Card from "../components/Card";
import Button from "../components/Button";
import Badge from "../components/Badge";

const moods = [
  { level: 1, label: "Overwhelmed", helper: "Things feel heavy and hard to manage.", accent: "bg-status-error/10 text-status-error border-status-error/20" },
  { level: 2, label: "Stressed", helper: "Pressure is building and affecting focus.", accent: "bg-secondary/10 text-secondary border-secondary/20" },
  { level: 3, label: "Steady", helper: "You are managing, but still carrying some strain.", accent: "bg-text-main/8 text-text-main border-text-main/10" },
  { level: 4, label: "Good", helper: "You feel mostly grounded and capable today.", accent: "bg-primary/10 text-primary border-primary/20" },
  { level: 5, label: "Thriving", helper: "Energy and motivation feel strong right now.", accent: "bg-status-success/10 text-status-success border-status-success/20" },
] as const;

const factors = ["Academics", "Sleep", "Family", "Social", "Health", "Finances", "Motivation", "Other"] as const;
type Factor = typeof factors[number];

const reflectionPrompts: Record<number, string> = {
  1: "What would make the next few hours feel safer or lighter?",
  2: "Which pressure is taking the most space in your mind today?",
  3: "What is going okay, and what still feels fragile?",
  4: "What helped you feel more steady today?",
  5: "What would you like to keep doing while this feels manageable?",
};

export default function CheckInEnhanced() {
  const navigate = useNavigate();
  const [moodLevel, setMoodLevel] = useState<number>(3);
  const [selectedFactors, setSelectedFactors] = useState<Factor[]>([]);
  const [message, setMessage] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedMood = moods.find((item) => item.level === moodLevel);

  const toggleFactor = (factor: Factor) => {
    setSelectedFactors((current) =>
      current.includes(factor) ? current.filter((item) => item !== factor) : [...current, factor]
    );
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const totalFiles = mediaFiles.length + files.length;

    if (totalFiles > 5) {
      setMsg("You can upload up to 5 files.");
      return;
    }

    const oversized = files.find((file) => file.size > 50 * 1024 * 1024);
    if (oversized) {
      setMsg("Each file must be under 50MB.");
      return;
    }

    setMsg("");
    setMediaFiles((current) => [...current, ...files]);
  };

  const removeFile = (index: number) => {
    setMediaFiles((current) => current.filter((_, fileIndex) => fileIndex !== index));
  };

  const checkInSummary = useMemo(() => {
    if (!selectedFactors.length && !message.trim()) {
      return "You have not added extra context yet.";
    }

    const pieces: string[] = [];
    if (selectedFactors.length) {
      pieces.push(`Main factors: ${selectedFactors.join(", ")}`);
    }
    if (message.trim()) {
      pieces.push(`Reflection length: ${message.trim().split(/\s+/).length} words`);
    }
    return pieces.join(" | ");
  }, [message, selectedFactors]);

  const submitCheckIn = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMsg("");

    const formData = new FormData();
    formData.append("moodLevel", moodLevel.toString());
    formData.append("anonymous", String(anonymous));

    const factorString = selectedFactors.length ? `[Factors: ${selectedFactors.join(", ")}]\n\n` : "";
    formData.append("message", `${factorString}${message}`.trim());

    mediaFiles.forEach((file) => {
      formData.append("media", file);
    });

    try {
      await api.post("/checkins", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/student");
    } catch (error: any) {
      setMsg(error?.response?.data?.message || "Failed to submit check-in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <section className="section-shell mesh-highlight overflow-hidden p-6 sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.7fr] lg:items-end">
          <div>
            <Badge variant="secondary">Private reflection</Badge>
            <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">Take a moment and check in with yourself.</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-text-body">
              This form is designed to help you name what you are carrying, attach context if it helps, and decide whether to keep your response anonymous.
            </p>
          </div>
          <Card className="border-none bg-white/85 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-text-muted">Current selection</p>
            <p className="mt-3 text-3xl font-extrabold text-primary">{selectedMood?.label}</p>
            <p className="mt-2 text-sm leading-6 text-text-body">{selectedMood?.helper}</p>
            <p className="mt-4 text-sm text-text-muted">{checkInSummary}</p>
          </Card>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-none bg-white/90">
          <form onSubmit={submitCheckIn} className="space-y-8">
            <section className="space-y-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-secondary">Step 1</p>
                <h2 className="mt-2 text-2xl font-extrabold">How are you feeling today?</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                {moods.map((mood) => {
                  const isActive = mood.level === moodLevel;
                  return (
                    <button
                      key={mood.level}
                      type="button"
                      onClick={() => setMoodLevel(mood.level)}
                      className={`rounded-[26px] border p-4 text-left transition-all ${isActive ? `${mood.accent} scale-[1.01] shadow-soft` : "border-border-light bg-surface hover:border-primary/25 hover:bg-surface-strong"}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-3xl font-extrabold">{mood.level}</span>
                        {isActive && <Badge variant="primary">Selected</Badge>}
                      </div>
                      <p className="mt-4 font-bold text-text-main">{mood.label}</p>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="space-y-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-secondary">Step 2</p>
                <h2 className="mt-2 text-2xl font-extrabold">What is influencing this feeling?</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {factors.map((factor) => {
                  const active = selectedFactors.includes(factor);
                  return (
                    <button
                      key={factor}
                      type="button"
                      onClick={() => toggleFactor(factor)}
                      className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${active ? "border-primary bg-primary text-white" : "border-border-light bg-surface text-text-body hover:border-primary/30 hover:bg-primary-light/40"}`}
                    >
                      {factor}
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="space-y-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-secondary">Step 3</p>
                <h2 className="mt-2 text-2xl font-extrabold">Add a little context</h2>
                <p className="mt-2 text-sm text-text-muted">{reflectionPrompts[moodLevel]}</p>
              </div>
              <textarea
                className="min-h-[170px] w-full rounded-[24px] border border-border-light bg-surface px-4 py-4 text-text-body outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                placeholder="Write whatever feels useful. Short is fine."
                value={message}
                onChange={(event) => setMessage(event.target.value)}
              />
            </section>

            <section className="space-y-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-secondary">Step 4</p>
                <h2 className="mt-2 text-2xl font-extrabold">Optional media</h2>
              </div>
              <div className="rounded-[28px] border-2 border-dashed border-border bg-surface-strong p-6">
                <input
                  id="media-upload"
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="media-upload" className="block cursor-pointer text-center">
                  <p className="text-base font-bold text-text-main">Upload photos or videos</p>
                  <p className="mt-2 text-sm text-text-muted">Optional, up to 5 files and 50MB each.</p>
                </label>
              </div>
              {mediaFiles.length > 0 && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {mediaFiles.map((file, index) => (
                    <div key={`${file.name}-${index}`} className="flex items-center justify-between rounded-[22px] border border-border-light bg-surface px-4 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-text-main">{file.name}</p>
                        <p className="text-xs text-text-muted">{Math.round(file.size / 1024)} KB</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="rounded-full px-3 py-1 text-sm font-semibold text-status-error hover:bg-status-error/10"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-[28px] border border-primary/10 bg-primary-light/40 p-5">
              <label className="flex cursor-pointer items-start gap-4">
                <input
                  type="checkbox"
                  checked={anonymous}
                  onChange={(event) => setAnonymous(event.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                <div>
                  <p className="font-semibold text-text-main">Submit anonymously</p>
                  <p className="mt-1 text-sm leading-6 text-text-body">
                    Your counselor will not see your name in the request view. The portal still keeps the submission linked securely for system access control.
                  </p>
                </div>
              </label>
            </section>

            {msg && (
              <div className="rounded-[22px] bg-status-error/10 px-4 py-3 text-sm font-semibold text-status-error">
                {msg}
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button type="button" variant="ghost" className="sm:flex-1" onClick={() => navigate("/student")}>
                Cancel
              </Button>
              <Button type="submit" size="lg" className="sm:flex-[1.4]" disabled={loading}>
                {loading ? "Submitting..." : "Submit check-in"}
              </Button>
            </div>
          </form>
        </Card>

        <div className="space-y-5">
          <Card className="border-none bg-white/90">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-secondary">Reflection guide</p>
            <h2 className="mt-3 text-2xl font-extrabold">What makes a useful check-in?</h2>
            <div className="mt-5 space-y-4 text-sm leading-6 text-text-body">
              <p>Name the strongest feeling first, even if it is messy or unclear.</p>
              <p>Add only the context you want to remember later. Short notes are still valuable.</p>
              <p>If today feels especially difficult, pairing the check-in with a support request can help you get a response sooner.</p>
            </div>
          </Card>

          <Card className="border-none bg-primary p-6 text-white">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-secondary-light">Need more than a check-in?</p>
            <h2 className="mt-3 text-2xl font-extrabold text-white">Support requests stay one step away.</h2>
            <p className="mt-3 text-sm leading-6 text-white/80">
              If your stress feels hard to carry alone, you can submit this check-in and then open a counselor request with the same context still fresh in your mind.
            </p>
            <Button type="button" variant="secondary" className="mt-6" onClick={() => navigate("/support")}>
              Go to support requests
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
