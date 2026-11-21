import 'dotenv/config';
import express, { type NextFunction, type Request, type Response } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { processQuoteSubmission } from './src/utils/quoteDelivery.ts';
import { createRateLimiter } from './src/utils/rateLimit.ts';

const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Client-side routes that should return HTTP 200. Anything else gets a real 404.
const KNOWN_ROUTES = new Set([
  '/',
  '/services',
  '/about',
  '/service-area',
  '/contact',
  '/privacy-policy',
  '/terms-and-conditions',
]);

// 5 quote submissions per visitor IP per 15 minutes.
const quoteLimiter = createRateLimiter({ windowMs: 15 * 60 * 1000, max: 5 });

async function createServer() {
  const app = express();
  app.disable('x-powered-by');

  // Set TRUST_PROXY=1 when running behind a reverse proxy / load balancer
  // (Render, Railway, Fly, Nginx, Cloud Run, etc.) so req.ip is the visitor's IP.
  if (process.env.TRUST_PROXY) {
    const value = Number(process.env.TRUST_PROXY);
    app.set('trust proxy', Number.isNaN(value) ? process.env.TRUST_PROXY : value);
  }

  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    next();
  });

  app.use(express.json({ limit: '64kb' }));

  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'skylark-star-logistics',
      quoteDeliveryConfigured: Boolean(process.env.QUOTE_WEBHOOK_URL?.trim()),
    });
  });

  app.post('/api/quote', async (req, res) => {
    const limit = quoteLimiter.check(req.ip ?? 'unknown');
    if (!limit.allowed) {
      res.setHeader('Retry-After', String(limit.retryAfterSeconds));
      res.status(429).json({
        ok: false,
        delivered: false,
        status: 'rate_limited',
        message: 'Too many quote requests from this connection. Please wait a few minutes and try again.',
      });
      return;
    }

    const result = await processQuoteSubmission(req.body ?? {}, {
      QUOTE_WEBHOOK_URL: process.env.QUOTE_WEBHOOK_URL,
    });
    res.status(result.httpStatus).json(result.body);
  });

  app.use('/api', (_req, res) => {
    res.status(404).json({ ok: false, message: 'Not found.' });
  });

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(import.meta.dirname, 'dist');
    const indexFile = path.join(distPath, 'index.html');

    // Hashed build files never change, so they can be cached for a long time.
    app.use(
      '/assets',
      express.static(path.join(distPath, 'assets'), { maxAge: '1y', immutable: true }),
    );
    app.use(express.static(distPath, { maxAge: '1d', index: false }));

    app.get('*', (req, res) => {
      if (!fs.existsSync(indexFile)) {
        res.status(500).send('Build output not found. Run "npm run build" first.');
        return;
      }
      const normalized =
        req.path.length > 1 && req.path.endsWith('/') ? req.path.slice(0, -1) : req.path;
      res.setHeader('Cache-Control', 'no-cache');
      res.status(KNOWN_ROUTES.has(normalized) ? 200 : 404).sendFile(indexFile);
    });
  }

  // Return JSON (not an HTML error page) for malformed or oversized request bodies.
  app.use((err: Error & { status?: number; type?: string }, _req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
      next(err);
      return;
    }
    const status = err.status && err.status >= 400 && err.status < 500 ? err.status : 500;
    if (status === 500) console.error(err);
    res.status(status).json({
      ok: false,
      status: status === 413 ? 'payload_too_large' : status === 500 ? 'server_error' : 'bad_request',
      message: status === 500 ? 'Something went wrong. Please try again.' : 'The request could not be read.',
    });
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Skylark Star Logistics server listening on http://localhost:${PORT}`);
  });
}

createServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
