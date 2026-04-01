import { Link } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import Logo from "../components/Logo";

const steps = [
  {
    title: "Check in honestly",
    description: "Capture how academics, sleep, stress, and life outside class are affecting you today.",
    metric: "2 min",
  },
  {
    title: "Surface what needs attention",
    description: "Spot trends early, flag harder weeks, and understand when it may be time to ask for support.",
    metric: "Early signals",
  },
  {
    title: "Reach the right support",
    description: "Contact counselors, review practical coping guidance, and keep every step inside one secure space.",
    metric: "Private by design",
  },
];

const supportHighlights = [
  "Anonymous check-ins when you need privacy",
  "Counselor follow-up inside your campus environment",
  "Resource library for stress, sleep, anxiety, and focus",
  "Trend tracking that helps students notice patterns sooner",
];

const emergencyOptions = [
  { label: "Campus counselor", text: "Use the portal for non-emergency support and follow-up." },
  { label: "Trusted contact", text: "Reach out to a friend, roommate, parent, or staff member right away." },
  { label: "Emergency services", text: "If someone is in immediate danger, contact local emergency services now." },
];

export default function LandingEnhanced() {
  return (
    <div className="min-h-screen text-text-main">
      <header className="sticky top-0 z-50 border-b border-white/50 glass-panel">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center">
            <Logo type="horizontal" />
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#support-flow" className="text-sm font-semibold text-text-body hover:text-primary">Support flow</a>
            <a href="#why-it-works" className="text-sm font-semibold text-text-body hover:text-primary">Why it works</a>
            <a href="#emergency" className="text-sm font-semibold text-text-body hover:text-primary">Urgent help</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Log In</Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Create Account</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden px-4 pb-20 pt-10 sm:px-6 lg:px-8 lg:pt-16">
          <div className="pointer-events-none absolute inset-0 mesh-highlight opacity-90" />
          <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/75 px-4 py-2 text-sm font-semibold text-primary shadow-soft">
                <span className="h-2.5 w-2.5 rounded-full bg-secondary" />
                Built for academic pressure, emotional honesty, and timely support
              </div>

              <div className="space-y-5">
                <h1 className="max-w-3xl text-5xl font-extrabold leading-tight sm:text-6xl">
                  Support students before stress becomes a crisis.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-text-body sm:text-xl">
                  The Academic Emotional Support Portal gives students a calm place to check in, ask for help, and find campus-ready wellness guidance without feeling exposed or lost.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link to="/login">
                  <Button size="lg" className="w-full sm:w-auto">Start a private check-in</Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">Join your campus portal</Button>
                </Link>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <Card className="border-none bg-white/75 p-5">
                  <p className="text-3xl font-extrabold text-primary">24/7</p>
                  <p className="mt-2 text-sm text-text-body">Self-guided check-ins whenever students need a moment to reflect.</p>
                </Card>
                <Card className="border-none bg-white/75 p-5">
                  <p className="text-3xl font-extrabold text-primary">3 roles</p>
                  <p className="mt-2 text-sm text-text-body">Students, counselors, and admins all work from the same trusted system.</p>
                </Card>
                <Card className="border-none bg-white/75 p-5">
                  <p className="text-3xl font-extrabold text-primary">1 space</p>
                  <p className="mt-2 text-sm text-text-body">Check-ins, support requests, and resources stay connected in one flow.</p>
                </Card>
              </div>
            </div>

            <div className="section-shell mesh-highlight relative overflow-hidden p-6 sm:p-8">
              <div className="absolute right-5 top-5 rounded-full bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-primary">
                Student snapshot
              </div>
              <div className="space-y-6 pt-10">
                <Card className="border-none bg-white/90 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-text-muted">Today's feeling</p>
                      <h2 className="mt-1 text-3xl font-extrabold">Steady, but stretched</h2>
                    </div>
                    <div className="rounded-3xl bg-primary/10 px-4 py-3 text-3xl">3</div>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-text-body">
                    Midterms, low sleep, and money stress are showing up together. A quick check-in can help surface that pattern early.
                  </p>
                </Card>

                <div className="grid gap-4 sm:grid-cols-2">
                  {supportHighlights.map((item) => (
                    <div key={item} className="rounded-[24px] border border-white/60 bg-primary/95 p-4 text-white shadow-soft">
                      <p className="text-sm leading-6">{item}</p>
                    </div>
                  ))}
                </div>

                <div className="rounded-[28px] border border-primary/10 bg-white/80 p-5">
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-secondary">What students can do next</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <span className="rounded-full bg-secondary/10 px-4 py-2 text-sm font-semibold text-secondary">Log a check-in</span>
                    <span className="rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">Request counselor support</span>
                    <span className="rounded-full bg-accent/30 px-4 py-2 text-sm font-semibold text-text-main">Open resource library</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="support-flow" className="px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl section-shell p-8 sm:p-10">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-secondary">Support flow</p>
                <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">A calmer path from pressure to support.</h2>
                <p className="mt-4 max-w-xl text-base leading-7 text-text-body">
                  Students often do not need a complicated system. They need a clear place to pause, be honest, and see the next step without stigma.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                {steps.map((step, index) => (
                  <Card key={step.title} className="border-none bg-white/80 p-6">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-lg font-extrabold text-white">
                      0{index + 1}
                    </div>
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-secondary">{step.metric}</p>
                    <h3 className="mt-3 text-xl font-bold">{step.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-text-body">{step.description}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="why-it-works" className="px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_1fr]">
            <Card className="mesh-highlight overflow-hidden border-none p-8">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-primary">Why it works</p>
              <h2 className="mt-4 text-3xl font-extrabold">Built around trust, not surveillance.</h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-text-body">
                The portal gives students choice. They can check in anonymously, ask for support directly, or browse practical guidance at their own pace.
              </p>
              <div className="mt-8 space-y-3">
                {["Privacy-first check-ins", "Role-based access for safer workflows", "Campus-specific support structure"].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl bg-white/75 px-4 py-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">+</span>
                    <span className="font-semibold text-text-main">{item}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card id="emergency" className="border-none bg-primary p-8 text-white">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-secondary-light">Urgent help</p>
              <h2 className="mt-4 text-3xl font-extrabold text-white">If this feels urgent, do not wait inside the portal.</h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-white/80">
                The portal supports ongoing care and follow-up. It is not a replacement for emergency response when someone may be in immediate danger.
              </p>
              <div className="mt-8 space-y-4">
                {emergencyOptions.map((option) => (
                  <div key={option.label} className="rounded-[24px] border border-white/15 bg-white/10 p-4">
                    <p className="font-bold text-white">{option.label}</p>
                    <p className="mt-2 text-sm leading-6 text-white/80">{option.text}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/40 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-text-muted md:flex-row md:items-center md:justify-between">
          <p>Academic Emotional Support Portal</p>
          <div className="flex flex-wrap items-center gap-5">
            <a href="#support-flow" className="hover:text-primary">Support flow</a>
            <a href="#why-it-works" className="hover:text-primary">Trust and privacy</a>
            <a href="#emergency" className="text-status-error hover:text-status-error">Urgent help guidance</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
