import { PropertyInputs, AnalysisResults, ProjectionDataPoint } from './types';

export function calculateMortgage(principal: number, annualRate: number, termYears: number): number {
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = termYears * 12;
  if (monthlyRate === 0) return principal / numPayments;
  return (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
    (Math.pow(1 + monthlyRate, numPayments) - 1);
}

export function analyzeProperty(inputs: PropertyInputs): AnalysisResults {
  const loanAmount = inputs.purchasePrice * (1 - inputs.downPayment / 100);
  const monthlyMortgage = calculateMortgage(loanAmount, inputs.interestRate, inputs.loanTerm);

  const effectiveMonthlyRent = inputs.monthlyRent * (1 - inputs.vacancyRate / 100);
  const monthlyPropertyTax = inputs.propertyTax / 12;
  const monthlyInsurance = inputs.insurance / 12;
  const monthlyMaintenance = (inputs.purchasePrice * inputs.maintenanceCost / 100) / 12;
  const monthlyManagement = effectiveMonthlyRent * (inputs.managementFee / 100);

  const totalMonthlyExpenses = monthlyMortgage + monthlyPropertyTax + monthlyInsurance +
    monthlyMaintenance + monthlyManagement;

  const monthlyCashFlow = effectiveMonthlyRent - totalMonthlyExpenses;
  const annualCashFlow = monthlyCashFlow * 12;

  const annualRent = inputs.monthlyRent * 12;
  const grossRentalYield = (annualRent / inputs.purchasePrice) * 100;

  const annualNetIncome = effectiveMonthlyRent * 12 - (monthlyPropertyTax + monthlyInsurance + monthlyMaintenance + monthlyManagement) * 12;
  const netRentalYield = (annualNetIncome / inputs.purchasePrice) * 100;

  const capRate = (annualNetIncome / inputs.purchasePrice) * 100;

  const totalInvestment = inputs.purchasePrice * (inputs.downPayment / 100);
  const cashOnCashReturn = (annualCashFlow / totalInvestment) * 100;

  // 5 and 10 year ROI with appreciation
  const roi5Year = calculateROI(inputs, 5, totalInvestment);
  const roi10Year = calculateROI(inputs, 10, totalInvestment);

  const breakEvenMonths = monthlyCashFlow >= 0 ? 0 : Math.abs(totalInvestment / monthlyCashFlow);

  // Neighborhood growth score (0–100)
  const neighborhoodGrowthScore = Math.round(
    (inputs.walkScore * 0.2) +
    (inputs.schoolRating * 10 * 0.25) +
    ((10 - inputs.crimeIndex) * 10 * 0.25) +
    (inputs.developmentActivity * 10 * 0.2) +
    (inputs.neighborhoodScore * 0.1)
  );

  const investmentGrade = calculateGrade(cashOnCashReturn, netRentalYield, neighborhoodGrowthScore, monthlyCashFlow);
  const verdict = generateVerdict(investmentGrade, cashOnCashReturn, monthlyCashFlow);

  return {
    monthlyMortgage,
    totalMonthlyExpenses,
    effectiveMonthlyRent,
    monthlyCashFlow,
    annualCashFlow,
    grossRentalYield,
    netRentalYield,
    capRate,
    cashOnCashReturn,
    roi5Year,
    roi10Year,
    breakEvenMonths,
    totalInvestment,
    neighborhoodGrowthScore,
    investmentGrade,
    verdict,
  };
}

function calculateROI(inputs: PropertyInputs, years: number, totalInvestment: number): number {
  const futureValue = inputs.purchasePrice * Math.pow(1 + inputs.appreciationRate / 100, years);
  const appreciation = futureValue - inputs.purchasePrice;
  const loanAmount = inputs.purchasePrice * (1 - inputs.downPayment / 100);
  const monthlyMortgage = calculateMortgage(loanAmount, inputs.interestRate, inputs.loanTerm);
  const effectiveMonthlyRent = inputs.monthlyRent * (1 - inputs.vacancyRate / 100);
  const monthlyExpenses = monthlyMortgage +
    inputs.propertyTax / 12 +
    inputs.insurance / 12 +
    (inputs.purchasePrice * inputs.maintenanceCost / 100) / 12 +
    effectiveMonthlyRent * (inputs.managementFee / 100);
  const totalCashFlow = (effectiveMonthlyRent - monthlyExpenses) * 12 * years;
  return ((appreciation + totalCashFlow) / totalInvestment) * 100;
}

function calculateGrade(
  cashOnCash: number,
  netYield: number,
  neighborhoodScore: number,
  cashFlow: number
): 'A' | 'B' | 'C' | 'D' | 'F' {
  let score = 0;
  if (cashOnCash >= 12) score += 3;
  else if (cashOnCash >= 8) score += 2;
  else if (cashOnCash >= 4) score += 1;
  else if (cashOnCash < 0) score -= 1;

  if (netYield >= 8) score += 3;
  else if (netYield >= 5) score += 2;
  else if (netYield >= 3) score += 1;

  if (neighborhoodScore >= 75) score += 2;
  else if (neighborhoodScore >= 50) score += 1;

  if (cashFlow > 500) score += 2;
  else if (cashFlow > 0) score += 1;
  else score -= 1;

  if (score >= 9) return 'A';
  if (score >= 6) return 'B';
  if (score >= 3) return 'C';
  if (score >= 1) return 'D';
  return 'F';
}

function generateVerdict(grade: string, cashOnCash: number, cashFlow: number): string {
  if (grade === 'A') return 'Exceptional investment opportunity with strong cash flow and growth potential.';
  if (grade === 'B') return 'Solid investment with good fundamentals and positive cash flow.';
  if (grade === 'C') return 'Moderate investment. Consider negotiating purchase price or improving rent.';
  if (grade === 'D') return 'Below-average returns. High risk without significant appreciation.';
  return 'Poor investment at current price. Negative cash flow and weak fundamentals.';
}

export function generateProjections(inputs: PropertyInputs): ProjectionDataPoint[] {
  const loanAmount = inputs.purchasePrice * (1 - inputs.downPayment / 100);
  const monthlyRate = inputs.interestRate / 100 / 12;
  const numPayments = inputs.loanTerm * 12;
  const monthlyMortgage = calculateMortgage(loanAmount, inputs.interestRate, inputs.loanTerm);

  const points: ProjectionDataPoint[] = [];

  for (let year = 0; year <= 15; year++) {
    const propertyValue = inputs.purchasePrice * Math.pow(1 + inputs.appreciationRate / 100, year);

    // Remaining loan balance
    let remainingBalance = loanAmount;
    for (let m = 0; m < year * 12; m++) {
      const interest = remainingBalance * monthlyRate;
      const principal = monthlyMortgage - interest;
      remainingBalance = Math.max(0, remainingBalance - principal);
    }

    const equity = propertyValue - remainingBalance;
    const effectiveMonthlyRent = inputs.monthlyRent * (1 - inputs.vacancyRate / 100);
    const monthlyExpenses = monthlyMortgage +
      inputs.propertyTax / 12 +
      inputs.insurance / 12 +
      (inputs.purchasePrice * inputs.maintenanceCost / 100) / 12 +
      effectiveMonthlyRent * (inputs.managementFee / 100);
    const cumulativeCashFlow = (effectiveMonthlyRent - monthlyExpenses) * 12 * year;
    const totalReturn = equity - (inputs.purchasePrice * inputs.downPayment / 100) + cumulativeCashFlow;

    points.push({ year, propertyValue, equity, cumulativeCashFlow, totalReturn });
  }

  return points;
}

export function formatCurrency(value: number): string {
  if (Math.abs(value) >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (Math.abs(value) >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
}

export function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}
