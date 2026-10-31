import { Showcase } from '../sections/Showcase';
import { Features } from '../sections/Features';
import { Proof } from '../sections/Proof';
import { Process } from '../sections/Process';
import { Work } from '../sections/Work';
import { Pricing } from '../sections/Pricing';
import { Faq } from '../sections/Faq';
import { FinalCta } from '../sections/FinalCta';

/** Everything below the first two chapters: its own chunk, rendered right after the first paint. */
export default function HomeRest() {
  return (
    <>
      <Showcase />
      <div className="relative bg-ink">
        <Features />
        <Proof />
        <Process />
      </div>
      <div className="relative bg-ink">
        <Work />
      </div>
      <div className="relative bg-ink">
        <Pricing />
        <Faq />
      </div>
      <FinalCta />
    </>
  );
}
