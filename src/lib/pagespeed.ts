/** Google PageSpeed Insights (mobile) straight from the browser. Optional key: VITE_PAGESPEED_KEY. */

export interface SpeedResult {
  url: string;
  score: number;
  /** true when Google's test was unavailable and the score is a response-time estimate */
  estimated?: boolean;
  responseMs?: number;
  fcp: string;
  lcp: string;
  tbt: string;
  speedIndex: string;
}

export function normalizeUrl(input: string) {
  const trimmed = input.trim();
  if (!trimmed) return '';
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    return new URL(withProtocol).toString();
  } catch {
    return '';
  }
}

export async function runSpeedTest(rawUrl: string, signal?: AbortSignal): Promise<SpeedResult> {
  const url = normalizeUrl(rawUrl);
  if (!url) throw new Error('That doesn’t look like a website address. Try something like yourbusiness.com');

  const key = import.meta.env.VITE_PAGESPEED_KEY as string | undefined;
  const endpoint =
    `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}` +
    `&strategy=mobile&category=performance${key ? `&key=${encodeURIComponent(key)}` : ''}`;

  const res = await fetch(endpoint, { signal });
  if (res.status === 429 || res.status === 403) throw new QuotaError();
  if (!res.ok) throw new Error('Google couldn’t reach that site. Check the address and that the site is public.');

  const data = await res.json();
  const lighthouse = data?.lighthouseResult;
  const score = lighthouse?.categories?.performance?.score;
  if (typeof score !== 'number') throw new Error('Google returned no score for that site. Try again in a moment.');

  const audit = (id: string) => (lighthouse.audits?.[id]?.displayValue as string | undefined)?.replace(/ /g, ' ') ?? '—';
  return {
    url,
    score: Math.round(score * 100),
    fcp: audit('first-contentful-paint'),
    lcp: audit('largest-contentful-paint'),
    tbt: audit('total-blocking-time'),
    speedIndex: audit('speed-index'),
  };
}

/** Google's shared quota (or a missing key) blocked the request */
export class QuotaError extends Error {
  constructor() {
    super('Google’s free speed test is busy right now. Try again in a minute.');
  }
}

/**
 * Fallback when Google's test is unavailable: time a few real requests to the site from the
 * visitor's browser and map the median response time onto a rough 0–100 scale. Always shown
 * to the visitor as an estimate, never as a Google score.
 */
export async function quickEstimate(rawUrl: string, signal?: AbortSignal): Promise<SpeedResult> {
  const url = normalizeUrl(rawUrl);
  if (!url) throw new Error('That doesn’t look like a website address. Try something like yourbusiness.com');

  const samples: number[] = [];
  for (let i = 0; i < 3; i++) {
    const start = performance.now();
    try {
      await fetch(`${url}${url.includes('?') ? '&' : '?'}_ax07=${Date.now()}`, { mode: 'no-cors', cache: 'no-store', signal });
    } catch (err) {
      if (signal?.aborted) throw err;
      throw new Error('We couldn’t reach that site. Check the address and that the site is public.');
    }
    samples.push(performance.now() - start);
  }
  samples.sort((a, b) => a - b);
  const ms = Math.round(samples[1]);

  // Rough mapping from server response time to a mobile performance band
  const bands: [number, number, number][] = [
    [300, 92, 97],
    [700, 75, 91],
    [1300, 55, 74],
    [2500, 35, 54],
    [Infinity, 15, 34],
  ];
  let prev = 0;
  let score = 15;
  for (const [limit, lo, hi] of bands) {
    if (ms <= limit) {
      const span = limit === Infinity ? 4000 : limit - prev;
      const t = Math.min(1, (ms - prev) / span);
      score = Math.round(hi - (hi - lo) * t);
      break;
    }
    prev = limit;
  }

  return { url, score, estimated: true, responseMs: ms, fcp: '—', lcp: '—', tbt: '—', speedIndex: '—' };
}

export const scoreTone = (score: number) => (score >= 90 ? 'good' : score >= 50 ? 'average' : 'poor');
