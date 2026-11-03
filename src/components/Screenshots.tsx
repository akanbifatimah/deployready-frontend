import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';

export interface Shot {
  src: string;
  alt: string;
  caption: string;
}

/**
 * One screenshot, or a small carousel when a step has several.
 * Clicking the image opens it full size, since dashboard text is small.
 */
export function Screenshots({ shots }: { shots: Shot[] }) {
  const [index, setIndex] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const shot = shots[index];
  const many = shots.length > 1;

  const go = (delta: number) => setIndex((i) => (i + delta + shots.length) % shots.length);

  // Arrow keys move through the carousel while the full-size view is open.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !many) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    dialog.addEventListener('keydown', onKey);
    return () => dialog.removeEventListener('keydown', onKey);
  });

  const navButton = (delta: number, className: string) => {
    const Icon = delta > 0 ? ChevronRight : ChevronLeft;
    return (
      <button
        type="button"
        onClick={() => go(delta)}
        aria-label={delta > 0 ? 'Next screenshot' : 'Previous screenshot'}
        className={`flex size-9 items-center justify-center rounded-full bg-slate-900/70 text-white ring-1 ring-white/20 backdrop-blur transition hover:bg-slate-900/90 focus-visible:outline-2 focus-visible:outline-indigo-400 ${className}`}
      >
        <Icon aria-hidden className="size-5" />
      </button>
    );
  };

  return (
    <figure className="space-y-2" aria-roledescription={many ? 'carousel' : undefined}>
      <div className="relative overflow-hidden rounded-xl bg-slate-950 ring-1 ring-slate-200 dark:ring-slate-800">
        <button
          type="button"
          onClick={() => dialogRef.current?.showModal()}
          className="group block w-full cursor-zoom-in focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          aria-label={`View full size: ${shot.alt}`}
        >
          <img src={shot.src} alt={shot.alt} loading="lazy" className="aspect-[16/7] w-full object-contain object-top" />
          <span className="absolute top-2 right-2 flex items-center gap-1 rounded-md bg-slate-900/70 px-2 py-1 text-xs font-medium text-white opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
            <Maximize2 aria-hidden className="size-3" />
            Enlarge
          </span>
        </button>
        {many && (
          <>
            {navButton(-1, 'absolute top-1/2 left-2 -translate-y-1/2')}
            {navButton(1, 'absolute top-1/2 right-2 -translate-y-1/2')}
          </>
        )}
      </div>

      <figcaption className="flex items-start justify-between gap-3 text-sm text-slate-500 dark:text-slate-400">
        <span aria-live={many ? 'polite' : undefined}>
          {many && (
            <span className="font-semibold text-slate-700 tabular-nums dark:text-slate-300">
              {index + 1}/{shots.length} ·{' '}
            </span>
          )}
          {shot.caption}
        </span>
        {many && (
          <span className="flex shrink-0 gap-1.5 pt-1.5">
            {shots.map((s, i) => (
              <button
                key={s.src}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show screenshot ${i + 1}`}
                aria-current={i === index}
                className={`h-2 rounded-full transition-all ${i === index ? 'w-5 bg-indigo-600' : 'w-2 bg-slate-300 hover:bg-slate-400 dark:bg-slate-700'}`}
              />
            ))}
          </span>
        )}
      </figcaption>

      <dialog
        ref={dialogRef}
        onClick={(e) => e.target === e.currentTarget && dialogRef.current?.close()}
        className="m-auto max-h-[95svh] max-w-[95vw] overflow-visible bg-transparent p-0 backdrop:bg-slate-950/85 backdrop:backdrop-blur-sm"
      >
        <div className="relative">
          <img src={shot.src} alt={shot.alt} className="max-h-[85svh] w-auto rounded-lg shadow-2xl" />
          <p className="mt-3 text-center text-sm text-slate-200">
            {many && `${index + 1}/${shots.length} · `}
            {shot.caption}
          </p>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label="Close"
            autoFocus
            className="absolute -top-3 -right-3 flex size-9 items-center justify-center rounded-full bg-white text-slate-900 shadow-lg focus-visible:outline-2 focus-visible:outline-indigo-400"
          >
            <X aria-hidden className="size-5" />
          </button>
          {many && (
            <>
              {navButton(-1, 'absolute top-1/2 left-3 -translate-y-1/2')}
              {navButton(1, 'absolute top-1/2 right-3 -translate-y-1/2')}
            </>
          )}
        </div>
      </dialog>
    </figure>
  );
}
