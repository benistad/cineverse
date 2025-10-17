import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export const locales = ['fr', 'en'];
export const defaultLocale = 'fr';

export default getRequestConfig(async () => {
  // Récupérer la langue depuis les cookies ou les headers
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get('NEXT_LOCALE');
  
  let locale = localeCookie?.value || defaultLocale;
  
  // Vérifier que la locale est valide
  if (!locales.includes(locale)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
