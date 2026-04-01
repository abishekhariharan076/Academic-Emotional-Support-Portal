import { useEffect, useMemo, useState } from "react";
import { api } from "../services/api";
import Card from "../components/Card";
import Badge from "../components/Badge";
import Button from "../components/Button";
import Modal from "../components/Modal";

interface ResourceSection {
  title: string;
  text: string;
}

interface Resource {
  _id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  link?: string;
  fullContent?: ResourceSection[];
}

type SupportNeed = "Calm down" | "Sleep better" | "Focus again" | "Ask for support";
type EnergyLevel = "Low energy" | "Some energy" | "Ready to act";
type TimeWindow = "5 minutes" | "15 minutes" | "30+ minutes";

const categories = ["All", "Anxiety", "Sleep", "Focus", "Stress", "General"];
const supportNeeds: SupportNeed[] = ["Calm down", "Sleep better", "Focus again", "Ask for support"];
const energyLevels: EnergyLevel[] = ["Low energy", "Some energy", "Ready to act"];
const timeWindows: TimeWindow[] = ["5 minutes", "15 minutes", "30+ minutes"];

const plannerMap: Record<SupportNeed, Record<EnergyLevel, Record<TimeWindow, string[]>>> = {
  "Calm down": {
    "Low energy": {
      "5 minutes": ["Step away from the task for one full breath cycle.", "Unclench your jaw and relax your shoulders.", "Open one short anxiety or stress resource."],
      "15 minutes": ["Move to a quieter space if possible.", "Do slow breathing for 3 to 5 minutes.", "Write one sentence about what feels most intense right now."],
      "30+ minutes": ["Pause schoolwork for a reset block.", "Take a walk, shower, or sit somewhere grounding.", "Return only after choosing one manageable next step."],
    },
    "Some energy": {
      "5 minutes": ["Try box breathing or a 5-4-3-2-1 grounding exercise.", "Mute distracting notifications.", "Pick one stress resource to skim."],
      "15 minutes": ["Journal the top stressor and what is under your control.", "Drink water and stretch.", "Message someone safe if you need company."],
      "30+ minutes": ["Build a short decompression routine.", "Review whether the stress needs counselor support.", "Choose one non-urgent task to postpone."],
    },
    "Ready to act": {
      "5 minutes": ["Name the trigger clearly.", "Choose one calming technique and do it immediately.", "Set a reminder to check in later tonight."],
      "15 minutes": ["Make a quick plan for the rest of the day.", "Reduce one pressure source.", "Open the portal support form if the feeling keeps rising."],
      "30+ minutes": ["Create a fuller recovery block with food, water, and rest.", "Rework your task list into must-do and can-wait.", "Follow up with a counselor if this pattern repeats."],
    },
  },
  "Sleep better": {
    "Low energy": {
      "5 minutes": ["Dim screens or switch to night mode.", "Stop starting new tasks.", "Open a sleep resource instead of scrolling."],
      "15 minutes": ["Pack tomorrow's essentials now.", "Set one realistic bedtime target.", "Avoid caffeine or a heavy snack late tonight."],
      "30+ minutes": ["Start a screen-light wind-down routine.", "Take a warm shower or read something quiet.", "Protect the next morning from overscheduling."],
    },
    "Some energy": {
      "5 minutes": ["List what still must happen tonight.", "Drop one non-essential task.", "Set an alarm for bedtime, not just wake-up."],
      "15 minutes": ["Reset your desk and room for sleep.", "Write tomorrow's top three tasks so your brain can let go.", "Choose one calming resource to read."],
      "30+ minutes": ["Follow a simple pre-sleep routine.", "Keep lights low and avoid intense studying.", "Aim for consistency more than perfection."],
    },
    "Ready to act": {
      "5 minutes": ["Check whether your next choice helps or hurts sleep.", "Close the most stimulating tab or app.", "Plan tomorrow around better rest."],
      "15 minutes": ["Prepare for a full sleep-focused evening.", "Set boundaries with friends or work if needed.", "Use a resource on sleep hygiene to guide the routine."],
      "30+ minutes": ["Commit to a full wind-down block.", "Reduce noise, brightness, and pressure.", "Track how you feel tomorrow after better sleep."],
    },
  },
  "Focus again": {
    "Low energy": {
      "5 minutes": ["Pick the smallest possible task.", "Set a timer for one short work sprint.", "Hide every unrelated tab or device."],
      "15 minutes": ["Break the assignment into three tiny steps.", "Start with the easiest one.", "Use a focus resource if your mind feels scattered."],
      "30+ minutes": ["Build one protected study block.", "Use short work and break cycles.", "Stop if you notice overwhelm turning into panic."],
    },
    "Some energy": {
      "5 minutes": ["Write the exact task you are avoiding.", "Choose one starting sentence or question.", "Begin before motivation feels perfect."],
      "15 minutes": ["Time-block one realistic study session.", "Use headphones or a quieter place.", "Reward yourself after one completed chunk."],
      "30+ minutes": ["Run two or three Pomodoro cycles.", "Review what helped attention return.", "Carry the best tactic into tomorrow."],
    },
    "Ready to act": {
      "5 minutes": ["Set one clear output goal.", "Start immediately on the highest-value item.", "Ignore polishing until later."],
      "15 minutes": ["Map the rest of the session.", "Use a checklist to keep momentum visible.", "Notice whether sleep or stress is hurting focus."],
      "30+ minutes": ["Build a deeper work block with breaks.", "Protect it from messages and multitasking.", "If focus keeps crashing, switch to support-oriented care."],
    },
  },
  "Ask for support": {
    "Low energy": {
      "5 minutes": ["Open the support request page.", "Write one sentence about what feels hardest.", "Submit even if the message is brief."],
      "15 minutes": ["Use your latest check-in for context.", "Name whether this is academic, emotional, or both.", "Ask for follow-up rather than solving everything alone."],
      "30+ minutes": ["Write a fuller message with examples.", "Include what kind of help would feel useful.", "Reach out to a trusted person too if needed."],
    },
    "Some energy": {
      "5 minutes": ["Decide who needs to know first.", "Start with the counselor request if you want structure.", "Keep the first message simple and honest."],
      "15 minutes": ["Gather the details you want to share.", "Mention any repeated patterns from recent weeks.", "Submit the request before second-guessing it."],
      "30+ minutes": ["Pair the request with a check-in and one resource.", "List what support would look like this week.", "Set a reminder to review responses."],
    },
    "Ready to act": {
      "5 minutes": ["Open the portal and send the message now.", "State urgency clearly if you need a prompt reply.", "Plan one gentle thing to do after sending."],
      "15 minutes": ["Write the request with context and desired support.", "Be direct about deadlines, panic, or safety concerns.", "Use the resource library while waiting."],
      "30+ minutes": ["Create a full support plan for the next 24 hours.", "Contact both campus support and someone you trust.", "Use urgent help options if immediate safety is involved."],
    },
  },
};

export default function ResourcesEnhanced() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [selectedNeed, setSelectedNeed] = useState<SupportNeed>("Calm down");
  const [selectedEnergy, setSelectedEnergy] = useState<EnergyLevel>("Low energy");
  const [selectedTime, setSelectedTime] = useState<TimeWindow>("5 minutes");

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      try {
        const response = await api.get("/reference");
        setResources(response.data || []);
      } catch (error) {
        console.error("Failed to fetch references", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const matchesCategory = filter === "All" || resource.category === filter;
      const haystack = `${resource.title} ${resource.description} ${resource.category} ${resource.type}`.toLowerCase();
      const matchesQuery = haystack.includes(query.trim().toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [filter, query, resources]);

  const featuredResources = useMemo(() => filteredResources.slice(0, 3), [filteredResources]);
  const plannerSteps = plannerMap[selectedNeed][selectedEnergy][selectedTime];

  const openResource = (resource: Resource) => {
    if (resource.fullContent) {
      setSelectedResource(resource);
      return;
    }

    if (resource.link) {
      window.open(resource.link, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="space-y-8">
      <section className="section-shell mesh-highlight overflow-hidden p-6 sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.7fr] lg:items-end">
          <div>
            <Badge variant="secondary">Resource library</Badge>
            <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">Support resources students can actually use.</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-text-body">
              Search across practical guidance for stress, sleep, focus, anxiety, and day-to-day emotional care. Open short reads when you need help fast, or explore deeper content when you have time.
            </p>
          </div>
          <Card className="border-none bg-white/85 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-text-muted">Library overview</p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-3xl font-extrabold text-primary">{resources.length}</p>
                <p className="mt-1 text-sm text-text-body">Resources available</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-primary">{categories.length - 1}</p>
                <p className="mt-1 text-sm text-text-body">Core support categories</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-[0.78fr_1.22fr]">
        <Card className="border-none bg-white/90">
          <h2 className="text-xl font-extrabold">Find the right kind of help</h2>
          <p className="mt-2 text-sm text-text-muted">Search by topic, then narrow by category.</p>

          <div className="mt-5 space-y-4">
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search stress, sleep, focus, anxiety..."
              className="w-full rounded-full border border-border-light bg-surface px-4 py-3 text-sm text-text-main outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setFilter(category)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${filter === category ? "bg-primary text-white" : "bg-surface-strong text-text-body hover:bg-primary-light/40 hover:text-primary"}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </Card>

        <Card className="border-none bg-[linear-gradient(135deg,#244f45_0%,#1d433a_52%,#17362f_100%)] p-6 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary-light">Quick support planner</p>
          <h2 className="mt-3 text-2xl font-extrabold text-white">Build a realistic next step in under a minute.</h2>
          <p className="mt-3 text-sm leading-6 text-white/88">
            Choose what you need, how much energy you have, and how much time is available. The planner will turn that into a short, doable action sequence.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/78">Need</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {supportNeeds.map((need) => (
                  <button
                    key={need}
                    type="button"
                    onClick={() => setSelectedNeed(need)}
                    className={`rounded-full border px-3 py-2 text-sm font-semibold transition ${selectedNeed === need ? "border-white bg-white text-primary shadow-sm" : "border-white/18 bg-[#f4efe6] text-text-main hover:border-white/35 hover:bg-white"}`}
                  >
                    {need}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/78">Energy</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {energyLevels.map((energy) => (
                  <button
                    key={energy}
                    type="button"
                    onClick={() => setSelectedEnergy(energy)}
                    className={`rounded-full border px-3 py-2 text-sm font-semibold transition ${selectedEnergy === energy ? "border-secondary bg-secondary text-white shadow-sm" : "border-white/18 bg-[#f4efe6] text-text-main hover:border-white/35 hover:bg-white"}`}
                  >
                    {energy}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/78">Time</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {timeWindows.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    className={`rounded-full border px-3 py-2 text-sm font-semibold transition ${selectedTime === time ? "border-accent bg-accent text-text-main shadow-sm" : "border-white/18 bg-[#f4efe6] text-text-main hover:border-white/35 hover:bg-white"}`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-[28px] border border-white/12 bg-white/12 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/78">Suggested action path</p>
            <div className="mt-4 space-y-3">
              {plannerSteps.map((step, index) => (
                <div key={`${selectedNeed}-${selectedEnergy}-${selectedTime}-${index}`} className="flex items-start gap-3 rounded-[22px] bg-white/14 px-4 py-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold text-primary">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-6 text-white/92">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </section>

      <section className="grid gap-8 xl:grid-cols-[0.75fr_1.25fr]">
        <Card className="border-none bg-white/90">
          <h2 className="text-xl font-extrabold">Use the portal intentionally</h2>
          <p className="mt-2 text-sm text-text-muted">Three simple rules that make the library more useful.</p>
          <div className="mt-5 space-y-3">
            {[
              "Pick the smallest useful resource first when you feel overloaded.",
              "If the same stressor keeps returning, pair reading with a check-in.",
              "Use a support request when self-guided resources are not enough.",
            ].map((tip) => (
              <div key={tip} className="rounded-[22px] bg-surface-strong p-4 text-sm leading-6 text-text-body">
                {tip}
              </div>
            ))}
          </div>
        </Card>

        <Card className="border-none bg-white/90">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold">Featured right now</h2>
              <p className="mt-1 text-sm text-text-muted">A quick starting point from your current filter.</p>
            </div>
            <Badge variant="primary">{filteredResources.length} matches</Badge>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {featuredResources.length === 0 && !loading ? (
              <div className="md:col-span-3 rounded-[26px] bg-surface-strong p-6 text-sm text-text-muted">
                No featured resources match your current search.
              </div>
            ) : (
              featuredResources.map((resource) => (
                <div key={resource._id} className="rounded-[26px] border border-border-light bg-surface-strong p-5">
                  <Badge variant="secondary">{resource.category}</Badge>
                  <h3 className="mt-4 text-lg font-bold text-text-main">{resource.title}</h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-text-body">{resource.description}</p>
                </div>
              ))
            )}
          </div>
        </Card>
      </section>

      <section>
        {loading ? (
          <Card className="border-none bg-white/90 py-12 text-center text-text-muted">Loading resources...</Card>
        ) : filteredResources.length === 0 ? (
          <Card className="border-none bg-white/90 py-12 text-center">
            <h2 className="text-2xl font-extrabold">No resources found</h2>
            <p className="mt-3 text-sm text-text-muted">Try a different search term or switch back to all categories.</p>
          </Card>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredResources.map((resource) => (
              <Card key={resource._id} className="border-none bg-white/90">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-3">
                    <Badge variant="secondary">{resource.category}</Badge>
                    <h3 className="text-xl font-extrabold">{resource.title}</h3>
                  </div>
                  <span className="rounded-full bg-surface-strong px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
                    {resource.type}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-6 text-text-body">{resource.description}</p>
                <Button variant="outline" className="mt-6 w-full" onClick={() => openResource(resource)}>
                  {resource.fullContent ? "Read article" : "Open resource"}
                </Button>
              </Card>
            ))}
          </div>
        )}
      </section>

      <Modal isOpen={Boolean(selectedResource)} onClose={() => setSelectedResource(null)} title={selectedResource?.title}>
        {selectedResource?.fullContent && Array.isArray(selectedResource.fullContent) && (
          <div className="space-y-6">
            {selectedResource.fullContent.map((section, index) => (
              <section key={`${section.title}-${index}`}>
                <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-secondary">{section.title}</h4>
                <p className="mt-3 text-sm leading-7 text-text-main">{section.text}</p>
              </section>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}
