/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Google Apps Script (or other) webhook the browser posts quotes to on static hosting. */
  readonly VITE_QUOTE_WEBHOOK_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
