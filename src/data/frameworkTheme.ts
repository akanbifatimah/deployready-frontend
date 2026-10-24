import { Atom, Hexagon, Terminal, type LucideIcon } from 'lucide-react';
import type { FrameworkId } from '../types';

interface FrameworkTheme {
  icon: LucideIcon;
  shortName: string;
  /** Icon tile background + foreground. */
  iconClass: string;
  /** Soft glow behind cards on hover. */
  glowClass: string;
  /** Accent used for active framework pills. */
  activeClass: string;
}

export const FRAMEWORK_THEME: Record<FrameworkId, FrameworkTheme> = {
  react: {
    icon: Atom,
    shortName: 'React',
    iconClass: 'bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400',
    glowClass: 'from-sky-400/25',
    activeClass: 'border-sky-500 bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300',
  },
  nodejs: {
    icon: Hexagon,
    shortName: 'Node.js',
    iconClass: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400',
    glowClass: 'from-emerald-400/25',
    activeClass: 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
  },
  python: {
    icon: Terminal,
    shortName: 'Python',
    iconClass: 'bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400',
    glowClass: 'from-amber-400/25',
    activeClass: 'border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
  },
};
