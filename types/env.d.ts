/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  /** Путь до бэкенда - обязателен */
  readonly VITE_API_URL: string;
  readonly VITE_API_PROXY_TARGET?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
