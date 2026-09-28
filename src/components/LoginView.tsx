import { useState, type FormEvent } from "react"
import { I, Ico } from "@/icons"
import ThemeSwitcher from "@/components/ThemeSwitcher"
import { LogoMark } from "@/components/ui"
import {
  demoAccount,
  demoAccounts,
  features,
  findAccount,
  type DemoAccount,
} from "@/data"
import type { User } from "@/types"
import { userFromEmail } from "@/utils"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Sign-in screen: marketing panel on the left, form on the right. */
export function LoginView({
  onSignIn,
  dark,
  toggleTheme,
}: {
  onSignIn: (user: User) => void
  dark: boolean
  toggleTheme: () => void
}) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [remember, setRemember] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  // Fake a short network round-trip so the spinner is visible, then hand the
  // resolved profile to App, which keeps it for the session.
  const start = (user: User) => {
    setError("")
    setBusy(true)
    setTimeout(() => onSignIn(user), 900)
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (busy) return
    const address = email.trim()
    if (!EMAIL_RE.test(address)) {
      setError("Enter a valid email address to continue.")
      return
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }
    // A seeded account must be given its password; an address with no account
    // signs in with a profile derived from the email, the way this
    // backend-less demo has always allowed.
    const account = findAccount(address)
    if (account && account.password !== password) {
      setError("Incorrect password. Demo accounts use student123.")
      return
    }
    start(account ?? userFromEmail(address))
  }

  /** Sign straight in as a seeded account — the fastest way to see the profile
   *  screen follow whoever signed in. */
  const signInAs = (account: DemoAccount) => {
    if (busy) return
    setEmail(account.email)
    setPassword(account.password)
    start(account)
  }

  const demoLogin = () => signInAs(demoAccount)

  return (
    <div
      className="flex min-h-screen"
      style={{ background: "var(--bg-base)", color: "var(--text)" }}
    >
      <div className="fixed top-4 right-4 z-10 hidden lg:block">
        <ThemeSwitcher dark={dark} onToggle={toggleTheme} scale={0.6} />
      </div>

      {/* Marketing panel — desktop only */}
      <div
        className="hidden lg:flex flex-col justify-start w-[46%] max-w-2xl p-10 border-r relative overflow-hidden"
        style={{
          borderColor: "var(--border)",
          background:
            "linear-gradient(135deg, var(--accent-dim) 0%, var(--bg-elevated) 100%)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <LogoMark />
          <span className="text-base font-bold">SemMigo</span>
        </div>

        <div className="max-w-md">
          <h2 className="text-3xl font-semibold leading-tight">
            Everything you need to ace the semester.
          </h2>
          <p className="text-sm mt-3" style={{ color: "var(--text-dim)" }}>
            Your student productivity dashboard — tasks, schedule, grades and
            notes, all in one place.
          </p>

          <div className="mt-8 space-y-4">
            {features.slice(0, 4).map((f) => (
              <div key={f.title} className="flex items-start gap-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: f.bg, color: f.color }}
                >
                  <Ico d={f.icon} size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium">{f.title}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <LogoMark />
            <span className="text-base font-bold">SemMigo</span>
          </div>

          <h1 className="text-2xl font-semibold">Welcome back</h1>
          <p className="text-sm mt-1.5" style={{ color: "var(--text-muted)" }}>
            Sign in to your student productivity dashboard
          </p>

          {error && (
            <div
              className="mt-4 flex items-center gap-2 rounded-lg border px-3.5 py-2.5 text-xs"
              style={{
                background: "var(--danger-dim)",
                color: "var(--danger)",
                borderColor: "rgba(239,68,68,0.2)",
              }}
            >
              <Ico d={I.close} size={14} /> {error}
            </div>
          )}

          <form className="mt-6 space-y-4" onSubmit={submit}>
            <div>
              <label
                htmlFor="login-email"
                className="block text-xs mb-1.5"
                style={{ color: "var(--text-muted)" }}
              >
                Email
              </label>
              <div className="relative">
                <span
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--text-muted)" }}
                >
                  <Ico d={I.mail} size={16} />
                </span>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setError("")
                  }}
                  placeholder=""
                  autoComplete="email"
                  className="login-input w-full rounded-lg pl-9 pr-3 py-2.5 text-sm border outline-none"
                  style={{
                    background: "var(--bg-elevated)",
                    color: "var(--text)",
                    borderColor: "var(--border)",
                  }}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="block text-xs mb-1.5"
                style={{ color: "var(--text-muted)" }}
              >
                Password
              </label>
              <div className="relative">
                <span
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--text-muted)" }}
                >
                  <Ico d={I.lock} size={16} />
                </span>
                <input
                  id="login-password"
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setError("")
                  }}
                  placeholder=""
                  autoComplete="current-password"
                  className="login-input w-full rounded-lg pl-9 pr-10 py-2.5 text-sm border outline-none"
                  style={{
                    background: "var(--bg-elevated)",
                    color: "var(--text)",
                    borderColor: "var(--border)",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  title={showPw ? "Hide password" : "Show password"}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer transition-opacity hover:opacity-70"
                  style={{ color: "var(--text-muted)" }}
                >
                  <Ico d={showPw ? I.eyeOff : I.eye} size={16} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label
                className="flex items-center gap-2 cursor-pointer select-none"
                style={{ color: "var(--text-dim)" }}
              >
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-3.5 h-3.5 cursor-pointer"
                  style={{ accentColor: "var(--accent)" }}
                />
                Remember me
              </label>
              <button
                type="button"
                className="font-medium cursor-pointer transition-opacity hover:opacity-80"
                style={{ color: "var(--accent)" }}
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium text-white cursor-pointer transition-opacity hover:opacity-90 disabled:opacity-70"
              style={{ background: "var(--accent)" }}
            >
              {busy ? (
                <>
                  <span
                    className="login-spinner w-4 h-4 rounded-full inline-block"
                    style={{
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTopColor: "white",
                    }}
                  />{" "}
                  Signing in...
                </>
              ) : (
                <>
                  Sign In <Ico d={I.arrowRight} size={15} />
                </>
              )}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div
              className="flex-1 h-px"
              style={{ background: "var(--border)" }}
            />
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              or
            </span>
            <div
              className="flex-1 h-px"
              style={{ background: "var(--border)" }}
            />
          </div>

          <button
            onClick={demoLogin}
            disabled={busy}
            className="w-full flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium cursor-pointer transition-opacity hover:opacity-80 disabled:opacity-70"
            style={{
              background: "var(--bg-elevated)",
              color: "var(--text-dim)",
              border: "1px solid var(--border)",
            }}
          >
            <Ico d={I.graduation} size={15} /> Try Demo Account
          </button>

          {/* Each seeded account carries its own profile, so these chips are
              the quickest way to watch the profile screen change hands. */}
          <div className="mt-4">
            <p
              className="text-center text-[11px] mb-2"
              style={{ color: "var(--text-muted)" }}
            >
              or sign in as a seeded demo user
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {demoAccounts.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => signInAs(account)}
                  disabled={busy}
                  title={account.email}
                  className="rounded-full border px-3 py-1 text-[11px] font-medium cursor-pointer transition-opacity hover:opacity-80 disabled:opacity-60"
                  style={{
                    background: "var(--bg-elevated)",
                    color: "var(--text-dim)",
                    borderColor: "var(--border)",
                  }}
                >
                  {account.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
