# Prod API image — Nest only (no Nuxt)
FROM node:24 AS build
WORKDIR /app
RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/models packages/models
COPY server server

RUN corepack pnpm install --frozen-lockfile
RUN corepack pnpm --filter @portal/api build

FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000
COPY --from=build /app/server/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/server/package.json ./package.json
EXPOSE 4000
CMD ["node", "dist/main.js"]
