import { useCallback } from 'react';
import { depositLimiter, investmentLimiter, authLimiter } from '@/middleware/rateLimiter';

type LimiterType = 'deposit' | 'investment' | 'auth';

export const useRateLimit = (type: LimiterType = 'deposit', userId: string) => {
  const limiters = {
    deposit: depositLimiter,
    investment: investmentLimiter,
    auth: authLimiter,
  };

  const checkLimit = useCallback(() => {
    return limiters[type](userId);
  }, [type, userId]);

  return { isAllowed: checkLimit };
};
