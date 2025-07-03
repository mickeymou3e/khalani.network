FROM rust:1.82.0 as builder

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

RUN cd /build && cargo build --all --release


FROM debian:bookworm-20230612-slim

RUN apt-get update \
    && apt-get install -y --no-install-recommends curl jq ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=builder /build/target/release/medusa /app/medusa
COPY --from=builder /build/target/release/arcadia-solver /app/arcadia-solver
COPY --from=builder /build/config.toml /app/config.toml
#COPY --from=builder /build/crates/solver/src/config.toml /app/solver-config.toml
COPY --from=builder /build/contracts/arcadia-core-contracts /app/contracts/arcadia-core-contracts

CMD /app/medusa /app/config.toml