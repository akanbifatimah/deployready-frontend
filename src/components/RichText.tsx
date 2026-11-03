const codeClass =
  'rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.85em] break-words text-slate-800 dark:bg-slate-800 dark:text-slate-200';

/** Renders text with `code`, **bold** and [label](https://url) spans. */
export function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split(/(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\(https?:\/\/[^)\s]+\))/g).map((part, i) => {
        if (part.startsWith('`') && part.endsWith('`') && part.length > 1) {
          return (
            <code key={i} className={codeClass}>
              {part.slice(1, -1)}
            </code>
          );
        }
        if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
          return (
            <strong key={i} className="font-semibold text-slate-800 dark:text-slate-200">
              {part.slice(2, -2)}
            </strong>
          );
        }
        const link = part.match(/^\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)$/);
        if (link) {
          return (
            <a key={i} href={link[2]} target="_blank" rel="noreferrer" className="font-medium text-indigo-600 underline underline-offset-2 dark:text-indigo-400">
              {link[1]}
            </a>
          );
        }
        return part;
      })}
    </>
  );
}
