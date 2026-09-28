/** Demo content for the dashboard. Everything here is seeded in-memory; the app
 *  has no backend, so edits are lost on reload. */
import { I } from "@/icons"
import type { Note, Subject, Task, User } from "@/types"
import { isoDaysFromToday } from "@/utils"

export const initSubjects: Subject[] = [
  {
    id: 1,
    name: "Calculus III",
    code: "MAT301",
    instructor: "Dr. Elena Ruiz",
    credits: 4,
    grade: "A",
    gpa: 4.0,
    color: "#3d7eff",
    progress: 72,
    schedule: "Mon/Wed 9:00 AM",
  },
  {
    id: 2,
    name: "Physics II",
    code: "PHY202",
    instructor: "Prof. James Liu",
    credits: 4,
    grade: "A-",
    gpa: 3.7,
    color: "#22c55e",
    progress: 65,
    schedule: "Tue/Thu 2:00 PM",
  },
  {
    id: 3,
    name: "CS Theory",
    code: "CS310",
    instructor: "Dr. Sarah Kim",
    credits: 3,
    grade: "B+",
    gpa: 3.3,
    color: "#f59e0b",
    progress: 58,
    schedule: "Tue/Thu 10:00 AM",
  },
  {
    id: 4,
    name: "Statistics",
    code: "STA201",
    instructor: "Prof. Maria Santos",
    credits: 3,
    grade: "A+",
    gpa: 4.0,
    color: "#a855f7",
    progress: 80,
    schedule: "Tue/Thu 1:00 PM",
  },
  {
    id: 5,
    name: "Technical Writing",
    code: "ENG305",
    instructor: "Dr. Alan Moore",
    credits: 2,
    grade: "A-",
    gpa: 3.7,
    color: "#ef4444",
    progress: 85,
    schedule: "Mon/Wed 11:30 AM",
  },
]

/** Seed task deadlines relative to today so the deadline notifier has
 *  something meaningful to show, no matter when the app is opened. Dates are
 *  local calendar days so they line up with what the UI calls "today". */
const day = isoDaysFromToday

export const initTasks: Task[] = [
  {
    id: 1,
    title: "Calculus Problem Set #7",
    subject: "Calculus III",
    due: day(2),
    priority: "high",
    done: false,
    tag: "homework",
    notes: "Chapter 8: Multiple Integrals",
  },
  {
    id: 2,
    title: "Physics Lab Report",
    subject: "Physics II",
    due: day(4),
    priority: "high",
    done: false,
    tag: "lab",
  },
  {
    id: 3,
    title: "CS Theory Problem Set",
    subject: "CS Theory",
    due: day(6),
    priority: "medium",
    done: false,
    tag: "homework",
  },
  {
    id: 4,
    title: "Statistics Homework Ch.5",
    subject: "Statistics",
    due: day(9),
    priority: "medium",
    done: false,
    tag: "homework",
  },
  {
    id: 5,
    title: "Technical Writing Draft",
    subject: "Technical Writing",
    due: day(1),
    priority: "low",
    done: false,
    tag: "essay",
  },
  {
    id: 6,
    title: "Calculus Quiz Prep",
    subject: "Calculus III",
    due: day(-1),
    priority: "high",
    done: true,
    tag: "exam",
  },
  {
    id: 7,
    title: "Physics Reading Ch.4",
    subject: "Physics II",
    due: day(-2),
    priority: "medium",
    done: true,
    tag: "reading",
  },
  {
    id: 8,
    title: "CS Theory Quiz",
    subject: "CS Theory",
    due: day(-3),
    priority: "high",
    done: true,
    tag: "exam",
  },
]

const now = Date.now()

export const initNotes: Note[] = [
  {
    id: 1,
    title: "Calculus Formulas",
    subject: "Calculus III",
    content:
      "Integration by parts, substitution, partial fractions. Remember to check convergence before applying tests.",
    tags: ["math", "formulas"],
    color: "#3d7eff",
    updated: now - 2 * 3600e3,
  },
  {
    id: 2,
    title: "Physics Lab Notes",
    subject: "Physics II",
    content:
      "Electromagnetic induction experiments. Faraday's law: induced EMF = -N dΦ/dt. Recompute coil area before the lab report.",
    tags: ["lab", "physics"],
    color: "#22c55e",
    updated: now - 5 * 3600e3,
  },
  {
    id: 3,
    title: "CS Algorithm Notes",
    subject: "CS Theory",
    content:
      "Big O notation, sorting algorithms, graph traversal. BFS uses a queue, DFS uses a stack — know which one the problem needs.",
    tags: ["algorithms", "CS"],
    color: "#f59e0b",
    updated: now - 24 * 3600e3,
  },
  {
    id: 4,
    title: "Statistics Formulas",
    subject: "Statistics",
    content:
      "Standard deviation, variance, probability distributions. Memorize the z-score table values for the common confidence levels.",
    tags: ["stats", "formulas"],
    color: "#a855f7",
    updated: now - 2 * 86400e3,
  },
  {
    id: 5,
    title: "Writing Techniques",
    subject: "Technical Writing",
    content:
      "Paragraph structure, thesis statements, citations. One idea per paragraph; cite as you write, not after.",
    tags: ["writing"],
    color: "#ef4444",
    updated: now - 3 * 86400e3,
  },
  {
    id: 6,
    title: "Study Schedule",
    subject: "General",
    content:
      "Weekly study plan and exam preparation timeline. Deep work in the morning, review sessions in the evening.",
    tags: ["planning"],
    color: "#64748b",
    updated: now - 7 * 86400e3,
  },
]

/** Semester GPA, month by month. */
export const perfData = [
  { month: "Apr", gpa: 3.4 },
  { month: "May", gpa: 3.5 },
  { month: "Jun", gpa: 3.6 },
  { month: "Jul", gpa: 3.55 },
  { month: "Aug", gpa: 3.7 },
  { month: "Sep", gpa: 3.8 },
]

/** Study hours per weekday, in hours. */
export const studyData = [
  { day: "Mon", h: 4.5 },
  { day: "Tue", h: 6 },
  { day: "Wed", h: 5.2 },
  { day: "Thu", h: 7.1 },
  { day: "Fri", h: 3.8 },
  { day: "Sat", h: 2.5 },
  { day: "Sun", h: 4 },
]

/** Share of study time per discipline, as percentages. */
export const distData = [
  { name: "Mathematics", value: 35, color: "#3d7eff" },
  { name: "Science", value: 25, color: "#22c55e" },
  { name: "Computer Science", value: 20, color: "#f59e0b" },
  { name: "Statistics", value: 12, color: "#a855f7" },
  { name: "Writing", value: 8, color: "#ef4444" },
]

export interface ClassSlot {
  time: string
  subject: string
  room: string
  type: string
  color: string
}

/** Weekly timetable, keyed by the three-letter weekday. */
export const scheduleData: Record<string, ClassSlot[]> = {
  Mon: [
    {
      time: "9:00 AM",
      subject: "Calculus III",
      room: "Hall B-204",
      type: "Lecture",
      color: "#3d7eff",
    },
    {
      time: "2:00 PM",
      subject: "Physics II",
      room: "Lab 3",
      type: "Lab",
      color: "#22c55e",
    },
  ],
  Tue: [
    {
      time: "10:00 AM",
      subject: "CS Theory",
      room: "Tech 101",
      type: "Lecture",
      color: "#f59e0b",
    },
    {
      time: "1:00 PM",
      subject: "Statistics",
      room: "Math 205",
      type: "Tutorial",
      color: "#a855f7",
    },
  ],
  Wed: [
    {
      time: "9:00 AM",
      subject: "Calculus III",
      room: "Hall B-204",
      type: "Lecture",
      color: "#3d7eff",
    },
    {
      time: "11:30 AM",
      subject: "Technical Writing",
      room: "Arts 110",
      type: "Seminar",
      color: "#ef4444",
    },
    {
      time: "2:00 PM",
      subject: "Physics II",
      room: "Sci 302",
      type: "Lecture",
      color: "#22c55e",
    },
  ],
  Thu: [
    {
      time: "10:00 AM",
      subject: "CS Theory",
      room: "Tech 101",
      type: "Lecture",
      color: "#f59e0b",
    },
    {
      time: "1:00 PM",
      subject: "Statistics",
      room: "Math 205",
      type: "Lecture",
      color: "#a855f7",
    },
  ],
  Fri: [
    {
      time: "9:00 AM",
      subject: "Calculus III",
      room: "Hall B-204",
      type: "Lecture",
      color: "#3d7eff",
    },
    {
      time: "11:30 AM",
      subject: "Technical Writing",
      room: "Arts 110",
      type: "Workshop",
      color: "#ef4444",
    },
  ],
  Sat: [],
  Sun: [
    {
      time: "6:00 PM",
      subject: "Study Group",
      room: "Library R-3",
      type: "Study Group",
      color: "#64748b",
    },
  ],
}

/** Marketing copy for the landing page and the sign-in sidebar. */
export const features = [
  {
    icon: I.tasks,
    color: "var(--accent)",
    bg: "var(--accent-dim)",
    title: "Smart task planning",
    desc: "Prioritized deadlines, tags and reminders",
  },
  {
    icon: I.trending,
    color: "var(--success)",
    bg: "var(--success-dim)",
    title: "Live grade tracking",
    desc: "GPA updated across every subject",
  },
  {
    icon: I.clock,
    color: "var(--warning)",
    bg: "var(--warning-dim)",
    title: "Weekly schedule",
    desc: "Lectures, labs and study groups",
  },
  {
    icon: I.notes,
    color: "var(--purple)",
    bg: "var(--purple-dim)",
    title: "Subject notes",
    desc: "Capture and organize ideas fast",
  },
  {
    icon: I.analytics,
    color: "var(--danger)",
    bg: "var(--danger-dim)",
    title: "Study analytics",
    desc: "See where your hours actually go",
  },
  {
    icon: I.shield,
    color: "var(--text-dim)",
    bg: "var(--bg-elevated)",
    title: "Calm by default",
    desc: "No noisy feeds, just your semester",
  },
]

/** A seeded sign-in. The profile the app shows after signing in is exactly
 *  this account's `User`, which is what makes the profile screen follow the
 *  login. All accounts share the demo password so the "Try Demo Account"
 *  button and the quick-switch chips can reuse it. */
export type DemoAccount = User & { password: string }

export const demoAccounts: DemoAccount[] = [
  {
    name: "John Doe",
    email: "demo@semmigo.app",
    major: "Computer Science",
    year: "3rd Year",
    password: "student123",
  },
  {
    name: "Amina Yusuf",
    email: "amina@semmigo.app",
    major: "Data Science",
    year: "2nd Year",
    password: "student123",
  },
  {
    name: "Marcus Lee",
    email: "marcus@semmigo.app",
    major: "Software Engineering",
    year: "4th Year",
    password: "student123",
  },
]

/** The account the "Try Demo Account" button signs in with. */
export const demoAccount: DemoAccount = demoAccounts[0]

/** Case-insensitive lookup, so "Demo@SemMigo.app" still finds its account. */
export function findAccount(email: string): DemoAccount | undefined {
  const normalized = email.trim().toLowerCase()
  return demoAccounts.find((account) => account.email === normalized)
}
