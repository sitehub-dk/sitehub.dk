import da from './da.json';
import en from './en.json';
import nn from './nn.json';
import sv from './sv.json';
import nl from './nl.json';

export const languages = {
  da: { name: 'Dansk', flag: '🇩🇰' },
  en: { name: 'English', flag: '🇬🇧' },
  nn: { name: 'Norsk', flag: '🇳🇴' },
  sv: { name: 'Svenska', flag: '🇸🇪' },
  nl: { name: 'Nederlands', flag: '🇳🇱' },
} as const;

export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'da';

const translations = { da, en, nn, sv, nl } as const;

export function t(lang: Lang, key: string): string {
  const dict = translations[lang] ?? translations[defaultLang];
  return (dict as Record<string, string>)[key] ?? key;
}

/** Get URL path for a given language. Danish (default) has no prefix. */
export function langPath(lang: Lang): string {
  return lang === defaultLang ? '' : `/${lang}`;
}

/** Get the translated page URL given current lang + slug + translations map */
export function getTranslatedUrl(
  targetLang: Lang,
  currentSlug: string,
  translations: Record<string, string>,
): string {
  const slug = translations[targetLang] ?? currentSlug;
  const prefix = targetLang === defaultLang ? '' : `/${targetLang}`;
  // Homepage slugs
  if (slug === 'home' || slug === 'home-en' || slug === 'home-no' || slug === 'home-sv' || slug === 'home-nl') {
    return `${prefix}/`;
  }
  return `${prefix}/${slug}/`;
}
