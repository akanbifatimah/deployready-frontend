import { useEffect, useState } from 'react';
import { Check, Copy } from 'lucide-react';

export function CopyButton({ value, label = 'Copy' }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(timer);
  }, [copied]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      // Clipboard API unavailable (insecure context or permission denied).
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? 'Copied' : `${label}: ${value}`}
      title={copied ? 'Copied!' : label}
      className="shrink-0 rounded-md p-1.5 text-slate-400 transition hover:bg-slate-200/70 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-indigo-500 active:scale-90 dark:hover:bg-slate-700/60 dark:hover:text-slate-200"
    >
      {copied ? (
        <Check aria-hidden className="size-4 animate-pop text-emerald-500" />
      ) : (
        <Copy aria-hidden className="size-4" />
      )}
    </button>
  );
}
