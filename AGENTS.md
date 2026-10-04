# AGENTS.md

## Commands
- `npm run dev` = `tsx server.ts`: one process runs Express on :3000 **and** mounts Vite in middleware mode. Never start `vite` separately — there is no standalone frontend dev server.
- `npm run lint` = `tsc --noEmit` (TypeScript 7.0.2) — the only check, currently clean. There are no tests, no ESLint/Prettier, and no CI workflows.
- `npm run build` = client bundle only → `dist/` (index.html + assets).
- `npm start` (`node dist/server.js`) and `npm run clean` reference a server bundle that no script produces — treat as stale; don't rely on them without verifying.

## Env vars (real gotchas)
- `.env` is **never loaded automatically**: `dotenv` is installed but never imported, and tsx does not read `.env`. Verified: `npx tsx -e "console.log(process.env.MONGODB_URI)"` → unset.
- To use the file: `npx tsx --env-file=.env server.ts`, or export vars in the shell.
- Missing `MONGODB_URI` does not stop boot, but `/api/history`, `/api/settings`, `/api/stats` hang until the client times out instead of returning an error.
- `GEMINI_API_KEY` is read once at import (`server.ts:88`) — restart the server after changing it.
- Key precedence for images/text: `process.env.OPENAI_API_KEY` → `x-openai-key` header → `openaiApiKey` in body (`server.ts:179`). If the env var is set, the key entered in the UI (IntegrationsModal) is ignored.
- README's "put the key in `.env.local`" is stale boilerplate; trust `.env.example`.

## Architecture
- `server.ts` (~980 lines) is the whole backend: all `/api/*` routes, Mongoose models, and dev/prod static serving. Frontend entry: `index.html` → `src/main.tsx` → `src/App.tsx`; UI lives in `src/components/`.
- Path alias `@` resolves to the **repo root**, not `src/` (set in both `vite.config.ts` and `tsconfig.json`).
- Persistence is scoped by a random `deviceId` generated into localStorage (`src/utils/storage.ts`); history/settings/stats are per-device, so "missing data" usually means a new deviceId, not a DB failure.
- API surface used by the UI: `POST /api/generate/{omni,text,code,image}`, `POST /api/github/push`, `POST /api/social/publish`, `GET|POST /api/history`, `GET /api/stats`, `GET|POST /api/settings`.

## Deploy (Vercel)
- `vercel.json`: build `vite build`, output `dist`, rewrite `/api/*` → `api` function, everything else → `index.html`.
- `api/index.ts` default-exports the Express app from `../server.js`. `server.ts` only calls `listen()` when `process.env.VERCEL` is unset — preserve that guard around `setupVite()`.
- The `DISABLE_HMR` block in `vite.config.ts` is intentional (AI Studio disables HMR/file watching during agent edits). Do not modify it.

## Misc
- Both `package-lock.json` and `bun.lock` exist; `package-lock.json` is the one kept in sync with `node_modules`. Use npm, don't regenerate the bun lockfile.
- `README.md` is AI Studio boilerplate and partly out of date — prefer config and `.env.example` over it.
