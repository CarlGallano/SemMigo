import { useState } from "react"
import { I, Ico } from "@/icons"
import { Badge, Btn, Card, inputStyle } from "@/components/ui"
import { NoteModal } from "@/components/NoteModal"
import type { Note, Subject } from "@/types"
import { nextId } from "@/utils"

const timeAgo = (ts: number) => {
  const m = Math.floor((Date.now() - ts) / 60000)
  if (m < 1) return "just now"
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  return d < 7 ? `${d}d ago` : `${Math.floor(d / 7)}w ago`
}

/** Note cards: searchable by title, subject, content or tag. Create, edit and
 *  delete via the modal; state lives in App so edits survive navigation. */
export function NotesView({
  notes,
  setNotes,
  subjects,
}: {
  notes: Note[]
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>
  subjects: Pick<Subject, "id" | "name">[]
}) {
  const [search, setSearch] = useState("")
  const [editNote, setEditNote] = useState<Note | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const filtered = notes.filter((n) => {
    const q = search.toLowerCase()
    return (
      !q ||
      n.title.toLowerCase().includes(q) ||
      n.subject.toLowerCase().includes(q) ||
      n.content.toLowerCase().includes(q) ||
      n.tags.some((t) => t.toLowerCase().includes(q))
    )
  })

  const openNew = () => {
    setEditNote(null)
    setModalOpen(true)
  }

  const openEdit = (n: Note) => {
    setEditNote(n)
    setModalOpen(true)
  }

  const save = (data: Omit<Note, "id" | "updated">) => {
    if (editNote) {
      setNotes((p) =>
        p.map((n) =>
          n.id === editNote.id ? { ...n, ...data, updated: Date.now() } : n,
        ),
      )
    } else {
      setNotes((p) => [...p, { id: nextId(), updated: Date.now(), ...data }])
    }
  }

  const del = (id: number) => setNotes((p) => p.filter((n) => n.id !== id))

  return (
    <div className="space-y-4">
      <NoteModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditNote(null)
        }}
        onSave={save}
        subjects={subjects}
        editNote={editNote}
      />

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <span
            className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "var(--text-muted)" }}
          >
            <Ico d={I.search} size={14} />
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes..."
            className="login-input w-full rounded-lg pl-8 pr-3 py-1.5 text-xs border outline-none"
            style={inputStyle}
          />
        </div>
        <Btn variant="primary" size="sm" onClick={openNew}>
          <Ico d={I.plus} size={14} /> New Note
        </Btn>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4">
        {filtered.map((n) => (
          <Card key={n.id} className="p-4 hover:opacity-80 transition-opacity">
            <div className="flex items-start justify-between mb-2">
              <h3
                className="text-sm font-semibold"
                style={{ color: "var(--text)" }}
              >
                {n.title}
              </h3>
              <div
                className="w-2 h-2 rounded-full flex-shrink-0 mt-1"
                style={{ background: n.color }}
              />
            </div>
            <p className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>
              {n.subject} · {timeAgo(n.updated)}
            </p>
            <p className="text-xs mb-3" style={{ color: "var(--text-dim)" }}>
              {n.content.length > 120
                ? `${n.content.slice(0, 120)}...`
                : n.content}
            </p>
            <div className="flex items-end justify-between gap-2">
              <div className="flex flex-wrap gap-1.5">
                {n.tags.map((t) => (
                  <Badge key={t} color="gray">
                    {t}
                  </Badge>
                ))}
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button
                  onClick={() => openEdit(n)}
                  className="p-1.5 rounded-lg cursor-pointer transition-opacity hover:opacity-70"
                  style={{
                    background: "var(--bg-elevated)",
                    color: "var(--text-muted)",
                  }}
                  title="Edit note"
                >
                  <Ico d={I.edit} size={14} />
                </button>
                <button
                  onClick={() => del(n.id)}
                  className="p-1.5 rounded-lg cursor-pointer transition-opacity hover:opacity-70"
                  style={{
                    background: "var(--danger-dim)",
                    color: "var(--danger)",
                  }}
                  title="Delete note"
                >
                  <Ico d={I.trash} size={14} />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {search
              ? `No notes match "${search}".`
              : "No notes yet — create your first one."}
          </p>
          {!search && (
            <Btn variant="primary" size="sm" onClick={openNew} className="mt-3">
              <Ico d={I.plus} size={14} /> New Note
            </Btn>
          )}
        </div>
      )}
    </div>
  )
}
