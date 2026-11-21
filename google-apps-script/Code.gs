// Skylark Star Logistics – quote requests → Google Sheet
// Paste this whole file into Extensions → Apps Script in the Google Sheet.
// Setup steps: see QUOTE_SETUP.md in the repository.

// Email that gets an alert for every new quote. Use '' to turn emails off.
const NOTIFY_EMAIL = 'you@example.com';
const SHEET_NAME = 'Quotes';
const MAX_PER_HOUR = 30;

const HEADERS = [
  'Submitted At', 'Reference', 'Full Name', 'Company', 'Email', 'Phone',
  'Service', 'Pickup Location', 'Delivery Destination', 'Pickup Date',
  'Freight Description', 'Additional Message', 'Status',
];

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const q = data.quote || {};

    const problem = validate_(data, q);
    if (problem) return json_({ ok: false, error: problem });
    if (!underHourlyLimit_()) return json_({ ok: false, error: 'Too many requests' });

    const row = [
      new Date(),
      clip_(data.referenceId, 20),
      clip_(q.fullName, 120), clip_(q.companyName, 150), clip_(q.email, 180), clip_(q.phone, 40),
      clip_(q.serviceType, 100), clip_(q.pickupLocation, 200), clip_(q.deliveryDestination, 200),
      clip_(q.preferredPickupDate, 40), clip_(q.freightDescription, 1500), clip_(q.additionalMessage, 2000),
      'New',
    ].map(safe_);

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      getSheet_().appendRow(row);
    } finally {
      lock.releaseLock();
    }

    if (NOTIFY_EMAIL) {
      MailApp.sendEmail({
        to: NOTIFY_EMAIL,
        replyTo: clip_(q.email, 180),
        subject: 'New quote request ' + clip_(data.referenceId, 20) + ' - ' + clip_(q.companyName, 80),
        body: clip_(data.formattedSummary, 6000),
      });
    }

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: 'Bad request' });
  }
}

// Visit the web app URL in a browser to confirm it is live.
function doGet() {
  return ContentService.createTextOutput('Skylark quote webhook is running.');
}

function validate_(data, q) {
  if (!/^SSL-[0-9A-F]{6}$/.test(String(data.referenceId || ''))) return 'Invalid reference';
  const required = ['fullName', 'companyName', 'email', 'phone', 'pickupLocation',
    'deliveryDestination', 'serviceType', 'freightDescription', 'preferredPickupDate'];
  for (const field of required) {
    if (typeof q[field] !== 'string' || q[field].trim().length < 2) return 'Missing ' + field;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(q.email.trim())) return 'Invalid email';
  if (q.consentAccepted !== true) return 'Consent required';
  return '';
}

function underHourlyLimit_() {
  const cache = CacheService.getScriptCache();
  const key = 'quotes-' + Math.floor(Date.now() / 3600000);
  const count = Number(cache.get(key) || 0);
  if (count >= MAX_PER_HOUR) return false;
  cache.put(key, String(count + 1), 3600);
  return true;
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function clip_(value, max) {
  return String(value === undefined || value === null ? '' : value).slice(0, max);
}

// Stops text like "=HYPERLINK(...)" from running as a spreadsheet formula.
function safe_(value) {
  if (typeof value === 'string' && /^[=+\-@]/.test(value)) return "'" + value;
  return value;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
