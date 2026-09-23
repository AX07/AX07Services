import { getCountryContent, defaultCountry } from '@/src/lib/content';
import { AppProvider } from '@/src/context/ThemeLanguageContext';
import { AboutStudioPage } from '@/src/components/AboutStudioPage';

export const metadata = {
  title: 'Manifesto & Tech Stack | AX07 Studio',
  description: 'Learn about our engineering philosophy: sub-500ms edge deployments, 60fps spatial 3D web, and our zero-deposit spec model.',
};

export default function AboutPage() {
  const content = getCountryContent(defaultCountry);

  return (
    <AppProvider initialLang={content.defaultLanguage}>
      <AboutStudioPage countryContent={content} />
    </AppProvider>
  );
}
