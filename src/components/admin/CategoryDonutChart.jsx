"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#e4574f", "#d97a72", "#c94a43", "#e8a09a", "#b83832", "#f0c4bf", "#962c27", "#f4a261", "#2a9d8f"];

export default function CategoryDonutChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${apiUrl}/analytics/admin`);
        if (res.ok) {
          const json = await res.json();
          if (json.categoryDistribution && json.categoryDistribution.length > 0) {
            const formatted = json.categoryDistribution.map((item, index) => ({
              name: item.name,
              value: item.value,
              color: COLORS[index % COLORS.length],
            }));
            setData(formatted);
          }
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const total = data.reduce((acc, cur) => acc + cur.value, 0);

  return (
    <div className="rounded-2xl border border-[var(--color-art-border)] bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-4">
        <h3 className="font-art-display text-lg font-semibold text-[var(--color-art-text)]">
          Artworks by Category
        </h3>
        <p className="text-sm text-[var(--color-art-muted)]">
          Active distribution across the platform
        </p>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-art-primary border-t-transparent" />
        </div>
      ) : data.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-sm text-art-muted">
          No category data available
        </div>
      ) : (
        <>
          <div className="relative mx-auto h-56 w-full max-w-[260px] sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius="58%"
                  outerRadius="85%"
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e5e1da",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  }}
                  formatter={(value) => [`${value} pieces`, ""]}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Center label */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <p className="font-art-display text-2xl font-bold text-[var(--color-art-text)]">{total}</p>
              <p className="text-xs font-medium text-[var(--color-art-muted)]">Total Pieces</p>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1.5">
            {data.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5 text-xs">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-[var(--color-art-secondary)]">
                  {item.name} ({item.value})
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}