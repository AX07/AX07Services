import { getCountryContent, defaultCountry } from '@/src/lib/content';
import { AppProvider } from '@/src/context/ThemeLanguageContext';
import { WorkPortfolioPage } from '@/src/components/WorkPortfolioPage';

export const metadata = {
  title: 'Portfolio & Case Studies | AX07 Services',
  description: 'Explore verified 3D WebGL case studies, performance metrics, and zero-commission booking systems.',
};

export default function WorkPage() {
  const content = getCountryContent(defaultCountry);

  return (
    <AppProvider initialLang={content.defaultLanguage}>
      <WorkPortfolioPage countryContent={content} />
    </AppProvider>
  );
}
