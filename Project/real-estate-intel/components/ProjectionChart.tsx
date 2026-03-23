'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { ProjectionDataPoint } from '@/lib/types';

interface ProjectionChartProps {
  data: ProjectionDataPoint[];
}

const formatK = (value: number) => {
  if (Math.abs(value) >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  return `$${(value / 1_000).toFixed(0)}K`;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[var(--border)] rounded-xl p-3 shadow-lg text-xs">
        <p className="font-display font-bold text-sm mb-2">Year {label}</p>
        {payload.map((entry: any) => (
          <div key={entry.name} className="flex justify-between gap-4">
            <span style={{ color: entry.color }}>{entry.name}</span>
            <span className="font-mono font-semibold">{formatK(entry.value)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function ProjectionChart({ data }: ProjectionChartProps) {
  return (
    <div className="bg-white rounded-2xl border border-[var(--border)] p-6">
      <h3 className="font-display text-lg font-bold mb-1">15-Year Projection</h3>
      <p className="text-xs text-[var(--muted)] mb-6">Property value, equity & cumulative returns over time</p>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#c9a84c" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#c9a84c" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4a6741" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#4a6741" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorReturn" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3a6a8a" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#3a6a8a" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e8e3da" />
          <XAxis
            dataKey="year"
            tickFormatter={(v) => `Yr ${v}`}
            tick={{ fontSize: 11, fill: '#8a8070' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={formatK}
            tick={{ fontSize: 11, fill: '#8a8070' }}
            axisLine={false}
            tickLine={false}
            width={55}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '12px', paddingTop: '16px' }}
          />
          <Area
            type="monotone"
            dataKey="propertyValue"
            name="Property Value"
            stroke="#c9a84c"
            strokeWidth={2}
            fill="url(#colorValue)"
          />
          <Area
            type="monotone"
            dataKey="equity"
            name="Equity"
            stroke="#4a6741"
            strokeWidth={2}
            fill="url(#colorEquity)"
          />
          <Area
            type="monotone"
            dataKey="totalReturn"
            name="Total Return"
            stroke="#3a6a8a"
            strokeWidth={2}
            fill="url(#colorReturn)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
