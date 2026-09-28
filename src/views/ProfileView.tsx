import { I, Ico } from "@/icons"
import { Btn, Card } from "@/components/ui"
import ThemeSwitcher from "@/components/ThemeSwitcher"
import type { Subject, Task, User } from "@/types"
import { initialsFromName, weightedGpa } from "@/utils"

/** Account summary, theme preference and sign out. The identity comes from the
 *  signed-in `user`, so this screen always describes whoever logged in. */
export function ProfileView({
  user,
  tasks,
  subjects,
  dark,
  toggleTheme,
  onSignOut,
}: {
  user: User
  tasks: Task[]
  subjects: Subject[]
  dark: boolean
  toggleTheme: () => void
  onSignOut: () => void
}) {
  const pending = tasks.filter((t) => !t.done).length
  const completed = tasks.filter((t) => t.done).length
  const totalCredits = subjects.reduce((s, g) => s + g.credits, 0)
  // Shared with the Grades screen so the two numbers can never disagree.
  const gpa = weightedGpa(subjects)

  const stats = [
    { label: "GPA", value: gpa },
    { label: "Tasks", value: `${completed}/${completed + pending}` },
    { label: "Credits", value: String(totalCredits) },
  ]

  return (
    <div className="space-y-5 max-w-lg">
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          {/* Decorative: the name sits right beside it, so screen readers get
              the identity once from the heading rather than twice. */}
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold"
            style={{ background: "var(--accent-dim)", color: "var(--accent)" }}
            aria-hidden="true"
          >
            {initialsFromName(user.name)}
          </div>
          <div>
            <h2
              className="text-lg font-semibold"
              style={{ color: "var(--text)" }}
            >
              {user.name}
            </h2>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {[user.major, user.year].filter(Boolean).join(" · ")}
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-dim)" }}>
              {user.email}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p
                className="text-xl font-semibold"
                style={{ color: "var(--accent)" }}
              >
                {s.value}
              </p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <h3
          className="text-sm font-semibold mb-4"
          style={{ color: "var(--text)" }}
        >
          Preferences
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm" style={{ color: "var(--text)" }}>
              Dark Mode
            </span>
            <ThemeSwitcher dark={dark} onToggle={toggleTheme} scale={0.6} />
          </div>
        </div>
      </Card>

      <Btn variant="danger" onClick={onSignOut} className="w-full">
        <Ico d={I.logout} size={16} /> Sign Out
      </Btn>
    </div>
  )
}
