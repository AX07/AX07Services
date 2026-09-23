export type CountryCode = 'pt' | 'ie';

export interface CountryContent {
  countryCode: 'PT' | 'IE';
  countrySlug: CountryCode;
  countryName: string;
  flag: string;
  currency: string;
  pricingUpfront: string;
  pricingRetainer: string;
  whatsappNumber: string;
  heroSubtitle: string;
  badgeLocation: string;
  marketName: string;
  defaultLanguage: 'pt' | 'en';
}

export const countryDictionary: Record<CountryCode, CountryContent> = {
  pt: {
    countryCode: 'PT',
    countrySlug: 'pt',
    countryName: 'Portugal',
    flag: '🇵🇹',
    currency: 'EUR',
    pricingUpfront: '€500',
    pricingRetainer: '€25/mo',
    whatsappNumber: '351912345678',
    heroSubtitle:
      'Visuais 3D interativos, performance edge abaixo de um segundo e sistemas de reserva direta por WhatsApp criados para donos de negócios.',
    badgeLocation: 'PORTUGAL · RISCO ZERO EM 48 HORAS',
    marketName: 'Portugal',
    defaultLanguage: 'pt',
  },
  ie: {
    countryCode: 'IE',
    countrySlug: 'ie',
    countryName: 'Ireland',
    flag: '🇮🇪',
    currency: 'EUR',
    pricingUpfront: '€1,800',
    pricingRetainer: '€75/mo',
    whatsappNumber: '353871234567',
    heroSubtitle:
      'Interactive 3D visuals, sub-second edge performance, and direct 1-click WhatsApp booking systems crafted for Irish business owners.',
    badgeLocation: 'IRELAND & UK · ZERO DEPOSIT RISK',
    marketName: 'Ireland',
    defaultLanguage: 'en',
  },
};

export const defaultCountry: CountryCode = 'ie';
export const supportedCountries: CountryCode[] = ['ie', 'pt'];

export function isValidCountry(country?: string): country is CountryCode {
  if (!country) return false;
  const slug = country.toLowerCase();
  return slug === 'pt' || slug === 'ie';
}

export function getCountryContent(country?: string): CountryContent {
  const normalized = (country || '').toLowerCase() as CountryCode;
  if (normalized in countryDictionary) {
    return countryDictionary[normalized];
  }
  return countryDictionary[defaultCountry];
}
