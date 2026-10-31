import { motion } from 'motion/react';
import { EASE_OUT, Eyebrow, Headline, RevealGroup, RevealItem } from '../components/Reveal';
import { CountTo } from '../components/Gauge';
import { SpeedTest } from '../components/SpeedTest';

// Replays each time the card returns to view
const VIEW = { once: false, amount: 0.6 } as const;

export function Proof() {
  return (
    <section id="proof" className="relative gutter section-y">
      <div className="mx-auto max-w-6xl">
        <Eyebrow index="04" className="mb-5">
          Proof, not promises
        </Eyebrow>
        <Headline
          text={[{ text: 'Fast is a feature.' }, { text: 'Test it yourself.', className: 'text-muted' }]}
          className="display max-w-3xl text-display-2"
        />

        <RevealGroup className="mt-14 grid grid-cols-1 gap-4 lg:grid-cols-3 lg:grid-rows-[auto_auto]">
          {/* Live speed test: the visitor's own site vs ours */}
          <RevealItem className="card p-6 sm:p-8 lg:col-span-2 lg:row-span-2">
            <SpeedTest />
          </RevealItem>

          {/* First paint timeline */}
          <RevealItem className="card flex flex-col justify-between gap-6 p-6 sm:p-7">
            <span className="eyebrow">First paint on 4G</span>
            <div className="display text-stat">
              <CountTo to={0.4} decimals={1} />
              <span className="text-muted">s</span>
            </div>
            <div>
              <div className="relative h-2 rounded-full bg-raised">
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 0.1 }}
                  viewport={VIEW}
                  transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.2 }}
                  className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-accent-bright"
                />
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 0.8 }}
                  viewport={VIEW}
                  transition={{ duration: 2.4, ease: 'linear', delay: 0.2 }}
                  className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-danger/25"
                />
              </div>
              <div className="mt-2 flex justify-between text-[12px] text-muted">
                <span className="text-accent">ax07 · 0.4s</span>
                <span>Template · 3.2s</span>
              </div>
            </div>
          </RevealItem>

          {/* 48h + €0 */}
          <RevealItem className="card grid grid-cols-2 gap-4 p-6 sm:p-7">
            <div className="flex flex-col justify-between gap-4">
              <span className="eyebrow">To your preview</span>
              <div className="display text-stat-sm">
                <CountTo to={48} duration={1.4} />
                <span className="text-muted">h</span>
              </div>
            </div>
            <div className="flex flex-col justify-between gap-4 border-l border-line pl-4">
              <span className="eyebrow">Before you approve</span>
              <div className="display text-stat-sm">
                €<CountTo from={1270} to={0} duration={1.8} />
              </div>
            </div>
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  );
}
