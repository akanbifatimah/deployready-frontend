import { ArrowRight, Bug, KeyRound, ListChecks, Sparkles, Zap } from 'lucide-react';
import { FRAMEWORK_THEME } from '../data/frameworkTheme';
import { guides } from '../data/guides';
import { Link } from 'react-router-dom';
import { useSeo } from '../hooks/useSeo';

const FEATURES = [
  { icon: ListChecks, title: 'Pre-flight checklists', text: 'Tick off every step before you ship.' },
  { icon: KeyRound, title: 'Env variable rules', text: 'Know what is public, secret and required.' },
  { icon: Bug, title: 'Fixes for real errors', text: 'Common failures, causes and the fix.' },
];

export function Home() {
  useSeo({
    description:
      'Interactive deployment checklists, environment variable guides and troubleshooting fixes for React, Node.js and Python apps. Ship to PipeOps with confidence.',
  });

  return (
    <>
      <section className="relative isolate overflow-hidden">
        {/* Decorative background */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-32 left-1/2 h-[28rem] w-[56rem] max-w-[200vw] -translate-x-1/2 rounded-full bg-gradient-to-tr from-indigo-400/30 via-violet-400/20 to-sky-300/20 blur-3xl dark:from-indigo-600/25 dark:via-violet-600/15 dark:to-sky-500/10" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(148_163_184/0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgb(148_163_184/0.12)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_70%)] bg-[size:3rem_3rem]" />
        </div>

        <div className="mx-auto max-w-6xl px-4 pt-16 pb-14 text-center sm:px-6 sm:pt-24 sm:pb-20 lg:px-8">
          <p className="mx-auto mb-6 inline-flex animate-fade-in-up items-center gap-2 rounded-full border border-indigo-200 bg-white/70 px-3.5 py-1.5 text-xs font-medium text-indigo-700 shadow-sm backdrop-blur sm:text-sm dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300">
            <Sparkles aria-hidden className="size-4" />
            Your interactive deployment co-pilot
          </p>
          <h1
            className="mx-auto max-w-3xl animate-fade-in-up text-4xl font-extrabold tracking-tight text-balance text-slate-900 sm:text-5xl lg:text-6xl dark:text-white"
            style={{ animationDelay: '80ms' }}
          >
            Ship your app{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-500 bg-clip-text text-transparent dark:from-indigo-400 dark:via-violet-400 dark:to-sky-400">
              without the guesswork
            </span>
          </h1>
          <p
            className="mx-auto mt-6 max-w-2xl animate-fade-in-up text-base leading-relaxed text-pretty text-slate-600 sm:text-lg dark:text-slate-400"
            style={{ animationDelay: '160ms' }}
          >
            DeployReady walks you through everything between &ldquo;it works on my machine&rdquo; and a healthy
            production deploy — checklists, environment variables, build commands and fixes for the errors you&apos;re
            most likely to hit.
          </p>
          <div
            className="mt-8 flex animate-fade-in-up flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center"
            style={{ animationDelay: '240ms' }}
          >
            <button
              type="button"
              onClick={() => document.getElementById('frameworks')?.scrollIntoView({ behavior: 'smooth' })}
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:-translate-y-0.5 hover:bg-indigo-500 hover:shadow-xl hover:shadow-indigo-600/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 active:translate-y-0"
            >
              Choose your stack
              <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
            </button>
            <Link
              to="/walkthrough"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white/70 px-6 py-3 font-semibold text-slate-700 backdrop-blur transition hover:-translate-y-0.5 hover:border-slate-400 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 active:translate-y-0 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:bg-slate-900"
            >
              <Zap aria-hidden className="size-4 text-amber-500" />
              PipeOps walkthrough
            </Link>
          </div>

          <ul className="mx-auto mt-14 grid max-w-4xl gap-3 text-left sm:grid-cols-3 sm:gap-4">
            {FEATURES.map(({ icon: Icon, title, text }, i) => (
              <li
                key={title}
                className="flex animate-fade-in-up items-start gap-3 rounded-xl border border-slate-200/80 bg-white/60 p-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/50"
                style={{ animationDelay: `${320 + i * 80}ms` }}
              >
                <Icon aria-hidden className="mt-0.5 size-5 shrink-0 text-indigo-500" />
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="frameworks" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mb-8 text-center sm:mb-10">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            Pick a deployment guide
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Step-by-step prep tailored to your framework.</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {guides.map((guide, i) => {
            const theme = FRAMEWORK_THEME[guide.id];
            const Icon = theme.icon;
            return (
              <Link
                key={guide.id}
                to={`/guide/${guide.id}`}
                className="group relative flex animate-fade-in-up flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-slate-300 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div
                  aria-hidden
                  className={`pointer-events-none absolute -top-24 -right-24 size-48 rounded-full bg-gradient-to-br to-transparent opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100 ${theme.glowClass}`}
                />
                <span
                  className={`mb-5 flex size-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 ${theme.iconClass}`}
                >
                  <Icon aria-hidden className="size-6" />
                </span>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{guide.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {guide.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 dark:bg-slate-800">
                    {guide.checklist.length} checks
                  </span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 dark:bg-slate-800">
                    {guide.envVars.variables.length} env vars
                  </span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 dark:bg-slate-800">
                    {guide.troubleshooting.length} fixes
                  </span>
                </div>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                  Open guide
                  <ArrowRight aria-hidden className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
