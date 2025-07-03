.PHONY: all build build-release check fmt clean test run run-server run-solver docker docker-compose

# Default target
all: check fmt 

build-all:
	cargo build --all --release

build-service:
	cargo build --bin medusa-service --release

build-solver:
	cargo build -p arcadia-solver --release

# Check code for errors without building
check:
	cargo check --all

# Format code
fmt:
	cargo +nightly fmt --all

# Check clippy
clippy:
	cargo clippy --all --all-features --all-targets -- -D warnings

# Clean build artifacts
clean:
	cargo clean

# Run all tests
test:
	cargo test --all

# Run with development settings
run:
	cargo run --bin medusa -- config.toml

# Run the main server component
run-server:
	cargo run --bin medusa -- config.toml

# Run the solver component
run-solver:
	cargo run --bin arcadia-solver -- solver-config.toml

# Build docker image
docker:
	docker build -t medusa-api-server:latest .

# Start docker-compose environment
docker-compose-up:
	docker-compose up -d

# Stop docker-compose environment
docker-compose-down:
	docker-compose down

# Run a specific crate's tests
test-crate:
	@if [ -z "$(CRATE)" ]; then \
		echo "Please specify a crate: make test-crate CRATE=api"; \
	else \
		cargo test -p medusa-$(CRATE); \
	fi

# Development environment setup
setup:
	cp .env.example .env
	@echo "Please edit .env with your configuration"

# Watch and rebuild on changes
watch:
	cargo watch -x build

# Install developer tools
dev-tools:
	rustup component add rustfmt clippy
	cargo install cargo-watch 