'use client';

import { PropertyInputs } from '@/lib/types';

interface NeighborhoodRadarProps {
  inputs: PropertyInputs;
  score: number;
}

export function NeighborhoodRadar({ inputs, score }: NeighborhoodRadarProps) {
  const metrics = [
    { label: 'Walk Score', value: inputs.walkScore, max: 100, color: '#4a6741' },
    { label: 'Schools', value: inputs.schoolRating * 10, max: 100, color: '#c9a84c' },
    { label: 'Safety', value: (10 - inputs.crimeIndex) * 10, max: 100, color: '#3a6a8a' },
    { label: 'Development', value: inputs.developmentActivity * 10, max: 100, color: '#c45c2e' },
    { label: 'Desirability', value: inputs.neighborhoodScore, max: 100, color: '#7a5f9a' },
  ];

  const getColor = (pct: number) => {
    if (pct >= 70) return 'var(--sage)';
    if (pct >= 40) return 'var(--gold)';
    return 'var(--rust)';
  };

  return (
    <div className="bg-white rounded-2xl border border-[var(--border)] p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-display text-lg font-bold">Neighborhood Intelligence</h3>
          <p className="text-xs text-[var(--muted)] mt-0.5">Location quality factors</p>
        </div>
        <div className="text-right">
          <div
            className="font-display text-3xl font-black"
            style={{ color: getColor(score) }}
          >
            {score}
          </div>
          <div className="text-xs text-[var(--muted)]">/ 100</div>
        </div>
      </div>

      <div className="space-y-4">
        {metrics.map((m) => {
          const pct = (m.value / m.max) * 100;
          return (
            <div key={m.label}>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-[var(--slate)] font-medium">{m.label}</span>
                <span className="font-mono font-semibold" style={{ color: m.color }}>
                  {Math.round(m.value)}
                </span>
              </div>
              <div className="h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: m.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-5 border-t border-[var(--border)]">
        <div className="flex gap-3">
          {score >= 70 && (
            <div className="flex items-center gap-1.5 text-xs text-[var(--sage)] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--sage)]" />
              Prime Location
            </div>
          )}
          {inputs.developmentActivity >= 7 && (
            <div className="flex items-center gap-1.5 text-xs text-[var(--gold)] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)]" />
              High Development
            </div>
          )}
          {inputs.crimeIndex <= 3 && (
            <div className="flex items-center gap-1.5 text-xs text-[var(--slate)] font-medium">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--slate)' }} />
              Safe Area
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
