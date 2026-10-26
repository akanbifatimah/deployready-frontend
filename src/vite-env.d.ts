/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Public URL of the deployed site, without a trailing slash. */
  readonly VITE_SITE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
