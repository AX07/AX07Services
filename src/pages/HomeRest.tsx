import { Showcase } from '../sections/Showcase';
import { Features } from '../sections/Features';
import { Proof } from '../sections/Proof';
import { Process } from '../sections/Process';
import { PreviewOffer } from '../sections/PreviewOffer';
import { Work } from '../sections/Work';
import { Pricing } from '../sections/Pricing';
import { Faq } from '../sections/Faq';
import { FinalCta } from '../sections/FinalCta';

/** Everything below the first two chapters: its own chunk, rendered right after the first paint. */
export default function HomeRest() {
  return (
    <>
      <Showcase />
      <Work />
      <PreviewOffer />
      <Features />
      <Proof />
      <Process />
      <Pricing />
      <Faq />
      <FinalCta />
    </>
  );
}
