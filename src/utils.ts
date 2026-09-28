/** Small cross-cutting helpers, kept in one place so the date, id, user and
 *  grade rules cannot drift apart between screens. */

import type { LetterGrade, Subject, User } from "@/types"

// ── Local calendar dates ─────────────────────────────────────────────────────
// Due dates are stored as `YYYY-MM-DD` strings and must be read as days in the
// user's own timezone: `new Date("2026-09-28")` parses as UTC midnight, which is
// the *previous* local day west of UTC — the bug that made a task due today show
// up as "Overdue by 1d".

/** Midnight at the start of the given date's local day. */
export const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate())

/** A `Date` as `YYYY-MM-DD` in local time (never shifts across midnight). */
export function toLocalISODate(d: Date): string {
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${d.getFullYear()}-${month}-${day}`
}

/** Today as `YYYY-MM-DD`, in local time. */
export const todayISO = () => toLocalISODate(new Date())

/** `n` days from today as `YYYY-MM-DD` (negative = the past). */
export const isoDaysFromToday = (n: number) =>
  toLocalISODate(new Date(Date.now() + n * 864e5))

/** Parses a `YYYY-MM-DD` value as a local calendar day. Anything else (full ISO
 *  timestamps, for instance) falls back to the browser's own parser. */
export function parseLocalDate(value: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return new Date(value)
  const [, year, month, day] = match
  return new Date(Number(year), Number(month) - 1, Number(day))
}

/** Whole days from today until the due date (negative = overdue). */
export const daysUntil = (due: string) =>
  Math.round(
    (startOfDay(parseLocalDate(due)).getTime() -
      startOfDay(new Date()).getTime()) /
      864e5,
  )

// ── Unique ids ───────────────────────────────────────────────────────────────

let lastId = 0

/** Strictly increasing numeric id for the in-memory records. Using `Date.now()`
 *  on its own repeats when two records are created in the same millisecond,
 *  which collides React keys and makes id-based updates hit both records. */
export function nextId(): number {
  const now = Date.now()
  lastId = now > lastId ? now : lastId + 1
  return lastId
}

// ── Users ────────────────────────────────────────────────────────────────────

/** Avatar initials for a display name: the first letter of the first and last
 *  words, so "John Doe" reads as "JD" and "Amina Yusuf" as "AY". Middle names
 *  are skipped, a single-word name contributes one letter, and a name that
 *  cannot be read at all still gets a glyph rather than an empty circle. */
export function initialsFromName(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return "?"
  if (words.length === 1) return words[0][0].toUpperCase()
  return (words[0][0] + words[words.length - 1][0]).toUpperCase()
}

/** Profile for a sign-in address that has no seeded account, so any well-formed
 *  email still reaches the dashboard (there is no backend to reject it):
 *  "jane.smith@uni.edu" becomes "Jane Smith". A "+tag" is dropped first, the
 *  way mail providers treat it as the same mailbox. The major and year stay
 *  honest — this profile was never told them. */
export function userFromEmail(email: string): User {
  const address = email.trim()
  const [local = ""] = address.split("@")
  const name = local
    .split("+")[0]
    .split(/[._\-\s]+/)
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ")
  return { name: name || "Student", email: address, major: "Student", year: "" }
}

// ── Grades ───────────────────────────────────────────────────────────────────

/** Standard 4.0-scale points per letter grade, used to derive a GPA. Keyed by
 *  `LetterGrade`, so adding a grade to LETTER_GRADES without a value here (or
 *  the reverse) fails to compile rather than looking up `undefined`. */
export const GRADE_GPA: Record<LetterGrade, number> = {
  "A+": 4.0,
  A: 4.0,
  "A-": 3.7,
  "B+": 3.3,
  B: 3.0,
  "B-": 2.7,
  "C+": 2.3,
  C: 2.0,
  "C-": 1.7,
  D: 1.0,
  F: 0.0,
}

/** True when `value` is one of the letter grades the app knows, and therefore
 *  has a GPA. Narrows values that arrive as plain strings, such as a `<select>`
 *  change event. Checked against the table rather than LETTER_GRADES so this
 *  module keeps a type-only dependency on @/types — see the note in
 *  src/utils.test.ts about running it with no build step. */
export function isLetterGrade(value: string): value is LetterGrade {
  return Object.prototype.hasOwnProperty.call(GRADE_GPA, value)
}

/** Credit-weighted GPA across the enrolled subjects, or "—" when nothing is
 *  enrolled (avoids a divide-by-zero and reads better than "0.00"). */
export function weightedGpa(
  subjects: Pick<Subject, "credits" | "gpa">[],
): string {
  const credits = subjects.reduce((sum, s) => sum + s.credits, 0)
  if (credits === 0) return "—"
  return (
    subjects.reduce((sum, s) => sum + s.gpa * s.credits, 0) / credits
  ).toFixed(2)
}
