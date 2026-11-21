import crypto from 'node:crypto';
import {
  formatQuoteSummary,
  type QuoteFieldErrors,
  type QuoteFormInput,
  validateQuoteForm,
} from './quoteValidation.ts';

export interface DeliveryEnvironment {
  QUOTE_WEBHOOK_URL?: string;
}

export interface QuoteDeliveryResponse {
  httpStatus: number;
  body: {
    ok: boolean;
    delivered: boolean;
    status: 'delivered' | 'integration_pending' | 'validation_error' | 'spam_rejected' | 'delivery_failed' | 'rate_limited';
    referenceId?: string;
    message: string;
    errors?: QuoteFieldErrors;
    formattedSummary?: string;
  };
}

export type WebhookSender = (
  url: string,
  payload: Record<string, unknown>,
) => Promise<{ ok: boolean; status: number }>;

async function defaultWebhookSender(
  url: string,
  payload: Record<string, unknown>,
): Promise<{ ok: boolean; status: number }> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return { ok: res.ok, status: res.status };
}

export async function processQuoteSubmission(
  rawBody: Partial<QuoteFormInput>,
  env: DeliveryEnvironment,
  sendWebhook: WebhookSender = defaultWebhookSender,
): Promise<QuoteDeliveryResponse> {
  const validation = validateQuoteForm(rawBody);

  if (validation.isSpam) {
    return {
      httpStatus: 400,
      body: {
        ok: false,
        delivered: false,
        status: 'spam_rejected',
        message: 'Submission could not be processed.',
      },
    };
  }

  if (!validation.valid) {
    return {
      httpStatus: 400,
      body: {
        ok: false,
        delivered: false,
        status: 'validation_error',
        message: 'Please correct the highlighted fields before submitting.',
        errors: validation.errors,
      },
    };
  }

  const referenceId = `SSL-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
  const formattedSummary = formatQuoteSummary(validation.sanitized, referenceId);
  const webhookUrl = env.QUOTE_WEBHOOK_URL?.trim();

  // Never show a fake success message if live email/CRM credentials are not yet configured.
  if (!webhookUrl) {
    return {
      httpStatus: 200,
      body: {
        ok: true,
        delivered: false,
        status: 'integration_pending',
        referenceId,
        formattedSummary,
        message:
          'Your quote request details have been validated, but live email/CRM delivery is not yet connected until client credentials are configured. Please copy the formatted summary below to retain your inquiry.',
      },
    };
  }

  try {
    const result = await sendWebhook(webhookUrl, {
      referenceId,
      submittedAt: new Date().toISOString(),
      quote: validation.sanitized,
      formattedSummary,
    });

    if (!result.ok) {
      return {
        httpStatus: 502,
        body: {
          ok: false,
          delivered: false,
          status: 'delivery_failed',
          referenceId,
          formattedSummary,
          message:
            'We validated your quote request, but the configured delivery endpoint did not confirm receipt. Please copy your quote summary and retry shortly.',
        },
      };
    }

    return {
      httpStatus: 200,
      body: {
        ok: true,
        delivered: true,
        status: 'delivered',
        referenceId,
        formattedSummary,
        message:
          'Thank you. Your quote request has been delivered to the Skylark Star Logistics dispatch team.',
      },
    };
  } catch {
    return {
      httpStatus: 502,
      body: {
        ok: false,
        delivered: false,
        status: 'delivery_failed',
        referenceId,
        formattedSummary,
        message:
          'Unable to reach the configured email/CRM delivery endpoint. Your quote details remain preserved below.',
      },
    };
  }
}
