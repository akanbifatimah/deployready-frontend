import { CirclePlay, Newspaper, type LucideIcon } from 'lucide-react';

export interface ExternalLink {
  label: string;
  /** Fuller label for the mobile menu and footer. */
  longLabel: string;
  /** Longer name for screen readers and tooltips. */
  title: string;
  href: string;
  icon: LucideIcon;
  /** Tailwind text colour for the icon. */
  iconClass: string;
}

/** The video and article that walk through deploying on PipeOps. */
export const EXTERNAL_LINKS: ExternalLink[] = [
  {
    label: 'Video',
    longLabel: 'Watch the video',
    title: 'Watch the PipeOps deployment video on YouTube',
    href: 'https://youtu.be/tFDvL0mHPDM',
    icon: CirclePlay,
    iconClass: 'text-red-500',
  },
  {
    label: 'Article',
    longLabel: 'Read the article',
    title: 'Read "How to Deploy Your App on PipeOps in 10 Steps" on Medium',
    href: 'https://medium.com/@fatimahakanbi/how-to-deploy-your-app-on-pipeops-in-10-steps-f2b45c93a593',
    icon: Newspaper,
    iconClass: 'text-slate-700 dark:text-slate-200',
  },
];
