import { Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FRAMEWORK_THEME } from '../data/frameworkTheme';
import { guides } from '../data/guides';

const YEAR = new Date().getFullYear();

const linkClass =
  'rounded text-sm text-slate-500 transition-colors hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:text-slate-400 dark:hover:text-white';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/60 dark:border-slate-800 dark:bg-slate-950/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="sm:col-span-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-500"
          >
            <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
              <Rocket aria-hidden className="size-4" />
            </span>
            <span className="font-bold tracking-tight text-slate-900 dark:text-white">
              Deploy<span className="text-indigo-600 dark:text-indigo-400">Ready</span>
            </span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            Interactive deployment checklists, environment variable guides and fixes for React, Node.js and Python
            apps.
          </p>
        </div>

        <nav aria-label="Guides">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Guides</h2>
          <ul className="mt-4 space-y-3">
            {guides.map((guide) => (
              <li key={guide.id}>
                <Link to={`/guide/${guide.id}`} className={linkClass}>
                  {FRAMEWORK_THEME[guide.id].shortName}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Resources">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Resources</h2>
          <ul className="mt-4 space-y-3">
            <li>
              <Link to="/walkthrough" className={linkClass}>
                PipeOps walkthrough
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-slate-200 dark:border-slate-800">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-slate-500 sm:flex-row sm:px-6 lg:px-8 dark:text-slate-400">
          <p>&copy; {YEAR} DeployReady. All rights reserved.</p>
          <p>Built for shipping with confidence.</p>
        </div>
      </div>
    </footer>
  );
}
