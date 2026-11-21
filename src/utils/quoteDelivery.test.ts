import test from 'node:test';
import assert from 'node:assert/strict';
import { processQuoteSubmission } from './quoteDelivery';
import { QuoteFormInput } from './quoteValidation';

/** Returns a YYYY-MM-DD date `days` from today so tests never go stale. */
function futureDate(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

const validPayload: QuoteFormInput = {
  fullName: 'Jordan Vance',
  companyName: 'Gulf Coast Industrial Supply',
  email: 'jordan@gulfcoastsupply.com',
  phone: '(281) 555-0148',
  pickupLocation: 'La Porte, TX',
  deliveryDestination: 'Houston, TX',
  serviceType: 'Transportation Services',
  freightDescription: '4 palletized equipment crates ready for dock pickup.',
  preferredPickupDate: futureDate(14),
  additionalMessage: '',
  consentAccepted: true,
  website: '',
};

test('never reports fake delivery when webhook/email credentials are unconfigured', async () => {
  const response = await processQuoteSubmission(validPayload, {});
  assert.equal(response.httpStatus, 200);
  assert.equal(response.body.delivered, false);
  assert.equal(response.body.status, 'integration_pending');
  assert.ok(response.body.referenceId);
  assert.ok(response.body.formattedSummary);
});

test('reports delivered=true only when configured webhook confirms HTTP 2xx', async () => {
  const response = await processQuoteSubmission(
    validPayload,
    { QUOTE_WEBHOOK_URL: 'https://crm.example.com/hook' },
    async () => ({ ok: true, status: 200 }),
  );
  assert.equal(response.httpStatus, 200);
  assert.equal(response.body.delivered, true);
  assert.equal(response.body.status, 'delivered');
});

test('reports delivery_failed when configured webhook returns non-2xx', async () => {
  const response = await processQuoteSubmission(
    validPayload,
    { QUOTE_WEBHOOK_URL: 'https://crm.example.com/hook' },
    async () => ({ ok: false, status: 500 }),
  );
  assert.equal(response.httpStatus, 502);
  assert.equal(response.body.delivered, false);
  assert.equal(response.body.status, 'delivery_failed');
});

test('rejects invalid payloads with 400 validation_error', async () => {
  const response = await processQuoteSubmission({ fullName: 'A' }, {});
  assert.equal(response.httpStatus, 400);
  assert.equal(response.body.delivered, false);
  assert.equal(response.body.status, 'validation_error');
});

test('rejects honeypot spam submissions with 400 spam_rejected', async () => {
  const response = await processQuoteSubmission(
    { ...validPayload, website: 'http://spam.test' },
    {},
  );
  assert.equal(response.httpStatus, 400);
  assert.equal(response.body.status, 'spam_rejected');
});
