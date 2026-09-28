import { useEffect, useState, type ChangeEvent, type FormEvent } from "react"
import type { Subject, Task } from "@/types"
import { Btn, Field, Modal, inputClass, inputStyle } from "@/components/ui"
import { todayISO } from "@/utils"

const TAGS = ["homework", "exam", "lab", "essay", "reading", "project"]

/** Add or edit a task. Pass `editTask` to edit, omit it to create. */
export function TaskModal({
  open,
  onClose,
  onSave,
  subjects,
  editTask,
}: {
  open: boolean
  onClose: () => void
  onSave: (t: Omit<Task, "id">) => void
  subjects: Subject[]
  editTask?: Task | null
}) {
  const blank = () => ({
    title: "",
    subject: subjects[0]?.name || "",
    due: todayISO(),
    priority: "medium" as "high" | "medium" | "low",
    tag: "homework",
    notes: "",
  })

  const [form, setForm] = useState(blank)

  // Reset the fields whenever the dialog opens, so a stale edit never leaks in.
  useEffect(() => {
    if (editTask) {
      setForm({
        title: editTask.title,
        subject: editTask.subject,
        due: editTask.due,
        priority: editTask.priority,
        tag: editTask.tag,
        notes: editTask.notes || "",
      })
    } else {
      setForm(blank())
    }
  }, [editTask, open])

  const set =
    (k: keyof ReturnType<typeof blank>) =>
    (
      e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    ) =>
      setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = (e: FormEvent) => {
    e.preventDefault()
    onSave({ ...form, done: editTask?.done || false })
    onClose()
  }

  return (
    <Modal
      open={open}
      title={editTask ? "Edit Task" : "Add Task"}
      onClose={onClose}
    >
      <form onSubmit={submit}>
        <Field label="Task Title">
          <input
            required
            value={form.title}
            onChange={set("title")}
            className={inputClass}
            style={inputStyle}
          />
        </Field>

        <Field label="Subject">
          <select
            value={form.subject}
            onChange={set("subject")}
            className={inputClass}
            style={inputStyle}
          >
            {subjects.map((s) => (
              <option key={s.id}>{s.name}</option>
            ))}
          </select>
        </Field>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3">
          <Field label="Due Date">
            <input
              type="date"
              value={form.due}
              onChange={set("due")}
              className={inputClass}
              style={inputStyle}
            />
          </Field>
          <Field label="Priority">
            <select
              value={form.priority}
              onChange={set("priority")}
              className={inputClass}
              style={inputStyle}
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </Field>
        </div>

        <Field label="Tag">
          <select
            value={form.tag}
            onChange={set("tag")}
            className={inputClass}
            style={inputStyle}
          >
            {TAGS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>

        <Field label="Notes">
          <textarea
            value={form.notes}
            onChange={set("notes")}
            rows={3}
            className={inputClass + " resize-none"}
            style={inputStyle}
          />
        </Field>

        <div className="flex gap-2 justify-end mt-2">
          <Btn variant="ghost" onClick={onClose}>
            Cancel
          </Btn>
          <Btn variant="primary" type="submit">
            {editTask ? "Save Changes" : "Add Task"}
          </Btn>
        </div>
      </form>
    </Modal>
  )
}
