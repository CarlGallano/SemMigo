/**
 * App shell. Everything substantial lives elsewhere:
 *
 *   src/types.ts               shared types
 *   src/data.ts                demo content and chart series
 *   src/icons.tsx              icon set
 *   src/components/ui.tsx      Card, Btn, Badge, Modal, inputs
 *   src/components/*View.tsx   landing and sign-in screens
 *   src/views/*.tsx            the eight dashboard screens
 *
 * This file owns only the theme, the session (which student is signed in), the
 * current view and the chrome around it (sidebar, header, mobile drawer).
 */
import { useEffect, useState, type Dispatch, type SetStateAction } from "react"
import { I, Ico } from "@/icons"
import { initNotes, initSubjects, initTasks } from "@/data"
import { Sidebar, bottomNavItems, viewTitles } from "@/components/Sidebar"
import { TaskModal } from "@/components/TaskModal"
import { LandingView } from "@/components/LandingView"
import { LoginView } from "@/components/LoginView"
import ThemeSwitcher from "@/components/ThemeSwitcher"
import { DeadlineNotifier } from "@/components/DeadlineNotifier"
import { Dashboard } from "@/views/Dashboard"
import { TasksView } from "@/views/TasksView"
import { SubjectsView } from "@/views/SubjectsView"
import { ScheduleView } from "@/views/ScheduleView"
import { GradesView } from "@/views/GradesView"
import { AnalyticsView } from "@/views/AnalyticsView"
import { NotesView } from "@/views/NotesView"
import { ProfileView } from "@/views/ProfileView"
import type { Note, Subject, Task, User, View } from "@/types"
import { nextId } from "@/utils"

/** Dark by default. Toggling `light` on <html> flips every CSS variable. */
function useTheme() {
  const [dark, setDark] = useState(true)
  useEffect(() => {
    document.documentElement.classList.toggle("light", !dark)
  }, [dark])
  return { dark, toggle: () => setDark((d) => !d) }
}

interface AppViewProps {
  view: View
  user: User
  tasks: Task[]
  setTasks: Dispatch<SetStateAction<Task[]>>
  subjects: Subject[]
  setSubjects: Dispatch<SetStateAction<Subject[]>>
  notes: Note[]
  setNotes: Dispatch<SetStateAction<Note[]>>
  dark: boolean
  toggleTheme: () => void
  onAddTask: () => void
  onSignOut: () => void
}

/** Maps the current view onto its screen. Declared once at module scope so the
 *  subtree is not remounted (and its local state not reset) on every App render. */
function AppView({
  view,
  user,
  tasks,
  setTasks,
  subjects,
  setSubjects,
  notes,
  setNotes,
  dark,
  toggleTheme,
  onAddTask,
  onSignOut,
}: AppViewProps) {
  switch (view) {
    case "dashboard":
      return <Dashboard tasks={tasks} subjects={subjects} />
    case "tasks":
      return (
        <TasksView
          tasks={tasks}
          setTasks={setTasks}
          subjects={subjects}
          onAddTask={onAddTask}
        />
      )
    case "subjects":
      return <SubjectsView subjects={subjects} setSubjects={setSubjects} />
    case "schedule":
      return <ScheduleView />
    case "grades":
      return <GradesView subjects={subjects} />
    case "analytics":
      return <AnalyticsView />
    case "notes":
      return <NotesView notes={notes} setNotes={setNotes} subjects={subjects} />
    case "profile":
      return (
        <ProfileView
          user={user}
          tasks={tasks}
          subjects={subjects}
          dark={dark}
          toggleTheme={toggleTheme}
          onSignOut={onSignOut}
        />
      )
    default:
      return null
  }
}

export default function App() {
  const { dark, toggle: toggleTheme } = useTheme()
  const [user, setUser] = useState<User | null>(null)
  const [screen, setScreen] = useState<"landing" | "auth">("landing")
  const [view, setView] = useState<View>("dashboard")
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [tasks, setTasks] = useState<Task[]>(initTasks)
  const [subjects, setSubjects] = useState<Subject[]>(initSubjects)
  const [notes, setNotes] = useState<Note[]>(initNotes)
  const [taskModalOpen, setTaskModalOpen] = useState(false)

  const addTask = (data: Omit<Task, "id">) =>
    setTasks((p) => [...p, { id: nextId(), ...data }])

  const handleNav = (v: View) => {
    setView(v)
    setMobileOpen(false)
  }

  const signOut = () => {
    setUser(null)
    setScreen("landing")
    // Start the next session on a clean slate rather than dropping the user
    // back onto whichever screen they signed out from.
    setView("dashboard")
    setTaskModalOpen(false)
    setMobileOpen(false)
  }

  // Signed out: marketing page, then the sign-in form.
  if (!user) {
    return screen === "landing" ? (
      <LandingView
        onGetStarted={() => setScreen("auth")}
        dark={dark}
        toggleTheme={toggleTheme}
      />
    ) : (
      <LoginView onSignIn={setUser} dark={dark} toggleTheme={toggleTheme} />
    )
  }

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "var(--bg-base)", color: "var(--text)" }}
    >
      <TaskModal
        open={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        onSave={addTask}
        subjects={subjects}
      />

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer. Closed, it is still mounted and merely translated
          off-screen, so its buttons would otherwise stay in the tab order and
          be announced by screen readers. `inert` takes the subtree out of both
          (and blocks clicks) until the drawer is opened; `aria-hidden` covers
          browsers that do not implement `inert` yet. */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ background: "var(--bg-surface)" }}
        inert={!mobileOpen}
        aria-hidden={!mobileOpen}
      >
        <Sidebar
          view={view}
          setView={handleNav}
          collapsed={false}
          className="w-full"
        />
      </div>

      <Sidebar
        view={view}
        setView={handleNav}
        collapsed={collapsed}
        className="hidden lg:flex"
      />

      <div className="flex-1 flex flex-col min-w-0">
        <header
          className="flex items-center justify-between px-4 py-3 border-b lg:px-6"
          style={{
            borderColor: "var(--border)",
            background: "var(--bg-surface)",
          }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-1.5 rounded-lg cursor-pointer"
              style={{ color: "var(--text-muted)" }}
              title="Open menu"
            >
              <Ico d={I.menu} size={20} />
            </button>
            <button
              onClick={() => setCollapsed((c) => !c)}
              className="hidden lg:block p-1.5 rounded-lg cursor-pointer"
              style={{ color: "var(--text-muted)" }}
              title="Toggle sidebar"
            >
              <Ico d={I.menu} size={20} />
            </button>
            <h1 className="text-lg font-semibold">{viewTitles[view]}</h1>
          </div>

          <div className="flex items-center gap-2">
            <DeadlineNotifier
              tasks={tasks}
              onOpenTasks={() => setView("tasks")}
            />
            <ThemeSwitcher
              dark={dark}
              onToggle={toggleTheme}
              scale={0.6}
              mobileScale={0.45}
            />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 pb-24 lg:p-6 lg:pb-6">
          <AppView
            view={view}
            user={user}
            tasks={tasks}
            setTasks={setTasks}
            subjects={subjects}
            setSubjects={setSubjects}
            notes={notes}
            setNotes={setNotes}
            dark={dark}
            toggleTheme={toggleTheme}
            onAddTask={() => setTaskModalOpen(true)}
            onSignOut={signOut}
          />
        </main>
      </div>

      {/* Mobile bottom bar */}
      <div
        className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around py-2 border-t lg:hidden"
        style={{
          background: "var(--bg-surface)",
          borderColor: "var(--border)",
        }}
      >
        {bottomNavItems.map((item) => (
          <button
            key={item.view}
            onClick={() => handleNav(item.view)}
            className="flex flex-col items-center gap-0.5 px-3 py-1 cursor-pointer"
            style={{
              color: view === item.view ? "var(--accent)" : "var(--text-muted)",
            }}
          >
            <Ico d={item.icon} size={18} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
