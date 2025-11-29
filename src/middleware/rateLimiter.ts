interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

const requestMap = new Map<string, { count: number; resetTime: number }>();

export const createRateLimiter = (config: RateLimitConfig) => {
  return (identifier: string): boolean => {
    const now = Date.now();
    const data = requestMap.get(identifier);

    if (!data || now > data.resetTime) {
      requestMap.set(identifier, {
        count: 1,
        resetTime: now + config.windowMs,
      });
      return true;
    }

    if (data.count < config.maxRequests) {
      data.count++;
      return true;
    }

    return false;
  };
};

export const depositLimiter = createRateLimiter({
  maxRequests: 5,
  windowMs: 60000,
});

export const investmentLimiter = createRateLimiter({
  maxRequests: 10,
  windowMs: 60000,
});

export const authLimiter = createRateLimiter({
  maxRequests: 5,
  windowMs: 900000,
});
