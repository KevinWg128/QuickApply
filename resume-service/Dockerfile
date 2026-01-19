# Development
FROM node:22-alpine AS development

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install

COPY . .

EXPOSE 3004

CMD ["pnpm", "run", "dev"]

# Production
FROM node:22-alpine AS production

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install

COPY . .

RUN pnpm run build

RUN pnpm prune --prod

EXPOSE 3004

CMD ["pnpm", "start"]
