import { Link } from "react-router-dom";
import Button from "../components/Button";
import Logo from "../components/Logo";

const quickPoints = [
  "Private emotional check-ins",
  "Direct counselor support",
  "Simple campus wellness resources",
];

export default function LandingEnhanced() {
  return (
    <div className="min-h-screen bg-canvas text-text-main">
      <header className="border-b border-white/50 glass-panel">
        <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center">
            <Logo type="horizontal" />
          </Link>

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

      <main className="px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <section className="section-shell mesh-highlight overflow-hidden p-8 sm:p-10 lg:p-14">
            <div className="max-w-3xl space-y-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary">
                Academic Emotional Support Portal
              </p>

              <div className="space-y-4">
                <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
                  A simple place for students to check in and get support.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-text-body sm:text-lg">
                  Track how you are doing, reach out to counselors, and find helpful resources without extra clutter.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link to="/login">
                  <Button size="lg" className="w-full sm:w-auto">Start Check-In</Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">Join Portal</Button>
                </Link>
              </div>
            </div>
          </section>

          <section className="mt-8 grid gap-4 md:grid-cols-3">
            {quickPoints.map((point) => (
              <div
                key={point}
                className="rounded-[24px] border border-white/60 bg-surface/90 p-5 shadow-soft"
              >
                <p className="text-base font-semibold text-text-main">{point}</p>
              </div>
            ))}
          </section>
        </div>
      </main>

      <footer className="border-t border-white/40 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl text-sm text-text-muted">
          Academic Emotional Support Portal
        </div>
      </footer>
    </div>
  );
}
