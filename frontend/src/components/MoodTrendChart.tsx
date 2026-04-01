import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface MoodTrendChartProps {
  data: { label: string; mood: number }[];
}

export default function MoodTrendChart({ data }: MoodTrendChartProps) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#ddd1bf" />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6f7a81", fontSize: 12 }}
            dy={10}
          />
          <YAxis
            domain={[1, 5]}
            ticks={[1, 2, 3, 4, 5]}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6f7a81", fontSize: 12 }}
          />
          <Tooltip
            formatter={(value) => [`Level ${value}`, "Mood"]}
            contentStyle={{
              backgroundColor: "#fffdf8",
              border: "1px solid #ece2d3",
              borderRadius: "16px",
              boxShadow: "0 18px 40px -28px rgba(24, 33, 38, 0.45)",
              color: "#42505a",
            }}
            labelStyle={{ color: "#182126", fontWeight: 700 }}
            cursor={{ stroke: "#d4e6dd", strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="mood"
            stroke="#244f45"
            strokeWidth={3}
            dot={{ r: 4, fill: "#244f45", strokeWidth: 2, stroke: "#fffdf8" }}
            activeDot={{ r: 6, fill: "#d97c54", stroke: "#fffdf8", strokeWidth: 2 }}
            animationDuration={1500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
