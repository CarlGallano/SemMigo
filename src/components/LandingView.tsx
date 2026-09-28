import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import { I, Ico } from "@/icons"
import { Btn, LogoMark } from "@/components/ui"
import ThemeSwitcher from "@/components/ThemeSwitcher"
import { features } from "@/data"

const landingSteps = [
  {
    n: "01",
    icon: I.subjects,
    color: "var(--accent)",
    bg: "var(--accent-dim)",
    title: "Set up your semester",
    desc: "Add subjects, credits and class times in under a minute.",
  },
  {
    n: "02",
    icon: I.tasks,
    color: "var(--warning)",
    bg: "var(--warning-dim)",
    title: "Plan the week",
    desc: "Turn work into tasks with due dates, tags and priorities.",
  },
  {
    n: "03",
    icon: I.trending,
    color: "var(--success)",
    bg: "var(--success-dim)",
    title: "Track and adjust",
    desc: "Watch GPA, study hours and progress update as you go.",
  },
]

/** Centred eyebrow + heading + description used by each landing section. */
function SectionHead({
  eyebrow,
  title,
  desc,
}: {
  eyebrow: string
  title: string
  desc?: string
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p
        className="text-xs font-semibold uppercase tracking-[0.18em]"
        style={{ color: "var(--accent)" }}
      >
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
        {title}
      </h2>
      {desc && (
        <p
          className="mt-4 text-sm sm:text-base"
          style={{ color: "var(--text-dim)" }}
        >
          {desc}
        </p>
      )}
    </div>
  )
}

/** Public marketing page shown before sign-in. */
export function LandingView({
  onGetStarted,
  dark,
  toggleTheme,
}: {
  onGetStarted: () => void
  dark: boolean
  toggleTheme: () => void
}) {
  return (
    <div
      id="top"
      className="min-h-screen flex flex-col"
      style={{ background: "var(--bg-base)", color: "var(--text)" }}
    >
      <header
        className="landing-nav sticky top-0 z-40 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <a
            href="#top"
            className="flex items-center gap-2.5"
            style={{ color: "var(--text)" }}
          >
            <LogoMark />
            <span className="text-base font-bold">SemMigo</span>
          </a>
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeSwitcher
              dark={dark}
              onToggle={toggleTheme}
              scale={0.5}
              mobileScale={0.4}
            />
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="landing-grid-bg pointer-events-none absolute inset-0" />
          <div
            className="pointer-events-none absolute -top-32 left-1/4 h-80 w-80 rounded-full blur-3xl"
            style={{ background: "var(--accent-dim)" }}
          />

          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pt-14 pb-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pt-24 lg:pb-28">
            <div className="landing-rise">
              <span
                className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium"
                style={{
                  borderColor: "var(--accent-border)",
                  background: "var(--accent-dim)",
                  color: "var(--accent)",
                }}
              >
                <Ico d={I.zap} size={13} /> Built for the semester sprint
              </span>

              <h1 className="mt-6 text-4xl font-semibold leading-[1.08] tracking-tight text-balance sm:text-5xl lg:text-[3.4rem]">
                Everything you need to{" "}
                <span className="landing-gradient-text">ace the semester</span>.
              </h1>

              <p
                className="mt-6 max-w-xl text-base leading-relaxed sm:text-lg"
                style={{ color: "var(--text-dim)" }}
              >
                Your student productivity dashboard — tasks, schedule, grades
                and notes, all in one place. Plan the week once and stop
                juggling five apps.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Btn
                  size="lg"
                  onClick={onGetStarted}
                  className="min-w-44 justify-center sm:min-w-0"
                >
                  Get started free <Ico d={I.arrowRight} size={16} />
                </Btn>
              </div>
            </div>

            <div className="relative order-first lg:order-none mx-auto w-full max-w-72 sm:max-w-80 lg:max-w-none">
              <div
                className="pointer-events-none absolute -inset-8"
                style={{
                  background:
                    "radial-gradient(50% 50% at 50% 50%, var(--accent-dim) 0%, transparent 70%)",
                }}
              />
              <div className="landing-float relative aspect-square scale-110 sm:scale-100">
                <DotLottieReact
                  src={`${import.meta.env.BASE_URL}animations/hero-login.json`}
                  loop
                  autoplay
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="scroll-mt-20 py-16 lg:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHead
              eyebrow="Features"
              title="One home for the whole semester"
              desc="Stop stitching together a notes app, a calendar and three spreadsheets to keep track of a degree."
            />

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="rounded-xl border p-5 transition-transform hover:-translate-y-0.5"
                  style={{
                    background: "var(--bg-surface)",
                    borderColor: "var(--border)",
                  }}
                >
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ background: f.bg, color: f.color }}
                  >
                    <Ico d={f.icon} size={18} />
                  </div>
                  <h3
                    className="mt-4 text-sm font-semibold"
                    style={{ color: "var(--text)" }}
                  >
                    {f.title}
                  </h3>
                  <p
                    className="mt-1.5 text-sm leading-relaxed"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          className="scroll-mt-20 border-y py-16 lg:py-24"
          style={{
            borderColor: "var(--border)",
            background: "var(--bg-surface)",
          }}
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHead
              eyebrow="How it works"
              title="Set up in three steps"
              desc="No import tools, no onboarding call. Add your courses and start planning tonight."
            />

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {landingSteps.map((s) => (
                <div
                  key={s.n}
                  className="relative rounded-xl border p-6"
                  style={{
                    background: "var(--bg-base)",
                    borderColor: "var(--border)",
                  }}
                >
                  <span
                    className="absolute right-5 top-5 text-xs font-medium"
                    style={{
                      color: "var(--text-muted)",
                      fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                    }}
                  >
                    {s.n}
                  </span>
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ background: s.bg, color: s.color }}
                  >
                    <Ico d={s.icon} size={18} />
                  </div>
                  <h3
                    className="mt-4 text-sm font-semibold"
                    style={{ color: "var(--text)" }}
                  >
                    {s.title}
                  </h3>
                  <p
                    className="mt-1.5 text-sm leading-relaxed"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer
        className="border-t"
        style={{
          borderColor: "var(--border)",
          background: "var(--bg-surface)",
        }}
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-start md:justify-between">
          <div>
            <a
              href="#top"
              className="flex items-center gap-2.5"
              style={{ color: "var(--text)" }}
            >
              <LogoMark />
              <span className="text-base font-bold">SemMigo</span>
            </a>
            <p
              className="mt-4 max-w-xs text-xs leading-relaxed"
              style={{ color: "var(--text-muted)" }}
            >
              A student productivity dashboard for tasks, schedules, grades and
              notes.
            </p>
          </div>
        </div>
        <div
          className="border-t"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          <div
            className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs sm:flex-row sm:px-6"
            style={{ color: "var(--text-muted)" }}
          >
            <p>
              &copy; {new Date().getFullYear()} SemMigo. All rights reserved.
            </p>
            <p>Built for students who would rather not juggle five apps.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
