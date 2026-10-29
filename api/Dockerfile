FROM node:18-alpine AS builder
WORKDIR /app
COPY api/package*.json ./
COPY package.json ./root-package.json
RUN npm i --force
COPY api/ .
COPY package.json ./root-package.json
RUN npm run build

FROM node:18-alpine
WORKDIR /app
RUN apk add --no-cache wget curl
COPY api/package*.json ./
COPY package.json ./root-package.json
RUN npm i --omit=dev --force
COPY --from=builder /app/dist ./dist
COPY package.json ./root-package.json
EXPOSE 80
CMD ["node", "dist/server.js"]