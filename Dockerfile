# Coolify: Build Pack = Dockerfile, port 80.
# Optional Redis: attach a Coolify Redis and set CACHE_BACKEND=redis, REDIS_URL=...

FROM node:22-bookworm-slim AS web

WORKDIR /web

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY client/package.json client/package-lock.json client/.npmrc ./
RUN npm ci

COPY client/ ./

ARG EXPO_PUBLIC_API_URL=
ARG EXPO_PUBLIC_SHARE_ORIGIN=
ENV EXPO_PUBLIC_API_URL=$EXPO_PUBLIC_API_URL \
    EXPO_PUBLIC_SHARE_ORIGIN=$EXPO_PUBLIC_SHARE_ORIGIN \
    CI=1 \
    EXPO_NO_TELEMETRY=1 \
    NODE_ENV=production \
    NODE_OPTIONS=--max-old-space-size=4096

RUN npx expo export --platform web --output-dir dist

FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    TZ=Europe/Zurich \
    CACHE_BACKEND=memory \
    PERSIST_CACHE=false \
    WARM_ON_STARTUP=true \
    CACHE_DIR=/app/.cache

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    nginx \
    supervisor \
    tzdata \
    && rm -rf /var/lib/apt/lists/* \
    && rm -f /etc/nginx/sites-enabled/default

COPY server/requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY server/app ./app
COPY --from=web /web/dist /var/www/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/supervisord.conf /etc/supervisor/conf.d/konlife.conf

RUN useradd -m -u 1000 appuser \
    && mkdir -p /app/.cache /var/log/supervisor \
    && chown -R appuser:appuser /app \
    && chown -R www-data:www-data /var/www/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
    CMD curl -f http://127.0.0.1/api/health || exit 1

CMD ["/usr/bin/supervisord", "-n", "-c", "/etc/supervisor/supervisord.conf"]
