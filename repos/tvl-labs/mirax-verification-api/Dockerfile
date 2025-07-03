# First run cargo build --release --bins, and make sure that `axi-lang` is available at `target/release/axi-lang`.

FROM debian:bullseye-slim

WORKDIR /app

COPY target/release/axi-playground-api target/release/axi-lang target/release/mirax-verify /app

EXPOSE 3000

CMD ["/app/axi-playground-api"]
