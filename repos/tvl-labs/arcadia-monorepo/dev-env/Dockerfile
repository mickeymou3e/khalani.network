FROM ubuntu:22.04 AS base

ENV FOUNDRY_DIR=/opt/foundry
ENV PATH="$FOUNDRY_DIR/bin:$PATH"
ENV CARGO_HOME=/opt/cargo
ENV RUSTUP_HOME=/opt/rustup
ENV PATH="$CARGO_HOME/bin:$PATH"

RUN apt-get update && apt-get install -y \
    curl \
    git \
    build-essential \
    pkg-config \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://deb.nodesource.com/setup_current.x | bash - && \ 
    apt-get install -y nodejs

RUN npm install -g yarn@latest

RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y && \
    chmod -R a+w $RUSTUP_HOME $CARGO_HOME

RUN curl -L https://foundry.paradigm.xyz | bash && \
    $FOUNDRY_DIR/bin/foundryup

RUN npm install -g @hyperlane-xyz/cli && \  
    rm -rf /var/lib/apt/lists/*


FROM base AS production

WORKDIR /root/.hyperlane/
COPY ./dev-env/hyperlane-dev-env/deployments/ .

WORKDIR /app
COPY . .

WORKDIR /app/medusa
RUN cargo build --release --all

WORKDIR /app/contracts
RUN forge build --via-ir

WORKDIR /app/dev-env/hyperlane-dev-env
RUN yarn install --frozen-lockfile

WORKDIR /app/dev-env/hyperlane-dev-env
RUN chmod +x ./e2e.sh ./helpers/wait-for-multinode.sh ./helpers/wait-for-medusa.sh
CMD ["sh", "-c", "./e2e.sh"]
