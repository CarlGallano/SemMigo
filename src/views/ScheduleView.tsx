import { Card } from "@/components/ui"
import { scheduleData } from "@/data"
import { startOfDay } from "@/utils"

const WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const BY_JS_DAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const dayFmt = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
})

/** Monday of the week containing `d` (JS weeks start on Sunday). */
function startOfWeek(d: Date) {
  const monday = startOfDay(d)
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7))
  return monday
}

/** Week grid: one column per day, with today highlighted. */
export function ScheduleView() {
  const today = BY_JS_DAY[new Date().getDay()]
  // The timetable repeats weekly, so the heading tracks the week the reader is
  // in rather than a date frozen at the time this screen was written.
  const weekStart = startOfWeek(new Date())
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekEnd.getDate() + 6)

  return (
    <div className="space-y-4">
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>
        Week of {dayFmt.format(weekStart)} – {dayFmt.format(weekEnd)},{" "}
        {weekEnd.getFullYear()}
      </p>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <div
            className="grid"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
              borderBottom: "1px solid var(--border)",
            }}
          >
            {WEEK.map((d) => (
              <div
                key={d}
                className="border-r last:border-r-0"
                style={{ borderColor: "var(--border)" }}
              >
                <div
                  className="px-3 py-3 border-b"
                  style={{
                    borderColor: "var(--border)",
                    background:
                      d === today ? "var(--accent-dim)" : "var(--bg-elevated)",
                  }}
                >
                  <p
                    className="text-xs font-semibold text-center"
                    style={{
                      color:
                        d === today ? "var(--accent)" : "var(--text-muted)",
                    }}
                  >
                    {d}
                  </p>
                  {d === today && (
                    <p
                      className="text-xs text-center mt-0.5"
                      style={{ color: "var(--accent)" }}
                    >
                      Today
                    </p>
                  )}
                </div>

                <div className="p-2 space-y-2 min-h-60">
                  {(scheduleData[d] || []).map((ev, i) => (
                    <div
                      key={i}
                      className="rounded-lg p-2.5 cursor-pointer hover:opacity-80 transition-opacity"
                      style={{
                        background: `${ev.color}15`,
                        borderLeft: `2px solid ${ev.color}`,
                      }}
                    >
                      <p
                        className="text-xs font-medium"
                        style={{ color: ev.color }}
                      >
                        {ev.time}
                      </p>
                      <p
                        className="text-xs leading-tight mt-0.5"
                        style={{ color: "var(--text)" }}
                      >
                        {ev.subject}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {ev.room}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
