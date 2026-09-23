import { notFound } from 'next/navigation';
import { getCountryContent, countryDictionary, CountryCode, isValidCountry } from '@/src/lib/content';
import { AppProvider } from '@/src/context/ThemeLanguageContext';
import { WorkPortfolioPage } from '@/src/components/WorkPortfolioPage';

export async function generateStaticParams() {
  return Object.keys(countryDictionary).map((country) => ({
    country,
  }));
}

interface PageProps {
  params: Promise<{ country: string }> | { country: string };
}

export default async function CountryWorkPage({ params }: PageProps) {
  const resolvedParams = await params;
  const countryParam = resolvedParams?.country?.toLowerCase();

  if (!isValidCountry(countryParam)) {
    notFound();
  }

  const content = getCountryContent(countryParam as CountryCode);

  return (
    <AppProvider initialLang={content.defaultLanguage}>
      <WorkPortfolioPage countryContent={content} />
    </AppProvider>
  );
}
