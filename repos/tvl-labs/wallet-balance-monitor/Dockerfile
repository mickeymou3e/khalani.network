FROM node:16

WORKDIR /app

COPY package.json yarn.lock tsconfig.json ./

RUN yarn

# Copy the TypeScript source code.
COPY src/ src/

RUN yarn build