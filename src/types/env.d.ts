/// <reference types="vite/client" />

// Vite环境变量类型定义
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  // 添加更多环境变量类型...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Node.js process 类型
declare const process: {
  env: {
    NODE_ENV: string
    [key: string]: string | undefined
  }
}

// PWA 虚拟模块类型
declare module 'virtual:pwa-register/react' {
  export interface RegisterSWOptions {
    immediate?: boolean
    onNeedRefresh?: () => void
    onOfflineReady?: () => void
    onRegistered?: (registration: ServiceWorkerRegistration | undefined) => void
    onRegisterError?: (error: unknown) => void
  }

  export function useRegisterSW(options?: RegisterSWOptions): {
    needRefresh: [boolean, (value: boolean) => void]
    offlineReady: [boolean, (value: boolean) => void]
    updateServiceWorker: (reloadPage?: boolean) => Promise<void>
  }
}
