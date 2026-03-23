'use client';

import { useState, useMemo } from 'react';
import { Home, TrendingUp, MapPin, Info } from 'lucide-react';
import { PropertyInputs } from '@/lib/types';
import { analyzeProperty, generateProjections, formatCurrency, formatPercent } from '@/lib/calculator';
import { GradeCard } from '@/components/GradeCard';
import { MetricCard, SliderField } from '@/components/MetricCard';
import { ProjectionChart } from '@/components/ProjectionChart';
import { NeighborhoodRadar } from '@/components/NeighborhoodRadar';

const DEFAULT_INPUTS: PropertyInputs = {
  purchasePrice: 450000,
  downPayment: 20,
  interestRate: 7.2,
  loanTerm: 30,
  monthlyRent: 2800,
  vacancyRate: 5,
  maintenanceCost: 1,
  propertyTax: 4500,
  insurance: 1800,
  managementFee: 8,
  appreciationRate: 3.5,
  neighborhoodScore: 65,
  walkScore: 72,
  schoolRating: 7,
  crimeIndex: 4,
  developmentActivity: 6,
};

type Tab = 'property' | 'income' | 'neighborhood';

export default function HomePage() {
  const [inputs, setInputs] = useState<PropertyInputs>(DEFAULT_INPUTS);
  const [activeTab, setActiveTab] = useState<Tab>('property');

  const set = (key: keyof PropertyInputs) => (value: number) =>
    setInputs((prev) => ({ ...prev, [key]: value }));

  const results = useMemo(() => analyzeProperty(inputs), [inputs]);
  const projections = useMemo(() => generateProjections(inputs), [inputs]);

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'property', label: 'Property', icon: <Home size={14} /> },
    { id: 'income', label: 'Income & Costs', icon: <TrendingUp size={14} /> },
    { id: 'neighborhood', label: 'Neighbourhood', icon: <MapPin size={14} /> },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--cream)' }}>
      <header className="sticky top-0 z-50 border-b" style={{ backgroundColor: 'var(--ink)', borderColor: '#1a1a2e' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--gold)' }}>
              <Home size={16} color="var(--ink)" />
            </div>
            <div>
              <span className="font-display text-lg font-bold text-white">PropIntel</span>
              <span className="hidden sm:inline text-xs text-gray-400 ml-2 font-mono">Real Estate Intelligence</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-3 py-1.5 rounded-full font-semibold" style={{ backgroundColor: 'var(--gold)', color: 'var(--ink)' }}>
              Grade: {results.investmentGrade}
            </span>
            <span className="text-xs text-gray-400 hidden sm:block">{formatCurrency(inputs.purchasePrice)}</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8 fade-up">
          <div className="flex items-baseline gap-3">
            <h1 className="font-display text-4xl sm:text-5xl font-black" style={{ color: 'var(--ink)' }}>Is it worth it?</h1>
            <div className="w-2 h-2 rounded-full mt-auto mb-2 pulse-dot" style={{ backgroundColor: 'var(--gold)' }} />
          </div>
          <p className="text-[var(--muted)] mt-2 max-w-lg">
            Stop guessing. Analyse any property's investment potential with real numbers — ROI, rental yield, and neighbourhood growth score.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Input Panel */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl border border-[var(--border)] overflow-hidden">
              <div className="flex border-b border-[var(--border)]" style={{ backgroundColor: 'var(--paper)' }}>
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-3 text-xs font-semibold transition-all ${activeTab === tab.id ? 'tab-active' : 'text-[var(--muted)] hover:text-[var(--ink)]'}`}
                    style={{ color: activeTab === tab.id ? 'var(--ink)' : undefined }}
                  >
                    {tab.icon}
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </div>

              <div className="p-5 space-y-6">
                {activeTab === 'property' && (
                  <>
                    <SliderField label="Purchase Price" value={inputs.purchasePrice} min={50000} max={5000000} step={10000} prefix="$" onChange={set('purchasePrice')} />
                    <SliderField label="Down Payment" value={inputs.downPayment} min={5} max={100} step={1} unit="%" onChange={set('downPayment')} />
                    <SliderField label="Interest Rate" value={inputs.interestRate} min={2} max={15} step={0.1} unit="%" onChange={set('interestRate')} />
                    <SliderField label="Loan Term" value={inputs.loanTerm} min={10} max={30} step={5} unit=" yrs" onChange={set('loanTerm')} />
                    <SliderField label="Annual Appreciation" value={inputs.appreciationRate} min={0} max={10} step={0.1} unit="%" onChange={set('appreciationRate')} />
                  </>
                )}
                {activeTab === 'income' && (
                  <>
                    <SliderField label="Monthly Rent" value={inputs.monthlyRent} min={500} max={20000} step={50} prefix="$" onChange={set('monthlyRent')} />
                    <SliderField label="Vacancy Rate" value={inputs.vacancyRate} min={0} max={30} step={1} unit="%" onChange={set('vacancyRate')} />
                    <SliderField label="Annual Property Tax" value={inputs.propertyTax} min={0} max={30000} step={100} prefix="$" onChange={set('propertyTax')} />
                    <SliderField label="Annual Insurance" value={inputs.insurance} min={0} max={10000} step={100} prefix="$" onChange={set('insurance')} />
                    <SliderField label="Maintenance (% of value/yr)" value={inputs.maintenanceCost} min={0} max={5} step={0.1} unit="%" onChange={set('maintenanceCost')} />
                    <SliderField label="Management Fee" value={inputs.managementFee} min={0} max={20} step={1} unit="%" onChange={set('managementFee')} />
                  </>
                )}
                {activeTab === 'neighborhood' && (
                  <>
                    <SliderField label="Walk Score" value={inputs.walkScore} min={0} max={100} step={1} onChange={set('walkScore')} />
                    <SliderField label="School Rating (1–10)" value={inputs.schoolRating} min={1} max={10} step={1} onChange={set('schoolRating')} />
                    <SliderField label="Crime Index (0=safe, 10=high)" value={inputs.crimeIndex} min={0} max={10} step={1} onChange={set('crimeIndex')} />
                    <SliderField label="Development Activity (1–10)" value={inputs.developmentActivity} min={0} max={10} step={1} onChange={set('developmentActivity')} />
                    <SliderField label="Overall Desirability" value={inputs.neighborhoodScore} min={0} max={100} step={1} onChange={set('neighborhoodScore')} />
                  </>
                )}
              </div>
            </div>

            <div className="rounded-2xl border p-4" style={{ backgroundColor: 'var(--paper)', borderColor: 'var(--border)' }}>
              <div className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-3">Quick Summary</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-[var(--muted)]">Investment:</span><span className="font-mono font-semibold ml-1">{formatCurrency(results.totalInvestment)}</span></div>
                <div><span className="text-[var(--muted)]">Mortgage:</span><span className="font-mono font-semibold ml-1">${Math.round(results.monthlyMortgage)}/mo</span></div>
                <div><span className="text-[var(--muted)]">Eff. rent:</span><span className="font-mono font-semibold ml-1">${Math.round(results.effectiveMonthlyRent)}/mo</span></div>
                <div><span className="text-[var(--muted)]">Total costs:</span><span className="font-mono font-semibold ml-1">${Math.round(results.totalMonthlyExpenses)}/mo</span></div>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-3 space-y-4">
            <GradeCard results={results} />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <MetricCard label="Cash on Cash" value={formatPercent(results.cashOnCashReturn)} subtitle="Annual return on cash" positive={results.cashOnCashReturn >= 8} negative={results.cashOnCashReturn < 0} accent={results.cashOnCashReturn >= 12} delay={1} />
              <MetricCard label="Gross Yield" value={formatPercent(results.grossRentalYield)} subtitle="Rent ÷ price" positive={results.grossRentalYield >= 7} negative={results.grossRentalYield < 4} delay={2} />
              <MetricCard label="Net Yield" value={formatPercent(results.netRentalYield)} subtitle="After expenses" positive={results.netRentalYield >= 5} negative={results.netRentalYield < 3} delay={3} />
              <MetricCard label="Cap Rate" value={formatPercent(results.capRate)} subtitle="NOI ÷ price" positive={results.capRate >= 6} negative={results.capRate < 3} delay={4} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <MetricCard label="Monthly Cash Flow" value={`${results.monthlyCashFlow >= 0 ? '+' : ''}$${Math.round(results.monthlyCashFlow)}`} positive={results.monthlyCashFlow > 0} negative={results.monthlyCashFlow < 0} delay={1} />
              <MetricCard label="Annual Cash Flow" value={formatCurrency(results.annualCashFlow)} positive={results.annualCashFlow > 0} negative={results.annualCashFlow < 0} delay={2} />
              <MetricCard label="5-Year ROI" value={formatPercent(results.roi5Year)} positive={results.roi5Year >= 30} delay={3} />
              <MetricCard label="10-Year ROI" value={formatPercent(results.roi10Year)} positive={results.roi10Year >= 60} delay={4} />
            </div>

            {results.monthlyCashFlow < 0 && (
              <div className="rounded-xl border px-4 py-3 flex items-center gap-3 text-sm" style={{ borderColor: '#c97a2e40', backgroundColor: '#fdf3ec' }}>
                <Info size={16} color="var(--rust)" className="flex-shrink-0" />
                <span style={{ color: 'var(--rust)' }}>
                  <strong>Negative cash flow.</strong> You need rent of at least <strong>${Math.ceil(results.totalMonthlyExpenses / (1 - inputs.vacancyRate / 100))}/mo</strong> to break even.
                </span>
              </div>
            )}

            <ProjectionChart data={projections} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <NeighborhoodRadar inputs={inputs} score={results.neighborhoodGrowthScore} />

              <div className="bg-white rounded-2xl border border-[var(--border)] p-6">
                <h3 className="font-display text-lg font-bold mb-1">Monthly Breakdown</h3>
                <p className="text-xs text-[var(--muted)] mb-5">Where your money goes</p>
                <div className="space-y-3">
                  {[
                    { label: 'Mortgage P&I', value: results.monthlyMortgage, color: '#c9a84c' },
                    { label: 'Property Tax', value: inputs.propertyTax / 12, color: '#4a6741' },
                    { label: 'Insurance', value: inputs.insurance / 12, color: '#3a6a8a' },
                    { label: 'Maintenance', value: (inputs.purchasePrice * inputs.maintenanceCost / 100) / 12, color: '#c97a2e' },
                    { label: 'Management', value: results.effectiveMonthlyRent * (inputs.managementFee / 100), color: '#7a5f9a' },
                  ].map((item) => {
                    const pct = (item.value / results.totalMonthlyExpenses) * 100;
                    return (
                      <div key={item.label}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-[var(--slate)]">{item.label}</span>
                          <span className="font-mono font-semibold">${Math.round(item.value)}/mo</span>
                        </div>
                        <div className="h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: item.color }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-5 pt-4 border-t border-[var(--border)] flex justify-between text-sm">
                  <span className="font-medium text-[var(--slate)]">Total Monthly</span>
                  <span className="font-mono font-bold">${Math.round(results.totalMonthlyExpenses)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-12 pt-6 border-t border-[var(--border)] text-center text-xs text-[var(--muted)]">
          <p>PropIntel uses standard real estate investment formulas. Not financial advice.</p>
          <p className="mt-1">Always consult a qualified financial advisor before making investment decisions.</p>
        </footer>
      </main>
    </div>
  );
}
