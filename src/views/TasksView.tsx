import { useState, type Dispatch, type SetStateAction } from "react"
import { I, Ico } from "@/icons"
import { Badge, Btn, Card, inputStyle, type BadgeColor } from "@/components/ui"
import { TaskModal } from "@/components/TaskModal"
import type { Subject, Task } from "@/types"

const FILTERS = ["all", "pending", "completed"] as const

/** Priority -> Badge colour. */
const priorityColor = (p: string): BadgeColor =>
  p === "high" ? "red" : p === "medium" ? "amber" : "gray"

/** Task list: filter tabs, search, a table on desktop and cards on mobile. */
export function TasksView({
  tasks,
  setTasks,
  subjects,
  onAddTask,
}: {
  tasks: Task[]
  setTasks: Dispatch<SetStateAction<Task[]>>
  subjects: Subject[]
  onAddTask: () => void
}) {
  const [filter, setFilter] = useState<typeof FILTERS[number]>("all")
  const [search, setSearch] = useState("")
  const [editTask, setEditTask] = useState<Task | null>(null)
  const [editModal, setEditModal] = useState(false)

  const filtered = tasks.filter((t) => {
    if (filter === "pending" && t.done) return false
    if (filter === "completed" && !t.done) return false
    if (search && !t.title.toLowerCase().includes(search.toLowerCase()))
      return false
    return true
  })

  const toggle = (id: number) =>
    setTasks((p) => p.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  const del = (id: number) => setTasks((p) => p.filter((t) => t.id !== id))

  const closeModal = () => {
    setEditModal(false)
    setEditTask(null)
  }

  return (
    <div className="space-y-4">
      <TaskModal
        open={editModal}
        onClose={closeModal}
        onSave={(data) => {
          if (editTask) {
            setTasks((p) =>
              p.map((t) => (t.id === editTask.id ? { ...t, ...data } : t)),
            )
          }
        }}
        subjects={subjects}
        editTask={editTask}
      />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-3 py-1.5 text-xs font-medium rounded-lg cursor-pointer transition-all"
              style={{
                background:
                  filter === f ? "var(--accent)" : "var(--bg-elevated)",
                color: filter === f ? "white" : "var(--text-muted)",
                border: `1px solid ${
                  filter === f ? "var(--accent)" : "var(--border)"
                }`,
              }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-muted)]">
              <Ico d={I.search} size={14} />
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="login-input w-full sm:w-48 rounded-lg pl-8 pr-3 py-1.5 text-xs border outline-none"
              style={inputStyle}
            />
          </div>
          <Btn variant="primary" size="sm" onClick={onAddTask}>
            <Ico d={I.plus} size={14} /> Add Task
          </Btn>
        </div>
      </div>

      {/* Desktop: one row per task */}
      <div className="hidden lg:block">
        <Card className="overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid var(--border-subtle)",
                  background: "var(--bg-elevated)",
                }}
              >
                {[
                  "Task",
                  "Subject",
                  "Due",
                  "Priority",
                  "Tag",
                  "Status",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr
                  key={t.id}
                  style={{ borderBottom: "1px solid var(--border-subtle)" }}
                >
                  <td className="px-4 py-3">
                    <p
                      className="text-sm font-medium"
                      style={{ color: "var(--text)" }}
                    >
                      {t.title}
                    </p>
                  </td>
                  <td
                    className="px-4 py-3 text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {t.subject}
                  </td>
                  <td
                    className="px-4 py-3 text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {t.due}
                  </td>
                  <td className="px-4 py-3">
                    <Badge color={priorityColor(t.priority)}>
                      {t.priority}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge color="gray">{t.tag}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggle(t.id)}
                      className="cursor-pointer"
                      title={t.done ? "Mark as pending" : "Mark as done"}
                      style={{
                        color: t.done ? "var(--success)" : "var(--text-muted)",
                      }}
                    >
                      <Ico d={t.done ? I.check : I.clock} size={16} />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          setEditTask(t)
                          setEditModal(true)
                        }}
                        className="p-1 rounded cursor-pointer"
                        style={{ color: "var(--text-muted)" }}
                      >
                        <Ico d={I.edit} size={14} />
                      </button>
                      <button
                        onClick={() => del(t.id)}
                        className="p-1 rounded cursor-pointer"
                        style={{ color: "var(--danger)" }}
                      >
                        <Ico d={I.trash} size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      {/* Mobile: one card per task */}
      <div className="lg:hidden space-y-3">
        {filtered.map((t) => (
          <Card key={t.id} className="p-4">
            <div className="flex items-start justify-between mb-2">
              <p
                className="text-sm font-medium"
                style={{ color: "var(--text)" }}
              >
                {t.title}
              </p>
              <Badge color={priorityColor(t.priority)}>{t.priority}</Badge>
            </div>
            <div
              className="flex items-center gap-2 text-xs"
              style={{ color: "var(--text-muted)" }}
            >
              <span>{t.subject}</span>
              <span>·</span>
              <span>{t.due}</span>
            </div>
            <div className="flex items-center justify-between mt-3">
              <Badge color="gray">{t.tag}</Badge>
              <div className="flex gap-1">
                <button
                  onClick={() => toggle(t.id)}
                  className="p-1.5 rounded-lg cursor-pointer"
                  style={{
                    background: t.done
                      ? "var(--success-dim)"
                      : "var(--bg-elevated)",
                    color: t.done ? "var(--success)" : "var(--text-muted)",
                  }}
                >
                  <Ico d={I.check} size={14} />
                </button>
                <button
                  onClick={() => {
                    setEditTask(t)
                    setEditModal(true)
                  }}
                  className="p-1.5 rounded-lg cursor-pointer"
                  style={{
                    background: "var(--bg-elevated)",
                    color: "var(--text-muted)",
                  }}
                >
                  <Ico d={I.edit} size={14} />
                </button>
                <button
                  onClick={() => del(t.id)}
                  className="p-1.5 rounded-lg cursor-pointer"
                  style={{
                    background: "var(--danger-dim)",
                    color: "var(--danger)",
                  }}
                >
                  <Ico d={I.trash} size={14} />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
