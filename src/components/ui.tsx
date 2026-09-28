/** Small shared building blocks used by every screen. Styling comes from the
 *  CSS variables in src/index.css, so all of these follow the active theme. */
import {
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useRef,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from "react"
import { I, Ico } from "@/icons"

/** Brand mark. Points at the same image as the site favicon (see
 *  .figma/make/site.json) so the logo and the browser tab icon stay in sync.
 *  The artwork has a transparent background, so it needs no tile behind it.
 *  `BASE_URL` keeps the path correct if the app is ever served from a subpath. */
export function LogoMark({ size = 44 }: { size?: number }) {
  return (
    <img
      src={`${import.meta.env.BASE_URL}icon.png`}
      alt=""
      width={size}
      height={size}
      className="flex-shrink-0"
      style={{ objectFit: "contain" }}
    />
  )
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`rounded-xl border ${className}`}
      style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}
    >
      {children}
    </div>
  )
}

export function Btn({
  children,
  variant = "primary",
  size = "sm",
  onClick,
  type = "button",
  className = "",
}: {
  children: ReactNode
  variant?: "primary" | "ghost" | "danger"
  size?: "sm" | "xs" | "lg"
  onClick?: () => void
  type?: "button" | "submit"
  className?: string
}) {
  const base =
    "inline-flex items-center gap-1.5 font-medium rounded-lg transition-all cursor-pointer border-0"
  const sizes = {
    sm: "px-3.5 py-2 text-sm",
    xs: "px-2.5 py-1.5 text-xs",
    lg: "px-5 py-2.5 text-sm",
  }
  const styles: Record<string, CSSProperties> = {
    primary: { background: "var(--accent)", color: "white" },
    ghost: {
      background: "var(--bg-elevated)",
      color: "var(--text-dim)",
      border: "1px solid var(--border)",
    },
    danger: {
      background: "var(--danger-dim)",
      color: "var(--danger)",
      border: "1px solid rgba(239,68,68,0.2)",
    },
  }
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${base} ${sizes[size]} ${className}`}
      style={styles[variant]}
    >
      {children}
    </button>
  )
}

const badgeColors = {
  blue: {
    bg: "var(--accent-dim)",
    text: "var(--accent)",
    border: "var(--accent-border)",
  },
  green: {
    bg: "var(--success-dim)",
    text: "var(--success)",
    border: "rgba(34,197,94,0.2)",
  },
  amber: {
    bg: "var(--warning-dim)",
    text: "var(--warning)",
    border: "rgba(245,158,11,0.2)",
  },
  red: {
    bg: "var(--danger-dim)",
    text: "var(--danger)",
    border: "rgba(239,68,68,0.2)",
  },
  purple: {
    bg: "var(--purple-dim)",
    text: "var(--purple)",
    border: "rgba(168,85,247,0.2)",
  },
  gray: {
    bg: "var(--bg-elevated)",
    text: "var(--text-muted)",
    border: "var(--border)",
  },
}

/** Palette names `Badge` accepts. Derived from the map above, so a typo is a
 *  compile error instead of a silent fallback to blue. */
export type BadgeColor = keyof typeof badgeColors

export function Badge({
  children,
  color = "blue",
}: {
  children: ReactNode
  color?: BadgeColor
}) {
  const c = badgeColors[color]
  return (
    <span
      className="inline-block text-[10px] font-medium px-2 py-0.5 rounded-full"
      style={{
        background: c.bg,
        color: c.text,
        border: `1px solid ${c.border}`,
      }}
    >
      {children}
    </span>
  )
}

/** Tooltip body for every recharts chart. `any` because recharts injects these. */
export function ChartTip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div
      className="rounded-lg px-3 py-2 text-xs border shadow-lg"
      style={{
        background: "var(--bg-surface)",
        borderColor: "var(--border)",
        color: "var(--text)",
      }}
    >
      <p className="font-medium">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  )
}

/** Recharts tick styling, shared so every chart's axes line up. */
export const axisTick = { fill: "var(--text-muted)", fontSize: 11 }

/** Width reserved for a chart's y-axis. Recharts defaults to 60px, which is far
 *  more than these two-to-four-character tick labels need — the leftover space
 *  shoves the plot to the right of its card and leaves the numbers floating in
 *  the middle of it. Fitted to the widest label ("3.25"), and shared so every
 *  chart's plot area starts at the same x. */
export const yAxisWidth = 36

export const inputClass =
  "w-full rounded-lg px-3 py-2 text-sm border outline-none"
export const inputStyle: CSSProperties = {
  background: "var(--bg-elevated)",
  color: "var(--text)",
  borderColor: "var(--border)",
}

/** Everything the Tab trap inside a dialog may move focus to. */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}) {
  const panelRef = useRef<HTMLDivElement>(null)
  const titleId = useId()

  // While open: keep focus inside the panel, close on Escape, lock page scroll
  // and hand focus back to whatever opened the dialog. Gating all of this on
  // `open` also stops the several mounted-but-closed modals from reacting to a
  // single Escape press.
  useEffect(() => {
    if (!open) return
    const panel = panelRef.current
    const previouslyFocused = document.activeElement as HTMLElement | null

    const focusable = () =>
      panel ? Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)) : []

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key !== "Tab") return
      const items = focusable()
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      const active = document.activeElement
      if (e.shiftKey && (active === first || !panel?.contains(active))) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && (active === last || !panel?.contains(active))) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    ;(focusable()[0] ?? panel)?.focus()

    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = previousOverflow
      previouslyFocused?.focus()
    }
  }, [open, onClose])

  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="w-full max-w-md rounded-2xl border shadow-2xl outline-none"
        style={{
          background: "var(--bg-surface)",
          borderColor: "var(--border)",
        }}
      >
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: "var(--border)" }}
        >
          <h2
            id={titleId}
            className="text-base font-semibold"
            style={{ color: "var(--text)" }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 transition-colors"
            style={{ color: "var(--text-muted)" }}
          >
            <Ico d={I.close} size={16} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

export function Field({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  // Bind the label to its control automatically, so every field gains a
  // programmatic name (clicking the label focuses the input, screen readers
  // announce it) without each call site having to thread an id through.
  const id = useId()
  const control = isValidElement(children)
    ? cloneElement(children as ReactElement<{ id?: string }>, { id })
    : children

  return (
    <div className="mb-3">
      <label
        htmlFor={id}
        className="block text-xs mb-1.5 font-medium"
        style={{ color: "var(--text-muted)" }}
      >
        {label}
      </label>
      {control}
    </div>
  )
}
