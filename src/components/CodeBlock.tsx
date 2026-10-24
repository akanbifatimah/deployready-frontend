import { CopyButton } from './CopyButton';

interface CodeBlockProps {
  code: string;
  /** Shown in the title bar, e.g. a filename or "Terminal". */
  label?: string;
}

export function CodeBlock({ code, label = 'Terminal' }: CodeBlockProps) {
  return (
    <div className="overflow-hidden rounded-xl bg-slate-900 ring-1 ring-slate-800 dark:bg-slate-950">
      <div className="flex items-center justify-between gap-2 border-b border-slate-800 py-1.5 pr-1.5 pl-4">
        <div className="flex min-w-0 items-center gap-2">
          <span aria-hidden className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-red-400/80" />
            <span className="size-2.5 rounded-full bg-amber-400/80" />
            <span className="size-2.5 rounded-full bg-emerald-400/80" />
          </span>
          <span className="truncate font-mono text-xs text-slate-400">{label}</span>
        </div>
        <CopyButton value={code} label={`Copy ${label}`} />
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed text-slate-100">
        <code>{code}</code>
      </pre>
    </div>
  );
}
