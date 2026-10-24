import { useEffect, useState, type ReactNode } from 'react';
import {
  ArrowDown,
  Check,
  FolderGit2,
  Globe,
  Hammer,
  ImageIcon,
  Info,
  KeyRound,
  Laptop,
  Link2,
  RotateCcw,
  ScrollText,
  ShieldAlert,
  type LucideIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { CodeBlock } from '../components/CodeBlock';
import { RichText } from '../components/RichText';
import { useSeo } from '../hooks/useSeo';

const STORAGE_KEY = 'deployready:walkthrough:react-vite';

interface Step {
  id: string;
  icon: LucideIcon;
  title: string;
  summary: string;
  body: ReactNode;
}

function Hint({ tone = 'info', children }: { tone?: 'info' | 'warning'; children: ReactNode }) {
  const styles =
    tone === 'warning'
      ? 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-100/90'
      : 'border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-900/50 dark:bg-sky-950/20 dark:text-sky-100/90';
  const Icon = tone === 'warning' ? ShieldAlert : Info;
  return (
    <div className={`flex gap-3 rounded-xl border p-4 text-sm leading-relaxed ${styles}`}>
      <Icon aria-hidden className="mt-0.5 size-4 shrink-0" />
      <div className="min-w-0 space-y-1">{children}</div>
    </div>
  );
}

function ScreenshotPlaceholder({ caption }: { caption: string }) {
  return (
    <figure className="flex aspect-video flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/80 p-4 text-center dark:border-slate-700 dark:bg-slate-900/40">
      <ImageIcon aria-hidden className="size-8 text-slate-400 dark:text-slate-500" />
      <figcaption className="max-w-xs text-sm text-slate-500 dark:text-slate-400">
        <span className="block font-medium text-slate-600 dark:text-slate-300">Screenshot placeholder</span>
        {caption}
      </figcaption>
    </figure>
  );
}

function Paragraph({ text }: { text: string }) {
  return (
    <p className="leading-relaxed text-slate-600 dark:text-slate-400">
      <RichText text={text} />
    </p>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-indigo-500" />
          <span className="min-w-0">
            <RichText text={item} />
          </span>
        </li>
      ))}
    </ul>
  );
}

const STEPS: Step[] = [
  {
    id: 'verify-locally',
    icon: Laptop,
    title: 'Verify the production build locally',
    summary: 'Catch type and build errors before PipeOps does.',
    body: (
      <>
        <Paragraph text="Run the exact commands the build server will run, from a clean install. If this fails locally it will fail on PipeOps too." />
        <CodeBlock code={'npm ci\nnpm run build\nnpm run preview'} />
        <Paragraph text="Open the preview URL and click through every route. Refresh on a nested page like `/guide/react` to make sure client-side routing works." />
      </>
    ),
  },
  {
    id: 'push-repo',
    icon: FolderGit2,
    title: 'Push your code to Git',
    summary: 'PipeOps deploys from your repository, so commit everything it needs.',
    body: (
      <>
        <BulletList
          items={[
            'Commit `package-lock.json` so installs are reproducible.',
            'Make sure `.gitignore` excludes `node_modules`, `dist` and `.env`.',
            'Add a `.env.example` listing every `VITE_` variable with placeholder values.',
          ]}
        />
        <CodeBlock code={'git add .\ngit commit -m "chore: prepare for deployment"\ngit push origin main'} />
      </>
    ),
  },
  {
    id: 'create-project',
    icon: Link2,
    title: 'Connect your repository on PipeOps',
    summary: 'Authorize your Git provider and pick the repo and branch to deploy.',
    body: (
      <>
        <Paragraph text="From the PipeOps dashboard, create a new project, connect the Git provider that hosts your code, then select this repository and the branch you deploy from (usually `main`)." />
        <ScreenshotPlaceholder caption="PipeOps — creating a new project and selecting the repository and branch." />
        <Hint>
          <p>Dashboard labels can change between PipeOps releases. If a step looks different, look for the equivalent option.</p>
        </Hint>
      </>
    ),
  },
  {
    id: 'build-settings',
    icon: Hammer,
    title: 'Configure build settings',
    summary: 'Tell PipeOps how to install, build and serve a Vite app.',
    body: (
      <>
        <Paragraph text="A Vite React app compiles to static files. Use these values in the build configuration:" />
        <CodeBlock
          label="Build settings"
          code={['Install command:   npm ci', 'Build command:     npm run build', 'Output directory:  dist', 'Node.js version:   20 or newer'].join('\n')}
        />
        <ScreenshotPlaceholder caption="PipeOps — build configuration with install command, build command and output directory filled in." />
        <Hint>
          <p>
            <RichText text="Pin the Node.js version with an `engines` field in `package.json` so the build server matches your machine." />
          </p>
        </Hint>
        <CodeBlock label="package.json" code={'"engines": {\n  "node": ">=20"\n}'} />
      </>
    ),
  },
  {
    id: 'env-vars',
    icon: KeyRound,
    title: 'Add environment variables',
    summary: 'Set every VITE_ variable before the first build runs.',
    body: (
      <>
        <Paragraph text="Add each variable from your `.env.example` in the project's environment settings on PipeOps, using production values." />
        <CodeBlock label=".env.example" code={'VITE_SITE_URL=https://your-app.example.com\nVITE_API_URL=https://api.example.com'} />
        <Hint tone="warning">
          <p className="font-semibold">VITE_ variables are public.</p>
          <p>
            <RichText text="Anything prefixed with `VITE_` is bundled into the JavaScript that every visitor downloads. Never put API secrets, database URLs or private keys in them." />
          </p>
        </Hint>
        <Hint>
          <p>
            <RichText text="Vite inlines these values at build time. After changing one, trigger a new build. Restarting the app is not enough." />
          </p>
        </Hint>
        <ScreenshotPlaceholder caption="PipeOps — environment variables panel with VITE_SITE_URL and VITE_API_URL added." />
      </>
    ),
  },
  {
    id: 'spa-routing',
    icon: ScrollText,
    title: 'Handle client-side routes',
    summary: 'Make deep links like /guide/react load the app instead of a 404.',
    body: (
      <>
        <Paragraph text="React Router handles URLs in the browser, but the server receives the first request. Every unknown path must fall back to `index.html`." />
        <Paragraph text="If you serve `dist` from your own container, an nginx rule like this does it:" />
        <CodeBlock label="nginx.conf" code={'location / {\n  try_files $uri $uri/ /index.html;\n}'} />
        <Hint>
          <p>Test it after deploying: open a nested page directly and refresh. If you get a 404, the fallback isn&apos;t configured.</p>
        </Hint>
      </>
    ),
  },
  {
    id: 'deploy',
    icon: ArrowDown,
    title: 'Deploy and watch the logs',
    summary: 'Start the deployment and follow the build output.',
    body: (
      <>
        <Paragraph text="Trigger the deployment and keep the build logs open. A healthy Vite build ends with a list of files written to `dist/`." />
        <CodeBlock
          label="Expected build output"
          code={'vite building for production...\n✓ modules transformed.\ndist/index.html\ndist/assets/index-[hash].css\ndist/assets/index-[hash].js\n✓ built in 1.6s'}
        />
        <ScreenshotPlaceholder caption="PipeOps — deployment build logs showing a successful Vite build." />
        <Hint>
          <p>
            Build failed? The <Link to="/guide/react" className="font-semibold underline underline-offset-2">React guide&apos;s Troubleshooting tab</Link> covers the most common errors.
          </p>
        </Hint>
      </>
    ),
  },
  {
    id: 'go-live',
    icon: Globe,
    title: 'Verify and go live',
    summary: 'Smoke-test the live URL, then add your domain.',
    body: (
      <>
        <BulletList
          items={[
            'Open the generated URL and check the browser console for errors.',
            'Refresh a nested route to confirm the SPA fallback works.',
            'Check the Network tab: API calls should hit your production `VITE_API_URL`, not localhost.',
            'Attach your custom domain, then update `VITE_SITE_URL` to match and rebuild so share links are correct.',
          ]}
        />
        <ScreenshotPlaceholder caption="PipeOps — live deployment with its public URL and custom domain settings." />
      </>
    ),
  },
];

function loadCompleted(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

/** Tracks which step is currently in view for the sidebar highlight. */
function useActiveStep(ids: string[]) {
  const [activeId, setActiveId] = useState(ids[0]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      // Treat the band just below the sticky header as "current".
      { rootMargin: '-80px 0px -60% 0px' },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);

  return activeId;
}

const STEP_IDS = STEPS.map((step) => step.id);

const scrollToStep = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

export function PipeOpsWalkthrough() {
  useSeo({
    title: 'Deploy React + Vite to PipeOps',
    description:
      'A step-by-step, interactive guide to deploying a React and Vite app on PipeOps: build settings, environment variables, SPA routing and going live.',
  });

  const [completed, setCompleted] = useState(loadCompleted);
  const activeId = useActiveStep(STEP_IDS);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed]));
    } catch {
      // Progress just won't persist.
    }
  }, [completed]);

  const toggleStep = (id: string) =>
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const completeAndContinue = (index: number) => {
    setCompleted((prev) => new Set(prev).add(STEPS[index].id));
    const nextStep = STEPS[index + 1];
    if (nextStep) scrollToStep(nextStep.id);
  };

  const doneCount = STEPS.filter((step) => completed.has(step.id)).length;
  const percent = Math.round((doneCount / STEPS.length) * 100);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <header className="mx-auto mb-10 max-w-3xl animate-fade-in-up text-center sm:mb-14">
        <p className="mb-3 text-sm font-semibold tracking-wide text-indigo-600 uppercase dark:text-indigo-400">
          PipeOps Walkthrough · React + Vite
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-balance text-slate-900 sm:text-4xl dark:text-white">
          Deploy your React app to PipeOps, step by step
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-slate-600 dark:text-slate-400">
          Work through each step and tick it off as you go. Your progress is saved in this browser. Dashboard labels on
          PipeOps may differ slightly from the descriptions here.
        </p>
      </header>

      {/* Progress: sticky under the header on small screens. */}
      <div className="sticky top-16 z-20 -mx-4 mb-8 border-b border-slate-200 bg-slate-50/90 px-4 py-3 backdrop-blur-lg sm:mx-0 sm:rounded-xl sm:border lg:hidden dark:border-slate-800 dark:bg-slate-950/90">
        <ProgressBar percent={percent} doneCount={doneCount} />
      </div>

      <div className="lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-10">
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-5">
            <ProgressBar percent={percent} doneCount={doneCount} />
            <nav aria-label="Walkthrough steps">
              <ol className="space-y-1">
                {STEPS.map((step, i) => {
                  const done = completed.has(step.id);
                  const active = step.id === activeId;
                  return (
                    <li key={step.id}>
                      <button
                        type="button"
                        onClick={() => scrollToStep(step.id)}
                        aria-current={active ? 'step' : undefined}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-indigo-500 ${
                          active
                            ? 'bg-indigo-50 font-semibold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-white'
                        }`}
                      >
                        <span
                          className={`flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                            done
                              ? 'bg-emerald-500 text-white'
                              : active
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                          }`}
                        >
                          {done ? <Check aria-hidden className="size-3.5 animate-pop" strokeWidth={3} /> : i + 1}
                        </span>
                        <span className="min-w-0 truncate">{step.title}</span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </nav>
            {doneCount > 0 && (
              <button
                type="button"
                onClick={() => setCompleted(new Set())}
                className="flex animate-fade-in items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                <RotateCcw aria-hidden className="size-3.5" />
                Reset progress
              </button>
            )}
          </div>
        </aside>

        <ol className="space-y-6 sm:space-y-8">
          {STEPS.map((step, i) => {
            const done = completed.has(step.id);
            const Icon = step.icon;
            return (
              <li
                key={step.id}
                id={step.id}
                className={`scroll-mt-36 animate-fade-in-up rounded-2xl border bg-white shadow-sm transition-colors duration-300 lg:scroll-mt-24 dark:bg-slate-900 ${
                  done ? 'border-emerald-300 dark:border-emerald-800' : 'border-slate-200 dark:border-slate-800'
                }`}
                style={{ animationDelay: `${Math.min(i, 3) * 80}ms` }}
              >
                <div className="flex items-start gap-4 border-b border-slate-100 p-5 sm:p-6 dark:border-slate-800">
                  <span
                    className={`flex size-11 shrink-0 items-center justify-center rounded-xl transition-colors ${
                      done
                        ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400'
                        : 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400'
                    }`}
                  >
                    {done ? <Check aria-hidden className="size-5 animate-pop" strokeWidth={2.5} /> : <Icon aria-hidden className="size-5" />}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                      Step {i + 1} of {STEPS.length}
                    </p>
                    <h2 className="mt-0.5 text-lg font-semibold text-slate-900 sm:text-xl dark:text-white">{step.title}</h2>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{step.summary}</p>
                  </div>
                </div>

                <div className="space-y-4 p-5 sm:p-6">{step.body}</div>

                <div className="flex flex-col-reverse gap-2 border-t border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:border-slate-800">
                  <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-1 py-1.5 text-sm font-medium text-slate-700 select-none dark:text-slate-300">
                    <input type="checkbox" checked={done} onChange={() => toggleStep(step.id)} className="peer sr-only" />
                    <span
                      aria-hidden
                      className={`flex size-5 items-center justify-center rounded-md border-2 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-500 peer-focus-visible:ring-offset-2 dark:peer-focus-visible:ring-offset-slate-900 ${
                        done ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300 dark:border-slate-600'
                      }`}
                    >
                      {done && <Check className="size-3.5 animate-pop" strokeWidth={3} />}
                    </span>
                    Mark as done
                  </label>
                  {i < STEPS.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => completeAndContinue(i)}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 active:translate-y-0"
                    >
                      Done, next step
                      <ArrowDown aria-hidden className="size-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setCompleted((prev) => new Set(prev).add(step.id))}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-emerald-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 active:translate-y-0"
                    >
                      Finish walkthrough
                      <Check aria-hidden className="size-4" />
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {percent === 100 && (
        <section
          role="status"
          className="mt-12 animate-fade-in-up rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-center text-white shadow-xl shadow-emerald-600/20 sm:p-8"
        >
          <p className="text-2xl font-bold">🎉 Your app is live on PipeOps</p>
          <p className="mt-2 text-emerald-50">Deploying an API too? The Node.js and Python guides cover server apps.</p>
          <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/guide/nodejs" className="rounded-xl bg-white/15 px-5 py-2.5 font-semibold ring-1 ring-white/30 transition hover:bg-white/25">
              Node.js guide
            </Link>
            <Link to="/guide/python" className="rounded-xl bg-white/15 px-5 py-2.5 font-semibold ring-1 ring-white/30 transition hover:bg-white/25">
              Python guide
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}

function ProgressBar({ percent, doneCount }: { percent: number; doneCount: number }) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between text-sm">
        <span className="font-semibold text-slate-900 tabular-nums dark:text-white">{percent}% complete</span>
        <span className="text-slate-500 tabular-nums dark:text-slate-400">
          {doneCount}/{STEPS.length} steps
        </span>
      </div>
      <div
        role="progressbar"
        aria-label="Walkthrough progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
      >
        <div
          className={`h-full rounded-full bg-gradient-to-r transition-all duration-700 ease-out ${
            percent === 100 ? 'from-emerald-400 to-emerald-600' : 'from-indigo-400 to-violet-600'
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
