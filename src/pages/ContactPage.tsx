import { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  Building2,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Info,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { COMPANY_FACTS, RoutePath, SERVICE_TYPE_OPTIONS } from '../utils/companyData';
import {
  QuoteFieldErrors,
  QuoteFormInput,
  validateQuoteForm,
} from '../utils/quoteValidation';
import { OrangeAccentLine, SlideUpHeadline } from '../components/MotionPrimitives';
import { SEOHead } from '../components/SEOHead';
import { withBase } from '../utils/basePath';
import { submitQuote } from '../utils/quoteClient';

/** Today's date in the visitor's local time as YYYY-MM-DD (for the date picker's min). */
function todayIsoDate(): string {
  const now = new Date();
  const offsetMs = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offsetMs).toISOString().slice(0, 10);
}

interface ContactPageProps {
  onNavigate: (path: RoutePath) => void;
  preselectedService?: string;
}

interface SubmissionOutcome {
  type: 'delivered' | 'integration_pending' | 'error';
  message: string;
  referenceId?: string;
  formattedSummary?: string;
}

const INITIAL_FORM: QuoteFormInput = {
  fullName: '',
  companyName: '',
  email: '',
  phone: '',
  pickupLocation: '',
  deliveryDestination: '',
  serviceType: 'Transportation Services',
  freightDescription: '',
  preferredPickupDate: '',
  additionalMessage: '',
  consentAccepted: false,
  website: '',
};

export function ContactPage({ onNavigate, preselectedService }: ContactPageProps) {
  const [form, setForm] = useState<QuoteFormInput>(() => ({
    ...INITIAL_FORM,
    serviceType:
      preselectedService &&
      SERVICE_TYPE_OPTIONS.includes(preselectedService as (typeof SERVICE_TYPE_OPTIONS)[number])
        ? preselectedService
        : INITIAL_FORM.serviceType,
  }));
  const [errors, setErrors] = useState<QuoteFieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [outcome, setOutcome] = useState<SubmissionOutcome | null>(null);
  const [copied, setCopied] = useState(false);
  const outcomeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (outcome && outcomeRef.current) {
      outcomeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [outcome]);

  useEffect(() => {
    if (
      preselectedService &&
      SERVICE_TYPE_OPTIONS.includes(preselectedService as (typeof SERVICE_TYPE_OPTIONS)[number])
    ) {
      setForm((prev) => ({ ...prev, serviceType: preselectedService }));
    }
  }, [preselectedService]);

  const updateField = <K extends keyof QuoteFormInput>(field: K, value: QuoteFormInput[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOutcome(null);

    const validation = validateQuoteForm(form);
    if (validation.isSpam) {
      setOutcome({
        type: 'error',
        message: 'Submission could not be processed.',
      });
      return;
    }

    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const data = await submitQuote(validation.sanitized);

      if (data.status === 'validation_error' && data.errors) {
        setErrors(data.errors);
        setOutcome({
          type: 'error',
          message: data.message || 'Please review the highlighted fields.',
        });
        return;
      }

      if (data.delivered === true && data.status === 'delivered') {
        setOutcome({
          type: 'delivered',
          message: data.message,
          referenceId: data.referenceId,
          formattedSummary: data.formattedSummary,
        });
        setForm(INITIAL_FORM);
        return;
      }

      if (data.status === 'integration_pending') {
        setOutcome({
          type: 'integration_pending',
          message: data.message,
          referenceId: data.referenceId,
          formattedSummary: data.formattedSummary,
        });
        return;
      }

      setOutcome({
        type: 'error',
        message: data.message || 'Unable to process your quote request right now.',
        referenceId: data.referenceId,
        formattedSummary: data.formattedSummary,
      });
    } catch {
      setOutcome({
        type: 'error',
        message:
          'A connection error occurred while submitting your quote request. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopySummary = async () => {
    if (!outcome?.formattedSummary) return;
    try {
      await navigator.clipboard.writeText(outcome.formattedSummary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  const inputClass = (hasError?: boolean) =>
    `w-full rounded-xl border px-4 py-3 text-sm text-[#171717] bg-[#FFF5EB]/55 transition-colors focus:bg-white focus:outline-none focus:ring-2 ${
      hasError
        ? 'border-red-600 focus:border-red-600 focus:ring-red-600/20'
        : 'border-[#EAD8C8] focus:border-[#FF6500] focus:ring-[#FF6500]/20'
    }`;

  return (
    <>
      <SEOHead
        title="Request a Quote & Contact | Skylark Star Logistics, LLC"
        description="Contact Skylark Star Logistics, LLC in La Porte, TX 77571 or submit a freight quote request for transportation, logistics, handling, or delivery services."
        canonicalPath="/contact"
      />

      {/* Editorial Header */}
      <section className="bg-[#FFF5EB] text-[#171717] pt-32 sm:pt-36 pb-14 lg:pb-16 border-b border-[#EAD8C8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#FF6500]">
            Contact &amp; Quote Request · La Porte, Texas
          </p>
          <SlideUpHeadline
            as="h1"
            className="mt-4 font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#171717] max-w-3xl leading-[1.04] text-balance"
          >
            Let&apos;s Discuss Your Transportation Needs.
          </SlideUpHeadline>
          <OrangeAccentLine className="w-20 h-1.5 rounded-full bg-[#FF6500] my-6" />
          <p className="text-base sm:text-lg text-[#171717]/80 max-w-2xl leading-relaxed">
            Provide your shipment details below to prepare a freight inquiry for Skylark Star
            Logistics, LLC.
          </p>
        </div>
      </section>

      {/* Two-Column Contact & Quote Form */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* LEFT COLUMN: Verified Company & Contact Details */}
            <aside className="lg:col-span-5 min-w-0 space-y-6">
              <div className="bg-[#FFF5EB] rounded-3xl border border-[#EAD8C8] p-7 sm:p-9">
                <p className="text-xs font-bold uppercase tracking-widest text-[#FF6500]">
                  Company Information
                </p>
                <h2 className="mt-2 font-display text-2xl font-extrabold text-[#171717]">
                  {COMPANY_FACTS.legalName}
                </h2>
                <p className="mt-1 text-sm text-[#171717]/75">
                  Managed by {COMPANY_FACTS.managerName}, {COMPANY_FACTS.managerTitle}
                </p>
                <div className="w-12 h-1 rounded-full bg-[#FF6500] my-5" aria-hidden="true" />

                <dl className="space-y-5 text-sm">
                  <div className="flex items-start gap-3.5">
                    <Building2 className="w-5 h-5 text-[#171717] mt-0.5 shrink-0" aria-hidden="true" />
                    <div>
                      <dt className="font-bold text-[#171717]">Company Name</dt>
                      <dd className="text-[#171717]/80 mt-0.5">{COMPANY_FACTS.legalName}</dd>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <MapPin className="w-5 h-5 text-[#171717] mt-0.5 shrink-0" aria-hidden="true" />
                    <div>
                      <dt className="font-bold text-[#171717]">Business Location</dt>
                      <dd className="text-[#171717]/80 mt-0.5">{COMPANY_FACTS.locationDisplay}</dd>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <Phone className="w-5 h-5 text-[#171717] mt-0.5 shrink-0" aria-hidden="true" />
                    <div>
                      <dt className="font-bold text-[#171717]">Direct Phone</dt>
                      <dd className="text-[#171717]/70 mt-0.5">
                        {COMPANY_FACTS.contactPlaceholders.phone}
                      </dd>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <Mail className="w-5 h-5 text-[#171717] mt-0.5 shrink-0" aria-hidden="true" />
                    <div>
                      <dt className="font-bold text-[#171717]">Direct Email</dt>
                      <dd className="text-[#171717]/70 mt-0.5">
                        {COMPANY_FACTS.contactPlaceholders.email}
                      </dd>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <Clock className="w-5 h-5 text-[#171717] mt-0.5 shrink-0" aria-hidden="true" />
                    <div>
                      <dt className="font-bold text-[#171717]">Business Hours</dt>
                      <dd className="text-[#171717]/70 mt-0.5">
                        {COMPANY_FACTS.contactPlaceholders.hours}
                      </dd>
                    </div>
                  </div>
                </dl>
              </div>

              <div className="bg-white rounded-3xl border border-[#EAD8C8] overflow-hidden">
                <div className="aspect-[4/3] w-full bg-[#EAD8C8]/40">
                  <iframe
                    title={`Map of ${COMPANY_FACTS.locationDisplay}`}
                    src={`https://www.google.com/maps?q=${encodeURIComponent(COMPANY_FACTS.mapQuery)}&output=embed`}
                    className="w-full h-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>
                <div className="flex items-center justify-between gap-3 px-6 py-4">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <MapPin className="w-5 h-5 text-[#FF6500] shrink-0" aria-hidden="true" />
                    <span className="text-sm font-semibold text-[#171717] truncate">
                      {COMPANY_FACTS.locationDisplay}
                    </span>
                  </div>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(COMPANY_FACTS.mapQuery)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-xs font-bold uppercase tracking-wider text-[#171717] underline decoration-[#FF6500] decoration-2 underline-offset-4 hover:text-[#FF6500] transition-colors"
                  >
                    Open in Google Maps
                  </a>
                </div>
              </div>

              <div className="bg-[#171717] text-[#FFF5EB] rounded-3xl p-7 sm:p-8">
                <div className="flex items-center gap-2.5 text-[#FF6500]">
                  <ShieldCheck className="w-5 h-5 shrink-0" aria-hidden="true" />
                  <h3 className="text-xs font-bold uppercase tracking-widest">
                    Registration &amp; Accuracy Notice
                  </h3>
                </div>
                <p className="mt-3 text-sm text-[#FFF5EB]/85 leading-relaxed">
                  {COMPANY_FACTS.registrationStatusNote} All quote inquiries are reviewed for
                  operating coverage and lane readiness prior to dispatch confirmation.
                </p>
              </div>
            </aside>

            {/* RIGHT COLUMN: Quote Request Form */}
            <div className="lg:col-span-7 min-w-0 bg-white rounded-3xl border border-[#EAD8C8] p-6 sm:p-8 lg:p-10">
              <div className="mb-7">
                <p className="text-xs font-bold uppercase tracking-widest text-[#FF6500]">
                  Freight Quote Form
                </p>
                <h2 className="mt-2 font-display text-2xl sm:text-3xl font-extrabold text-[#171717]">
                  Request a Transportation or Logistics Quote
                </h2>
                <p className="mt-1.5 text-sm text-[#171717]/70">
                  Fields marked with <span className="text-red-600 font-semibold">*</span> are
                  required.
                </p>
              </div>

              {/* Outcome Banners */}
              <div ref={outcomeRef}>
                {outcome?.type === 'delivered' && (
                  <div
                    role="status"
                    className="mb-7 rounded-2xl border border-emerald-700/25 bg-emerald-50 p-5 text-[#171717]"
                  >
                    <div className="flex items-start gap-3">
                      <CheckCircle2
                        className="w-5 h-5 text-emerald-700 mt-0.5 shrink-0"
                        aria-hidden="true"
                      />
                      <div>
                        <h3 className="font-display text-base font-bold text-emerald-900">
                          Quote Request Delivered ({outcome.referenceId})
                        </h3>
                        <p className="mt-1 text-sm text-emerald-900/85">{outcome.message}</p>
                      </div>
                    </div>
                  </div>
                )}

                {outcome?.type === 'integration_pending' && (
                  <div
                    role="status"
                    className="mb-7 rounded-2xl border border-[#FF6500] bg-[#FFF5EB] p-5 text-[#171717]"
                  >
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-[#FF6500] mt-0.5 shrink-0" aria-hidden="true" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display text-base font-bold text-[#171717]">
                          Quote Details Validated — Delivery Integration Pending ({outcome.referenceId})
                        </h3>
                        <p className="mt-1.5 text-sm text-[#171717]/80 leading-relaxed">
                          {outcome.message}
                        </p>

                        {outcome.formattedSummary && (
                          <div className="mt-4">
                            <pre className="p-4 rounded-xl bg-white border border-[#EAD8C8] text-xs font-mono text-[#171717] overflow-x-auto whitespace-pre-wrap">
                              {outcome.formattedSummary}
                            </pre>
                            <button
                              type="button"
                              onClick={handleCopySummary}
                              className="mt-3 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#171717] hover:bg-[#2A2A2A] text-[#FFF5EB] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                            >
                              {copied ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-[#FF6500]" aria-hidden="true" />
                                  <span>Summary Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5 text-[#FF6500]" aria-hidden="true" />
                                  <span>Copy Quote Summary</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {outcome?.type === 'error' && (
                  <div
                    role="alert"
                    className="mb-7 rounded-2xl border border-red-600/30 bg-red-50 p-4 text-red-900 flex items-start gap-3"
                  >
                    <AlertCircle className="w-5 h-5 text-red-700 mt-0.5 shrink-0" aria-hidden="true" />
                    <p className="text-sm font-medium">{outcome.message}</p>
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* Honeypot Spam Protection Field */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="quote-website">Website</label>
                  <input
                    id="quote-website"
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.website}
                    onChange={(e) => updateField('website', e.target.value)}
                  />
                </div>

                {/* Row 1: Full Name & Company Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-xs font-bold uppercase tracking-wider text-[#171717] mb-1.5"
                    >
                      Full Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required
                      value={form.fullName}
                      onChange={(e) => updateField('fullName', e.target.value)}
                      placeholder="Your full name"
                      aria-invalid={Boolean(errors.fullName)}
                      className={inputClass(Boolean(errors.fullName))}
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-xs text-red-700 font-medium">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="companyName"
                      className="block text-xs font-bold uppercase tracking-wider text-[#171717] mb-1.5"
                    >
                      Company Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      id="companyName"
                      name="companyName"
                      type="text"
                      required
                      value={form.companyName}
                      onChange={(e) => updateField('companyName', e.target.value)}
                      placeholder="Business or organization"
                      aria-invalid={Boolean(errors.companyName)}
                      className={inputClass(Boolean(errors.companyName))}
                    />
                    {errors.companyName && (
                      <p className="mt-1 text-xs text-red-700 font-medium">{errors.companyName}</p>
                    )}
                  </div>
                </div>

                {/* Row 2: Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs font-bold uppercase tracking-wider text-[#171717] mb-1.5"
                    >
                      Email Address <span className="text-red-600">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      placeholder="name@company.com"
                      aria-invalid={Boolean(errors.email)}
                      className={inputClass(Boolean(errors.email))}
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-700 font-medium">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-xs font-bold uppercase tracking-wider text-[#171717] mb-1.5"
                    >
                      Phone Number <span className="text-red-600">*</span>
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      placeholder="(281) 555-0100"
                      aria-invalid={Boolean(errors.phone)}
                      className={inputClass(Boolean(errors.phone))}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-xs text-red-700 font-medium">{errors.phone}</p>
                    )}
                  </div>
                </div>

                {/* Row 3: Pickup & Delivery */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="pickupLocation"
                      className="block text-xs font-bold uppercase tracking-wider text-[#171717] mb-1.5"
                    >
                      Pickup Location <span className="text-red-600">*</span>
                    </label>
                    <input
                      id="pickupLocation"
                      name="pickupLocation"
                      type="text"
                      required
                      value={form.pickupLocation}
                      onChange={(e) => updateField('pickupLocation', e.target.value)}
                      placeholder="City, State (e.g., La Porte, TX)"
                      aria-invalid={Boolean(errors.pickupLocation)}
                      className={inputClass(Boolean(errors.pickupLocation))}
                    />
                    {errors.pickupLocation && (
                      <p className="mt-1 text-xs text-red-700 font-medium">
                        {errors.pickupLocation}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="deliveryDestination"
                      className="block text-xs font-bold uppercase tracking-wider text-[#171717] mb-1.5"
                    >
                      Delivery Destination <span className="text-red-600">*</span>
                    </label>
                    <input
                      id="deliveryDestination"
                      name="deliveryDestination"
                      type="text"
                      required
                      value={form.deliveryDestination}
                      onChange={(e) => updateField('deliveryDestination', e.target.value)}
                      placeholder="City, State (e.g., Houston, TX)"
                      aria-invalid={Boolean(errors.deliveryDestination)}
                      className={inputClass(Boolean(errors.deliveryDestination))}
                    />
                    {errors.deliveryDestination && (
                      <p className="mt-1 text-xs text-red-700 font-medium">
                        {errors.deliveryDestination}
                      </p>
                    )}
                  </div>
                </div>

                {/* Row 4: Type of Service & Preferred Pickup Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="serviceType"
                      className="block text-xs font-bold uppercase tracking-wider text-[#171717] mb-1.5"
                    >
                      Type of Service <span className="text-red-600">*</span>
                    </label>
                    <select
                      id="serviceType"
                      name="serviceType"
                      required
                      value={form.serviceType}
                      onChange={(e) => updateField('serviceType', e.target.value)}
                      aria-invalid={Boolean(errors.serviceType)}
                      className={inputClass(Boolean(errors.serviceType))}
                    >
                      {SERVICE_TYPE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    {errors.serviceType && (
                      <p className="mt-1 text-xs text-red-700 font-medium">{errors.serviceType}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="preferredPickupDate"
                      className="block text-xs font-bold uppercase tracking-wider text-[#171717] mb-1.5"
                    >
                      Preferred Pickup Date <span className="text-red-600">*</span>
                    </label>
                    <input
                      id="preferredPickupDate"
                      name="preferredPickupDate"
                      type="date"
                      required
                      min={todayIsoDate()}
                      value={form.preferredPickupDate}
                      onChange={(e) => updateField('preferredPickupDate', e.target.value)}
                      aria-invalid={Boolean(errors.preferredPickupDate)}
                      className={inputClass(Boolean(errors.preferredPickupDate))}
                    />
                    {errors.preferredPickupDate && (
                      <p className="mt-1 text-xs text-red-700 font-medium">
                        {errors.preferredPickupDate}
                      </p>
                    )}
                  </div>
                </div>

                {/* Freight Description */}
                <div>
                  <label
                    htmlFor="freightDescription"
                    className="block text-xs font-bold uppercase tracking-wider text-[#171717] mb-1.5"
                  >
                    Freight Description <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    id="freightDescription"
                    name="freightDescription"
                    rows={3}
                    required
                    value={form.freightDescription}
                    onChange={(e) => updateField('freightDescription', e.target.value)}
                    placeholder="Describe cargo type, approximate weight, pallet count, or packaging details."
                    aria-invalid={Boolean(errors.freightDescription)}
                    className={inputClass(Boolean(errors.freightDescription))}
                  />
                  {errors.freightDescription && (
                    <p className="mt-1 text-xs text-red-700 font-medium">
                      {errors.freightDescription}
                    </p>
                  )}
                </div>

                {/* Additional Message */}
                <div>
                  <label
                    htmlFor="additionalMessage"
                    className="block text-xs font-bold uppercase tracking-wider text-[#171717] mb-1.5"
                  >
                    Additional Message
                  </label>
                  <textarea
                    id="additionalMessage"
                    name="additionalMessage"
                    rows={3}
                    value={form.additionalMessage}
                    onChange={(e) => updateField('additionalMessage', e.target.value)}
                    placeholder="Dock hours, appointment notes, or scheduling questions (optional)."
                    className={inputClass(false)}
                  />
                </div>

                {/* Privacy Notice & Consent */}
                <div className="pt-2">
                  <div className="flex items-start gap-3">
                    <input
                      id="consentAccepted"
                      name="consentAccepted"
                      type="checkbox"
                      checked={form.consentAccepted}
                      onChange={(e) => updateField('consentAccepted', e.target.checked)}
                      aria-invalid={Boolean(errors.consentAccepted)}
                      className="mt-1 h-4 w-4 rounded border-[#EAD8C8] text-[#FF6500] focus:ring-[#FF6500]"
                    />
                    <label htmlFor="consentAccepted" className="text-xs text-[#171717]/80 leading-relaxed">
                      I acknowledge the{' '}
                      <a
                        href={withBase('/privacy-policy')}
                        onClick={(e) => {
                          e.preventDefault();
                          onNavigate('/privacy-policy');
                        }}
                        className="underline font-bold text-[#171717] hover:text-[#FF6500]"
                      >
                        Privacy Policy
                      </a>{' '}
                      and consent to Skylark Star Logistics, LLC reviewing the submitted shipment
                      details to respond to this quote request.{' '}
                      <span className="text-red-600 font-semibold">*</span>
                    </label>
                  </div>
                  {errors.consentAccepted && (
                    <p className="mt-1.5 text-xs text-red-700 font-medium">
                      {errors.consentAccepted}
                    </p>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl bg-[#FF6500] hover:bg-[#E05800] disabled:opacity-60 text-[#171717] text-xs sm:text-sm font-bold uppercase tracking-wider shadow-sm transition-colors cursor-pointer"
                  >
                    {isSubmitting ? 'VALIDATING REQUEST...' : 'SUBMIT QUOTE REQUEST'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
