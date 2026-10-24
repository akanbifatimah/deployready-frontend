import { useEffect, useState } from 'react';
import { Check, PartyPopper, RotateCcw } from 'lucide-react';
import type { ChecklistItem } from '../types';
import { RichText } from './RichText';

interface ChecklistProps {
  items: ChecklistItem[];
  /** When set, progress is remembered in localStorage under this key. */
  storageKey?: string;
}

function loadChecked(storageKey: string | undefined): Set<string> {
  if (!storageKey) return new Set();
  try {
    const raw = localStorage.getItem(storageKey);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

export function Checklist({ items, storageKey }: ChecklistProps) {
  const [checked, setChecked] = useState(() => loadChecked(storageKey));

  useEffect(() => {
    if (!storageKey) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify([...checked]));
    } catch {
      // Progress just won't persist.
    }
  }, [checked, storageKey]);

  const toggle = (id: string) =>
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const doneCount = items.filter((item) => checked.has(item.id)).length;
  const percent = items.length ? Math.round((doneCount / items.length) * 100) : 0;
  const complete = percent === 100;
  const barColor = complete
    ? 'from-emerald-400 to-emerald-600'
    : percent >= 50
      ? 'from-indigo-400 to-violet-600'
      : 'from-amber-400 to-orange-500';

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums sm:text-3xl dark:text-white">
              {percent}% Ready
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {doneCount} of {items.length} tasks complete
            </p>
          </div>
          {doneCount > 0 && (
            <button
              type="button"
              onClick={() => setChecked(new Set())}
              className="flex animate-fade-in items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-2 focus-visible:outline-indigo-500 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <RotateCcw aria-hidden className="size-3.5" />
              Reset
            </button>
          )}
        </div>
        <div
          role="progressbar"
          aria-label="Deployment readiness"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
          className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
        >
          <div
            className={`relative h-full rounded-full bg-gradient-to-r transition-all duration-700 ease-out ${barColor}`}
            style={{ width: `${percent}%` }}
          >
            <span className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent" />
          </div>
        </div>
        {complete && (
          <p
            role="status"
            className="mt-3 flex animate-fade-in-up items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-400"
          >
            <PartyPopper aria-hidden className="size-4 animate-pop" />
            All set — you&apos;re ready to deploy!
          </p>
        )}
      </div>

      <ul className="space-y-3">
        {items.map((item, index) => {
          const isChecked = checked.has(item.id);
          return (
            <li key={item.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
              <label
                className={`group flex cursor-pointer gap-3 rounded-xl border p-4 transition-all duration-200 sm:gap-4 ${
                  isChecked
                    ? 'border-emerald-200 bg-emerald-50/60 dark:border-emerald-900/60 dark:bg-emerald-950/20'
                    : 'border-slate-200 bg-white hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-700'
                }`}
              >
                <input type="checkbox" checked={isChecked} onChange={() => toggle(item.id)} className="peer sr-only" />
                <span
                  aria-hidden
                  className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-500 peer-focus-visible:ring-offset-2 dark:peer-focus-visible:ring-offset-slate-900 ${
                    isChecked
                      ? 'border-emerald-500 bg-emerald-500 text-white'
                      : 'border-slate-300 group-hover:border-indigo-400 dark:border-slate-600'
                  }`}
                >
                  {isChecked && <Check className="size-3.5 animate-pop" strokeWidth={3} />}
                </span>
                <span className="min-w-0 space-y-1">
                  <span
                    className={`block font-medium transition-colors ${
                      isChecked
                        ? 'text-slate-500 line-through decoration-emerald-500/60 dark:text-slate-400'
                        : 'text-slate-900 dark:text-slate-100'
                    }`}
                  >
                    {item.task}
                  </span>
                  <span className="block text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    <RichText text={item.description} />
                  </span>
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
