/// <reference types="vite/client" />

// Optionnel : typage strict des variables VITE_ que tu utilises
interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_STRIPE_PUBLIC_KEY?: string;
  // ajoute ici d'autres VITE_ variables si besoin
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
