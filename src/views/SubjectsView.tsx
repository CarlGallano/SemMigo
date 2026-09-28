import { useState, type Dispatch, type SetStateAction } from "react"
import { I, Ico } from "@/icons"
import { Btn, Card } from "@/components/ui"
import { SubjectModal } from "@/components/SubjectModal"
import type { Subject } from "@/types"
import { nextId } from "@/utils"

/** Enrolled courses as cards, each with its progress bar and grade. */
export function SubjectsView({
  subjects,
  setSubjects,
}: {
  subjects: Subject[]
  setSubjects: Dispatch<SetStateAction<Subject[]>>
}) {
  const [modal, setModal] = useState(false)
  const [editSubject, setEditSubject] = useState<Subject | null>(null)

  const save = (data: Omit<Subject, "id">) => {
    if (editSubject) {
      setSubjects((p) =>
        p.map((s) => (s.id === editSubject.id ? { ...s, ...data } : s)),
      )
    } else {
      setSubjects((p) => [...p, { id: nextId(), ...data }])
    }
  }

  const del = (id: number) => setSubjects((p) => p.filter((s) => s.id !== id))

  return (
    <div className="space-y-4">
      <SubjectModal
        open={modal || !!editSubject}
        onClose={() => {
          setModal(false)
          setEditSubject(null)
        }}
        onSave={save}
        editSubject={editSubject}
      />

      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          {subjects.length} enrolled courses
        </p>
        <Btn variant="primary" size="sm" onClick={() => setModal(true)}>
          <Ico d={I.plus} size={14} /> Add Subject
        </Btn>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-4">
        {subjects.map((s) => (
          <Card key={s.id} className="p-5 group">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ background: s.color }}
                />
                <div>
                  <h3
                    className="text-sm font-semibold"
                    style={{ color: "var(--text)" }}
                  >
                    {s.name}
                  </h3>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {s.code} · {s.credits} credits
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="text-xl font-semibold"
                  style={{ color: s.color }}
                >
                  {s.grade}
                </span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setEditSubject(s)}
                    className="p-1.5 rounded-md cursor-pointer"
                    style={{
                      color: "var(--text-muted)",
                      background: "var(--bg-elevated)",
                    }}
                  >
                    <Ico d={I.edit} size={13} />
                  </button>
                  <button
                    onClick={() => del(s.id)}
                    className="p-1.5 rounded-md cursor-pointer"
                    style={{
                      color: "var(--danger)",
                      background: "var(--danger-dim)",
                    }}
                  >
                    <Ico d={I.trash} size={13} />
                  </button>
                </div>
              </div>
            </div>

            <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>
              {s.instructor}
            </p>
            <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
              {s.schedule}
            </p>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className="text-xs"
                  style={{ color: "var(--text-muted)" }}
                >
                  Progress
                </span>
                <span
                  className="text-xs font-medium"
                  style={{ color: "var(--text-dim)" }}
                >
                  {s.progress}%
                </span>
              </div>
              <div
                className="h-1 rounded-full overflow-hidden"
                style={{ background: "var(--border)" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{ width: `${s.progress}%`, background: s.color }}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
