# Stage 1 - the build process
FROM node:lts-alpine3.18 as build-deps

ARG NEXT_PUBLIC_REST_URL
ARG NEXT_PUBLIC_WS_URL
ARG NEXT_PUBLIC_TRADING_FEE_MULTIPLIER
ARG NEXT_PUBLIC_WITHDRAWAL_FEE_MULTIPLIER
ARG NEXT_PUBLIC_JASMINE_NEUTRAL_REST_URL
ARG NEXT_PUBLIC_NEUTRAL_WS_URL
ARG NEXT_PUBLIC_JASMINE_REST_URL
ARG NEXT_PUBLIC_THEGRAPH_JASMINE_URL
ARG NEXT_PUBLIC_JASMINE_TOKEN_ADDRESS
ARG NEXT_PUBLIC_JASMINE_EAT_ADDRESS
ARG NEXT_PUBLIC_POOL_STRATEGY_TOKEN
ARG NEXT_PUBLIC_POOL_TOKEN
ARG NEXT_PUBLIC_POOL_STRATEGY_TX_FEE_TOKEN
ARG NEXT_PUBLIC_POOL_TX_FEE_TOKEN
ARG NEXT_PUBLIC_POOL_TX_FEE_MIN_THRESHOLD
ARG NEXT_PUBLIC_ASSETS_JASMINE_MINTER_ADDRESS
ARG NEXT_PUBLIC_POOL_TX_FEE_AMOUNT

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile && yarn cache clean
COPY . .
RUN yarn build
RUN yarn install --production --frozen-lockfile && yarn cache clean
RUN rm -r ./build/cache

# Stage 2 - the production environment
FROM node:lts-alpine3.18
WORKDIR /app

COPY --from=build-deps /app/build ./build
COPY --from=build-deps /app/node_modules ./node_modules
COPY --from=build-deps /app/public ./public
COPY --from=build-deps /app/next.config.js ./next.config.js
COPY --from=build-deps /app/next-i18next.config.js ./next-i18next.config.js
COPY --from=build-deps /app/package.json ./package.json

CMD ["yarn", "start"]
