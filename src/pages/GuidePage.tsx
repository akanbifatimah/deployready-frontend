import { useId, useState, type KeyboardEvent } from 'react';
import {
  ArrowLeft,
  Bug,
  ChevronDown,
  CircleAlert,
  FolderGit2,
  Hammer,
  KeyRound,
  Lightbulb,
  ListChecks,
  Lock,
  ShieldAlert,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import { Checklist } from '../components/Checklist';
import { CopyButton } from '../components/CopyButton';
import { RichText } from '../components/RichText';
import { FRAMEWORK_THEME } from '../data/frameworkTheme';
import { getGuide, guides, isFrameworkId } from '../data/guides';
import { Link, useParams } from 'react-router-dom';
import { NotFound } from './NotFound';
import { useSeo } from '../hooks/useSeo';
import type { BuildConfig, EnvVarConfig, FrameworkGuide, TroubleshootingItem } from '../types';

type TabId = 'checklist' | 'repo' | 'env' | 'build' | 'troubleshooting';

const TABS: { id: TabId; label: string; icon: LucideIcon }[] = [
  { id: 'checklist', label: 'Checklist', icon: ListChecks },
  { id: 'repo', label: 'Repo Prep', icon: FolderGit2 },
  { id: 'env', label: 'Env Variables', icon: KeyRound },
  { id: 'build', label: 'Build Config', icon: Hammer },
  { id: 'troubleshooting', label: 'Troubleshooting', icon: Bug },
];

export function GuidePage() {
  const { frameworkId = '' } = useParams<{ frameworkId: string }>();
  const guide = isFrameworkId(frameworkId) ? getGuide(frameworkId) : undefined;
  if (!guide) return <NotFound />;
  // Keyed so tab state resets when switching frameworks.
  return <GuideContent key={guide.id} guide={guide} />;
}

function GuideContent({ guide }: { guide: FrameworkGuide }) {
  useSeo({ title: `${guide.title} Deployment Guide`, description: guide.description });
  const [activeTab, setActiveTab] = useState<TabId>('checklist');
  const baseId = useId();
  const tabId = (id: TabId) => `${baseId}-tab-${id}`;
  const panelId = `${baseId}-panel`;
  const theme = FRAMEWORK_THEME[guide.id];
  const Icon = theme.icon;

  function selectTab(id: TabId) {
    setActiveTab(id);
    const tab = document.getElementById(tabId(id));
    tab?.focus();
    tab?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  }

  function handleTabKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    const index = TABS.findIndex((tab) => tab.id === activeTab);
    const nextIndex =
      e.key === 'ArrowRight'
        ? (index + 1) % TABS.length
        : e.key === 'ArrowLeft'
          ? (index - 1 + TABS.length) % TABS.length
          : e.key === 'Home'
            ? 0
            : e.key === 'End'
              ? TABS.length - 1
              : -1;
    if (nextIndex === -1) return;
    e.preventDefault();
    selectTab(TABS[nextIndex].id);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Link
        to="/"
        className="group mb-6 inline-flex items-center gap-1.5 rounded text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-indigo-500 dark:text-slate-400 dark:hover:text-white"
      >
        <ArrowLeft aria-hidden className="size-4 transition-transform group-hover:-translate-x-1" />
        All guides
      </Link>

      <header className="mb-8 flex animate-fade-in-up flex-col gap-5 sm:flex-row sm:items-start">
        <span className={`flex size-14 shrink-0 items-center justify-center rounded-2xl ${theme.iconClass}`}>
          <Icon aria-hidden className="size-7" />
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">{guide.title}</h1>
          <p className="mt-2 max-w-2xl leading-relaxed text-slate-600 dark:text-slate-400">{guide.description}</p>
          <nav aria-label="Switch framework" className="mt-4 flex flex-wrap gap-2">
            {guides.map((g) => {
              const current = g.id === guide.id;
              return (
                <Link
                  key={g.id}
                  to={`/guide/${g.id}`}
                  aria-current={current ? 'page' : undefined}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-indigo-500 ${
                    current
                      ? FRAMEWORK_THEME[g.id].activeClass
                      : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  {FRAMEWORK_THEME[g.id].shortName}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Scrolls horizontally on narrow screens; fades hint at overflow. */}
      <div className="sticky top-16 z-30 -mx-4 mb-6 border-b border-slate-200 bg-slate-50/85 px-4 backdrop-blur-lg sm:mx-0 sm:rounded-xl sm:border sm:bg-white/85 sm:p-1.5 dark:border-slate-800 dark:bg-slate-950/85 sm:dark:bg-slate-900/85">
        <div role="tablist" aria-label="Guide sections" className="no-scrollbar flex gap-1 overflow-x-auto pr-8 [mask-image:linear-gradient(to_right,black_calc(100%-2.5rem),transparent)] sm:pr-0 sm:[mask-image:none]">
          {TABS.map((tab) => {
            const selected = tab.id === activeTab;
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                id={tabId(tab.id)}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={panelId}
                tabIndex={selected ? 0 : -1}
                onClick={() => selectTab(tab.id)}
                onKeyDown={handleTabKeyDown}
                className={`relative flex shrink-0 items-center gap-2 px-3 py-3 text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-500 sm:flex-1 sm:justify-center sm:rounded-lg sm:py-2 ${
                  selected
                    ? 'text-indigo-700 sm:bg-indigo-50 dark:text-indigo-300 sm:dark:bg-indigo-500/10'
                    : 'text-slate-500 hover:text-slate-900 sm:hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white sm:dark:hover:bg-slate-800'
                }`}
              >
                <TabIcon aria-hidden className="size-4" />
                {tab.label}
                {selected && (
                  <span className="absolute inset-x-2 bottom-0 h-0.5 animate-fade-in rounded-full bg-indigo-500 sm:hidden" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div
        key={activeTab}
        id={panelId}
        role="tabpanel"
        aria-labelledby={tabId(activeTab)}
        tabIndex={0}
        className="animate-fade-in-up rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-500"
      >
        {activeTab === 'checklist' && (
          <Checklist items={guide.checklist} storageKey={`deployready:checklist:${guide.id}`} />
        )}
        {activeTab === 'repo' && <RepoPrepPanel steps={guide.repoPrep} />}
        {activeTab === 'env' && <EnvVarsPanel config={guide.envVars} />}
        {activeTab === 'build' && <BuildConfigPanel config={guide.buildConfig} />}
        {activeTab === 'troubleshooting' && <TroubleshootingPanel items={guide.troubleshooting} />}
      </div>
    </div>
  );
}

const cardClass =
  'rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900';

function SectionTitle({ children }: { children: string }) {
  return <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">{children}</h2>;
}

function RepoPrepPanel({ steps }: { steps: string[] }) {
  return (
    <section className={cardClass}>
      <SectionTitle>Prepare your repository</SectionTitle>
      <ol className="space-y-4">
        {steps.map((step, i) => (
          <li key={step} className="flex animate-fade-in-up gap-3 sm:gap-4" style={{ animationDelay: `${i * 60}ms` }}>
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
              {i + 1}
            </span>
            <p className="min-w-0 pt-0.5 leading-relaxed text-slate-700 dark:text-slate-300">
              <RichText text={step} />
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function EnvVarsPanel({ config }: { config: EnvVarConfig }) {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:p-6 dark:border-amber-900/50 dark:bg-amber-950/20">
        <h2 className="mb-3 flex items-center gap-2 font-semibold text-amber-900 dark:text-amber-200">
          <ShieldAlert aria-hidden className="size-5" />
          Rules to follow
        </h2>
        <ul className="space-y-2.5">
          {config.rules.map((rule) => (
            <li key={rule} className="flex gap-2.5 text-sm leading-relaxed text-amber-900/90 dark:text-amber-100/80">
              <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-amber-500" />
              <span className="min-w-0">
                <RichText text={rule} />
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <SectionTitle>Variables</SectionTitle>
        <div className="grid gap-4 md:grid-cols-2">
          {config.variables.map((variable, i) => (
            <article
              key={variable.key}
              className={`${cardClass} animate-fade-in-up transition hover:-translate-y-0.5 hover:shadow-md`}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <code className="min-w-0 font-mono text-sm font-semibold break-all text-slate-900 dark:text-slate-100">
                  {variable.key}
                </code>
                <CopyButton value={variable.key} label="Copy variable name" />
              </div>
              <div className="mb-3 flex flex-wrap gap-1.5">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    variable.required
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {variable.required ? 'Required' : 'Optional'}
                </span>
                {variable.secret && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-500/15 dark:text-red-300">
                    <Lock aria-hidden className="size-3" />
                    Secret
                  </span>
                )}
              </div>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{variable.description}</p>
              <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 font-mono text-xs break-all text-slate-600 dark:bg-slate-950 dark:text-slate-400">
                <span className="text-slate-400 select-none dark:text-slate-500">e.g. </span>
                {variable.example}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function CommandRow({ label, command }: { label: string; command: string | null }) {
  return (
    <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-4">
      <dt className="w-24 shrink-0 text-sm font-medium text-slate-500 dark:text-slate-400">{label}</dt>
      <dd className="flex min-w-0 flex-1 items-center gap-2 rounded-lg bg-slate-900 py-1.5 pr-1.5 pl-3 dark:bg-slate-950 dark:ring-1 dark:ring-slate-800">
        {command ? (
          <>
            <code className="no-scrollbar min-w-0 flex-1 overflow-x-auto font-mono text-sm whitespace-nowrap text-emerald-300">
              <span className="text-slate-500 select-none">$ </span>
              {command}
            </code>
            <CopyButton value={command} label={`Copy ${label.toLowerCase()} command`} />
          </>
        ) : (
          <span className="py-1 text-sm text-slate-400 italic">Not required</span>
        )}
      </dd>
    </div>
  );
}

function BuildConfigPanel({ config }: { config: BuildConfig }) {
  const facts = [
    { label: 'Runtime', value: config.runtime },
    { label: 'Output directory', value: config.outputDirectory ?? '—' },
    { label: 'Default port', value: config.port?.toString() ?? 'Static (none)' },
  ];

  return (
    <div className="space-y-6">
      <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        {facts.map((fact, i) => (
          <div key={fact.label} className={`${cardClass} animate-fade-in-up`} style={{ animationDelay: `${i * 60}ms` }}>
            <dt className="text-xs font-medium tracking-wide text-slate-500 uppercase dark:text-slate-400">{fact.label}</dt>
            <dd className="mt-1 font-semibold break-words text-slate-900 dark:text-white">{fact.value}</dd>
          </div>
        ))}
      </dl>

      <section className={cardClass}>
        <SectionTitle>Commands</SectionTitle>
        <dl className="space-y-3">
          <CommandRow label="Install" command={config.installCommand} />
          <CommandRow label="Build" command={config.buildCommand} />
          <CommandRow label="Start" command={config.startCommand} />
        </dl>
      </section>

      {config.notes.length > 0 && (
        <section className="rounded-2xl border border-sky-200 bg-sky-50 p-4 sm:p-6 dark:border-sky-900/50 dark:bg-sky-950/20">
          <h2 className="mb-3 flex items-center gap-2 font-semibold text-sky-900 dark:text-sky-200">
            <Lightbulb aria-hidden className="size-5" />
            Notes
          </h2>
          <ul className="space-y-2.5">
            {config.notes.map((note) => (
              <li key={note} className="flex gap-2.5 text-sm leading-relaxed text-sky-900/90 dark:text-sky-100/80">
                <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-sky-500" />
                <span className="min-w-0">
                  <RichText text={note} />
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function TroubleshootingPanel({ items }: { items: TroubleshootingItem[] }) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <details
          key={item.error}
          name="troubleshooting"
          className="group animate-fade-in-up overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow open:shadow-md dark:border-slate-800 dark:bg-slate-900"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <summary className="flex cursor-pointer list-none items-start gap-3 p-4 transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-500 sm:p-5 dark:hover:bg-slate-800/50 [&::-webkit-details-marker]:hidden">
            <CircleAlert aria-hidden className="mt-0.5 size-5 shrink-0 text-red-500" />
            <code className="min-w-0 flex-1 font-mono text-sm leading-relaxed break-words text-slate-800 dark:text-slate-200">
              {item.error}
            </code>
            <ChevronDown
              aria-hidden
              className="mt-0.5 size-5 shrink-0 text-slate-400 transition-transform duration-300 group-open:rotate-180"
            />
          </summary>
          <div className="grid animate-fade-in gap-4 border-t border-slate-100 p-4 sm:grid-cols-2 sm:p-5 dark:border-slate-800">
            <div>
              <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
                <Bug aria-hidden className="size-3.5" />
                Cause
              </p>
              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                <RichText text={item.cause} />
              </p>
            </div>
            <div className="rounded-lg bg-emerald-50 p-3 dark:bg-emerald-950/30">
              <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold tracking-wide text-emerald-700 uppercase dark:text-emerald-400">
                <Wrench aria-hidden className="size-3.5" />
                Fix
              </p>
              <p className="text-sm leading-relaxed text-emerald-900 dark:text-emerald-100/90">
                <RichText text={item.fix} />
              </p>
            </div>
          </div>
        </details>
      ))}
    </div>
  );
}
