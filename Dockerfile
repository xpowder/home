FROM node:20-slim AS base 

WORKDIR /app

RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package.json ./

RUN npm cache clean --force && \
    npm config set fund false && \
    npm config set audit false

RUN npm install --legacy-peer-deps --prefer-offline=false

RUN npm install ajv@^8.12.0 --legacy-peer-deps && \
    npm install ajv-keywords@^5.1.0 --legacy-peer-deps || true

RUN npm dedupe --legacy-peer-deps || true

RUN npm rebuild lightningcss --legacy-peer-deps || \
    npm install lightningcss --legacy-peer-deps --force || true

RUN if [ ! -f "node_modules/lightningcss/lightningcss.linux-x64-gnu.node" ] && \
       [ ! -f "node_modules/lightningcss/lightningcss.linux-x64-musl.node" ]; then \
    echo "Warning: lightningcss native bindings missing, attempting fix..." && \
    rm -rf node_modules/lightningcss && \
    npm install lightningcss --legacy-peer-deps --force && \
    npm rebuild lightningcss --legacy-peer-deps || true; \
    fi

ARG NEXT_PUBLIC_BACKEND_API_URL=http://localhost:8000
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID=
ARG NEXT_PUBLIC_DEEPL_API_KEY=
ARG ENCRYPTION_SECRET_KEY=default-encryption-secret-key-change-in-production

ENV NEXT_PUBLIC_BACKEND_API_URL=${NEXT_PUBLIC_BACKEND_API_URL}
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=${NEXT_PUBLIC_GOOGLE_CLIENT_ID}
ENV NEXT_PUBLIC_DEEPL_API_KEY=${NEXT_PUBLIC_DEEPL_API_KEY}
ENV ENCRYPTION_SECRET_KEY=${ENCRYPTION_SECRET_KEY}

COPY . .

RUN npm run build 

FROM node:20-slim AS production 

WORKDIR /app

COPY package.json ./

RUN npm install --omit=dev --legacy-peer-deps

RUN npm install typescript --legacy-peer-deps --save-prod || true

COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/next.config.ts ./next.config.ts
COPY --from=base /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "run", "start"]
