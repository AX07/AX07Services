import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, HelpCircle, MessageCircle } from 'lucide-react';
import { appleSprings, appleGestures } from '../lib/design-system';
import { useApp } from '../context/ThemeLanguageContext';

export function Faq() {
  const { t } = useApp();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 sm:py-32 px-4 sm:px-6 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-white/10 relative z-20 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <div className="text-xs font-mono tracking-widest text-zinc-500 dark:text-white/40 mb-3 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-zinc-200 dark:border-white/10 bg-white/70 dark:bg-white/[0.04] backdrop-blur-md">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 stroke-[1.75]" />
            <span className="text-zinc-700 dark:text-white/60">{t.faq.tag}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white font-display mb-4">
            {t.faq.title}
          </h2>
          <p className="text-zinc-600 dark:text-white/60 text-sm sm:text-base md:text-lg max-w-xl mx-auto font-sans leading-relaxed">
            {t.faq.subtitle}
          </p>
        </div>

        {/* Interactive Accordion in Squircle Container */}
        <div className="rounded-[32px] border border-zinc-200 dark:border-white/10 bg-white/80 dark:bg-white/[0.04] backdrop-blur-xl p-4 sm:p-6 shadow-2xl space-y-3">
          {(t.faq?.items || []).map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.id}
                className={`rounded-[24px] border transition-all duration-300 backdrop-blur-md overflow-hidden ${
                  isOpen
                    ? 'border-emerald-500/30 bg-zinc-50/90 dark:bg-white/[0.04] shadow-lg ring-1 ring-emerald-500/20'
                    : 'border-zinc-200/80 dark:border-white/5 bg-white/50 dark:bg-white/[0.02] hover:border-zinc-300 dark:hover:border-white/15 hover:bg-white/80 dark:hover:bg-white/[0.03]'
                }`}
              >
                <motion.button
                  whileTap={appleGestures.primaryButton.tap}
                  onClick={() => toggleFaq(index)}
                  className="w-full p-5 sm:p-6 flex items-center justify-between gap-4 text-left cursor-pointer transition-colors select-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                    <span className="text-xs sm:text-sm font-mono text-zinc-400 dark:text-white/40 font-bold shrink-0 mt-0.5 sm:mt-0">
                      {faq.num}
                    </span>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 block mb-1 font-semibold">
                        {faq.tag}
                      </span>
                      <h3 className="text-base sm:text-lg md:text-xl font-bold font-display text-zinc-900 dark:text-white tracking-tight pr-4">
                        {faq.question}
                      </h3>
                    </div>
                  </div>

                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={appleSprings.snappy}
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border transition-colors ${
                      isOpen
                        ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                        : 'border-zinc-300 dark:border-white/10 bg-zinc-100 dark:bg-white/[0.04] text-zinc-500 dark:text-white/60'
                    }`}
                  >
                    {isOpen ? <Minus className="w-4 h-4 stroke-[1.75]" /> : <Plus className="w-4 h-4 stroke-[1.75]" />}
                  </motion.div>
                </motion.button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={appleSprings.snappy}
                    >
                      <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-1 border-t border-zinc-200 dark:border-white/5 text-zinc-600 dark:text-white/60 text-sm sm:text-base leading-relaxed font-sans pl-10 sm:pl-14">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Objection Crushing Bottom Card */}
        <div className="mt-10 p-6 sm:p-8 rounded-[28px] border border-zinc-200 dark:border-white/10 bg-white/80 dark:bg-white/[0.04] backdrop-blur-xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h4 className="text-base font-bold text-zinc-900 dark:text-white font-display tracking-tight">{t.faq.bottomCardTitle}</h4>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-white/60 mt-1 font-sans">{t.faq.bottomCardSubtitle}</p>
          </div>
          <motion.a
            whileHover={appleGestures.secondaryButton.hover}
            whileTap={appleGestures.secondaryButton.tap}
            href="https://wa.me/351912345678?text=Hello%20AX07,%20I%20have%20a%20question%20about%20your%203D%20website%20service"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-zinc-200/80 dark:bg-white/10 backdrop-blur-md border border-zinc-300 dark:border-white/15 hover:bg-zinc-300 dark:hover:bg-white/20 text-zinc-900 dark:text-white font-medium text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <MessageCircle className="w-4 h-4 text-emerald-500 dark:text-emerald-400 stroke-[1.75]" />
            <span>{t.faq.bottomCardCta}</span>
          </motion.a>
        </div>

      </div>
    </section>
  );
}

export default Faq;
