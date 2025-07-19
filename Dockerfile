FROM node:22.17.0-alpine AS base

RUN apk add --no-cache dumb-init postgresql-client

RUN addgroup -g 1001 -S nodejs
RUN adduser -S productsapp -u 1001

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]

# --- Stage para desenvolvimento ---
FROM base AS development

RUN npm ci --include=dev

COPY . .

RUN chown -R productsapp:nodejs /app

USER productsapp

EXPOSE 3333

CMD ["dumb-init", "npm", "run", "start:dev"]

# --- Stage para build ---
FROM base AS build

RUN npm ci --include=dev

COPY . .

RUN npm run build

RUN npm ci --only=production && npm cache clean --force

# --- Stage final para produção ---
FROM base AS production

COPY --from=build --chown=productsapp:nodejs /app/dist ./dist
COPY --from=build --chown=productsapp:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=productsapp:nodejs /app/package*.json ./

USER productsapp

EXPOSE 3333

CMD ["dumb-init", "node", "dist/app.js"]