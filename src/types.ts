/** The eight screens reachable from the sidebar. */
export type View = "dashboard" | "tasks" | "subjects" | "schedule" | "grades" | "analytics" | "notes" | "profile"

/** The student currently signed in. `App` holds one for the session and hands
 *  it to the profile screen, so what that screen shows always follows the
 *  sign-in that created it. A seeded account supplies one in src/data.ts; an
 *  email with no account derives one via `userFromEmail` in src/utils.ts. */
export interface User {
  name: string
  email: string
  major: string
  /** Year label, e.g. "3rd Year". Empty when a derived profile has no way to
   *  know; screens drop the separator rather than print a dangling dot. */
  year: string
}

export interface Task {
  id: number
  title: string
  subject: string
  due: string
  priority: "high" | "medium" | "low"
  done: boolean
  tag: string
  notes?: string
}

export interface Note {
  id: number
  title: string
  subject: string
  content: string
  tags: string[]
  color: string
  updated: number
}

/** Every letter grade the app understands, best first. The single source of
 *  truth: the grade -> GPA table, the subject form's dropdown and `Subject`'s
 *  `grade` field all derive from it, so the three cannot disagree about which
 *  grades exist. */
export const LETTER_GRADES = [
  "A+",
  "A",
  "A-",
  "B+",
  "B",
  "B-",
  "C+",
  "C",
  "C-",
  "D",
  "F",
] as const

/** A letter grade. Any other string — a typo in seed data, say — is a type
 *  error rather than a value that silently has no GPA. */
export type LetterGrade = typeof LETTER_GRADES[number]

export interface Subject {
  id: number
  name: string
  code: string
  instructor: string
  credits: number
  grade: LetterGrade
  gpa: number
  color: string
  progress: number
  schedule: string
}
