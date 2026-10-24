/** Renders text with `backtick` spans as inline code. */
export function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split(/(`[^`]+`)/g).map((part, i) =>
        part.startsWith('`') && part.endsWith('`') && part.length > 1 ? (
          <code
            key={i}
            className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.85em] break-words text-slate-800 dark:bg-slate-800 dark:text-slate-200"
          >
            {part.slice(1, -1)}
          </code>
        ) : (
          part
        ),
      )}
    </>
  );
}
