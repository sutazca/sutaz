<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Operating Principles (applies to ALL work in this workspace)

These are the durable rules for this workspace. Follow them exactly. They persist
across every session via this file.

## 1. Facts only — no speculation, no assumptions
- Never state something as fact without verifying it against the code, logs, or
  official docs. If you haven't checked it, don't claim it.
- When you reference something specific (a version, an API, a path, a config),
  confirm it actually exists before answering.
- If a value is unknown, say "unknown — need to verify" rather than guessing.

## 2. Research before writing code
- Before adding a dependency, calling an API, or changing config, look up the
  OFFICIAL documentation and confirm the current version + correct usage.
- Source priority: official framework docs > canonical registries (npm) >
  Stack Overflow > peer-reviewed (arXiv). Do not treat unofficial blogs as
  primary sources.
- Verify exact versions from the live registry (`registry.npmjs.org`), not from
  search summaries.
- Cross-reference any documented info against the actual codebase before acting.

## 3. Root cause, not symptom
- When you find a bug, find the ROOT CAUSE and fix it. Do not skip, patch over,
  or defer. Cross-reference and fix properly.
- Example method: reproduce → read the real error → trace to source → fix →
  verify the test that caught it now passes.

## 4. No mocks — real tests only
- Test against real implementations, real browsers, real data. No mocks/stubs
  to make a test "pass." If something is hard to test, build the harness.

## 5. Verify before claiming done
- Run the actual verification command (build, test, curl, E2E) and report the
  REAL output. Never claim "passes" without showing the evidence.
- A clean production build + a green E2E run is the bar for "done."

## 6. Multi-step workflow on every non-trivial task
research → cross-reference → root cause → fix bugs → test → deliver complete

## 7. Honest reporting
- If a step was skipped, say so. If a test fails, show the output. If something
  is a draft pending sign-off (e.g. legal copy, ecosystem content), mark it
  explicitly. No "it works" without proof.

## 8. Parallel agent teams for independent work
- When facing 2+ independent tasks with no shared state, dispatch them in
  parallel. Do not serialize work that can run concurrently.

# Project scope — IMPORTANT (do not conflate)

This workspace is **sutaz.ca** — a Next.js marketing website at
`C:\Users\root\Desktop\sutaz.ca` (Windows).

There is a SEPARATE project, **SutazAI** (an AI platform on a Dell R720 / Pi 5 /
Hailo NPU, docs at `/opt/sutazaiapp/docs/`), that is a DIFFERENT project on a
DIFFERENT machine. Do NOT assume SutazAI docs, paths, or context apply here.
If the user references SutazAI, verify which machine/project is meant first.

# E2E testing harness (verified working)

This project has real browser E2E via Playwright + axe-core:
- `@playwright/test@1.61.1` + `@axe-core/playwright@4.12.1` (devDependencies)
- Chromium headless shell installed via `npx playwright install chromium`
- Tests in `e2e/` — run against a **production build** (`next start`), NOT the
  dev server (Turbopack dev can't sustain parallel test load and times out).

How to run E2E (real, end-to-end):
```bash
# 1. Build production bundle (webpack — Turbopack crashes on Tailwind v4 CSS)
node node_modules/next/dist/bin/next build --webpack
# 2. Serve it
PORT=3999 node node_modules/next/dist/bin/next start -p 3999 &
# 3. Run the suite (functional + WCAG 2.2 AA accessibility)
node node_modules/@playwright/test/cli.js test
```

Known gotcha (verified): the standalone `server.js` output can serve a stale
render even after a fresh build — prefer `next start` for testing because it
reads the canonical `.next` directory directly.
