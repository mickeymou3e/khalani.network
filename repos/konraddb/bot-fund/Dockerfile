FROM node:16

WORKDIR /app

COPY package.json yarn.lock tsconfig.json ./

RUN --mount=type=secret,id=github_token \
   export GITHUB_TOKEN=$(cat /run/secrets/github_token) && \
   yarn config set //npm.pkg.github.com/:_authToken ${GITHUB_TOKEN} && \
   yarn config set @tvl-labs:registry https://npm.pkg.github.com 
RUN yarn

# Copy the TypeScript source code.
COPY src/ src/

RUN yarn build