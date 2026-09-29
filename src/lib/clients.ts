import seedClients from '../../data/clients.json';

export type MarketTier = 'Algarve (€500)' | 'Ireland (€1,800)';

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

export function ensureAbsoluteUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

export function getStoredClients(): ClientConfig[] {
  if (typeof window === 'undefined') {
    return seedClients as ClientConfig[];
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seedClients));
      return seedClients as ClientConfig[];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Merge with seedClients so any new seed entries (like cryptoax07) are never omitted
      const existingSlugs = new Set(parsed.map((c: ClientConfig) => c.slug?.toLowerCase()));
      const merged = [...parsed];
      for (const s of seedClients) {
        if (!existingSlugs.has((s as ClientConfig).slug?.toLowerCase())) {
          merged.push(s as ClientConfig);
        }
      }
      return merged;
    }
    return seedClients as ClientConfig[];
  } catch {
    return seedClients as ClientConfig[];
  }
}

export function saveStoredClients(clients: ClientConfig[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
  } catch (e) {
    console.error('Failed to save clients to localStorage', e);
  }
}

export function getClientBySlug(slug: string): ClientConfig | undefined {
  const clients = getStoredClients();
  const normalized = slug.trim().toLowerCase();
  return clients.find((c) => c.slug?.toLowerCase() === normalized);
}
