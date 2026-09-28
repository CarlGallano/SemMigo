import { Badge, Card } from "@/components/ui"
import type { LetterGrade, Subject } from "@/types"
import { weightedGpa } from "@/utils"

/** Marks per course code, kept as a lookup: a subject with no entry simply has
 *  no marks recorded yet, instead of borrowing another course's scores the way
 *  the old positional fallback did. */
const MARKS: Record<string, {
  midterm: number
  assignments: number
  overall: number
}> = {
  MAT301: { midterm: 94, assignments: 91, overall: 93 },
  PHY202: { midterm: 88, assignments: 85, overall: 87 },
  CS310: { midterm: 81, assignments: 78, overall: 80 },
  STA201: { midterm: 96, assignments: 93, overall: 95 },
  ENG305: { midterm: 84, assignments: 88, overall: 86 },
}

const HEADERS = [
  "Course",
  "Code",
  "Credits",
  "Midterm",
  "Assignments",
  "Overall",
  "Grade",
  "GPA",
]

type GradePalette = {
  color: string
  badge: "green" | "blue" | "amber"
}

/** A letter grade's palette: a plain "A" is green, other A grades use the
 *  accent, everything else warns. */
function gradePalette(grade: LetterGrade): GradePalette {
  if (grade === "A") return { color: "var(--success)", badge: "green" }
  if (grade.startsWith("A")) return { color: "var(--accent)", badge: "blue" }
  return { color: "var(--warning)", badge: "amber" }
}

export function GradesView({ subjects }: { subjects: Subject[] }) {
  const totalCredits = subjects.reduce((sum, s) => sum + s.credits, 0)

  // Best recorded mark, computed from the subjects actually on screen.
  const best = subjects.reduce<{
    name: string
    code: string
    overall: number
  } | null>((top, s) => {
    const marks = MARKS[s.code]
    if (!marks) return top
    if (top && top.overall >= marks.overall) return top
    return { name: s.name, code: s.code, overall: marks.overall }
  }, null)

  const summary = [
    {
      label: "Semester GPA",
      value: weightedGpa(subjects),
      sub: `${totalCredits} credits`,
      accent: true,
    },
    {
      label: "Highest Mark",
      value: best ? `${best.overall}%` : "—",
      sub: best ? `${best.name} · ${best.code}` : "No marks recorded yet",
    },
    {
      label: "Subjects",
      value: String(subjects.length),
      sub: "Currently enrolled",
    },
  ]

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4">
        {summary.map((s) => (
          <Card key={s.label} className="p-5">
            <p
              className="text-xs uppercase tracking-wider mb-2"
              style={{ color: "var(--text-muted)" }}
            >
              {s.label}
            </p>
            <p
              className="text-2xl font-semibold"
              style={{ color: s.accent ? "var(--accent)" : "var(--text)" }}
            >
              {s.value}
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              {s.sub}
            </p>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden">
        <div
          className="px-5 py-3 border-b"
          style={{
            borderColor: "var(--border)",
            background: "var(--bg-elevated)",
          }}
        >
          <h3
            className="text-sm font-semibold"
            style={{ color: "var(--text)" }}
          >
            Grade Breakdown
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid var(--border-subtle)",
                  background: "var(--bg-elevated)",
                }}
              >
                {HEADERS.map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {subjects.map((s) => {
                const marks = MARKS[s.code]
                const { color: gradeColor, badge } = gradePalette(s.grade)

                return (
                  <tr
                    key={s.id}
                    style={{ borderBottom: "1px solid var(--border-subtle)" }}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ background: s.color }}
                        />
                        <span
                          className="text-sm font-medium"
                          style={{ color: "var(--text)" }}
                        >
                          {s.name}
                        </span>
                      </div>
                    </td>
                    <td
                      className="px-5 py-3.5 text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {s.code}
                    </td>
                    <td
                      className="px-5 py-3.5 text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {s.credits}
                    </td>
                    <td
                      className="px-5 py-3.5 text-xs"
                      style={{ color: "var(--text-dim)" }}
                    >
                      {marks ? `${marks.midterm}%` : "—"}
                    </td>
                    <td
                      className="px-5 py-3.5 text-xs"
                      style={{ color: "var(--text-dim)" }}
                    >
                      {marks ? `${marks.assignments}%` : "—"}
                    </td>
                    <td
                      className="px-5 py-3.5 text-xs font-medium"
                      style={{ color: "var(--text)" }}
                    >
                      {marks ? `${marks.overall}%` : "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge color={badge}>{s.grade}</Badge>
                    </td>
                    <td
                      className="px-5 py-3.5 text-xs font-medium"
                      style={{ color: gradeColor }}
                    >
                      {s.gpa.toFixed(1)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
