# Development
FROM node:22-alpine AS development

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install

COPY . .

RUN pnpm prisma generate

EXPOSE 3001

CMD ["pnpm", "run", "dev"]

# Production
FROM node:22-alpine AS production

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Install all dependencies first (including devDependencies for prisma generate)
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install

COPY . .

# Generate prisma client and build
RUN pnpm prisma generate
RUN pnpm run build

# Remove devDependencies
RUN pnpm prune --prod

EXPOSE 3001

CMD ["pnpm", "start"]
