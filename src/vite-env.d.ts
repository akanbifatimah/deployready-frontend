/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Public URL of the deployed site, without a trailing slash. */
  readonly VITE_SITE_URL?: string;
  /** "Buy us a drink" tip page (https only). The header button is hidden when unset. */
  readonly VITE_TIP_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
