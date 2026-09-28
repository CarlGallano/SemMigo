import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { I, Ico } from "@/icons"
import { Card, ChartTip, axisTick, yAxisWidth } from "@/components/ui"
import { distData, perfData, scheduleData, studyData } from "@/data"
import type { Subject, Task } from "@/types"
import { daysUntil } from "@/utils"

/** Overview screen: four counters, the GPA trend, today's timetable and charts. */
export function Dashboard({
  tasks,
  subjects,
}: {
  tasks: Task[]
  subjects: Subject[]
}) {
  const pending = tasks.filter((t) => !t.done).length
  const completed = tasks.filter((t) => t.done).length
  const upcoming = tasks.filter((t) => {
    const days = daysUntil(t.due)
    return !t.done && days >= 0 && days <= 7
  }).length

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const today = days[new Date().getDay()]
  const todayClasses = scheduleData[today] || []

  const stats = [
    {
      label: "Subjects",
      value: subjects.length,
      icon: I.subjects,
      color: "var(--accent)",
      bg: "var(--accent-dim)",
    },
    {
      label: "Pending Tasks",
      value: pending,
      icon: I.tasks,
      color: "var(--warning)",
      bg: "var(--warning-dim)",
    },
    {
      label: "Completed",
      value: completed,
      icon: I.check,
      color: "var(--success)",
      bg: "var(--success-dim)",
    },
    {
      label: "Upcoming (7d)",
      value: upcoming,
      icon: I.clock,
      color: "var(--danger)",
      bg: "var(--danger-dim)",
    },
  ]

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-4">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: s.bg, color: s.color }}
              >
                <Ico d={s.icon} size={18} />
              </div>
              <div>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {s.label}
                </p>
                <p
                  className="text-xl font-semibold"
                  style={{ color: "var(--text)" }}
                >
                  {s.value}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-5">
        <Card className="p-5">
          <h3
            className="text-sm font-semibold mb-4"
            style={{ color: "var(--text)" }}
          >
            GPA Trend
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={perfData}>
              <defs>
                <linearGradient id="gpag" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="var(--accent)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--accent)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border-subtle)"
              />
              <XAxis
                dataKey="month"
                tick={axisTick}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={axisTick}
                axisLine={false}
                tickLine={false}
                domain={[3, 4]}
                width={yAxisWidth}
              />
              <Tooltip content={<ChartTip />} />
              <Area
                type="monotone"
                dataKey="gpa"
                name="GPA"
                stroke="var(--accent)"
                strokeWidth={2}
                fill="url(#gpag)"
                dot={{ fill: "var(--accent)", strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h3
            className="text-sm font-semibold mb-4"
            style={{ color: "var(--text)" }}
          >
            Today's Classes
          </h3>
          {todayClasses.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              No classes today
            </p>
          ) : (
            <div className="space-y-3">
              {todayClasses.map((c, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-lg"
                  style={{ background: `${c.color}10` }}
                >
                  <div
                    className="w-1 h-10 rounded-full"
                    style={{ background: c.color }}
                  />
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: "var(--text)" }}
                    >
                      {c.subject}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {c.time} · {c.room}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-5">
        <Card className="p-5">
          <h3
            className="text-sm font-semibold mb-4"
            style={{ color: "var(--text)" }}
          >
            Weekly Study Hours
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={studyData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border-subtle)"
              />
              <XAxis
                dataKey="day"
                tick={axisTick}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={axisTick}
                axisLine={false}
                tickLine={false}
                width={yAxisWidth}
              />
              <Tooltip content={<ChartTip />} />
              <Bar
                dataKey="h"
                name="Hours"
                fill="var(--accent)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h3
            className="text-sm font-semibold mb-4"
            style={{ color: "var(--text)" }}
          >
            Subject Distribution
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={distData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {distData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<ChartTip />} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  )
}
