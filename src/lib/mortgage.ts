export interface MortgageInput {
  price: number;
  downPaymentPercent: number;
  annualRatePercent: number;
  years: number;
}

export interface MortgageResult {
  loanAmount: number;
  downPayment: number;
  monthlyPayment: number;
  totalInterest: number;
  totalCost: number;
}

export function calculateMortgage({
  price,
  downPaymentPercent,
  annualRatePercent,
  years,
}: MortgageInput): MortgageResult {
  const downPayment = price * (downPaymentPercent / 100);
  const loanAmount = Math.max(price - downPayment, 0);
  const months = Math.max(Math.round(years * 12), 1);
  const monthlyRate = annualRatePercent / 100 / 12;

  const monthlyPayment =
    monthlyRate === 0
      ? loanAmount / months
      : (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));

  const totalPaid = monthlyPayment * months;
  return {
    loanAmount,
    downPayment,
    monthlyPayment,
    totalInterest: totalPaid - loanAmount,
    totalCost: totalPaid + downPayment,
  };
}
