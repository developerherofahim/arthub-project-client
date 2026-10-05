"use client";

import { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { Loader2 } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function SalesTrendChart() {
  const [data, setData]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/analytics/admin`)
      .then(r => r.json())
      .then(d => {
        if (Array.isArray(d.salesTrend) && d.salesTrend.length > 0) {
          setData(d.salesTrend.map(m => ({ month: m.month, sales: m.sales })));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="rounded-2xl border border-[var(--color-art-border)] bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-display text-lg font-semibold text-[var(--color-art-text)]">Sales Trend</h3>
          <p className="text-sm text-[var(--color-art-muted)]">Monthly revenue from completed transactions</p>
        </div>
        <div className="mt-2 flex items-center gap-4 text-xs sm:mt-0">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-art-primary)]" />
            <span className="text-[var(--color-art-secondary)]">Revenue ($)</span>
          </div>
        </div>
      </div>

      <div className="h-64 w-full sm:h-72">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--color-art-primary)]" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e1da" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#77736d", fontSize: 12 }} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#77736d", fontSize: 12 }}
                tickFormatter={(v) => v >= 1000 ? `$${(v / 1000).toFixed(0)}K` : `$${v}`}
              />
              <Tooltip
                contentStyle={{ borderRadius: "12px", border: "1px solid #e5e1da", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                formatter={(value) => [`$${Number(value).toLocaleString()}`, "Revenue"]}
              />
              <Line type="monotone" dataKey="sales" stroke="#e4574f" strokeWidth={2.5} dot={{ r: 4, fill: "#e4574f", strokeWidth: 0 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}