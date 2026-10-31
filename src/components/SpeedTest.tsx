import { useEffect, useRef, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { EASE_OUT } from './Reveal';
import { Gauge } from './Gauge';
import { QuotaError, quickEstimate, runSpeedTest, type SpeedResult } from '../lib/pagespeed';
import { whatsappLink } from '../lib/content';

const OUR_SCORE = 98;
const STEPS = ['Contacting Google PageSpeed…', 'Loading your site on a simulated 4G phone…', 'Measuring first paint and layout…', 'Scoring performance…'];

type State = { kind: 'idle' } | { kind: 'running'; step: number } | { kind: 'done'; result: SpeedResult } | { kind: 'error'; message: string };

/** Live Google PageSpeed test: the visitor's own site against an ax07 build. */
export function SpeedTest() {
  const [url, setUrl] = useState('');
  const [state, setState] = useState<State>({ kind: 'idle' });
  const abortRef = useRef<AbortController | null>(null);

  // Step the loading copy while Google works (a real test takes 10–30s)
  useEffect(() => {
    if (state.kind !== 'running') return;
    const id = window.setInterval(() => {
      setState((s) => (s.kind === 'running' ? { kind: 'running', step: Math.min(STEPS.length - 1, s.step + 1) } : s));
    }, 5000);
    return () => window.clearInterval(id);
  }, [state.kind]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!url.trim() || state.kind === 'running') return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setState({ kind: 'running', step: 0 });
    try {
      let result: SpeedResult;
      try {
        result = await runSpeedTest(url, controller.signal);
      } catch (err) {
        // Google's shared quota is often exhausted: fall back to a clearly labelled estimate
        if (!(err instanceof QuotaError)) throw err;
        result = await quickEstimate(url, controller.signal);
      }
      setState({ kind: 'done', result });
    } catch (err) {
      if (controller.signal.aborted) return;
      setState({ kind: 'error', message: err instanceof Error ? err.message : 'Something went wrong. Please try again.' });
    }
  };

  const result = state.kind === 'done' ? state.result : null;
  const host = result ? new URL(result.url).hostname.replace(/^www\./, '') : '';

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inset-0 animate-[pulse-ring_1.8s_var(--ease-out)_infinite] rounded-full bg-accent-bright" />
          <span className="relative h-2 w-2 rounded-full bg-accent-bright" />
        </span>
        <span className="eyebrow">Live test · Google PageSpeed, mobile</span>
      </div>
      <h3 className="display mt-3 text-[28px] sm:text-[34px]">How fast is your site?</h3>

      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-2 sm:flex-row sm:rounded-full sm:border sm:border-line-strong sm:bg-raised sm:p-1.5">
        <label htmlFor="speed-url" className="sr-only">
          Your website address
        </label>
        <input
          id="speed-url"
          inputMode="url"
          autoComplete="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="yourbusiness.com"
          className="min-h-[48px] flex-1 rounded-full border border-line-strong bg-raised px-5 text-[15px] placeholder:text-subtle focus:outline-none sm:border-0 sm:bg-transparent"
        />
        <button type="submit" disabled={state.kind === 'running'} className="btn btn-primary disabled:opacity-60">
          {state.kind === 'running' ? 'Testing…' : 'Run free test'}
        </button>
      </form>

      <div className="mt-6 flex flex-1 items-center justify-center">
        <AnimatePresence mode="wait">
          {state.kind === 'running' && (
            <motion.div
              key="running"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: EASE_OUT }}
              className="flex w-full flex-col items-center gap-4 text-center"
            >
              <div className="h-1.5 w-full max-w-sm overflow-hidden rounded-full bg-raised">
                <div className="h-full w-1/3 animate-[shimmer_1.2s_var(--ease-in-out)_infinite] rounded-full bg-accent-bright" />
              </div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={state.step}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3 }}
                  className="text-[15px] text-muted"
                >
                  {STEPS[state.step]}
                </motion.p>
              </AnimatePresence>
              <p className="text-[12px] text-subtle">A real test takes 10–30 seconds.</p>
            </motion.div>
          )}

          {state.kind === 'error' && (
            <motion.p
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-sm text-center text-[15px] text-danger"
            >
              {state.message}
            </motion.p>
          )}

          {state.kind === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex w-full items-center justify-center gap-6 sm:gap-10"
            >
              <Gauge score={OUR_SCORE} size={128} label="An ax07 build" />
              <div className="max-w-[12rem] text-[14px] leading-relaxed text-muted">
                Most small-business sites score under 50. Enter yours and see where it lands.
              </div>
            </motion.div>
          )}

          {result && (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE_OUT }}
              className="w-full"
            >
              <div className="flex items-start justify-center gap-6 sm:gap-12">
                <Gauge score={result.score} size={120} label={result.estimated ? `${host} · estimate` : host} />
                <Gauge score={OUR_SCORE} size={120} label="ax07 build" />
              </div>
              {result.estimated && (
                <p className="mt-4 text-center text-[12px] leading-relaxed text-subtle">
                  Google’s full test is unavailable right now, so this is a quick estimate from your site’s response time
                  ({result.responseMs} ms from your browser).
                </p>
              )}
              <dl className={`mt-5 grid-cols-3 gap-2 text-center ${result.estimated ? 'hidden' : 'grid'}`}>
                {[
                  ['First paint', result.fcp],
                  ['Main content', result.lcp],
                  ['Blocked', result.tbt],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-sm bg-raised px-2 py-2.5">
                    <dt className="text-[11px] text-muted">{k}</dt>
                    <dd className="mt-0.5 font-display text-[16px] font-semibold tabular-nums">{v}</dd>
                  </div>
                ))}
              </dl>
              <a
                href={whatsappLink(
                  `Hi ax07, I just tested ${host} on your site and scored ${result.score}/100. I'd like my free 48h preview built to your 98/100 standard.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary mt-5 w-full"
              >
                {result.score >= 90 ? 'Fast already. Let’s make it unforgettable' : `Fix my ${result.score}/100, free preview`}
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
