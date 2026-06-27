# sutaz.ca

Enterprise-grade marketing + lead-capture site for a Canadian B2B workflow-automation agency. The site **is** the proof of capability — it cannot look generic.

**Live:** http://192.168.100.250:8093 (LAN) · https://sutaz.ca (public, pending TLS)

## Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router, webpack build, React 19) |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS v4 (CSS-first `@theme`, no config file) |
| UI primitives | shadcn/ui (base-nova style, Base UI) + custom components |
| Animation | `motion` v12 (`motion/react`) |
| Fonts | Fraunces (display serif, opsz) + Geist (body) + JetBrains Mono |
| DB | PostgreSQL 16 (self-hosted in the compose stack) |
| Validation | zod v4 |
| Forms | react-hook-form |
| Deployment | Docker (multi-stage standalone) on Synology DS723+ |

## Design language — Engineering-Luxury

Dark-navy dominant (`#0F172A` base), single sharp teal accent (`#0D9488`/`#0F766E`).
Editorial serif headlines over a Swiss grotesque body. Glass-morphism cards,
engineering-grid texture, real motion choreography. Linear/Vercel/Stripe-press density.

## Routes

- `/` — Homepage: editorial hero + interactive ROI "terminal" calculator, problem/solution pairs, 5-vertical preview, FAQ (FAQPage JSON-LD)
- `/services` — **Flagship**: 120+ engineered services across 5 verticals (Real Estate, Construction, Marketing, E-Commerce, Professional Services) with Engineering Moat filters
- `/ecosystems` — Three vertical deep-dives with animated workflow wireframes (Service JSON-LD)
- `/lab` — 4-phase engineering timeline + sandbox isolation diagram (verbatim from the blueprint)
- `/contact` — Minimal-noise booking page
- `/api/leads` · `/api/roi-calculate` · `/api/calendly/webhook` — zod-validated, parameterized queries

## Database

Self-hosted Postgres 16 (no Supabase). Least-privilege `sutaz_app` role (cannot bulk-read leads — column-level SELECT grants only). Schema + dedup-then-seed for 210 source rows → 143 unique Canadian leads.

## Develop

```bash
pnpm install
pnpm dev          # Turbopack dev server
pnpm build        # webpack production build (Turbopack has a CSS-module-graph bug here)
pnpm start
pnpm lint
```

## Deploy

```bash
# On the NAS: /volume1/docker/sutazca/
docker compose up -d --build
```

`.env` (mode 600) holds `POSTGRES_PASSWORD`, `POSTGRES_APP_PASSWORD` (both `openssl rand -base64 32`), `DATABASE_URL`, public Calendly/site vars, and `CALENDLY_WEBHOOK_SIGNING_KEY`. Never committed.

## Project structure

```
src/
├── app/                      # App Router routes + globals.css (@theme tokens)
├── components/
│   ├── ui/                   # Button, Card, Badge, Slider, AnimatedCounter, SectionHeading
│   ├── layout/               # Navbar, Footer
│   ├── homepage/             # HeroSection, ROICalculator, ProblemSolution, ...
│   ├── ecosystems/           # EcosystemBlock, WorkflowWireframe
│   ├── services/             # ServiceMenu (the flagship interactive catalog)
│   ├── lab/                  # PhaseTimeline, SandboxDiagram
│   └── contact/              # CalendlyPanel, CalendlyEmbed
├── lib/                      # content.ts (verbatim copy), service-catalog.ts, roi.ts, db.ts, validations.ts
├── types/                    # lead.ts, roi.ts
supabase/                     # 001_initial_schema.sql + seed.sql + docker-initdb.sh
Dockerfile                    # multi-stage: deps -> builder (standalone) -> runner (non-root)
docker-compose.yml            # app + postgres:16 on isolated sutaz-ca-network
```

## License

Proprietary. © Sutaz Automation.
