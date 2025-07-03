# syntax=docker/dockerfile:1.4

# Use Ubuntu 20.04 as the base image
FROM rust as build-environment

ARG TARGETARCH
WORKDIR /opt

# Install dependencies
RUN apt-get update && apt-get install -y clang lld curl build-essential linux-headers-generic git openssl libssl-dev perl llvm-dev libclang-dev libpq-dev \
    && curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs > rustup.sh \
    && chmod +x ./rustup.sh \
    && ./rustup.sh -y

RUN [[ "$TARGETARCH" = "arm64" ]] && echo "export CFLAGS=-mno-outline-atomics" >> $HOME/.profile || true

WORKDIR /opt/khalani-solvers
COPY . .

RUN . $HOME/.profile && cargo build --release \
    && mkdir out \
    && mv target/release/spoke-chain-caller out/spoke-chain-caller \
    && mv target/release/intentbook-matchmaker out/intentbook-matchmaker \
    && mv target/release/swap-intent-settler out/swap-intent-settler \
    && mv target/release/cross-chain-market-maker out/cross-chain-market-maker \
    && strip out/spoke-chain-caller \
    && strip out/intentbook-matchmaker \
    && strip out/swap-intent-settler \
    && strip out/cross-chain-market-maker 


# Use a new stage for the final image to keep it clean
FROM  rust:bookworm  as solver-client

# Install dependencies
RUN apt-get update && apt-get install -y linux-headers-generic git 
RUN mkdir /config 
COPY /config/config.json /config

COPY --from=build-environment /opt/khalani-solvers/out/spoke-chain-caller /usr/local/bin/spoke-chain-caller
COPY --from=build-environment /opt/khalani-solvers/out/intentbook-matchmaker /usr/local/bin/intentbook-matchmaker
COPY --from=build-environment /opt/khalani-solvers/out/swap-intent-settler /usr/local/bin/swap-intent-settler
COPY --from=build-environment /opt/khalani-solvers/out/cross-chain-market-maker /usr/local/bin/cross-chain-market-maker


RUN useradd -u 1000 khalani-solver

ENTRYPOINT ["/bin/sh", "-c"]

LABEL org.label-schema.build-date=$BUILD_DATE \
    org.label-schema.name="Khalani Solvers" \
    org.label-schema.url="https://github.com/tvl-labs/khalani-solver.git" \
    org.label-schema.vcs-ref=$VCS_REF \
    org.label-schema.vcs-url="https://github.com/tvl-labs/khalani-solver.git" \
    org.label-schema.schema-version="1.0"



