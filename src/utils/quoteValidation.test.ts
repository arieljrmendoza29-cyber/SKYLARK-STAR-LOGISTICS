import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatQuoteSummary,
  isValidEmail,
  isValidPickupDate,
  isValidPhone,
  QuoteFormInput,
  validateQuoteForm,
} from './quoteValidation';

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
  freightDescription: '4 wrapped industrial pallets, dock-to-dock commercial delivery.',
  preferredPickupDate: futureDate(14),
  additionalMessage: 'Receiving dock closes at 4:00 PM CST.',
  consentAccepted: true,
  website: '',
};

test('validates a complete quote request payload cleanly', () => {
  const result = validateQuoteForm(validPayload);
  assert.equal(result.valid, true);
  assert.equal(result.isSpam, false);
  assert.deepEqual(result.errors, {});
});

test('flags missing required fields and invalid email/phone formats', () => {
  const result = validateQuoteForm({
    fullName: '',
    companyName: 'A',
    email: 'not-an-email',
    phone: '123',
    pickupLocation: '',
    deliveryDestination: '',
    serviceType: '',
    freightDescription: 'short',
    preferredPickupDate: '',
    consentAccepted: false,
  });

  assert.equal(result.valid, false);
  assert.ok(result.errors.fullName);
  assert.ok(result.errors.companyName);
  assert.ok(result.errors.email);
  assert.ok(result.errors.phone);
  assert.ok(result.errors.pickupLocation);
  assert.ok(result.errors.deliveryDestination);
  assert.ok(result.errors.serviceType);
  assert.ok(result.errors.freightDescription);
  assert.ok(result.errors.preferredPickupDate);
  assert.ok(result.errors.consentAccepted);
});

test('rejects submissions when honeypot spam field is populated', () => {
  const result = validateQuoteForm({
    ...validPayload,
    website: 'https://spam-bot.example.com',
  });
  assert.equal(result.valid, false);
  assert.equal(result.isSpam, true);
});

test('validates email and phone helpers accurately', () => {
  assert.equal(isValidEmail('dispatch@company.com'), true);
  assert.equal(isValidEmail('invalid@domain'), false);
  assert.equal(isValidPhone('(713) 555-0199'), true);
  assert.equal(isValidPhone('555-12'), false);
});

test('formats a readable dispatch summary with reference ID', () => {
  const summary = formatQuoteSummary(validPayload, 'SSL-1234AB');
  assert.match(summary, /SSL-1234AB/);
  assert.match(summary, /Jordan Vance/);
  assert.match(summary, /La Porte, TX/);
});

test('rejects consent values that are not strictly true', () => {
  for (const value of ['no', 'false', 1, 'true']) {
    const result = validateQuoteForm({
      ...validPayload,
      consentAccepted: value as unknown as boolean,
    });
    assert.equal(result.valid, false, `consent value ${JSON.stringify(value)} should fail`);
    assert.ok(result.errors.consentAccepted);
  }
});

test('rejects service types outside the published list', () => {
  const result = validateQuoteForm({ ...validPayload, serviceType: 'Space Freight' });
  assert.equal(result.valid, false);
  assert.ok(result.errors.serviceType);
});

test('pickup date must be a real calendar date from today onward', () => {
  const now = new Date(Date.UTC(2026, 10, 22));
  assert.equal(isValidPickupDate('2026-11-22', now), true);
  assert.equal(isValidPickupDate('2026-11-21', now), true, 'one day leeway for time zones');
  assert.equal(isValidPickupDate('2026-11-01', now), false);
  assert.equal(isValidPickupDate('1999-01-01', now), false);
  assert.equal(isValidPickupDate('2026-02-30', now), false);
  assert.equal(isValidPickupDate('2030-01-01', now), false, 'more than a year out');
  assert.equal(isValidPickupDate('12/01/2026', now), false);
});
