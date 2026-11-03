import type { FrameworkId } from '../types';

/**
 * The parts of the PipeOps walkthrough that differ per stack. Everything else
 * (signing in, connecting GitHub, the screenshots) is shared.
 * Strings support `code`, **bold** and [links](https://…) via RichText.
 */
export interface WalkthroughStack {
  /** Shown in the eyebrow, e.g. "React + Vite". */
  label: string;
  /** Completes "Deploy your … to PipeOps". */
  appNoun: string;
  storageKey: string;
  verifyCommands: string;
  verifyNote: string;
  pushItems: string[];
  frameworkChoice: string;
  /** Extra build-settings bullets for this stack. */
  buildNotes: string[];
  buildCommands: string;
  releaseCommand: string;
  resourcesNote: string;
  envExample: string;
  envNotes: string[];
  envWarningTitle: string;
  envWarning: string;
  expectedLogLabel: string;
  expectedLog: string;
  logNote: string;
  checks: string[];
}

export const WALKTHROUGH_STACKS: Record<FrameworkId, WalkthroughStack> = {
  react: {
    label: 'React + Vite',
    appNoun: 'React app',
    storageKey: 'deployready:walkthrough:react-vite',
    verifyCommands: 'npm ci\nnpm run build\nnpm run preview',
    verifyNote:
      'Open the preview URL and click through every route. Refresh on a nested page like `/guide/react` to make sure client-side routing works.',
    pushItems: [
      'Commit `package-lock.json`. PipeOps installs with `npm ci`, which fails if the lockfile is missing or out of sync.',
      'Make sure `.gitignore` excludes `node_modules`, `dist` and `.env`.',
      'Add a `.env.example` listing every `VITE_` variable with placeholder values.',
    ],
    frameworkChoice:
      '**Framework**: choose **ReactJs**. The list also includes Html, VueJs, NuxtJs and other frontend frameworks.',
    buildNotes: [],
    buildCommands: ['Install command:   npm ci', 'Build command:     npm run build', 'Output directory:  dist', 'Node.js version:   20 or newer'].join('\n'),
    releaseCommand: 'Leave it empty. A static React site has no database to migrate.',
    resourcesNote: 'The defaults are plenty for a static React site.',
    envExample: 'VITE_SITE_URL=https://deploy-ready.abj.pipeops.app\nHOST=0.0.0.0\nPORT=5127',
    envNotes: [
      '`VITE_SITE_URL` is your live URL, used for share links and SEO tags. If it is missing, those tags are wrong in production.',
      '`HOST=0.0.0.0` makes the server accept traffic from outside its container. `localhost` only accepts connections from inside it.',
      '`PORT` must match the port shown under Networking.',
      'Vite copies `VITE_` values into the bundle at build time. After changing one, redeploy. Restarting is not enough.',
    ],
    envWarningTitle: 'VITE_ variables are public.',
    envWarning:
      'Anything prefixed with `VITE_` is bundled into the JavaScript that every visitor downloads. Never put API secrets, database URLs or private keys in them.',
    expectedLogLabel: 'Expected build output',
    expectedLog:
      'vite building for production...\n✓ modules transformed.\ndist/index.html\ndist/assets/index-[hash].css\ndist/assets/index-[hash].js\n✓ built in 1.6s',
    logNote: 'A healthy Vite build ends with a list of files written to `dist/`:',
    checks: [
      'Open the browser console on the live site and check for errors.',
      'Open a nested route like `/guide/react` directly and refresh. If it returns 404, the server isn’t falling back to `index.html`.',
      'Check the Network tab: API calls should go to your production URL, not `localhost`.',
    ],
  },

  nodejs: {
    label: 'Node.js',
    appNoun: 'Node.js API',
    storageKey: 'deployready:walkthrough:nodejs',
    verifyCommands: 'npm ci\nnpm run build   # skip if there is no compile step\nPORT=8080 npm start',
    verifyNote:
      'Then call `http://localhost:8080/health` (or any route) to confirm the server answers when started with the production command, not `nodemon`.',
    pushItems: [
      'Commit `package-lock.json`. PipeOps installs with `npm ci`, which fails if the lockfile is missing or out of sync.',
      'Make sure `"start"` in `package.json` runs the production server, e.g. `node dist/index.js`.',
      'Keep runtime packages like `dotenv` or `express` in `dependencies`, not `devDependencies`.',
      'Make sure `.gitignore` excludes `node_modules` and `.env`, and add a `.env.example`.',
    ],
    frameworkChoice:
      '**Framework**: choose the Node.js option, or your server framework (such as Express) if it is listed. The screenshot shows the frontend list. Backend runtimes are further down the same dropdown.',
    buildNotes: [
      'Your server must listen on `process.env.PORT` and bind to `0.0.0.0`. A hard-coded port fails the health check.',
    ],
    buildCommands: ['Install command:   npm ci', 'Build command:     npm run build   (omit for plain JavaScript)', 'Start command:     npm start', 'Node.js version:   20 LTS'].join('\n'),
    releaseCommand:
      'Put database migrations here, e.g. `npx prisma migrate deploy` or `npm run migrate`, so they run once per deploy before the new version takes traffic.',
    resourcesNote:
      'Start with the defaults. Raise memory if the logs show `JavaScript heap out of memory`.',
    envExample:
      'NODE_ENV=production\nPORT=8080\nDATABASE_URL=postgresql://user:password@host:5432/dbname?sslmode=require\nJWT_SECRET=<random 64-char string>\nCORS_ORIGIN=https://your-frontend.abj.pipeops.app',
    envNotes: [
      '`NODE_ENV=production` turns on framework optimisations and hides stack traces from users.',
      '`PORT` must match the port shown under Networking.',
      '`CORS_ORIGIN` is the URL of the frontend allowed to call this API.',
    ],
    envWarningTitle: 'Keep secrets in PipeOps only.',
    envWarning:
      'Values like `DATABASE_URL` and `JWT_SECRET` belong here and nowhere else. Never commit them to Git or paste them into frontend code.',
    expectedLogLabel: 'Expected app output',
    expectedLog: '> api@1.0.0 start\n> node dist/index.js\n\nServer listening on http://0.0.0.0:8080',
    logNote: 'After the build, open **View App Logs**. A healthy server logs that it is listening on the right host and port:',
    checks: [
      'Call your health route on the live URL, e.g. `/health`, and expect a 200 response.',
      'Call the API from your deployed frontend and check the browser console for CORS errors.',
      'Watch **Logs** while you make a few requests to catch errors that only happen in production.',
    ],
  },

  python: {
    label: 'Python',
    appNoun: 'Python app',
    storageKey: 'deployready:walkthrough:python',
    verifyCommands:
      'python -m venv .venv && source .venv/bin/activate\npip install -r requirements.txt\ngunicorn myproject.wsgi:application --bind 0.0.0.0:8000',
    verifyNote:
      'Use the same server you will run in production (Gunicorn or Uvicorn), not `manage.py runserver` or `flask run`. For FastAPI: `uvicorn main:app --host 0.0.0.0 --port 8000`.',
    pushItems: [
      'Pin every dependency in `requirements.txt` (`pip freeze > requirements.txt`), including `gunicorn` or `uvicorn`.',
      'Add a `.python-version` or `runtime.txt` file so PipeOps uses the same Python version as you.',
      'Make sure `.gitignore` excludes `.venv`, `__pycache__` and `.env`, and add a `.env.example`.',
    ],
    frameworkChoice:
      '**Framework**: choose the Python option, or Django, Flask or FastAPI if it is listed. The screenshot shows the frontend list. Backend runtimes are further down the same dropdown.',
    buildNotes: [
      'Set the start command under **Advanced Settings** if PipeOps doesn’t detect it. Bind to `0.0.0.0:$PORT`.',
    ],
    buildCommands: [
      'Install command:   pip install -r requirements.txt',
      'Build command:     python manage.py collectstatic --noinput   (Django)',
      'Start command:     gunicorn myproject.wsgi:application --bind 0.0.0.0:$PORT',
      'Python version:    3.12',
    ].join('\n'),
    releaseCommand:
      'For Django, put `python manage.py migrate --noinput` here so the database schema is updated on every deploy. Flask and FastAPI apps use their own migration tool, e.g. `alembic upgrade head`.',
    resourcesNote:
      'Each Gunicorn worker uses its own memory. Raise memory, or lower `--workers`, if workers get killed.',
    envExample:
      'PORT=8000\nSECRET_KEY=<random 50-char string>\nDATABASE_URL=postgresql://user:password@host:5432/dbname\nDEBUG=False\nALLOWED_HOSTS=your-app.abj.pipeops.app\nPYTHONUNBUFFERED=1',
    envNotes: [
      '`DEBUG=False` is required in production. Debug mode shows your settings and code to anyone who hits an error.',
      '`ALLOWED_HOSTS` must include your PipeOps domain, or Django answers with `DisallowedHost`.',
      '`PYTHONUNBUFFERED=1` makes log output appear in PipeOps immediately.',
      '`PORT` must match the port shown under Networking.',
    ],
    envWarningTitle: 'Keep secrets in PipeOps only.',
    envWarning:
      'Values like `SECRET_KEY` and `DATABASE_URL` belong here and nowhere else. Never commit them or leave them hard-coded in `settings.py`.',
    expectedLogLabel: 'Expected app output',
    expectedLog:
      '[INFO] Starting gunicorn 22.0.0\n[INFO] Listening at: http://0.0.0.0:8000\n[INFO] Using worker: sync\n[INFO] Booting worker with pid: 8',
    logNote: 'After the build, open **View App Logs**. A healthy app shows Gunicorn listening and booting its workers:',
    checks: [
      'Open the live URL. A plain error page (not the yellow Django debug page) means `DEBUG` is off.',
      'Load the Django admin and check its CSS appears. If it doesn’t, static files weren’t collected or served.',
      'Watch **Logs** for `WORKER TIMEOUT` or tracebacks while you click around.',
    ],
  },
};
