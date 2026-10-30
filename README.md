# DeployReady

DeployReady is an interactive assistant for developers who can run an app locally and need a clear path to get it online. It covers environment variables, build and start commands, repository setup, and the errors that usually show up on the first deploy.

The app is a React + Vite site. Guide content lives in one file, `src/data/deploymentData.json`. There is no backend.

## Guides

Each guide has five sections: Checklist, Repo Prep, Env Variables, Build Config, and Troubleshooting. Checklist ticks and walkthrough progress are saved in the browser.

| Stack | What it covers |
| --- | --- |
| React (Vite) | Static site build, `VITE_` env vars, SPA routing |
| Node.js | API server, `PORT`, start command, health checks |
| Python | Django, Flask, or FastAPI behind Gunicorn or Uvicorn |

A separate page walks through deploying a React + Vite app on [PipeOps](https://pipeops.io).

## Run locally

```bash
npm install
npm run dev
```

Then open the URL Vite prints, usually `http://localhost:5173`.

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Typecheck and build for production |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run Oxlint |

## Built by

- [okekevicktur](https://github.com/okekevicktur)
- [akanbifatimah](https://github.com/akanbifatimah)
- [udebeulah@gmail.com](mailto:udebeulah@gmail.com)
- [onyeokorochioma@gmail.com](mailto:onyeokorochioma@gmail.com)
- [nunsiomi@gmail.com](mailto:nunsiomi@gmail.com)
