import { useEffect, useState, type ChangeEvent, type FormEvent } from "react"
import type { Note, Subject } from "@/types"
import { Btn, Field, Modal, inputClass, inputStyle } from "@/components/ui"

const COLORS = [
  "#3d7eff",
  "#22c55e",
  "#f59e0b",
  "#a855f7",
  "#ef4444",
  "#64748b",
]

/** Add or edit a note. Pass `editNote` to edit, omit it to create. */
export function NoteModal({
  open,
  onClose,
  onSave,
  subjects,
  editNote,
}: {
  open: boolean
  onClose: () => void
  onSave: (n: Omit<Note, "id" | "updated">) => void
  subjects: Pick<Subject, "id" | "name">[]
  editNote?: Note | null
}) {
  const blank = () => ({
    title: "",
    subject: subjects[0]?.name || "General",
    content: "",
    tags: "" as string, // free-form, comma-separated
    color: COLORS[0],
  })

  const [form, setForm] = useState(blank)

  // Reset the fields whenever the dialog opens, so a stale edit never leaks in.
  useEffect(() => {
    if (editNote) {
      setForm({
        title: editNote.title,
        subject: editNote.subject,
        content: editNote.content,
        tags: editNote.tags.join(", "),
        color: editNote.color,
      })
    } else {
      setForm(blank())
    }
  }, [editNote, open])

  const set =
    (k: keyof ReturnType<typeof blank>) =>
    (
      e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    ) =>
      setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = (e: FormEvent) => {
    e.preventDefault()
    onSave({
      title: form.title.trim(),
      subject: form.subject,
      content: form.content.trim(),
      tags: form.tags
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean),
      color: form.color,
    })
    onClose()
  }

  return (
    <Modal
      open={open}
      title={editNote ? "Edit Note" : "New Note"}
      onClose={onClose}
    >
      <form onSubmit={submit}>
        <Field label="Title">
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
            <option value="General">General</option>
          </select>
        </Field>

        <Field label="Content">
          <textarea
            required
            value={form.content}
            onChange={set("content")}
            rows={6}
            className={inputClass + " resize-none"}
            style={inputStyle}
          />
        </Field>

        <Field label="Tags (comma-separated)">
          <input
            value={form.tags}
            onChange={set("tags")}
            placeholder="e.g. math, formulas"
            className={inputClass}
            style={inputStyle}
          />
        </Field>

        <Field label="Color">
          <div className="flex gap-2">
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setForm((f) => ({ ...f, color: c }))}
                className="w-6 h-6 rounded-full cursor-pointer transition-transform hover:scale-110"
                style={{
                  background: c,
                  outline: form.color === c ? "2px solid var(--text)" : "none",
                  outlineOffset: 2,
                }}
                title={c}
              />
            ))}
          </div>
        </Field>

        <div className="flex gap-2 justify-end mt-2">
          <Btn variant="ghost" onClick={onClose}>
            Cancel
          </Btn>
          <Btn variant="primary" type="submit">
            {editNote ? "Save Changes" : "Create Note"}
          </Btn>
        </div>
      </form>
    </Modal>
  )
}
