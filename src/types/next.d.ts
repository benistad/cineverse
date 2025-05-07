// Déclaration de module pour étendre les types de Next.js

declare module 'next' {
  export interface PageProps {
    params: Record<string, string>;
    searchParams?: Record<string, string | string[] | undefined>;
  }
}

export {};
