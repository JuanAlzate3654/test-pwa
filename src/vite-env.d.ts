/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly APP_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
