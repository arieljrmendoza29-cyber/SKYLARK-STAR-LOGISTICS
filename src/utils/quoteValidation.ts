import { SERVICE_TYPE_OPTIONS } from './companyData.ts';

export interface QuoteFormInput {
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  pickupLocation: string;
  deliveryDestination: string;
  serviceType: string;
  freightDescription: string;
  preferredPickupDate: string;
  additionalMessage: string;
  consentAccepted: boolean;
  /** Honeypot field for spam protection; must remain empty. */
  website?: string;
}

export type QuoteFieldErrors = Partial<Record<keyof QuoteFormInput, string>>;

export interface QuoteValidationResult {
  valid: boolean;
  isSpam: boolean;
  errors: QuoteFieldErrors;
  sanitized: QuoteFormInput;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function cleanText(value: unknown, maxLength = 500): string {
  if (typeof value !== 'string') return '';
  return value.replace(/\s+/g, ' ').trim().slice(0, maxLength);
}

export function cleanMultilineText(value: unknown, maxLength = 2000): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
}

export function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email.trim());
}

export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15;
}

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Accepts a real calendar date in YYYY-MM-DD form that is not in the past.
 * One day of leeway allows for visitors in time zones behind the server.
 */
export function isValidPickupDate(value: string, now: Date = new Date()): boolean {
  if (!ISO_DATE_PATTERN.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return false;
  }
  const todayUtc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const oneDay = 24 * 60 * 60 * 1000;
  const oneYear = 366 * oneDay;
  return date.getTime() >= todayUtc - oneDay && date.getTime() <= todayUtc + oneYear;
}

export function validateQuoteForm(raw: Partial<QuoteFormInput>): QuoteValidationResult {
  const sanitized: QuoteFormInput = {
    fullName: cleanText(raw.fullName, 120),
    companyName: cleanText(raw.companyName, 150),
    email: cleanText(raw.email, 180),
    phone: cleanText(raw.phone, 40),
    pickupLocation: cleanText(raw.pickupLocation, 200),
    deliveryDestination: cleanText(raw.deliveryDestination, 200),
    serviceType: cleanText(raw.serviceType, 100),
    freightDescription: cleanMultilineText(raw.freightDescription, 1500),
    preferredPickupDate: cleanText(raw.preferredPickupDate, 40),
    additionalMessage: cleanMultilineText(raw.additionalMessage, 2000),
    // Only a real `true` counts as consent; strings like "no" or "false" must not pass.
    consentAccepted: raw.consentAccepted === true,
    website: typeof raw.website === 'string' ? raw.website.trim() : '',
  };

  if (sanitized.website && sanitized.website.length > 0) {
    return {
      valid: false,
      isSpam: true,
      errors: {},
      sanitized,
    };
  }

  const errors: QuoteFieldErrors = {};

  if (!sanitized.fullName || sanitized.fullName.length < 2) {
    errors.fullName = 'Please enter your full name.';
  }

  if (!sanitized.companyName || sanitized.companyName.length < 2) {
    errors.companyName = 'Please enter your company or organization name.';
  }

  if (!sanitized.email) {
    errors.email = 'Please enter your email address.';
  } else if (!isValidEmail(sanitized.email)) {
    errors.email = 'Please enter a valid email address (e.g., name@company.com).';
  }

  if (!sanitized.phone) {
    errors.phone = 'Please enter a contact phone number.';
  } else if (!isValidPhone(sanitized.phone)) {
    errors.phone = 'Please enter a valid 10-digit phone number.';
  }

  if (!sanitized.pickupLocation || sanitized.pickupLocation.length < 2) {
    errors.pickupLocation = 'Please specify the pickup city, state, or facility location.';
  }

  if (!sanitized.deliveryDestination || sanitized.deliveryDestination.length < 2) {
    errors.deliveryDestination = 'Please specify the delivery destination.';
  }

  if (!sanitized.serviceType) {
    errors.serviceType = 'Please select the type of service requested.';
  } else if (!(SERVICE_TYPE_OPTIONS as readonly string[]).includes(sanitized.serviceType)) {
    errors.serviceType = 'Please choose one of the listed service types.';
  }

  if (!sanitized.freightDescription || sanitized.freightDescription.length < 10) {
    errors.freightDescription =
      'Please provide a brief freight description (at least 10 characters).';
  }

  if (!sanitized.preferredPickupDate) {
    errors.preferredPickupDate = 'Please select a preferred pickup date.';
  } else if (!isValidPickupDate(sanitized.preferredPickupDate)) {
    errors.preferredPickupDate = 'Please choose a pickup date from today onward.';
  }

  if (!sanitized.consentAccepted) {
    errors.consentAccepted =
      'Please acknowledge the privacy notice so we may review your quote inquiry.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    isSpam: false,
    errors,
    sanitized,
  };
}

export function formatQuoteSummary(input: QuoteFormInput, referenceId: string): string {
  const lines = [
    `SKYLARK STAR LOGISTICS, LLC — QUOTE REQUEST (${referenceId})`,
    `------------------------------------------------------------`,
    `Full Name:             ${input.fullName}`,
    `Company Name:          ${input.companyName}`,
    `Email Address:         ${input.email}`,
    `Phone Number:          ${input.phone}`,
    `Type of Service:       ${input.serviceType}`,
    `Pickup Location:       ${input.pickupLocation}`,
    `Delivery Destination:  ${input.deliveryDestination}`,
    `Preferred Pickup Date: ${input.preferredPickupDate}`,
    `Freight Description:   ${input.freightDescription}`,
  ];

  if (input.additionalMessage) {
    lines.push(`Additional Message:    ${input.additionalMessage}`);
  }

  return lines.join('\n');
}
