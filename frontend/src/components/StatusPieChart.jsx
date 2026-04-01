import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function StatusPieChart({ openCount, reviewedCount }) {
  const data = [
    { name: "Open", value: openCount },
    { name: "Reviewed", value: reviewedCount },
  ];

  // No custom colors requested by you earlier; keeping minimal:
  // Recharts requires Cell fills; we’ll use neutral shades.
  const fills = ["#334155", "#0f172a"];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Seen Status</p>
        <p className="text-xs text-slate-500">Open vs Reviewed</p>
      </div>

      <div className="mt-4 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              contentStyle={{
                background: "#0b1220",
                border: "1px solid #1f2937",
                borderRadius: 12,
                color: "#e2e8f0",
                fontSize: 12,
              }}
            />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
            >
              {data.map((_, idx) => (
                <Cell key={idx} fill={fills[idx]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-400">
        <div className="rounded-lg border border-slate-800 bg-slate-900/30 p-2">
          Open: <span className="text-slate-200 font-semibold">{openCount}</span>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900/30 p-2">
          Reviewed:{" "}
          <span className="text-slate-200 font-semibold">{reviewedCount}</span>
        </div>
      </div>
    </div>
  );
}
