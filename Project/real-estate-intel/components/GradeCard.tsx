'use client';

import { AnalysisResults } from '@/lib/types';

interface GradeCardProps {
  results: AnalysisResults;
}

const gradeConfig = {
  A: { color: '#4a6741', bg: '#eef5ed', label: 'Excellent', ring: '#4a6741' },
  B: { color: '#3a6a8a', bg: '#edf4f8', label: 'Good', ring: '#3a6a8a' },
  C: { color: '#c9a84c', bg: '#fdf8ed', label: 'Fair', ring: '#c9a84c' },
  D: { color: '#c97a2e', bg: '#fdf3ec', label: 'Poor', ring: '#c97a2e' },
  F: { color: '#c45c2e', bg: '#fdecea', label: 'Avoid', ring: '#c45c2e' },
};

export function GradeCard({ results }: GradeCardProps) {
  const config = gradeConfig[results.investmentGrade];
  const score = results.neighborhoodGrowthScore;
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div
      className="rounded-2xl p-6 border"
      style={{ backgroundColor: config.bg, borderColor: config.ring + '40' }}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Grade */}
        <div className="flex flex-col items-center">
          <div
            className="font-display text-7xl font-black leading-none"
            style={{ color: config.color }}
          >
            {results.investmentGrade}
          </div>
          <div
            className="text-xs font-semibold tracking-widest uppercase mt-1"
            style={{ color: config.color }}
          >
            {config.label}
          </div>
        </div>

        {/* Neighborhood score ring */}
        <div className="flex flex-col items-center">
          <svg width="80" height="80" viewBox="0 0 100 100" className="score-ring -rotate-90">
            <circle
              cx="50" cy="50" r="45"
              fill="none"
              stroke={config.ring + '20'}
              strokeWidth="8"
            />
            <circle
              cx="50" cy="50" r="45"
              fill="none"
              stroke={config.ring}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              style={{ '--target-offset': offset } as React.CSSProperties}
            />
          </svg>
          <div className="text-center -mt-14">
            <div className="font-mono text-lg font-bold" style={{ color: config.color }}>
              {score}
            </div>
          </div>
          <div className="text-center mt-8">
            <div className="text-xs text-gray-500 font-medium">Neighborhood</div>
            <div className="text-xs text-gray-500">Growth Score</div>
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed" style={{ color: config.color }}>
        {results.verdict}
      </p>

      {/* Cash flow indicator */}
      <div
        className="mt-4 flex items-center gap-2 text-sm font-medium"
        style={{ color: config.color }}
      >
        <span
          className="w-2 h-2 rounded-full pulse-dot"
          style={{ backgroundColor: config.color }}
        />
        {results.monthlyCashFlow >= 0
          ? `Positive cash flow: $${Math.round(results.monthlyCashFlow)}/mo`
          : `Negative cash flow: -$${Math.abs(Math.round(results.monthlyCashFlow))}/mo`
        }
      </div>
    </div>
  );
}
