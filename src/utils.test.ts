/**
 * Unit tests for the date, id, user and grade rules in `utils.ts` — the helpers
 * whose edge cases stay invisible until a deadline shows the wrong day or a GPA
 * is off by a rounding step.
 *
 * Runs on Node's built-in test runner (`pnpm test`). `utils.ts` has no runtime
 * imports and only erasable type annotations, so Node executes it directly —
 * no bundler, transform or test framework dependency needed.
 */
import assert from "node:assert/strict"
import { describe, it } from "node:test"

import { LETTER_GRADES } from "./types.ts"
import {
  GRADE_GPA,
  daysUntil,
  initialsFromName,
  isLetterGrade,
  isoDaysFromToday,
  nextId,
  parseLocalDate,
  startOfDay,
  toLocalISODate,
  todayISO,
  userFromEmail,
  weightedGpa,
} from "./utils.ts"

/**
 * `n` days from today by the calendar. Uses `setDate` rather than adding
 * milliseconds, so it stays correct across a DST change — which is what makes
 * it usable as the expectation for `daysUntil`.
 */
function calendarDaysFromToday(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return toLocalISODate(d)
}

describe("toLocalISODate", () => {
  it("formats a local date as zero-padded YYYY-MM-DD", () => {
    assert.equal(toLocalISODate(new Date(2026, 0, 5)), "2026-01-05")
    assert.equal(toLocalISODate(new Date(2026, 11, 31)), "2026-12-31")
  })

  it("reads the local calendar day, not the UTC one", () => {
    // 00:30 local on the 1st is already the previous day in UTC for timezones
    // east of it, so the string must come from the local fields.
    assert.equal(toLocalISODate(new Date(2026, 5, 1, 0, 30)), "2026-06-01")
    // ...and 23:30 local on the last day is the next day in UTC going the
    // other way (east of UTC).
    assert.equal(toLocalISODate(new Date(2026, 5, 30, 23, 30)), "2026-06-30")
  })
})

describe("parseLocalDate", () => {
  it("reads YYYY-MM-DD as midnight local time", () => {
    const d = parseLocalDate("2026-09-28")
    assert.equal(d.getFullYear(), 2026)
    assert.equal(d.getMonth(), 8)
    assert.equal(d.getDate(), 28)
    assert.equal(d.getHours(), 0)
    assert.equal(d.getMinutes(), 0)
    assert.equal(d.getSeconds(), 0)
  })

  it("keeps the named day in every timezone", () => {
    // `new Date("2026-01-01")` is UTC midnight, which is Dec 31 in timezones
    // west of UTC — the bug that made a task due today read "Overdue by 1d".
    // Only bites when the ambient offset is non-zero (i.e. not UTC), so this
    // suite is worth running in a local zone; CI defaults to UTC.
    assert.equal(parseLocalDate("2026-01-01").getDate(), 1)
    assert.equal(parseLocalDate("2026-12-31").getDate(), 31)
  })

  it("round-trips every value toLocalISODate can produce", () => {
    for (const iso of [
      "2026-01-01",
      "2027-12-31",
      "2028-02-29",
      "2026-06-15",
    ]) {
      assert.equal(toLocalISODate(parseLocalDate(iso)), iso, iso)
    }
  })

  it("falls back to the built-in parser for non YYYY-MM-DD input", () => {
    assert.ok(Number.isNaN(parseLocalDate("not a date").getTime()))
    // Full ISO timestamps are left to the browser's parser rather than being
    // silently reinterpreted as a local day.
    assert.equal(
      parseLocalDate("2026-09-28T12:00:00.000Z").getTime(),
      new Date("2026-09-28T12:00:00.000Z").getTime(),
    )
  })
})

describe("todayISO", () => {
  it("is today's local date", () => {
    assert.equal(todayISO(), toLocalISODate(new Date()))
  })

  it("keeps the YYYY-MM-DD shape", () => {
    assert.match(todayISO(), /^\d{4}-\d{2}-\d{2}$/)
  })
})

describe("isoDaysFromToday", () => {
  it("returns today for 0", () => {
    assert.equal(isoDaysFromToday(0), todayISO())
  })

  it("always returns a well-formed date", () => {
    for (const n of [-30, -1, 0, 1, 7, 45, 365]) {
      assert.match(isoDaysFromToday(n), /^\d{4}-\d{2}-\d{2}$/, `n=${n}`)
    }
  })

  // Only `0` is asserted exactly, on purpose: this helper adds fixed 24h steps,
  // so a DST change inside the span can shift the result to a neighbouring day
  // (and then `daysUntil` rightly reports that neighbouring day). Asserting the
  // calendar value here would be flaky for an hour either side of a DST
  // transition. `daysUntil` below is tested against calendar arithmetic, which
  // is the behaviour the UI actually depends on.
})

describe("daysUntil", () => {
  it("is exactly 0 for today", () => {
    assert.equal(daysUntil(todayISO()), 0)
  })

  it("counts whole days forward and backward", () => {
    for (const n of [-365, -30, -2, -1, 1, 2, 7, 30, 45, 180, 365]) {
      assert.equal(daysUntil(calendarDaysFromToday(n)), n, `n=${n}`)
    }
  })

  it("stays exact across a DST transition", () => {
    // The ms between two local midnights is n*864e5 +/- 1h around a DST change,
    // so the result must come from rounding, not truncation.
    for (const n of [150, 210, 300]) {
      const d = new Date()
      d.setDate(d.getDate() + n)
      assert.equal(daysUntil(toLocalISODate(d)), n, `n=${n}`)
    }
  })

  it("is signed: overdue is negative, upcoming positive", () => {
    assert.ok(daysUntil(calendarDaysFromToday(-1)) < 0)
    assert.ok(daysUntil(calendarDaysFromToday(1)) > 0)
  })

  it("agrees with itself regardless of the time of day", () => {
    // startOfDay normalises both sides, so a due date read at 00:01 and at
    // 23:59 must give the same answer.
    const due = calendarDaysFromToday(5)
    assert.equal(daysUntil(due), daysUntil(due))
    assert.equal(daysUntil(todayISO()), 0)
  })
})

describe("startOfDay", () => {
  it("zeroes the time without shifting the date", () => {
    const d = startOfDay(new Date(2026, 8, 28, 23, 59, 59, 999))
    assert.equal(toLocalISODate(d), "2026-09-28")
    assert.equal(d.getHours(), 0)
    assert.equal(d.getMinutes(), 0)
    assert.equal(d.getSeconds(), 0)
    assert.equal(d.getMilliseconds(), 0)
  })

  it("is idempotent", () => {
    const once = startOfDay(new Date(2026, 8, 28, 13, 45))
    assert.equal(startOfDay(once).getTime(), once.getTime())
  })
})

describe("nextId", () => {
  it("returns a positive integer", () => {
    const id = nextId()
    assert.ok(Number.isInteger(id))
    assert.ok(id > 0)
  })

  it("never repeats, even for ids minted in the same millisecond", () => {
    // `Date.now()` alone collides in a tight loop; a duplicate would make an
    // id-based update hit two records and collide React keys.
    const ids = Array.from({ length: 1000 }, () => nextId())
    assert.equal(new Set(ids).size, ids.length)
  })

  it("increases monotonically", () => {
    let previous = nextId()
    for (let i = 0; i < 100; i++) {
      const next = nextId()
      assert.ok(next > previous, `${next} should follow ${previous}`)
      previous = next
    }
  })
})

describe("LETTER_GRADES / GRADE_GPA", () => {
  it("lists the full letter ladder in order", () => {
    assert.deepEqual([...LETTER_GRADES], [
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
    ])
  })

  it("gives every listed grade a GPA value, and no others", () => {
    assert.deepEqual(Object.keys(GRADE_GPA), [...LETTER_GRADES])
  })

  it("maps the extremes the way a 4.0 scale does", () => {
    assert.equal(GRADE_GPA["A+"], 4.0)
    assert.equal(GRADE_GPA.A, 4.0)
    assert.equal(GRADE_GPA.F, 0.0)
  })

  it("never increases further down the ladder", () => {
    for (let i = 1; i < LETTER_GRADES.length; i++) {
      const grade = LETTER_GRADES[i]
      const above = LETTER_GRADES[i - 1]
      assert.ok(
        GRADE_GPA[grade] <= GRADE_GPA[above],
        `${grade} (${GRADE_GPA[grade]}) must not exceed ${above} (${GRADE_GPA[above]})`,
      )
    }
  })

  it("isLetterGrade accepts the list and rejects anything else", () => {
    for (const grade of LETTER_GRADES) assert.ok(isLetterGrade(grade), grade)
    for (const bad of ["A*", "a", "E", "", "AA", "4.0"]) {
      assert.equal(isLetterGrade(bad), false, bad)
    }
  })
})

describe("weightedGpa", () => {
  it("weights each course by its credits, not equally", () => {
    // A plain mean would report 3.00; credit weighting must report 2.50.
    assert.equal(
      weightedGpa([
        { credits: 1, gpa: 4.0 },
        { credits: 3, gpa: 2.0 },
      ]),
      "2.50",
    )
  })

  it("equals the plain mean when credits are equal", () => {
    assert.equal(
      weightedGpa([
        { credits: 3, gpa: 4.0 },
        { credits: 3, gpa: 3.0 },
      ]),
      "3.50",
    )
  })

  it("formats to exactly two decimals", () => {
    assert.equal(weightedGpa([{ credits: 1, gpa: 4.0 }]), "4.00")
    assert.equal(
      weightedGpa([
        { credits: 4, gpa: 4.0 },
        { credits: 4, gpa: 3.7 },
      ]),
      "3.85",
    )
  })

  it("matches the seeded semester: 16 credits over five courses", () => {
    const seeded = [
      { credits: 4, gpa: 4.0 }, // Calculus III
      { credits: 4, gpa: 3.7 }, // Physics II
      { credits: 3, gpa: 3.3 }, // CS Theory
      { credits: 3, gpa: 4.0 }, // Statistics
      { credits: 2, gpa: 3.7 }, // Technical Writing
    ]
    assert.equal(weightedGpa(seeded), "3.76")
  })

  it("reports an em dash rather than dividing by zero", () => {
    assert.equal(weightedGpa([]), "—")
    assert.equal(weightedGpa([{ credits: 0, gpa: 4.0 }]), "—")
    assert.equal(
      weightedGpa([
        { credits: 0, gpa: 4.0 },
        { credits: 0, gpa: 3.0 },
      ]),
      "—",
    )
  })
})

describe("initialsFromName", () => {
  it("takes the first letter of the first and last words", () => {
    assert.equal(initialsFromName("John Doe"), "JD")
    assert.equal(initialsFromName("Amina Yusuf"), "AY")
    assert.equal(initialsFromName("Marcus Lee"), "ML")
  })

  it("skips middle names", () => {
    assert.equal(initialsFromName("Ana Maria Santos"), "AS")
    assert.equal(initialsFromName("John F. Kennedy"), "JK")
  })

  it("uses a single letter for a one-word name", () => {
    assert.equal(initialsFromName("Prince"), "P")
  })

  it("normalizes casing and stray whitespace", () => {
    assert.equal(initialsFromName("  john   doe  "), "JD")
    assert.equal(initialsFromName("john doe"), "JD")
  })

  it("never returns an empty avatar for a blank name", () => {
    assert.equal(initialsFromName(""), "?")
    assert.equal(initialsFromName("   "), "?")
  })
})

describe("userFromEmail", () => {
  it("turns a dotted local part into a display name", () => {
    assert.equal(userFromEmail("jane.smith@uni.edu").name, "Jane Smith")
  })

  it("splits on the separators real addresses use", () => {
    assert.equal(userFromEmail("jane_smith@uni.edu").name, "Jane Smith")
    assert.equal(userFromEmail("jane-smith@uni.edu").name, "Jane Smith")
  })

  it("drops a +tag, which mail providers treat as the same mailbox", () => {
    assert.equal(userFromEmail("jane.smith+notes@uni.edu").name, "Jane Smith")
  })

  it("keeps the address as typed, minus surrounding whitespace", () => {
    assert.equal(
      userFromEmail("  jane.smith@uni.edu ").email,
      "jane.smith@uni.edu",
    )
  })

  it("admits when it has no year to report", () => {
    const user = userFromEmail("jane.smith@uni.edu")
    assert.equal(user.year, "")
    assert.ok(user.major.length > 0)
  })

  it("falls back to a neutral name with nothing to build one from", () => {
    assert.equal(userFromEmail("@uni.edu").name, "Student")
  })
})
