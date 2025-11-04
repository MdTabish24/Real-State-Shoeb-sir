const rateLimit = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(identifier: string, maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000): boolean {
  const now = Date.now();
  const record = rateLimit.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimit.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= maxAttempts) {
    return false;
  }

  record.count++;
  return true;
}

export function getRemainingTime(identifier: string): number {
  const record = rateLimit.get(identifier);
  if (!record) return 0;
  return Math.max(0, record.resetTime - Date.now());
}
