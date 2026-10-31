import seedClients from '../data/clients.json';

/**
 * Demo routes managed from /admin. Saved in this browser's localStorage, seeded from
 * src/data/clients.json. A copied demo link carries its target in `?url=`, so it opens on any
 * device even though the list itself only lives on the admin's machine.
 */
export type MarketTier = 'Ireland' | 'Algarve';

export interface ClientConfig {
  slug: string;
  name: string;
  stagingUrl: string;
  bookingUrl: string;
  whatsappNumber: string;
  marketTier: MarketTier;
  createdAt?: string;
}

const STORAGE_KEY = 'ax07_admin_clients_v1';

// Earlier versions stored the tier with a price attached, e.g. "Ireland (€1,800)"
const normaliseTier = (tier: string | undefined): MarketTier => (tier?.startsWith('Algarve') ? 'Algarve' : 'Ireland');
const normalise = (c: ClientConfig): ClientConfig => ({ ...c, marketTier: normaliseTier(c.marketTier) });
const seed = (seedClients as ClientConfig[]).map(normalise);

export function ensureAbsoluteUrl(url: string): string {
  const trimmed = (url || '').trim();
  if (!trimmed) return '';
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export function getStoredClients(): ClientConfig[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seed;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return seed;
    // Keep any seed entries the stored list doesn't have yet
    const existing = new Set(parsed.map((c: ClientConfig) => c.slug?.toLowerCase()));
    return [...parsed.map(normalise), ...seed.filter((s) => !existing.has(s.slug.toLowerCase()))];
  } catch {
    return seed;
  }
}

export function saveStoredClients(clients: ClientConfig[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
  } catch (e) {
    console.error('Failed to save clients to localStorage', e);
  }
}

export function getClientBySlug(slug: string): ClientConfig | undefined {
  const normalized = slug.trim().toLowerCase();
  return getStoredClients().find((c) => c.slug?.toLowerCase() === normalized);
}

export const demoPath = (c: Pick<ClientConfig, 'slug' | 'stagingUrl'>, withUrl = true) =>
  withUrl && c.stagingUrl ? `/demo/${c.slug}?url=${encodeURIComponent(c.stagingUrl)}` : `/demo/${c.slug}`;
