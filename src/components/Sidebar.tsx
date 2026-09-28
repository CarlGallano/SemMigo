import { I, Ico } from "@/icons"
import { LogoMark } from "@/components/ui"
import type { View } from "@/types"

/** One sidebar destination. Icons are one path or several, so `Ico` can draw
 *  either shape. */
export interface NavItem {
  icon: string | string[]
  label: string
  view: View
}

export const navItems: NavItem[] = [
  { icon: I.home, label: "Dashboard", view: "dashboard" },
  { icon: I.tasks, label: "Tasks", view: "tasks" },
  { icon: I.subjects, label: "Subjects", view: "subjects" },
  { icon: I.schedule, label: "Schedule", view: "schedule" },
  { icon: I.grades, label: "Grades", view: "grades" },
  { icon: I.analytics, label: "Analytics", view: "analytics" },
  { icon: I.notes, label: "Notes", view: "notes" },
]

/** The four destinations that fit in the mobile bottom bar. */
export const bottomNavItems = navItems.slice(0, 4)

export const viewTitles: Record<View, string> = {
  dashboard: "Dashboard",
  tasks: "Tasks",
  subjects: "Subjects",
  schedule: "Schedule",
  grades: "Grades",
  analytics: "Analytics",
  notes: "Notes",
  profile: "Profile",
}

/** Fixed left navigation. Collapses to icons on desktop, and is reused as the
 *  full-width drawer on mobile (where `collapsed` is always false). */
export function Sidebar({
  view,
  setView,
  collapsed,
  className = "",
}: {
  view: View
  setView: (v: View) => void
  collapsed: boolean
  className?: string
}) {
  const itemStyle = (active: boolean) => ({
    background: active ? "var(--accent-dim)" : "transparent",
    color: active ? "var(--accent)" : "var(--text-muted)",
  })

  return (
    <div
      className={`flex flex-col h-screen border-r transition-all ${className}`}
      style={{
        width: collapsed ? 68 : 220,
        borderColor: "var(--border)",
        background: "var(--bg-surface)",
      }}
    >
      <div className="flex items-center gap-2.5 px-4 py-5">
        {/* The collapsed rail is 68px wide with 16px of padding each side, which
            leaves 36px — anything bigger would overflow the sidebar. */}
        <LogoMark size={collapsed ? 36 : 44} />
        {!collapsed && <span className="text-base font-bold">SemMigo</span>}
      </div>

      <nav className="flex-1 px-2 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.view}
            onClick={() => setView(item.view)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-all"
            style={itemStyle(view === item.view)}
          >
            <Ico d={item.icon} size={18} />
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="px-2 pb-4 space-y-1">
        <button
          onClick={() => setView("profile")}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-all"
          style={itemStyle(view === "profile")}
        >
          <Ico d={I.profile} size={18} />
          {!collapsed && <span>Profile</span>}
        </button>
      </div>
    </div>
  )
}
