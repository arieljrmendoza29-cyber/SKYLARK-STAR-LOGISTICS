# Skylark Star Logistics, LLC

Corporate website and freight quote request platform for **Skylark Star Logistics, LLC** — <https://skylarkstarlogistics.com>

[![CI](https://github.com/<your-username>/<your-repo>/actions/workflows/ci.yml/badge.svg)](https://github.com/<your-username>/<your-repo>/actions/workflows/ci.yml)

## Company overview

- **Legal name:** Skylark Star Logistics, LLC
- **Leadership:** James Johnson, Manager / Owner
- **Location:** La Porte, Texas 77571
- **Established:** 2022 (Colorado LLC; currently registering to operate in Texas)
- **Services:** Transportation, Logistics Solutions, Freight Handling, Delivery

## Before launch

These items need information from the business and are **not** filled in yet:

- [ ] **Quote delivery** — set `QUOTE_WEBHOOK_URL`. Until it is set, the quote form validates submissions but does not deliver them anywhere.
- [ ] **Phone, email and business hours** — replace the placeholders in `src/utils/companyData.ts` (`contactPlaceholders`).
- [ ] **Credentials** — the home page "Verified Company Record" section should show real USDOT / MC numbers or insurance details, or be reworded.
- [ ] **Texas registration wording** — confirm the registration status text in `companyData.ts` is still accurate.

## Tech stack

- **Frontend:** React 19, TypeScript, Vite 8, Tailwind CSS v4, GSAP (ScrollTrigger), Lenis, Motion, Lucide icons
- **Backend:** Express (`server.ts`) — Vite middleware in development, serves the `dist/` build in production
- **Tests:** Node.js built-in test runner (`node:test` via `tsx`)

## Getting started

Requires **Node.js 22.18 or newer** (see `.nvmrc`). The production server runs `server.ts` directly using Node's built-in TypeScript support.

```bash
npm install
cp .env.example .env
npm run dev          # http://localhost:3000
```

### Scripts

| Command | What it does |
| :--- | :--- |
| `npm run dev` | Express + Vite dev server with hot reload |
| `npm run lint` | Type-check (`tsc --noEmit`) |
| `npm test` | Unit tests (quote validation, delivery, rate limiting, scroll snapping) |
| `npm run build` | Production build into `dist/` |
| `npm start` | Production server (set `NODE_ENV=production`, run `npm run build` first) |

### Environment variables

| Variable | Required | Description |
| :--- | :--- | :--- |
| `PORT` | No | Server port (default `3000`) |
| `NODE_ENV` | No | `development` or `production` |
| `APP_URL` | No | Public site URL |
| `QUOTE_WEBHOOK_URL` | For launch | Receives validated quote requests as a JSON `POST`. Works with Zapier, Make, n8n, a CRM inbound webhook, or an email relay. |
| `TRUST_PROXY` | When proxied | Set to `1` behind a reverse proxy / load balancer so rate limiting uses real visitor IPs. |

Never commit `.env` — it is ignored by `.gitignore`.

## Routes

| Path | Page |
| :--- | :--- |
| `/` | Home: hero, services, process timeline, Texas coverage map, credentials, quote CTA |
| `/services` | Service details with quote preselection |
| `/about` | Company background and leadership |
| `/service-area` | Interactive coverage map: La Porte, Greater Houston, broader Texas |
| `/contact` | Freight quote request form |
| `/privacy-policy`, `/terms-and-conditions` | Legal pages |

Unknown paths return HTTP 404 with the in-app "not found" page.

## API

- `GET /api/health` — service status and whether `QUOTE_WEBHOOK_URL` is configured.
- `POST /api/quote` — validates a quote request (client and server), rejects honeypot spam, rate-limits to 5 submissions per IP per 15 minutes, and forwards to `QUOTE_WEBHOOK_URL` when set.

Webhook payload:

```json
{
  "referenceId": "SSL-1A2B3C",
  "submittedAt": "2026-11-22T15:04:05.000Z",
  "quote": { "fullName": "...", "companyName": "...", "email": "...", "phone": "...", "pickupLocation": "...", "deliveryDestination": "...", "serviceType": "...", "freightDescription": "...", "preferredPickupDate": "YYYY-MM-DD", "additionalMessage": "...", "consentAccepted": true },
  "formattedSummary": "Plain-text summary suitable for an email body"
}
```

## Deployment

Any Node.js host works (Render, Railway, Fly.io, a VPS, etc.):

```bash
npm ci
npm run build
NODE_ENV=production npm start
```

Set `QUOTE_WEBHOOK_URL`, and `TRUST_PROXY=1` if the host sits behind a proxy (most managed platforms do).

## Project structure

```text
├── .github/workflows/ci.yml   # Type-check, test and build on every push / PR to main
├── public/
│   ├── brand/                 # Logo (PNG + WebP) and 1200×630 social preview image
│   ├── images/                # Site photography (optimized JPEGs)
│   ├── favicon.svg, robots.txt, sitemap.xml
├── src/
│   ├── components/            # Navbar, Footer, timeline, marquee, coverage map, SEO head...
│   ├── pages/                 # Home, Services, About, Service Area, Contact, Legal, 404
│   └── utils/                 # Company data, quote validation & delivery, rate limiter, tests
├── index.html                 # HTML entry, meta tags, Organization JSON-LD
├── server.ts                  # Express server
└── vite.config.ts
```

## Publishing to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Skylark Star Logistics website"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

Then replace `<your-username>/<your-repo>` in the CI badge at the top of this file.
