# run docker build from the root of the monorepo, not the root of the medusa directory
FROM rust:1.82.0 AS builder

WORKDIR /build
COPY . .

RUN --mount=type=cache,target=/usr/local/cargo/registry \
    --mount=type=cache,target=/build/target \
    set -eux; \
    apt-get update; \
    apt-get install -y --no-install-recommends \
    cmake \
    clang \
    llvm \
    gcc; \
    rm -rf /var/lib/apt/lists/*

RUN cd /build/medusa && cargo build --all --release


FROM debian:bookworm-20230612-slim

RUN apt-get update \
    && apt-get install -y --no-install-recommends curl jq ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=builder /build/medusa/target/release/medusa-service /app/medusa
COPY --from=builder /build/medusa/target/release/arcadia-solver /app/arcadia-solver
COPY --from=builder /build/medusa/config-example.toml /app/config.toml
COPY --from=builder /build/contracts /app/contracts/arcadia-core-contracts

CMD /app/medusa /app/config.toml