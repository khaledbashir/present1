'use client';

import { useMemo, useState } from 'react';

type AspectRatio = '16/9' | '4/3' | '1/1' | 'full';

const aspectPadding: Record<AspectRatio, string> = {
  '16/9': '56.25%',
  '4/3': '75%',
  '1/1': '100%',
  full: '60%',
};

export type EmbedEntry = {
  id: string;
  title: string;
  url: string;
  notes?: string;
  aspectRatio: AspectRatio;
};

interface Props {
  initialEntries: EmbedEntry[];
}

const aspectOptions: { label: string; value: AspectRatio }[] = [
  { label: '16:9 (presentation)', value: '16/9' },
  { label: '4:3 (classic)', value: '4/3' },
  { label: '1:1 (square)', value: '1/1' },
  { label: 'full (wide)', value: 'full' },
];

const sanitizeUrl = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  if (/^\/\//.test(trimmed)) {
    return `https:${trimmed}`;
  }
  return `https://${trimmed}`;
};

const getHost = (value: string) => {
  try {
    return new URL(value).host;
  } catch {
    return value;
  }
};

export default function EmbedCollector({ initialEntries }: Props) {
  const [entries, setEntries] = useState(initialEntries);
  const [form, setForm] = useState({
    title: '',
    url: '',
    notes: '',
    aspectRatio: '16/9' as AspectRatio,
  });
  const [activeEntry, setActiveEntry] = useState<EmbedEntry | null>(null);

  const canAdd = form.title.trim().length > 0 && form.url.trim().length > 0;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedUrl = sanitizeUrl(form.url);
    if (!canAdd || !normalizedUrl) {
      return;
    }

    const newEntry: EmbedEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      title: form.title.trim(),
      url: normalizedUrl,
      notes: form.notes.trim() || undefined,
      aspectRatio: form.aspectRatio,
    };

    setEntries((prev) => [newEntry, ...prev]);
    setForm({ title: '', url: '', notes: '', aspectRatio: '16/9' });
  };

  const entryCountLabel = useMemo(() => {
    if (entries.length <= 1) {
      return `${entries.length} embed ready`;
    }
    return `${entries.length} embeds ready to share`;
  }, [entries.length]);

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-zinc-200/40 bg-white/80 p-5 sm:p-6 shadow-lg shadow-black/20">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Project vault</p>
            <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
              Keep every live experience ready for your next share.
            </h2>
          </div>
          <span className="text-sm text-slate-500">{entryCountLabel}</span>
        </div>
        <p className="mt-3 text-sm text-slate-600">
          Paste a URL, jot quick context, and I frame the page so you can jump into it with a single tap—no window switching, no fiddly tabs.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-lg shadow-black/40">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
            Title
            <input
              type="text"
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              placeholder="e.g., Metrics console"
              className="mt-2 w-full rounded-2xl bg-zinc-950/70 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </label>
          <label className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
            URL
            <input
              type="url"
              value={form.url}
              onChange={(event) => setForm((prev) => ({ ...prev, url: event.target.value }))}
              placeholder="https://" 
              className="mt-2 w-full rounded-2xl bg-zinc-950/70 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </label>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
            Notes (optional)
            <textarea
              value={form.notes}
              onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
              placeholder="Describe what you’re showing"
              rows={2}
              className="mt-2 w-full rounded-2xl bg-zinc-950/70 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </label>
          <label className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
            Aspect ratio
            <select
              value={form.aspectRatio}
              onChange={(event) => setForm((prev) => ({ ...prev, aspectRatio: event.target.value as AspectRatio }))}
              className="mt-2 w-full rounded-2xl bg-zinc-950/70 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              {aspectOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={!canAdd}
            className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add project
          </button>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Keeps the iframe ready for you</p>
        </div>
      </form>

      <div className="grid gap-4 sm:grid-cols-2">
        {entries.map((entry) => (
          <button
            key={entry.id}
            type="button"
            onClick={() => setActiveEntry(entry)}
            aria-label={`Open ${entry.title}`}
            className="space-y-3 rounded-3xl border border-zinc-800 bg-zinc-950/60 p-5 text-left transition hover:border-emerald-500/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[0.65rem] uppercase tracking-[0.3em] text-zinc-500">live</p>
                <h3 className="text-lg font-semibold text-white">{entry.title}</h3>
                <p className="text-xs text-zinc-500">{getHost(entry.url)}</p>
              </div>
              <div className="text-right text-sm text-emerald-400">{entry.aspectRatio}</div>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-black">
              <div style={{ paddingTop: aspectPadding[entry.aspectRatio], position: 'relative' }}>
                <iframe
                  title={entry.title}
                  src={entry.url}
                  className="absolute inset-0 h-full w-full border-0"
                  loading="lazy"
                  allowFullScreen
                />
              </div>
            </div>
            {entry.notes && <p className="text-sm text-zinc-400">{entry.notes}</p>}
          </button>
        ))}
      </div>

      {activeEntry && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setActiveEntry(null)}
        >
          <div
            className="relative w-full max-w-5xl rounded-3xl border border-zinc-800 bg-zinc-950/95 p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[0.6rem] uppercase tracking-[0.4em] text-zinc-500">Spotlight</p>
                <h3 className="text-xl font-semibold text-white">{activeEntry.title}</h3>
                <p className="text-xs text-zinc-500">{getHost(activeEntry.url)}</p>
              </div>
              <div className="flex gap-2">
                <a
                  href={activeEntry.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-zinc-700 px-3 py-1 text-xs uppercase tracking-[0.3em] text-emerald-400 transition hover:border-emerald-300 hover:text-emerald-300"
                >
                  Visit original
                </a>
                <button
                  type="button"
                  onClick={() => setActiveEntry(null)}
                  className="rounded-full border border-zinc-700 px-3 py-1 text-xs uppercase tracking-[0.3em] text-zinc-400 transition hover:border-emerald-400 hover:text-emerald-400"
                >
                  Close
                </button>
              </div>
            </div>
            {activeEntry.notes && <p className="mt-2 text-sm text-zinc-400">{activeEntry.notes}</p>}
            <div className="mt-4 rounded-2xl border border-zinc-800 bg-black">
              <div
                style={{
                  paddingTop: aspectPadding[activeEntry.aspectRatio],
                  position: 'relative',
                }}
              >
                <iframe
                  title={activeEntry.title}
                  src={activeEntry.url}
                  className="absolute inset-0 h-full w-full border-0"
                  loading="lazy"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
