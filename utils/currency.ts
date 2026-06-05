import { CURRENCY_CODE, CURRENCY_SYMBOL } from '../constants';

export const formatSAR = (amount: number): string => {
  return new Intl.NumberFormat('en-SA', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount) + ` ${CURRENCY_SYMBOL}`;
};
