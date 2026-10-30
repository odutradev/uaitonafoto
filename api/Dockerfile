FROM node:22-alpine AS builder
WORKDIR /app
COPY api/package*.json ./
COPY package.json ./root-package.json
RUN npm i --force
COPY api/ .
COPY package.json ./root-package.json
RUN npm run build

FROM node:22-alpine
WORKDIR /app
RUN apk add --no-cache wget curl
COPY api/package*.json ./
COPY package.json ./root-package.json
RUN npm i --omit=dev --force
COPY --from=builder /app/dist ./dist
COPY api/healthcheck.js ./healthcheck.js
COPY package.json ./root-package.json
EXPOSE 80
HEALTHCHECK --interval=10s --timeout=5s --start-period=20s --retries=5 CMD node healthcheck.js
CMD ["node", "dist/server.js"]
