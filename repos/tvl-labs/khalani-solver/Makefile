include .env

# Docker image name
IMAGE_NAME = solver

.PHONY: docker_build
docker_build:
	docker build -t $(IMAGE_NAME) .

.PHONY: docker_run_spoke_chain_caller
docker_run_spoke_chain_caller:
	docker run --name spoke_chain_caller -e PRIVATE_KEY=$(PRIVATE_KEY) -e CONFIG_FILE=$(CONFIG_FILE) -e SEPOLIA_RPC_URL=$(SEPOLIA_RPC_URL) -e SEPOLIA_WS_URL=$(SEPOLIA_WS_URL) -e FUJI_RPC_URL=$(FUJI_RPC_URL) -e FUJI_WS_URL=$(FUJI_WS_URL) -e RUST_LOG=khalani_solver=debug,spoke_chain_caller=debug $(IMAGE_NAME) "spoke-chain-caller --private-key $(PRIVATE_KEY) --config-file $(CONFIG_FILE)"

.PHONY: docker_run_intent_book_matchmaker
docker_run_intent_book_matchmaker:
	docker run --name intent_book_matchmaker -e PRIVATE_KEY=$(PRIVATE_KEY) -e CONFIG_FILE=$(CONFIG_FILE) -e SEPOLIA_RPC_URL=$(SEPOLIA_RPC_URL) -e SEPOLIA_WS_URL=$(SEPOLIA_WS_URL) -e FUJI_RPC_URL=$(FUJI_RPC_URL) -e FUJI_WS_URL=$(FUJI_WS_URL) -e RUST_LOG=khalani_solver=debug,intentbook-matchmaker=debug $(IMAGE_NAME) "intentbook-matcher --private-key $(PRIVATE_KEY) --config-file $(CONFIG_FILE)"
.PHONY: docker_run_swap_intent_settler
docker_run_swap_intent_settler:
	docker run --name swap_intent_settler  -e PRIVATE_KEY=$(PRIVATE_KEY) -e CONFIG_FILE=$(CONFIG_FILE) -e SEPOLIA_RPC_URL=$(SEPOLIA_RPC_URL) -e SEPOLIA_WS_URL=$(SEPOLIA_WS_URL) -e FUJI_RPC_URL=$(FUJI_RPC_URL) -e FUJI_WS_URL=$(FUJI_WS_URL) -e RUST_LOG=khalani_solver=debug,swap_intent_settler=debug $(IMAGE_NAME) "swap-intent-settler --private-key $(PRIVATE_KEY) --config-file $(CONFIG_FILE)"

.PHONY: docker_run_cross_chain_market_maker
docker_run_cross_chain_market_maker:
	docker run --name cross_chain_market_maker -e PRIVATE_KEY=$(PRIVATE_KEY) -e CONFIG_FILE=$(CONFIG_FILE) -e SEPOLIA_RPC_URL=$(SEPOLIA_RPC_URL) -e SEPOLIA_WS_URL=$(SEPOLIA_WS_URL) -e FUJI_RPC_URL=$(FUJI_RPC_URL) -e FUJI_WS_URL=$(FUJI_WS_URL) -e RUST_LOG=khalani_solver=debug,cross-chain-market-maker=debug $(IMAGE_NAME) "cross-chain-market-maker --private-key $(PRIVATE_KEY) --config-file $(CONFIG_FILE)"

.PHONY: run_swap_intent_settler
run_swap_intent_settler:
	RUST_LOG=khalani_solver=debug,swap_intent_settler=debug cargo run --package swap-intent-settler -- --private-key "0x4f91dd71525e3acf4b83ffb493d16e5ed9bcdea36e8076eb3d74f361ae7dc0ff" --config-file ./config/config.json

CONTRACT_DIR?=../khalani-protocol

CONTRACTS=\
	IERC20Metadata \
	Escrow \
	GMPEventVerifier \
	GMPIntentEventVerifier \
	BaseIntentBook \
	LimitOrderIntentBook \
	SpokeChainCallIntentBook \
	SpokeChainExecutor \
	SwapIntentBook \
	SwapIntentFiller

.PHONY: generate-bindings
generate-bindings:
	forge bind --root ${CONTRACT_DIR} -b crates/bindings-khalani/ --crate-name bindings-khalani --overwrite ${CONTRACTS:%=--select ^%$} \
		&& cargo fmt --all
