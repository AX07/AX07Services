import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Link as LinkIcon, X, Search, Terminal, ArrowUpRight } from 'lucide-react';
import { toast } from 'sonner';
import { appleSprings, appleGestures } from '../lib/design-system';
import { useApp } from '../context/ThemeLanguageContext';

export function Dock() {
  const { t } = useApp();
  const [activeTab, setActiveTab] = useState<'none' | 'ai' | 'magic'>('none');
  const [inputValue, setInputValue] = useState('');
  const [iframeUrl, setIframeUrl] = useState('');

  const handleMagicSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (inputValue) {
      setIframeUrl(inputValue);
      toast.success('Magic Preview Generated', {
        description: `Staging container rendered for ${inputValue}`
      });
    }
  };

  const handleAiSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (inputValue) {
      setIframeUrl('https://dribbble.com/search/' + encodeURIComponent(inputValue));
      toast.info('AI Inspiration Sandbox', {
        description: `Queried high-converting motion benchmarks for "${inputValue}"`
      });
    }
  };

  return (
    <>
      {/* Floating Glass Control Dock */}
      <div className="fixed bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-50">
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ...appleSprings.default, delay: 0.8 }}
          className="flex items-center gap-1.5 p-1.5 rounded-full shadow-2xl border border-zinc-200 dark:border-white/10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl"
        >
          <motion.button
            whileHover={appleGestures.circularButton.hover}
            whileTap={appleGestures.circularButton.tap}
            onClick={() => {
              setActiveTab(activeTab === 'ai' ? 'none' : 'ai');
              setInputValue('');
              setIframeUrl('');
            }}
            className={`relative p-2.5 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
              activeTab === 'ai' ? 'text-zinc-900 dark:text-white' : 'text-zinc-500 dark:text-white/60 hover:text-zinc-900 dark:hover:text-white'
            }`}
            title={t.dock.aiTooltip}
          >
            {activeTab === 'ai' && (
              <motion.div
                layoutId="activeDockPill"
                className="absolute inset-0 bg-zinc-200/70 dark:bg-white/15 rounded-full border border-zinc-300 dark:border-white/20"
                transition={appleSprings.snappy}
              />
            )}
            <Sparkles className="w-4 h-4 relative z-10 stroke-[1.75]" />
          </motion.button>
          
          <div className="w-px h-4 bg-zinc-200 dark:bg-white/10 mx-0.5" />
          
          <motion.button
            whileHover={appleGestures.circularButton.hover}
            whileTap={appleGestures.circularButton.tap}
            onClick={() => {
              setActiveTab(activeTab === 'magic' ? 'none' : 'magic');
              setInputValue('');
              setIframeUrl('');
            }}
            className={`relative p-2.5 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
              activeTab === 'magic' ? 'text-zinc-900 dark:text-white' : 'text-zinc-500 dark:text-white/60 hover:text-zinc-900 dark:hover:text-white'
            }`}
            title={t.dock.magicTooltip}
          >
            {activeTab === 'magic' && (
              <motion.div
                layoutId="activeDockPill"
                className="absolute inset-0 bg-zinc-200/70 dark:bg-white/15 rounded-full border border-zinc-300 dark:border-white/20"
                transition={appleSprings.snappy}
              />
            )}
            <LinkIcon className="w-4 h-4 relative z-10 stroke-[1.75]" />
          </motion.button>
        </motion.div>
      </div>

      {/* Modal Overlay with Apple HIG Squircle Dialog Physics */}
      <AnimatePresence>
        {activeTab !== 'none' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 10 }}
            transition={appleSprings.default}
            className="fixed bottom-24 sm:bottom-28 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-[600px] z-50 rounded-[32px] p-6 sm:p-8 shadow-2xl border border-zinc-200 dark:border-white/10 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl"
          >
            <motion.button 
              whileHover={appleGestures.circularButton.hover}
              whileTap={appleGestures.circularButton.tap}
              onClick={() => setActiveTab('none')}
              className="absolute top-6 right-6 w-8 h-8 rounded-full border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/[0.04] flex items-center justify-center text-zinc-500 dark:text-white/60 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4 stroke-[1.75]" />
            </motion.button>

            <div className="mb-6">
              <h3 className="text-lg font-bold font-display text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
                {activeTab === 'ai' ? <Sparkles className="w-4 h-4 text-emerald-500 dark:text-emerald-400 stroke-[1.75]" /> : <Terminal className="w-4 h-4 text-emerald-500 dark:text-emerald-400 stroke-[1.75]" />}
                {activeTab === 'ai' ? t.dock.aiTitle : t.dock.magicTitle}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-white/60 mt-1 font-sans">
                {activeTab === 'ai' 
                  ? t.dock.aiDesc 
                  : t.dock.magicDesc}
              </p>
            </div>

            <form onSubmit={activeTab === 'ai' ? handleAiSubmit : handleMagicSubmit} className="flex gap-2.5 mb-4">
              <div className="relative flex-1">
                {activeTab === 'ai' ? (
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-white/40 stroke-[1.75]" />
                ) : (
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-white/40 stroke-[1.75]" />
                )}
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={activeTab === 'ai' ? t.dock.aiPlaceholder : t.dock.magicPlaceholder}
                  className="w-full bg-zinc-100 dark:bg-black/60 border border-zinc-200 dark:border-white/10 rounded-full py-3 pl-11 pr-4 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-white/40 focus:outline-none focus:border-zinc-400 dark:focus:border-white/30 transition-colors font-sans"
                  autoFocus
                />
              </div>
              <motion.button 
                type="submit"
                whileHover={appleGestures.primaryButton.hover}
                whileTap={appleGestures.primaryButton.tap}
                className="bg-zinc-900 dark:bg-white text-white dark:text-black px-6 rounded-full font-medium text-xs uppercase tracking-wider hover:bg-zinc-800 dark:hover:bg-white/90 transition-colors shrink-0 cursor-pointer shadow-md"
              >
                {t.dock.execute}
              </motion.button>
            </form>

            {iframeUrl && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={appleSprings.default}
                className="mt-5 border border-zinc-200 dark:border-white/10 rounded-[24px] overflow-hidden bg-zinc-50 dark:bg-black/50 p-3 relative backdrop-blur-md"
              >
                <div className="text-[10px] font-mono mb-2 px-2 flex justify-between items-center text-zinc-500 dark:text-white/40">
                  <span className="truncate max-w-[280px]">PREVIEW: {iframeUrl}</span>
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Edge Staging Active
                  </span>
                </div>
                <div className="w-full h-[240px] bg-zinc-100 dark:bg-zinc-900/90 rounded-[18px] flex flex-col items-center justify-center text-zinc-500 dark:text-white/40 border border-zinc-200 dark:border-white/5 p-4 text-center">
                   <p className="text-xs font-mono text-zinc-800 dark:text-white/80 mb-2 truncate max-w-full">Target: {iframeUrl}</p>
                   <p className="text-xs text-zinc-600 dark:text-white/60">Iframe simulation ready. Click below to open in isolated tab.</p>
                   <a
                     href={iframeUrl}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="mt-3 px-4 py-2 rounded-full bg-zinc-200 hover:bg-zinc-300 dark:bg-white/10 dark:hover:bg-white/20 text-zinc-900 dark:text-white text-xs font-mono flex items-center gap-1.5 transition-colors border border-zinc-300 dark:border-white/10 font-medium"
                   >
                     <span>{t.dock.openSandbox}</span>
                     <ArrowUpRight className="w-3.5 h-3.5 stroke-[1.75]" />
                   </a>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Dock;
