FROM ubuntu:20.04

ARG EXECUTOR_VERSION

RUN apt-get update
RUN apt-get install -y curl libssl-dev ca-certificates

RUN mkdir /app

COPY ./executor /app
COPY ./docker/keystore /app/eth-ks
COPY ./docker/config /app/config

COPY ./binaries/executor-v${EXECUTOR_VERSION}-linux-amd64.tar.gz /app

WORKDIR /app

RUN tar -xzf executor-v${EXECUTOR_VERSION}-linux-amd64.tar.gz

RUN rm executor-v${EXECUTOR_VERSION}-linux-amd64.tar.gz

EXPOSE 8090
