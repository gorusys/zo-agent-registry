# Production Dockerfile for Zo Agent Registry (web app)
FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.14.2 --activate
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/
COPY packages/manifest-schema/package.json ./packages/manifest-schema/
COPY packages/registry-core/package.json ./packages/registry-core/
COPY packages/ui/package.json ./packages/ui/
RUN pnpm install --frozen-lockfile

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm install
RUN pnpm --filter @zo-agent-registry/manifest-schema build
RUN pnpm --filter @zo-agent-registry/registry-core build
RUN pnpm --filter @zo-agent-registry/ui build
RUN pnpm --filter web exec prisma generate
RUN pnpm --filter web build

FROM base AS runner
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/apps/web/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/templates ./templates
USER nextjs
EXPOSE 3001
ENV PORT=3001
ENV HOSTNAME="0.0.0.0"
WORKDIR /app/apps/web
CMD ["node", "server.js"]
