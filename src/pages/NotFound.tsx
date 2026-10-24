import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSeo } from '../hooks/useSeo';

export function NotFound() {
  useSeo({ title: 'Page not found', description: "The page you're looking for doesn't exist or has moved.", noIndex: true });

  return (
    <main className="mx-auto flex max-w-xl animate-fade-in-up flex-col items-center px-4 py-24 text-center">
      <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">404</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Page not found</h1>
      <p className="mt-3 text-slate-600 dark:text-slate-400">The page you're looking for doesn't exist or has moved.</p>
      <Link
        to="/"
        className="group mt-8 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
      >
        <ArrowLeft aria-hidden className="size-4 transition-transform group-hover:-translate-x-1" />
        Back to home
      </Link>
    </main>
  );
}
