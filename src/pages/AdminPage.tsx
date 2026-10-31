import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { EASE_OUT } from '../components/Reveal';
import { linkProps } from '../lib/router';
import { demoPath, ensureAbsoluteUrl, getStoredClients, saveStoredClients, type ClientConfig, type MarketTier } from '../lib/clients';

/**
 * Admin for client demo links: each entry becomes /demo/[slug], which frames the client's staging
 * site under an ax07 bar with an "Approve & launch" WhatsApp button.
 *
 * The password check runs in the browser, so it only keeps casual visitors out; anything here
 * is visible to someone who reads the page source. Set VITE_ADMIN_PASSWORD in Vercel.
 */
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'adminadmin';
const AUTH_KEY = 'ax07_admin_auth';
const DEFAULT_WHATSAPP = '+353894419127';
const TIERS: MarketTier[] = ['Ireland', 'Algarve'];

const slugify = (v: string) =>
  v
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export function AdminPage() {
  const [authed, setAuthed] = useState(() => {
    try {
      return sessionStorage.getItem(AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const { toast, show } = useToast();

  return (
    <div className="min-h-[100svh] bg-ink px-5 py-8 sm:px-8 sm:py-12">
      {authed ? (
        <Console
          onLock={() => {
            try {
              sessionStorage.removeItem(AUTH_KEY);
            } catch {
              /* private mode */
            }
            setAuthed(false);
          }}
          toast={show}
        />
      ) : (
        <Login
          onSuccess={() => {
            try {
              sessionStorage.setItem(AUTH_KEY, 'true');
            } catch {
              /* private mode */
            }
            setAuthed(true);
          }}
        />
      )}

      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
            role="status"
            className="fixed bottom-5 left-1/2 z-50 w-[min(92vw,26rem)] -translate-x-1/2 rounded-sm border border-line bg-surface px-4 py-3 shadow-float"
          >
            <div className="text-[14px] font-medium">{toast.title}</div>
            {toast.body && <div className="mt-0.5 truncate text-[12px] text-muted">{toast.body}</div>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------------------------------------------------------- Login */

function Login({ onSuccess }: { onSuccess: () => void }) {
  const [value, setValue] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (value.trim() === ADMIN_PASSWORD) onSuccess();
    else setError(true);
  };

  return (
    <div className="flex min-h-[calc(100svh-6rem)] items-center justify-center">
      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE_OUT }}
        className="card w-full max-w-md p-8 text-center sm:p-10"
      >
        <img src="/logo-mark.png" alt="" width={40} height={40} className="mx-auto h-10 w-10 dark:invert" />
        <h1 className="display mt-5 text-title-lg">ax07 admin</h1>
        <p className="mt-2 text-[14px] text-muted">Manage client demo links.</p>

        <label htmlFor="admin-password" className="mt-8 block text-left text-[13px] font-medium">
          Password
        </label>
        <div className="relative mt-2">
          <input
            id="admin-password"
            type={show ? 'text' : 'password'}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError(false);
            }}
            autoFocus
            autoComplete="current-password"
            className={`w-full rounded-sm border bg-surface px-4 py-3 pr-16 text-[15px] outline-none transition-colors focus:border-accent-bright ${
              error ? 'border-danger' : 'border-line-strong'
            }`}
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute inset-y-0 right-3 cursor-pointer text-[12px] font-medium text-muted hover:text-fg"
          >
            {show ? 'Hide' : 'Show'}
          </button>
        </div>
        {error && <p className="mt-2 text-left text-[13px] text-danger">Incorrect password.</p>}

        <button type="submit" className="btn btn-primary mt-6 w-full">
          Unlock
        </button>
        <a {...linkProps('/')} className="mt-6 inline-block text-[13px] text-muted hover:text-fg">
          ← Back to website
        </a>
      </motion.form>
    </div>
  );
}

/* ---------------------------------------------------------------- Console */

function Console({ onLock, toast }: { onLock: () => void; toast: (title: string, body?: string) => void }) {
  const [clients, setClients] = useState<ClientConfig[]>(() => getStoredClients());
  const [search, setSearch] = useState('');
  const [tier, setTier] = useState<'All' | MarketTier>('All');
  const [copied, setCopied] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [stagingUrl, setStagingUrl] = useState('');
  const [bookingUrl, setBookingUrl] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [market, setMarket] = useState<MarketTier>('Ireland');

  const persist = (next: ClientConfig[]) => {
    setClients(next);
    saveStoredClients(next);
  };

  const onName = (v: string) => {
    // Keep the slug in step with the name until it's edited by hand
    if (!slug || slug === slugify(name)) setSlug(slugify(v));
    setName(v);
  };

  const edit = (c: ClientConfig) => {
    setName(c.name);
    setSlug(c.slug);
    setStagingUrl(c.stagingUrl);
    setBookingUrl(c.bookingUrl);
    setWhatsapp(c.whatsappNumber);
    setMarket(c.marketTier);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const clean = slugify(slug);
    if (!clean || !name.trim() || !stagingUrl.trim()) {
      toast('Name, slug and staging URL are required');
      return;
    }
    const entry: ClientConfig = {
      slug: clean,
      name: name.trim(),
      stagingUrl: ensureAbsoluteUrl(stagingUrl),
      bookingUrl: bookingUrl.trim() ? ensureAbsoluteUrl(bookingUrl) : '',
      whatsappNumber: whatsapp.trim() || DEFAULT_WHATSAPP,
      marketTier: market,
      createdAt: new Date().toISOString(),
    };
    const i = clients.findIndex((c) => c.slug.toLowerCase() === clean);
    if (i >= 0) {
      const next = [...clients];
      next[i] = entry;
      persist(next);
      toast(`Updated ${entry.name}`, `/demo/${clean}`);
    } else {
      persist([entry, ...clients]);
      toast('Demo link created', `/demo/${clean}`);
    }
    setName('');
    setSlug('');
    setStagingUrl('');
    setBookingUrl('');
    setWhatsapp('');
  };

  const remove = (c: ClientConfig) => {
    if (!window.confirm(`Remove the demo link for "${c.name}"?`)) return;
    persist(clients.filter((x) => x.slug !== c.slug));
    toast(`Removed /demo/${c.slug}`);
  };

  const copy = async (c: ClientConfig) => {
    const url = `${window.location.origin}${demoPath(c)}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(c.slug);
      toast('Demo link copied', url);
      window.setTimeout(() => setCopied((s) => (s === c.slug ? null : s)), 2200);
    } catch {
      window.prompt('Copy this demo link:', url);
    }
  };

  const q = search.trim().toLowerCase();
  const filtered = clients.filter(
    (c) =>
      (tier === 'All' || c.marketTier === tier) &&
      (!q || c.name.toLowerCase().includes(q) || c.slug.includes(q) || c.stagingUrl.toLowerCase().includes(q)),
  );

  return (
    <div className="mx-auto max-w-5xl">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6">
        <div className="flex items-center gap-3">
          <a {...linkProps('/')} className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface" aria-label="Back to website">
            <img src="/logo-mark.png" alt="" width={20} height={20} className="h-5 w-5 dark:invert" />
          </a>
          <div>
            <div className="eyebrow">Admin</div>
            <h1 className="display text-title-lg">Client demo links</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-accent-soft px-3 py-1.5 text-[13px] font-medium text-accent">{clients.length} live links</span>
          <button type="button" onClick={onLock} className="btn btn-quiet !min-h-[36px] !px-4 text-[13px]">
            Lock
          </button>
        </div>
      </header>

      {/* Create / update */}
      <form onSubmit={submit} className="card mt-8 p-6 sm:p-8">
        <h2 className="font-display text-title font-semibold">New demo link</h2>
        <p className="mt-1 text-[14px] text-muted">Saving with an existing slug updates that link.</p>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Client name" required>
            <input value={name} onChange={(e) => onName(e.target.value)} placeholder="FlyFoil Formosa" className={INPUT} required />
          </Field>
          <Field label="Slug" required>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-[14px] text-subtle">/demo/</span>
              <input value={slug} onChange={(e) => setSlug(slugify(e.target.value) || e.target.value.toLowerCase())} placeholder="flyfoil" className={`${INPUT} pl-[4.25rem]`} required />
            </div>
          </Field>
          <Field label="Staging URL" required>
            <input type="url" value={stagingUrl} onChange={(e) => setStagingUrl(e.target.value)} placeholder="https://client-demo.vercel.app" className={INPUT} required />
          </Field>
          <Field label="Booking URL">
            <input type="url" value={bookingUrl} onChange={(e) => setBookingUrl(e.target.value)} placeholder="https://…" className={INPUT} />
          </Field>
          <Field label="WhatsApp for 'Approve & launch'">
            <input type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder={DEFAULT_WHATSAPP} className={INPUT} />
          </Field>
          <Field label="Market" group>
            <div role="group" aria-label="Market" className="flex gap-1 rounded-sm border border-line-strong bg-surface p-1">
              {TIERS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setMarket(t)}
                  aria-pressed={market === t}
                  className={`flex-1 cursor-pointer rounded-[8px] py-2 text-[14px] transition-colors ${market === t ? 'bg-fg text-on-fg' : 'text-muted hover:text-fg'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </Field>
        </div>

        <div className="mt-6 flex justify-end border-t border-line pt-5">
          <button type="submit" className="btn btn-primary">
            Save demo link
          </button>
        </div>
      </form>

      {/* List */}
      <section className="mt-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-title font-semibold">Demo links</h2>
          <div className="flex flex-wrap gap-2">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or slug"
              aria-label="Search demo links"
              className="w-48 rounded-full border border-line-strong bg-surface px-4 py-2 text-[14px] outline-none focus:border-accent-bright sm:w-60"
            />
            <div className="flex gap-1 rounded-full border border-line-strong bg-surface p-1">
              {(['All', ...TIERS] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTier(t)}
                  className={`cursor-pointer rounded-full px-3 py-1 text-[13px] transition-colors ${tier === t ? 'bg-fg text-on-fg' : 'text-muted hover:text-fg'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
          {filtered.map((c) => (
            <article key={c.slug} className="card flex flex-col gap-4 p-5">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-raised px-2.5 py-0.5 text-[12px] text-muted">{c.marketTier}</span>
                  <span className="font-mono text-[12px] text-subtle">/demo/{c.slug}</span>
                </div>
                <h3 className="mt-3 font-display text-title font-semibold">{c.name}</h3>
                <p className="mt-0.5 truncate text-[13px] text-muted">{c.stagingUrl}</p>
              </div>
              <div className="flex flex-wrap gap-2 border-t border-line pt-4">
                <button
                  type="button"
                  onClick={() => copy(c)}
                  className={`btn !min-h-[36px] flex-1 !px-4 text-[13px] ${copied === c.slug ? 'bg-accent-bright text-white' : 'btn-primary'}`}
                >
                  {copied === c.slug ? 'Copied ✓' : 'Copy link'}
                </button>
                <a {...linkProps(demoPath(c))} className="btn btn-quiet !min-h-[36px] !px-4 text-[13px]">
                  Preview
                </a>
                <button type="button" onClick={() => edit(c)} className="btn btn-quiet !min-h-[36px] !px-4 text-[13px]">
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => remove(c)}
                  className="btn !min-h-[36px] cursor-pointer border border-danger/20 !px-4 text-[13px] text-danger hover:bg-danger/5"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full rounded-md border border-dashed border-line-strong p-10 text-center text-[14px] text-muted">
              No demo links match. Create one above.
            </div>
          )}
        </div>

        <p className="mt-8 text-[13px] leading-relaxed text-subtle">
          Links are saved in this browser. Copied links include the staging URL, so they open on any device.
        </p>
      </section>
    </div>
  );
}

const INPUT =
  'w-full rounded-sm border border-line-strong bg-surface px-4 py-2.5 text-[15px] outline-none transition-colors placeholder:text-subtle focus:border-accent-bright';

function Field({ label, required, group, children }: { label: string; required?: boolean; group?: boolean; children: ReactNode }) {
  // A button group can't sit inside a <label>, so it gets a plain wrapper instead
  const Tag = group ? 'div' : 'label';
  return (
    <Tag className="block">
      <span className="mb-1.5 block text-[13px] font-medium">
        {label}
        {required && <span className="text-accent"> *</span>}
      </span>
      {children}
    </Tag>
  );
}

function useToast() {
  const [toast, setToast] = useState<{ id: number; title: string; body?: string } | null>(null);
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const show = (title: string, body?: string) => {
    window.clearTimeout(timer.current);
    setToast({ id: Date.now(), title, body });
    timer.current = window.setTimeout(() => setToast(null), 2800);
  };
  return { toast, show };
}
