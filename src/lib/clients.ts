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
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : (seedClients as ClientConfig[]);
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
  return clients.find((c) => c.slug.toLowerCase() === normalized);
}
