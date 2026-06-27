# syntax=docker/dockerfile:1.7
# ============================================================================
# sutaz.ca — production Dockerfile (Next.js 16 standalone)
# Multi-stage: deps -> builder -> runner. Final image is non-root, minimal,
# and contains only the standalone server + static assets + public.
# ============================================================================

ARG NODE_VERSION=20-alpine

# ---------- Stage 1: deps -----------------------------------------------------
FROM node:${NODE_VERSION} AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Enable pnpm via corepack (pinned to match dev)
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

# Install only production + dev deps first (better layer caching than copying src)
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# ---------- Stage 2: builder --------------------------------------------------
FROM node:${NODE_VERSION} AS builder
WORKDIR /app
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
ENV NEXT_TELEMETRY_DISABLED=1
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build with runtime secrets stubbed — next.config has output:"standalone".
# Database + integration keys are NOT baked in; they are supplied at runtime
# via the compose env. We set a dummy value so any NEXT_PUBLIC_* referenced at
# build time doesn't hard-fail, but server-only secrets stay unset here.
ARG NEXT_PUBLIC_SITE_URL=https://sutaz.ca
ARG NEXT_PUBLIC_CALENDLY_URL=""
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
ENV NEXT_PUBLIC_CALENDLY_URL=${NEXT_PUBLIC_CALENDLY_URL}
RUN pnpm build

# ---------- Stage 3: runner ---------------------------------------------------
FROM node:${NODE_VERSION} AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Non-root user (node already exists on node:alpine images, uid 1000)
RUN addgroup --system --gid 1001 nodejs 2>/dev/null || true \
 && (id -u nextjs >/dev/null 2>&1 || adduser --system --uid 1001 nextjs)

# Copy the standalone server, static assets, and public.
# `.next/standalone` does NOT include `.next/static` or `public` — copy them
# explicitly so client assets and favicons serve correctly.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000

# next standalone server entry
CMD ["node", "server.js"]
