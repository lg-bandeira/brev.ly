FROM node:20-alpine AS base

FROM base AS dependencies
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS build
WORKDIR /usr/src/app
COPY . .
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
RUN npm run build
RUN npm prune --production

FROM cgr.dev/chainguard/node:latest AS deploy
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY --from=build --chown=node:node /usr/src/app/dist ./dist
COPY --from=build --chown=node:node /usr/src/app/node_modules ./node_modules
COPY --from=build --chown=node:node /usr/src/app/package.json ./package.json

EXPOSE 3333
CMD ["dist/server.js"]