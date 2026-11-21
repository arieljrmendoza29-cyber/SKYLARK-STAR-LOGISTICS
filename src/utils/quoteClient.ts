import type { QuoteDeliveryResponse } from './quoteDelivery';
import { formatQuoteSummary, type QuoteFormInput } from './quoteValidation';
import { withBase } from './basePath';

export type QuoteSubmitResult = QuoteDeliveryResponse['body'];

const PENDING_MESSAGE =
  'Your quote request details have been validated, but live email/CRM delivery is not yet connected. Please copy the formatted summary below to retain your inquiry.';

function makeReferenceId(): string {
  const bytes = new Uint8Array(3);
  crypto.getRandomValues(bytes);
  return `SSL-${Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('').toUpperCase()}`;
}

/**
 * Sends a validated quote request.
 *
 * - Static hosting (GitHub Pages): when VITE_QUOTE_WEBHOOK_URL is set at build time,
 *   the browser posts straight to that webhook (e.g. the Google Sheets Apps Script).
 * - Node hosting: otherwise it posts to this site's own /api/quote endpoint.
 * - If neither is available, it returns "integration_pending" with a copyable summary
 *   instead of pretending the request was delivered.
 */
export async function submitQuote(quote: QuoteFormInput): Promise<QuoteSubmitResult> {
  const webhookUrl = import.meta.env.VITE_QUOTE_WEBHOOK_URL?.trim();

  if (webhookUrl) {
    const referenceId = makeReferenceId();
    const formattedSummary = formatQuoteSummary(quote, referenceId);
    const { website: _honeypot, ...quoteFields } = quote;
    try {
      // text/plain keeps this a "simple" request, which Google Apps Script accepts cross-origin.
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          referenceId,
          submittedAt: new Date().toISOString(),
          quote: quoteFields,
          formattedSummary,
        }),
      });
      const data = (await res.json().catch(() => null)) as { ok?: boolean } | null;
      if (res.ok && data?.ok) {
        return {
          ok: true,
          delivered: true,
          status: 'delivered',
          referenceId,
          formattedSummary,
          message: 'Thank you. Your quote request has been delivered to the Skylark Star Logistics dispatch team.',
        };
      }
    } catch {
      // Falls through to the failure message below.
    }
    return {
      ok: false,
      delivered: false,
      status: 'delivery_failed',
      referenceId,
      formattedSummary,
      message:
        'We could not confirm delivery of your quote request. Please copy your quote summary below and try again shortly.',
    };
  }

  try {
    const res = await fetch(withBase('/api/quote'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quote),
    });
    if (res.headers.get('content-type')?.includes('application/json')) {
      return (await res.json()) as QuoteSubmitResult;
    }
    // Any non-JSON reply means there is no quote API here (static hosting).
  } catch {
    // Network error: treat like "no backend available" below.
  }

  // No server and no webhook configured (e.g. GitHub Pages before setup).
  const referenceId = makeReferenceId();
  return {
    ok: true,
    delivered: false,
    status: 'integration_pending',
    referenceId,
    formattedSummary: formatQuoteSummary(quote, referenceId),
    message: PENDING_MESSAGE,
  };
}
