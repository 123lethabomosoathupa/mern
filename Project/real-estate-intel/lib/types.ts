export interface PropertyInputs {
  purchasePrice: number;
  downPayment: number;
  interestRate: number;
  loanTerm: number;
  monthlyRent: number;
  vacancyRate: number;
  maintenanceCost: number;
  propertyTax: number;
  insurance: number;
  managementFee: number;
  appreciationRate: number;
  neighborhoodScore: number;
  walkScore: number;
  schoolRating: number;
  crimeIndex: number;
  developmentActivity: number;
}

export interface AnalysisResults {
  monthlyMortgage: number;
  totalMonthlyExpenses: number;
  effectiveMonthlyRent: number;
  monthlyCashFlow: number;
  annualCashFlow: number;
  grossRentalYield: number;
  netRentalYield: number;
  capRate: number;
  cashOnCashReturn: number;
  roi5Year: number;
  roi10Year: number;
  breakEvenMonths: number;
  totalInvestment: number;
  neighborhoodGrowthScore: number;
  investmentGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  verdict: string;
}

export interface ProjectionDataPoint {
  year: number;
  propertyValue: number;
  equity: number;
  cumulativeCashFlow: number;
  totalReturn: number;
}
