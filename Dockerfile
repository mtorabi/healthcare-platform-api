# Stage 1: Dev image with hot reload
FROM node:20-alpine AS development

# Ensure bash + some build tooling for native deps
RUN apk add --no-cache bash python3 make g++

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

# Expose dev port
EXPOSE 3000

# Use ts-node-dev for hot reload (or nodemon)
CMD ["npx", "ts-node-dev", "--respawn", "--transpile-only", "src/main.ts"]

# Stage 2: Production (optional, same file)
FROM node:20-alpine AS production
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=development /usr/src/app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/main.js"]