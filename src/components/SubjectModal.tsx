import { useEffect, useState, type ChangeEvent, type FormEvent } from "react"
import { LETTER_GRADES, type LetterGrade, type Subject } from "@/types"
import { Btn, Field, Modal, inputClass, inputStyle } from "@/components/ui"
import { GRADE_GPA, isLetterGrade } from "@/utils"

/** Colour swatches offered for a subject. */
export const subjectColors = [
  "#3d7eff",
  "#22c55e",
  "#f59e0b",
  "#a855f7",
  "#ef4444",
  "#64748b",
  "#ec4899",
  "#06b6d4",
]

/** Every field is held as a string while editing so the inputs stay controlled;
 *  credits and progress become numbers again on save. The grade is the shared
 *  `LetterGrade` union, so the form cannot hold a grade that has no GPA. */
interface SubjectForm {
  name: string
  code: string
  instructor: string
  credits: string
  grade: LetterGrade
  color: string
  progress: string
  schedule: string
}

/** Add or edit a subject. Pass `editSubject` to edit, omit it to create. */
export function SubjectModal({
  open,
  onClose,
  onSave,
  editSubject,
}: {
  open: boolean
  onClose: () => void
  onSave: (s: Omit<Subject, "id">) => void
  editSubject?: Subject | null
}) {
  const blank = (): SubjectForm => ({
    name: "",
    code: "",
    instructor: "",
    credits: "3",
    grade: "A",
    color: subjectColors[0],
    progress: "0",
    schedule: "",
  })

  const [form, setForm] = useState(blank)

  useEffect(() => {
    if (editSubject) {
      setForm({
        name: editSubject.name,
        code: editSubject.code,
        instructor: editSubject.instructor,
        credits: String(editSubject.credits),
        grade: editSubject.grade,
        color: editSubject.color,
        progress: String(editSubject.progress),
        schedule: editSubject.schedule,
      })
    } else {
      setForm(blank())
    }
  }, [editSubject, open])

  /** The non-grade fields all hold plain strings, so one setter covers them.
   *  The grade select narrows its own value instead of going through here. */
  const set =
    (k: Exclude<keyof SubjectForm, "grade">) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = (e: FormEvent) => {
    e.preventDefault()
    // Credits and progress are held as strings while editing so the inputs stay
    // controlled; they become numbers again on save. GPA is derived from the
    // letter grade rather than typed in, so the two can never disagree.
    onSave({
      ...form,
      credits: +form.credits,
      gpa: GRADE_GPA[form.grade],
      progress: +form.progress,
    })
    onClose()
  }

  return (
    <Modal
      open={open}
      title={editSubject ? "Edit Subject" : "Add Subject"}
      onClose={onClose}
    >
      <form onSubmit={submit}>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3">
          <Field label="Subject Name">
            <input
              required
              value={form.name}
              onChange={set("name")}
              className={inputClass}
              style={inputStyle}
            />
          </Field>
          <Field label="Subject Code">
            <input
              required
              value={form.code}
              onChange={set("code")}
              className={inputClass}
              style={inputStyle}
            />
          </Field>
        </div>

        <Field label="Instructor">
          <input
            required
            value={form.instructor}
            onChange={set("instructor")}
            className={inputClass}
            style={inputStyle}
          />
        </Field>

        <Field label="Schedule">
          <input
            value={form.schedule}
            onChange={set("schedule")}
            className={inputClass}
            style={inputStyle}
          />
        </Field>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(130px,1fr))] gap-3">
          <Field label="Credits">
            <input
              type="number"
              min="1"
              max="6"
              value={form.credits}
              onChange={set("credits")}
              className={inputClass}
              style={inputStyle}
            />
          </Field>
          <Field label="Current Grade">
            <select
              value={form.grade}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  grade: isLetterGrade(e.target.value) ? e.target.value : f.grade,
                }))
              }
              className={inputClass}
              style={inputStyle}
            >
              {LETTER_GRADES.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
          </Field>
          <Field label="Progress %">
            <input
              type="number"
              min="0"
              max="100"
              value={form.progress}
              onChange={set("progress")}
              className={inputClass}
              style={inputStyle}
            />
          </Field>
        </div>

        <Field label="Color">
          <div className="flex gap-2 flex-wrap">
            {subjectColors.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setForm((f) => ({ ...f, color: c }))}
                className="w-7 h-7 rounded-full cursor-pointer transition-transform hover:scale-110"
                style={{
                  background: c,
                  outline:
                    form.color === c
                      ? `2px solid var(--text)`
                      : "2px solid transparent",
                  outlineOffset: "2px",
                }}
              />
            ))}
          </div>
        </Field>

        <div className="flex gap-2 justify-end mt-2">
          <Btn variant="ghost" onClick={onClose}>
            Cancel
          </Btn>
          <Btn variant="primary" type="submit">
            {editSubject ? "Save Changes" : "Add Subject"}
          </Btn>
        </div>
      </form>
    </Modal>
  )
}
