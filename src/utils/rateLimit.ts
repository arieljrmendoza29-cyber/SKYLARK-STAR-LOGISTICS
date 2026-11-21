/**
 * Minimal fixed-window, in-memory rate limiter.
 *
 * Good enough for a single-instance small business site. If the app is ever
 * run on multiple instances, replace this with a shared store (e.g. Redis).
 */
export interface RateLimiterOptions {
  windowMs: number;
  max: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export function createRateLimiter({ windowMs, max }: RateLimiterOptions) {
  const hits = new Map<string, { count: number; resetAt: number }>();

  function check(key: string, now: number = Date.now()): RateLimitResult {
    // Opportunistic cleanup so the map can't grow without bound.
    if (hits.size > 10_000) {
      for (const [k, entry] of hits) {
        if (entry.resetAt <= now) hits.delete(k);
      }
    }

    let entry = hits.get(key);
    if (!entry || entry.resetAt <= now) {
      entry = { count: 0, resetAt: now + windowMs };
      hits.set(key, entry);
    }

    entry.count += 1;
    const allowed = entry.count <= max;
    return {
      allowed,
      remaining: Math.max(0, max - entry.count),
      retryAfterSeconds: allowed ? 0 : Math.ceil((entry.resetAt - now) / 1000),
    };
  }

  return { check };
}
