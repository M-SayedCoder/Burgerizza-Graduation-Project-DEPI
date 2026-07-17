/**
 * Formats a number as EGP currency string.
 */
export const formatCurrency = (amount: number): string => {
  return `${amount.toLocaleString('en-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} EGP`;
};
