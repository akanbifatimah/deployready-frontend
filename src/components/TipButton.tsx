import { CupSoda } from 'lucide-react';

// Set VITE_TIP_URL in .env (and in the PipeOps build environment) to show the button.
const rawTipUrl = import.meta.env.VITE_TIP_URL?.trim() ?? '';
// Only allow https links so a misconfigured value can't inject a javascript: URL.
const TIP_URL = /^https:\/\//i.test(rawTipUrl) ? rawTipUrl : null;

export function TipButton({ fullWidth = false }: { fullWidth?: boolean }) {
  if (!TIP_URL) return null;

  return (
    <a
      href={TIP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`group inline-flex items-center justify-center gap-2 rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-amber-950 shadow-sm shadow-amber-500/20 transition hover:-translate-y-0.5 hover:bg-amber-300 hover:shadow-md hover:shadow-amber-500/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 active:translate-y-0 ${
        fullWidth ? 'w-full py-2.5' : ''
      }`}
    >
      <CupSoda aria-hidden className="size-4 transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110" />
      Buy us a drink
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
