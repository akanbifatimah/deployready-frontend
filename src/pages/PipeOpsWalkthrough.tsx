import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  AppWindow,
  ArrowDown,
  Check,
  FolderGit2,
  GitBranch,
  Globe,
  Hammer,
  Info,
  KeyRound,
  Laptop,
  LayoutDashboard,
  LogIn,
  RotateCcw,
  ScrollText,
  ShieldAlert,
  SlidersHorizontal,
  type LucideIcon,
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { CodeBlock } from '../components/CodeBlock';
import { RichText } from '../components/RichText';
import { Screenshots } from '../components/Screenshots';
import { FRAMEWORK_THEME } from '../data/frameworkTheme';
import { FRAMEWORK_IDS, isFrameworkId } from '../data/guides';
import { WALKTHROUGH_STACKS, type WalkthroughStack } from '../data/walkthroughStacks';
import { useSeo } from '../hooks/useSeo';
import type { FrameworkId } from '../types';
import { NotFound } from './NotFound';

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

const shot = (file: string, alt: string, caption: string) => ({ src: `/walkthrough/${file}.png`, alt, caption });

function makeSteps(id: FrameworkId, stack: WalkthroughStack): Step[] {
  return [
    {
      id: 'verify-locally',
      icon: Laptop,
      title: 'Verify the production build locally',
      summary: 'Catch errors on your machine before PipeOps does.',
      body: (
        <>
          <Paragraph text="Run the same commands the build server will run, from a clean install. If this fails locally it will fail on PipeOps too." />
          <CodeBlock code={stack.verifyCommands} />
          <Paragraph text={stack.verifyNote} />
        </>
      ),
    },
    {
      id: 'push-repo',
      icon: FolderGit2,
      title: 'Push your code to GitHub',
      summary: 'PipeOps deploys from your repository, so commit everything it needs.',
      body: (
        <>
          <BulletList items={stack.pushItems} />
          <CodeBlock code={'git add .\ngit commit -m "chore: prepare for deployment"\ngit push origin main'} />
        </>
      ),
    },
    {
      id: 'sign-in',
      icon: LogIn,
      title: 'Sign in to PipeOps',
      summary: 'Create an account or sign in at pipeops.io.',
      body: (
        <>
          <Paragraph text="Go to [pipeops.io](https://pipeops.io) and click **Sign in**, or **Get started** if you don't have an account yet. You'll land on the PipeOps console at `console.pipeops.io`." />
          <Screenshots shots={[shot('01-pipeops-home', 'PipeOps homepage with Sign in and Get started buttons in the top right', 'pipeops.io: use Sign in or Get started in the top right.')]} />
        </>
      ),
    },
    {
      id: 'new-project',
      icon: LayoutDashboard,
      title: 'Start a new project',
      summary: 'Open the + New menu and choose Deploy Project.',
      body: (
        <>
          <Paragraph text="The dashboard opens on **My Projects**, which lists everything you've already deployed with its status (for example `RUNNING`). The left sidebar has Servers, AddOns, Integrations and more, but you don't need them for a first deploy." />
          <Paragraph text="Click **+ New** in the top-right corner and pick **Deploy Project**." />
          <Screenshots
            shots={[
              shot('02-dashboard', 'PipeOps dashboard showing the My Projects list', 'The dashboard. Existing projects show their region and status.'),
              shot('03-new-deploy-project', 'The + New dropdown open with Deploy Project as the first option', '+ New → Deploy Project.'),
            ]}
          />
        </>
      ),
    },
    {
      id: 'project-type',
      icon: AppWindow,
      title: 'Choose the Web project type',
      summary: 'Web covers frontends, APIs and full-stack apps.',
      body: (
        <>
          <Paragraph text="On **Choose a Project Type**, select **Web**. It builds and deploys straight from your source code, so it's the right choice for React, Node.js and Python apps." />
          <BulletList
            items={[
              '**Container Registry**: you already have a Docker image on Docker Hub or another registry.',
              '**Database**: a managed database service for your app to connect to.',
              '**Worker (Runner)**: background jobs and queue processors with no public URL.',
            ]}
          />
          {id !== 'react' && (
            <Hint>
              <p>
                <RichText text="Need a database? Deploy it first as a separate **Database** project, then copy its connection string into `DATABASE_URL` in step 9." />
              </p>
            </Hint>
          )}
          <Screenshots shots={[shot('04-project-type', 'Choose a Project Type screen with Web, Container Registry, Database and Worker cards', 'Pick Web for an app built from a Git repository.')]} />
        </>
      ),
    },
    {
      id: 'connect-repo',
      icon: GitBranch,
      title: 'Connect GitHub and pick your repo',
      summary: 'Install the PipeOps Git app, then select the repository and branch.',
      body: (
        <>
          <Paragraph text="Keep the default **From Repository** tab. (**From Templates** starts from a PipeOps starter project instead.)" />
          <Paragraph text="The first time, click **Install PipeOps Git**. GitHub opens and asks which repositories PipeOps may access. Approve it and you're sent back to PipeOps." />
          <Hint>
            <p>
              <RichText text="On GitHub, choosing **Only select repositories** is safer than granting access to everything. You can add more repos later from your GitHub settings under Applications." />
            </p>
          </Hint>
          <Paragraph text="Pick your account or organisation from the **Select / Add Organisation** dropdown. Your repositories load below. Search for the one to deploy, select it, choose the branch (usually `main`) and click **Proceed**." />
          <Screenshots
            shots={[
              shot('05-install-pipeops-git', 'Deploy From A Repository screen prompting to Install PipeOps Git', 'First time only: install the PipeOps Git app on GitHub.'),
              shot('06-select-repository', 'Repository list after selecting a GitHub account', 'Select your account, then the repository.'),
              shot('07-select-branch', 'Branch list with main selected and the Proceed button enabled', 'Select the branch to deploy and click Proceed.'),
            ]}
          />
          <Hint>
            <p>
              <RichText text="PipeOps redeploys automatically whenever you push to this branch, so pick the branch that holds production-ready code." />
            </p>
          </Hint>
        </>
      ),
    },
    {
      id: 'project-summary',
      icon: SlidersHorizontal,
      title: 'Name the project and set resources',
      summary: 'Review the project name, environment, server and CPU/memory.',
      body: (
        <>
          <Paragraph text="**Project Summary** is filled in with defaults. Check each field, then click **Proceed**." />
          <BulletList
            items={[
              '**Project Name**: PipeOps suggests a random name like `tangible-flock`. Change it to something meaningful, because it also becomes your default URL. Our project, `deploy-ready`, is served at `deploy-ready.abj.pipeops.app`.',
              '**Environment**: the stage this deployment belongs to.',
              '**Server**: where the app runs. The region (for example `Ng-Central-1`) decides which users get the lowest latency.',
              `**CPU and Memory**: ${stack.resourcesNote} **View Guide** explains the options.`,
            ]}
          />
          <Screenshots shots={[shot('08-project-summary', 'Project Summary screen with project name, environment, server and resource sliders', 'Project Summary: rename the project before you continue.')]} />
        </>
      ),
    },
    {
      id: 'build-settings',
      icon: Hammer,
      title: 'Configure build settings',
      summary: 'Pick the framework and check networking before deploying.',
      body: (
        <>
          <Paragraph text="**Project Build Settings** is where PipeOps learns how to build and run your app. The left side covers the build. The right side covers networking and environment variables." />
          <BulletList
            items={[
              stack.frameworkChoice,
              '**Build Method**: how the image is built. The default works for a standard project.',
              '**Advanced Settings**: override the install, build or start commands if your project differs from the defaults.',
              `**Release Command**: runs on every deploy before the new version goes live, with a 10-minute timeout. ${stack.releaseCommand}`,
              '**Ask Ora**: PipeOps’ AI assistant. Ask it to suggest settings or explain a failed build.',
              '**Networking**: shows your public URL and the **Port** traffic is sent to, which must match the port your app listens on. From here you can **Generate Domain**, add a **Custom Domain**, or open a **TCP Proxy** for non-HTTP services.',
              ...stack.buildNotes,
            ]}
          />
          <Paragraph text={`For reference, a ${stack.label} app needs these settings:`} />
          <CodeBlock label="Build settings" code={stack.buildCommands} />
          <Screenshots
            shots={[
              shot(
                '09-build-settings',
                'Project Build Settings with the Framework dropdown open',
                id === 'react'
                  ? 'Framework dropdown, with Networking and your public URL on the right.'
                  : `Framework dropdown (shown on a React project). Scroll the list to find the ${stack.label} option.`,
              ),
            ]}
          />
        </>
      ),
    },
    {
      id: 'env-vars',
      icon: KeyRound,
      title: 'Add environment variables',
      summary: 'Set every variable your app needs before the first build.',
      body: (
        <>
          <Paragraph text="Under **Environment Variables**, click **+ Add Env** once for each variable in your `.env.example`, using production values. PipeOps makes them available at build time and at runtime, and masks the values on screen." />
          <CodeBlock label="Example values" code={stack.envExample} />
          <BulletList items={stack.envNotes} />
          <Hint tone="warning">
            <p className="font-semibold">{stack.envWarningTitle}</p>
            <p>
              <RichText text={stack.envWarning} />
            </p>
          </Hint>
          <Screenshots shots={[shot('10-env-variables', 'Environment Variables panel with variables added and values masked', 'Environment variables. Values are masked once saved.')]} />
          <Paragraph text="When everything is set, click the blue **Deploy Project** button in the top-right corner." />
        </>
      ),
    },
    {
      id: 'deploy',
      icon: ScrollText,
      title: 'Watch the deployment',
      summary: 'Follow the build logs in the Deployment Pipeline.',
      body: (
        <>
          <Paragraph text="The page scrolls to the **Deployment Pipeline**, and the status in the top right switches to **BUILDING**. The log streams each stage live: fetching your commit, installing dependencies, running the build, then **DEPLOY**." />
          <Paragraph text={stack.logNote} />
          <CodeBlock label={stack.expectedLogLabel} code={stack.expectedLog} />
          <Screenshots shots={[shot('11-deploy-logs', 'Deployment Pipeline streaming build logs with status BUILDING', 'Build logs stream live. Notices like "New major version of npm available" are safe to ignore.')]} />
          <Hint>
            <p>
              Build failed? Read the last red lines of the log, use <strong>Ask Ora</strong> next to the pipeline, or check the{' '}
              <Link to={`/guide/${id}`} className="font-semibold underline underline-offset-2">
                {FRAMEWORK_THEME[id].shortName} guide&apos;s Troubleshooting tab
              </Link>
              . After fixing it, push again or click <strong>Rerun Deployment</strong>.
            </p>
          </Hint>
        </>
      ),
    },
    {
      id: 'go-live',
      icon: Globe,
      title: 'Open your live app',
      summary: 'Use the Live Url button, then smoke-test the deployment.',
      body: (
        <>
          <Paragraph text="When the deploy finishes, the project overview shows **Your App Is Running!** and the deployment is marked **LIVE** under Recent Activity. Click **Live Url** in the top right to open your app and copy its address." />
          <Screenshots shots={[shot('12-live', 'Deploy-Ready project overview showing App Status running, resource usage and a LIVE deployment', 'Our own project, live. Live Url is in the top right.')]} />
          <Paragraph text="Then check that it really works:" />
          <BulletList
            items={[
              ...stack.checks,
              'Use the **History**, **Metrics**, **Logs** and **Events** tabs to see past deploys, resource usage and runtime output.',
            ]}
          />
          <Hint>
            <p>
              This site was deployed exactly this way. See it live at{' '}
              <a href="https://deploy-ready.abj.pipeops.app/" target="_blank" rel="noreferrer" className="font-semibold underline underline-offset-2">
                deploy-ready.abj.pipeops.app
              </a>
              .
            </p>
          </Hint>
        </>
      ),
    },
  ];
}

function loadCompleted(key: string): Set<string> {
  try {
    const raw = localStorage.getItem(key);
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

const scrollToStep = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

export function PipeOpsWalkthrough() {
  const { frameworkId = 'react' } = useParams();
  if (!isFrameworkId(frameworkId)) return <NotFound />;
  // Remount per stack so progress state loads from that stack's storage key.
  return <Walkthrough key={frameworkId} id={frameworkId} />;
}

function Walkthrough({ id }: { id: FrameworkId }) {
  const stack = WALKTHROUGH_STACKS[id];
  useSeo({
    title: `Deploy ${stack.label} to PipeOps`,
    description: `A step-by-step, interactive guide to deploying a ${stack.label} app on PipeOps, with real dashboard screenshots: connecting GitHub, build settings, environment variables and going live.`,
  });

  const steps = useMemo(() => makeSteps(id, stack), [id, stack]);
  const stepIds = useMemo(() => steps.map((step) => step.id), [steps]);
  const [completed, setCompleted] = useState(() => loadCompleted(stack.storageKey));
  const activeId = useActiveStep(stepIds);

  useEffect(() => {
    try {
      localStorage.setItem(stack.storageKey, JSON.stringify([...completed]));
    } catch {
      // Progress just won't persist.
    }
  }, [completed, stack.storageKey]);

  const toggleStep = (id: string) =>
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const completeAndContinue = (index: number) => {
    setCompleted((prev) => new Set(prev).add(steps[index].id));
    const nextStep = steps[index + 1];
    if (nextStep) scrollToStep(nextStep.id);
  };

  const doneCount = steps.filter((step) => completed.has(step.id)).length;
  const percent = Math.round((doneCount / steps.length) * 100);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <header className="mx-auto mb-10 max-w-3xl animate-fade-in-up text-center sm:mb-14">
        <p className="mb-3 text-sm font-semibold tracking-wide text-indigo-600 uppercase dark:text-indigo-400">
          PipeOps Walkthrough · {stack.label}
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-balance text-slate-900 sm:text-4xl dark:text-white">
          Deploy your {stack.appNoun} to PipeOps, step by step
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-slate-600 dark:text-slate-400">
          Work through each step and tick it off as you go. Your progress is saved in this browser. The screenshots come
          from deploying this site; click any of them to enlarge it.
        </p>
        <nav aria-label="Switch stack" className="mt-6 flex flex-wrap justify-center gap-2">
          {FRAMEWORK_IDS.map((fid) => {
            const current = fid === id;
            const { icon: StackIcon, shortName, activeClass } = FRAMEWORK_THEME[fid];
            return (
              <Link
                key={fid}
                to={`/walkthrough/${fid}`}
                aria-current={current ? 'page' : undefined}
                className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-indigo-500 ${
                  current
                    ? activeClass
                    : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <StackIcon aria-hidden className="size-4" />
                {shortName}
              </Link>
            );
          })}
        </nav>
      </header>

      {/* Progress: sticky under the header on small screens. */}
      <div className="sticky top-16 z-20 -mx-4 mb-8 border-b border-slate-200 bg-slate-50/90 px-4 py-3 backdrop-blur-lg sm:mx-0 sm:rounded-xl sm:border lg:hidden dark:border-slate-800 dark:bg-slate-950/90">
        <ProgressBar percent={percent} doneCount={doneCount} total={steps.length} />
      </div>

      <div className="lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-10">
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-5">
            <ProgressBar percent={percent} doneCount={doneCount} total={steps.length} />
            <nav aria-label="Walkthrough steps">
              <ol className="space-y-1">
                {steps.map((step, i) => {
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
          {steps.map((step, i) => {
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
                      Step {i + 1} of {steps.length}
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
                  {i < steps.length - 1 ? (
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
          <p className="mt-2 text-emerald-50">Deploying another part of your stack? The same steps work with a few changes.</p>
          <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
            {FRAMEWORK_IDS.filter((fid) => fid !== id).map((fid) => (
              <Link
                key={fid}
                to={`/walkthrough/${fid}`}
                className="rounded-xl bg-white/15 px-5 py-2.5 font-semibold ring-1 ring-white/30 transition hover:bg-white/25"
              >
                {FRAMEWORK_THEME[fid].shortName} walkthrough
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function ProgressBar({ percent, doneCount, total }: { percent: number; doneCount: number; total: number }) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between text-sm">
        <span className="font-semibold text-slate-900 tabular-nums dark:text-white">{percent}% complete</span>
        <span className="text-slate-500 tabular-nums dark:text-slate-400">
          {doneCount}/{total} steps
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
