'use client';

interface MetricCardProps {
  label: string;
  value: string;
  subtitle?: string;
  positive?: boolean;
  negative?: boolean;
  accent?: boolean;
  delay?: number;
}

export function MetricCard({ label, value, subtitle, positive, negative, accent, delay = 0 }: MetricCardProps) {
  const delayClass = delay === 1 ? 'fade-up-delay-1' : delay === 2 ? 'fade-up-delay-2' : delay === 3 ? 'fade-up-delay-3' : 'fade-up-delay-4';

  return (
    <div
      className={`bg-white rounded-xl border border-[var(--border)] p-4 fade-up ${delayClass}`}
      style={{ borderColor: accent ? 'var(--gold)' : undefined, backgroundColor: accent ? 'var(--cream)' : 'white' }}
    >
      <div className="text-xs text-[var(--muted)] font-medium uppercase tracking-wider mb-1">{label}</div>
      <div
        className="font-mono text-xl font-semibold"
        style={{
          color: positive ? 'var(--sage)' : negative ? 'var(--rust)' : accent ? 'var(--gold)' : 'var(--ink)',
        }}
      >
        {value}
      </div>
      {subtitle && <div className="text-xs text-[var(--muted)] mt-1">{subtitle}</div>}
    </div>
  );
}

interface SliderFieldProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  prefix?: string;
  onChange: (value: number) => void;
}

export function SliderField({ label, value, min, max, step, unit, prefix, onChange }: SliderFieldProps) {
  const displayValue = prefix
    ? `${prefix}${value.toLocaleString()}`
    : unit
    ? `${value}${unit}`
    : value.toLocaleString();

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-[var(--slate)]">{label}</label>
        <span className="font-mono text-sm font-semibold text-[var(--ink)]">{displayValue}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <div className="flex justify-between text-xs text-[var(--muted)]">
        <span>{prefix}{min.toLocaleString()}{unit}</span>
        <span>{prefix}{max.toLocaleString()}{unit}</span>
      </div>
    </div>
  );
}
