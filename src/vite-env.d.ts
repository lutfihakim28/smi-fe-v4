/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_URL: string;
  readonly VITE_REQUEST_DELAY: number;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
