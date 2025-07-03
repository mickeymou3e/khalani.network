# Validity Playground

A web interface for interacting with the Validity proof language.

## Setup
To contribute to this repository, first, clone the codebase.

Once complete, ensure docker is running. Navigate to the root of the project directory and execute `bash ./build-docker.sh` to build the sandbox docker image.

From there, follow instructions to run in development mode below.

## Run in Development Mode

`cd app/frontend && npm run dev`

Then, in a separate terminal, run the server: `cd app && cargo run`

## Build & Run

First, build the server:
`cd app & cargo build`

Then, the frontend:
`cd app/frontend && npm i &&  npm run build:production`

Then run the server:
`cargo run`

