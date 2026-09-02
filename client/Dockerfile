FROM node:22-bookworm-slim AS build

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Baked into the static bundle at export time. Leave empty for same-origin /api.
ARG EXPO_PUBLIC_API_URL=
ARG EXPO_PUBLIC_SHARE_ORIGIN=
ENV EXPO_PUBLIC_API_URL=$EXPO_PUBLIC_API_URL \
    EXPO_PUBLIC_SHARE_ORIGIN=$EXPO_PUBLIC_SHARE_ORIGIN \
    CI=1 \
    EXPO_NO_TELEMETRY=1 \
    NODE_ENV=production \
    NODE_OPTIONS=--max-old-space-size=4096

RUN npx expo export --platform web --output-dir dist

FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1

CMD ["nginx", "-g", "daemon off;"]
