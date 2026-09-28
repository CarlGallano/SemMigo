import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Card, ChartTip, axisTick, yAxisWidth } from "@/components/ui"
import { distData, perfData, studyData } from "@/data"

/** Deeper dive into study habits: hours per day, subject mix and GPA history. */
export function AnalyticsView() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-5">
        <Card className="p-5">
          <h3
            className="text-sm font-semibold mb-4"
            style={{ color: "var(--text)" }}
          >
            Study Hours by Day
          </h3>
          <ResponsiveContainer width="100%" height={250}>
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
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={distData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
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

      <Card className="p-5">
        <h3
          className="text-sm font-semibold mb-4"
          style={{ color: "var(--text)" }}
        >
          GPA Over Time
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={perfData}>
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
            <Line
              type="monotone"
              dataKey="gpa"
              name="GPA"
              stroke="var(--accent)"
              strokeWidth={2}
              dot={{ fill: "var(--accent)", r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}
