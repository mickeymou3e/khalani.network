FROM rust:1.82.0 as builder

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

RUN --mount=type=cache,target=/usr/local/cargo/registry \
    cargo fetch

RUN --mount=type=cache,target=/usr/local/cargo/registry \
    --mount=type=cache,target=/build/target \
    cargo build --release --features aws

RUN --mount=type=cache,target=/usr/local/cargo/registry \
    --mount=type=cache,target=/build/target \
    cp /build/target/release/gas-oracle-service /build/


FROM debian:bookworm-20230612-slim

RUN apt-get update \
    && apt-get install -y --no-install-recommends curl jq ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=builder /build/gas-oracle-service /app/gas-oracle-service
COPY --from=builder /build/config.json /app/config.json
COPY --from=builder /build/redeemer_config.json /app/redeemer_config.json

CMD /app/gas-oracle-service