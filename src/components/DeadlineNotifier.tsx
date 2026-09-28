import { useEffect, useRef, useState } from "react"
import { I, Ico } from "@/icons"
import { daysUntil } from "@/utils"
import type { Task } from "@/types"

/** Deadlines within this many days count as "coming". */
export const SOON_DAYS = 3

export interface Deadline {
  task: Task
  days: number // negative = overdue, 0 = today
}

/** Pending tasks due today, within the next SOON_DAYS days, or overdue. */
export function upcomingDeadlines(tasks: Task[]): Deadline[] {
  return tasks
    .filter((t) => !t.done)
    .map((t) => ({ task: t, days: daysUntil(t.due) }))
    .filter((d) => d.days <= SOON_DAYS)
    .sort((a, b) => a.days - b.days)
}

const label = (d: Deadline) =>
  d.days < 0
    ? `Overdue by ${-d.days}d`
    : d.days === 0
      ? "Due today"
      : `Due in ${d.days}d`

const labelColor = (d: Deadline) =>
  d.days < 0
    ? "var(--danger)"
    : d.days === 0
      ? "var(--warning)"
      : "var(--accent)"

/** Fire an OS-level notification. `tag` dedupes at the browser level, and
 *  clicking the notification focuses the window and jumps to Tasks. */
function fireBrowserNotification(d: Deadline, onOpenTasks?: () => void) {
  if (
    typeof Notification === "undefined" ||
    Notification.permission !== "granted"
  )
    return
  try {
    const n = new Notification(`SemMigo — ${label(d)}`, {
      body: `${d.task.title} · ${d.task.subject}`,
      icon: `${import.meta.env.BASE_URL}icon.png`,
      tag: `semmigo-task-${d.task.id}`,
    })
    n.onclick = () => {
      window.focus()
      n.close()
      onOpenTasks?.()
    }
  } catch {
    // Some browsers (notably mobile Chrome/iOS) require a service worker for
    // `new Notification`; there is none in this demo, so stay silent.
  }
}

/** Bell button with a live badge, a dropdown of approaching deadlines, browser
 *  push notifications (opt-in), and a one-time toast fired shortly after
 *  sign-in if deadlines exist. */
export function DeadlineNotifier({
  tasks,
  onOpenTasks,
}: {
  tasks: Task[]
  onOpenTasks?: () => void
}) {
  const [open, setOpen] = useState(false)
  const [toast, setToast] = useState<Deadline | null>(null)
  const [perm, setPerm] = useState<NotificationPermission>(() =>
    typeof Notification !== "undefined" ? Notification.permission : "denied",
  )
  const wrapRef = useRef<HTMLDivElement>(null)
  const deadlines = upcomingDeadlines(tasks)
  const count = deadlines.length

  // Close the dropdown when clicking anywhere outside it.
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onDown)
    return () => document.removeEventListener("mousedown", onDown)
  }, [open])

  // Toast the most urgent deadline once, shortly after the dashboard appears.
  useEffect(() => {
    if (count === 0) return
    const t = setTimeout(() => setToast(deadlines[0]), 2500)
    return () => clearTimeout(t)
    // Fires once per session on purpose: only `count` transitioning 0 -> n.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count === 0])

  // Auto-dismiss the toast.
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 6000)
    return () => clearTimeout(t)
  }, [toast])

  // Browser push: on load (if already granted) notify the most urgent deadline
  // and mark every current one as seen; afterwards, notify only NEW deadlines
  // as they appear (e.g. a task added with a due date within SOON_DAYS).
  const notifiedRef = useRef<Set<number>>(new Set())
  const mountedRef = useRef(false)
  useEffect(() => {
    if (
      typeof Notification === "undefined" ||
      Notification.permission !== "granted"
    )
      return
    const upcoming = upcomingDeadlines(tasks)
    if (!mountedRef.current) {
      mountedRef.current = true
      upcoming.forEach((d) => notifiedRef.current.add(d.task.id))
      if (upcoming[0]) fireBrowserNotification(upcoming[0], onOpenTasks)
      return
    }
    upcoming.forEach((d) => {
      if (notifiedRef.current.has(d.task.id)) return
      notifiedRef.current.add(d.task.id)
      fireBrowserNotification(d, onOpenTasks)
    })
  }, [tasks, onOpenTasks])

  const requestPermission = async () => {
    if (typeof Notification === "undefined") return
    const p = await Notification.requestPermission()
    setPerm(p)
    if (p === "granted" && deadlines[0]) {
      notifiedRef.current.add(deadlines[0].task.id)
      fireBrowserNotification(deadlines[0], onOpenTasks)
    }
    if (p === "granted") setOpen(false)
  }

  return (
    <>
      <div className="relative" ref={wrapRef}>
        <button
          onClick={() => setOpen((o) => !o)}
          className="relative p-2 rounded-lg cursor-pointer transition-colors"
          style={{ color: "var(--text-muted)" }}
          title="Deadline reminders"
        >
          <Ico d={I.bell} size={18} />
          {count > 0 && (
            <span
              className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 flex items-center justify-center rounded-full text-[9px] font-bold text-white"
              style={{ background: "var(--danger)" }}
            >
              {count > 9 ? "9+" : count}
            </span>
          )}
        </button>

        {open && (
          <div
            className="absolute right-0 top-full mt-2 w-72 rounded-xl border shadow-2xl overflow-hidden z-50"
            style={{
              background: "var(--bg-surface)",
              borderColor: "var(--border)",
            }}
          >
            <div
              className="px-4 py-3 border-b text-xs font-semibold uppercase tracking-wider"
              style={{
                borderColor: "var(--border)",
                color: "var(--text-muted)",
              }}
            >
              Deadlines
            </div>
            {count === 0 ? (
              <p
                className="px-4 py-6 text-xs text-center"
                style={{ color: "var(--text-muted)" }}
              >
                Nothing due soon — you're all caught up. 🎉
              </p>
            ) : (
              <div className="max-h-72 overflow-y-auto">
                {deadlines.map(({ task, days }) => (
                  <div
                    key={task.id}
                    className="flex items-start gap-2.5 px-4 py-3 border-b last:border-b-0"
                    style={{ borderColor: "var(--border-subtle)" }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5"
                      style={{ background: labelColor({ task, days }) }}
                    />
                    <div className="min-w-0">
                      <p
                        className="text-xs font-medium truncate"
                        style={{ color: "var(--text)" }}
                        title={task.title}
                      >
                        {task.title}
                      </p>
                      <p
                        className="text-[10px]"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {task.subject}
                      </p>
                      <p
                        className="text-[10px] font-medium"
                        style={{ color: labelColor({ task, days }) }}
                      >
                        {label({ task, days })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div
              className="px-4 py-3 border-t"
              style={{ borderColor: "var(--border-subtle)" }}
            >
              {perm === "default" && (
                <button
                  onClick={requestPermission}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-opacity hover:opacity-80"
                  style={{
                    background: "var(--accent-dim)",
                    color: "var(--accent)",
                  }}
                >
                  <Ico d={I.bell} size={13} /> Enable browser notifications
                </button>
              )}
              {perm === "granted" && (
                <p
                  className="text-[10px] flex items-center gap-1.5"
                  style={{ color: "var(--success)" }}
                >
                  <Ico d={I.check} size={11} /> Browser notifications are on
                </p>
              )}
              {perm === "denied" && (
                <p
                  className="text-[10px]"
                  style={{ color: "var(--text-muted)" }}
                >
                  Notifications are blocked — enable them for this site in your
                  browser settings.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {toast && (
        <div
          className="toast-pop fixed top-16 right-4 z-[60] w-80 rounded-xl border shadow-2xl p-4"
          style={{
            background: "var(--bg-surface)",
            borderColor: labelColor(toast),
          }}
        >
          <div className="flex items-start gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                background: "var(--danger-dim)",
                color: "var(--danger)",
              }}
            >
              <Ico d={I.bell} size={16} />
            </div>
            <div className="min-w-0 flex-1">
              <p
                className="text-sm font-semibold"
                style={{ color: "var(--text)" }}
              >
                {label(toast)}
              </p>
              <p
                className="text-xs truncate"
                style={{ color: "var(--text-muted)" }}
                title={toast.task.title}
              >
                {toast.task.title} · {toast.task.subject}
              </p>
            </div>
            <button
              onClick={() => setToast(null)}
              className="p-1 rounded cursor-pointer flex-shrink-0"
              style={{ color: "var(--text-muted)" }}
              title="Dismiss"
            >
              <Ico d={I.close} size={14} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
