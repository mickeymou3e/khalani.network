# Axi Playground API

## Overview

This server provides HTTP APIs for the axi interpreter and for mirax-axi transaction verification.

## Features

- RESTful API for axi interpreter (`/run-axi`)
- RESTful API for mirax-axi transaction verification (`/verify`)
- Configurable concurrency limits
- Request timeout handling
- Graceful shutdown support
- Seccomp sandbox for security
- CORS

## Running the server

Make sure that mirax source code is available at `../mirax`. Also make sure that `axi-lang` is available at `target/release/axi-lang`.

```bash
cargo build --release --bins && ./target/release/axi-playground-api
```

## Configuration

The server can be configured using environment variables:

- `PORT`: The port to listen on (default: 3000)
- `TIMEOUT`: The request timeout in seconds (default: 15)
- `CONCURRENCY_LIMIT`: The maximum number of concurrent requests (default: 4)

## Docker

To build and run the server in a Docker container, follow these steps:

```bash
cargo build --release --bins
docker build -t axi-playground-api .
docker run -p 3000:3000 axi-playground-api
```

## API

### Verify Transaction

POST /verify

#### Request Body

```json
{
    "context": {...},
    "transaction": {...}
}
```

#### Response

```json
{
    "ok": true,
    "status": 0,
    "signal": null,
    "stdout": "...",
    "stderr": "..."
}
```

### Run Axi

POST /run-axi/{file_name}

#### Request Body

The Axi code to run.

#### Response

```json
{
    "ok": true,
    "status": 0,
    "signal": null,
    "stdout": "...",
    "stderr": "..."
}
```

### Calculate Mirax-keyed Blake3 Hash

POST /utils/mirax-hash

#### Request Body

```json
"0x..."
```

#### Response

```json
"0x..."
```

### Calculate Script Hash

POST /utils/script-hash

#### Request Body

```json
{
    "code_hash": "0x...",
    "hash_type": "Lock",
    "args": "0x..."
}
```

#### Response

```json
"0x..."
```
