/**
 * Calcula juros simples
 * Fórmula: J = (taxa / 365) × dias × valor
 * Valor Final = valor + J
 */
export const calculateSimpleInterest = (
  principal: number,
  annualRate: number,
  daysElapsed: number
): number => {
  return (annualRate / 365) * daysElapsed * principal / 100;
};

/**
 * Calcula juros compostos
 * Fórmula: A = P × (1 + i)^n
 * Onde:
 * - A = valor final
 * - P = principal
 * - i = taxa por período (anual/365 para dias)
 * - n = número de períodos (dias)
 */
export const calculateCompoundInterest = (
  principal: number,
  annualRate: number,
  daysElapsed: number
): number => {
  const dailyRate = (annualRate / 100) / 365;
  const finalAmount = principal * Math.pow(1 + dailyRate, daysElapsed);
  return finalAmount - principal;
};

/**
 * Calcula retorno baseado no tipo de juros
 */
export const calculateReturn = (
  principal: number,
  annualRate: number,
  daysElapsed: number,
  interestType: 'simples' | 'composto' = 'simples'
): number => {
  if (interestType === 'composto') {
    return calculateCompoundInterest(principal, annualRate, daysElapsed);
  }
  return calculateSimpleInterest(principal, annualRate, daysElapsed);
};
