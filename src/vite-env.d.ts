/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Public URL of the deployed site, without a trailing slash. */
  readonly VITE_SITE_URL?: string;
  /** Tip page (https only). Falls back to the Buy Me a Malt page when unset. */
  readonly VITE_TIP_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
