import { useEffect, useState } from 'react';
import { Menu, Rocket, X } from 'lucide-react';
import { Link, NavLink, useLocation, useMatch } from 'react-router-dom';
import { TipButton } from './TipButton';

const NAV_LINKS: { label: string; to: string }[] = [
  { label: 'Home', to: '/' },
  { label: 'PipeOps Walkthrough', to: '/walkthrough' },
];

export function Header() {
  const { pathname } = useLocation();
  const onGuidePage = useMatch('/guide/:frameworkId') !== null;
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the mobile menu whenever the route changes or Escape is pressed.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMenuOpen(false);
  }
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  // Guide pages are reached from Home, so keep "Home" highlighted there too.
  const isActive = (to: string, navActive: boolean) => navActive || (to === '/' && onGuidePage);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/75 backdrop-blur-lg dark:border-slate-800/80 dark:bg-slate-950/75">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="group flex items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-500"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/30 transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110">
            <Rocket aria-hidden className="size-5" />
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            Deploy<span className="text-indigo-600 dark:text-indigo-400">Ready</span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              end
              className={({ isActive: navActive }) =>
                `relative rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-indigo-500 ${
                  isActive(link.to, navActive)
                    ? 'text-slate-900 dark:text-white'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-white'
                }`
              }
            >
              {({ isActive: navActive }) => (
                <>
                  {link.label}
                  {isActive(link.to, navActive) && (
                    <span className="absolute inset-x-3 -bottom-[13px] h-0.5 animate-fade-in rounded-full bg-indigo-500" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:block">
          <TipButton />
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-indigo-500 md:hidden dark:text-slate-300 dark:hover:bg-slate-800"
        >
          {menuOpen ? <X aria-hidden className="size-5 animate-pop" /> : <Menu aria-hidden className="size-5" />}
        </button>
      </div>

      {menuOpen && (
        <div
          id="mobile-menu"
          className="animate-slide-down border-t border-slate-200 bg-white px-4 pt-3 pb-5 shadow-lg md:hidden dark:border-slate-800 dark:bg-slate-950"
        >
          <nav aria-label="Mobile" className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                end
                className={({ isActive: navActive }) =>
                  `rounded-lg px-3 py-2.5 text-base font-medium ${
                    isActive(link.to, navActive)
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300'
                      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-4 border-t border-slate-200 pt-4 empty:hidden dark:border-slate-800">
            <TipButton fullWidth />
          </div>
        </div>
      )}
    </header>
  );
}
