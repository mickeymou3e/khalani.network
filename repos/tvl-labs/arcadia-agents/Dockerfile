FROM rust:1.85.0 as builder

WORKDIR /build
COPY . .

RUN set -eux; \
    apt-get update; \
    apt-get install -y --no-install-recommends \
    cmake \
    clang \
    llvm \
    gcc; \
    rm -rf /var/lib/apt/lists/*

RUN cd /build && cargo build --release


FROM debian:bookworm-20230612-slim

RUN apt-get update \
    && apt-get install -y --no-install-recommends curl jq ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=builder /build/target/release/refunder-agent /app/refunder-agent
COPY --from=builder /build/config.toml /app/config.toml
COPY --from=builder /build/chain_config.toml /app/chain_config.toml

CMD /app/refunder-agent /app/config.toml /app/chain_config.toml