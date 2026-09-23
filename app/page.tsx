import { redirect } from 'next/navigation';
import { defaultCountry } from '@/src/lib/content';

export default function RootPage() {
  redirect(`/${defaultCountry}`);
}
