import test from 'node:test';
import assert from 'node:assert/strict';
import { createRateLimiter } from './rateLimit.ts';

test('allows requests up to the limit, then blocks until the window resets', () => {
  const limiter = createRateLimiter({ windowMs: 60_000, max: 3 });
  const t0 = 1_000_000;

  assert.equal(limiter.check('1.2.3.4', t0).allowed, true);
  assert.equal(limiter.check('1.2.3.4', t0).allowed, true);
  assert.equal(limiter.check('1.2.3.4', t0).allowed, true);

  const blocked = limiter.check('1.2.3.4', t0 + 1_000);
  assert.equal(blocked.allowed, false);
  assert.equal(blocked.retryAfterSeconds, 59);

  // Other visitors are unaffected.
  assert.equal(limiter.check('5.6.7.8', t0).allowed, true);

  // A new window starts after windowMs.
  assert.equal(limiter.check('1.2.3.4', t0 + 60_000).allowed, true);
});
