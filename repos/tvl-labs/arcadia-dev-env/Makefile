include .env.dev
export $(shell sed 's/=.*//' .env.dev)

num_spoke_chains=$(NUM_SPOKE_CHAINS)
hyp_key=$(HYP_KEY)
hyperlane_dir=$(HOME)/.hyperlane

hub_chain_port=8545
hub_chain_id=31337
hub_chain_block_time=1
spoke_chain_port_start=8546
spoke_chain_id_start=31338
spoke_chain_block_time=1

priv_key=$(PRIVATE_KEY)
hub_rpc_url=$(HUB_RPC_URL)
spoke_rpc_url=$(SPOKE_RPC_URL)
another_spoke_rpc_url=$(ANOTHER_SPOKE_RPC_URL)
fork_url=$(FORK_URL)

hub_chain_name=arcadialocal
spoke_chain_name_common=spokelocal

hub_chain_dir=$(hyperlane_dir)/chains/$(hub_chain_name)
hub_chain_metadata_file=$(hub_chain_dir)/metadata.yaml
hub_chain_addresses_file=$(hub_chain_dir)/addresses.yaml

spoke_chain_default_dir=$(hyperlane_dir)/chains/$(spoke_chain_name_common)
spoke_chain_default_metadata_file=$(spoke_chain_default_dir)/metadata.yaml
spoke_chain_default_addresses_file=$(spoke_chain_default_dir)/addresses.yaml

# spoke_deployer=$(SPOKE_DEPLOYER)
# spoke_deployer_key=$(SPOKE_DEPLOYER_KEY)
# spoke_mailbox=$(SPOKE_MAILBOX)
# hub_deployer=$(HUB_DEPLOYER)
# hub_deployer_key=$(HUB_DEPLOYER_KEY)
# hub_mailbox=$(HUB_MAILBOX)
# permit2_address=$(PERMIT2_ADDRESS)
# gas_oracle=$(GAS_ORACLE_ADDRESS)
# spoke_chain_event_verifier=$(SPOKE_CHAIN_EVENT_VERIFIER)
# hub_chain_event_verifier=$(HUB_CHAIN_EVENT_VERIFIER)
# spoke_publisher=$(SPOKE_PUBLISHER)
# spoke_handler=$(SPOKE_HANDLER)


show:
	@echo $(hyp_key)
	@echo $(hyperlane_dir)
	@echo $(hub_chain_dir)
	@echo $(spoke_chain_addresses_file)
	@echo $(hub_deployer)
	@echo $(hub_rpc_url)
	@echo $(spoke_rpc_url)

deps:
	npm install -g @hyperlane-xyz/cli
	@command -v docker >/dev/null 2>&1 || { echo "Docker is required if you want to run chains and medusa in background. Please install Docker (https://docs.docker.com/get-docker/)."; exit 1; }
	@docker info >/dev/null 2>&1 || { echo "Docker (required if you want to run chains and medusa in background) is installed but not running. Please start the Docker daemon."; exit 1; }
	@python -c "import yaml" 2>/dev/null || { echo "Python yaml package is not installed. Please install it with 'pip install pyyaml'"; exit 1; }

registry-hub:
	@if [ -s $(hub_chain_metadata_file) ]; then \
		echo "hub chain metadata exists"; \
	else \
		mkdir -p $(hub_chain_dir); \
		cp ./arcadialocal/metadata.yaml $(hub_chain_dir); \
	fi

registry-spoke:
	@if [ -z "$(strip $(num_spoke_chains))" ]; then \
		echo "num_spoke_chains is not set. Making registry for 1 spoke chain."; \
		if [ -s $(spoke_chain_default_metadata_file) ]; then \
			echo "spoke chain metadata exists"; \
		else \
			mkdir -p $(spoke_chain_default_dir); \
			cp ./spokelocal/metadata.yaml $(spoke_chain_default_dir); \
		fi; \
	else \
		python3 spoke_registries.py $(num_spoke_chains); \
	fi

registry: registry-hub registry-spoke

start-spoke:
	@for i in $(shell seq 1 $(num_spoke_chains)); do \
		spoke_chain_port=$$(($(spoke_chain_port_start) + $$i)); \
		spoke_chain_id=$$(($(spoke_chain_id_start) + $$i)); \
		spoke_chain_name=$(spoke_chain_name_common)$$i; \
		echo "Starting $$spoke_chain_name ($$spoke_chain_id) on port $$spoke_chain_port"; \
		anvil --port $$spoke_chain_port --chain-id $$spoke_chain_id --block-time $(spoke_chain_block_time) --fork-url $(fork_url) & \
	done; \
	wait

start-hub:
	anvil --port $(hub_chain_port) --chain-id $(hub_chain_id) --block-time $(hub_chain_block_time) --fork-url $(fork_url)

start-spoke-daemons:
	@for i in $(shell seq 1 $(num_spoke_chains)); do \
		spoke_chain_port=$$(($(spoke_chain_port_start) + $$i)); \
		spoke_chain_id=$$(($(spoke_chain_id_start) + $$i)); \
		spoke_chain_name=$(spoke_chain_name_common)$$i; \
		echo "Starting $$spoke_chain_name ($$spoke_chain_id) on port $$spoke_chain_port"; \
		docker run --rm -d -p $$spoke_chain_port:$$spoke_chain_port --net arcadia-local-network --name $$spoke_chain_name ghcr.io/foundry-rs/foundry:latest "anvil --host 0.0.0.0 --port $$spoke_chain_port --chain-id $$spoke_chain_id --block-time $(spoke_chain_block_time) --fork-url $(fork_url)" ; \
	done

start-hub-daemon:
	@docker network create arcadia-local-network 
	@docker run --rm -d -p $(hub_chain_port):$(hub_chain_port) --net arcadia-local-network --name $(hub_chain_name) ghcr.io/foundry-rs/foundry:latest "anvil --host 0.0.0.0 --port $(hub_chain_port) --chain-id $(hub_chain_id) --block-time $(hub_chain_block_time) --fork-url $(fork_url)"

core-init:
	cd ./hyp-local && hyperlane core init -k $(hyp_key)

hub-core-deploy: core-init
	cd ./hyp-local && hyperlane core deploy -k $(hyp_key) --chain $(hub_chain_name)

spoke-core-deploy:
	@if [ -z "$(strip $(num_spoke_chains))" ]; then \
		cd ./hyp-local && hyperlane core deploy -k $(hyp_key) --chain $(spoke_chain_name_common); \
	else \
		cd ./hyp-local && \
		for i in $(shell seq 1 $(num_spoke_chains)); do \
			spoke_chain_name=$(spoke_chain_name_common)$$i; \
			hyperlane core deploy -k $(hyp_key) --chain $$spoke_chain_name; \
		done; \
	fi

deploy-hyperlane: hub-core-deploy spoke-core-deploy

hyperlane-agent-configs:
	@if [ -z "$(strip $(num_spoke_chains))" ]; then \
		echo "Creating agent config for hub and single spoke chain"; \
		hyperlane registry agent-config --chains $(hub_chain_name),$(spoke_chain_name_common); \
	else \
		agentChains="$(hub_chain_name)"; \
		for i in $(shell seq 1 $(num_spoke_chains)); do \
			agentChains="$$agentChains,$(spoke_chain_name_common)$$i"; \
		done; \
		echo "Creating agent config for chains: $$agentChains"; \
		hyperlane registry agent-config --chains $$agentChains; \
	fi; \
	CONFIG_FILES=$$(realpath ./configs/agent-config.json); \
	export CONFIG_FILES; \
	echo "CONFIG_FILES set to $$CONFIG_FILES"

setup-validator-signatures-all:
	@echo "Setting up validator signatures directories..."
	@mkdir -p tmp/hyperlane-validator-signatures-$(hub_chain_name)
	@echo "export VALIDATOR_SIGNATURES_DIR_HUB=$(shell pwd)/tmp/hyperlane-validator-signatures-$(hub_chain_name)" > .validator_signatures.env
	@echo "Validator signatures directory for hub created at: $(shell pwd)/tmp/hyperlane-validator-signatures-$(hub_chain_name)"
	@if [ -z "$(strip $(num_spoke_chains))" ]; then \
		echo "No spoke chains defined, skipping spoke directories."; \
	else \
		for i in $(shell seq 1 $(num_spoke_chains)); do \
			mkdir -p tmp/hyperlane-validator-signatures-$(spoke_chain_name_common)$$i; \
			echo "export VALIDATOR_SIGNATURES_DIR_SPOKE$$i=$(shell pwd)/tmp/hyperlane-validator-signatures-$(spoke_chain_name_common)$$i" >> .validator_signatures.env; \
			echo "Validator signatures directory for spoke chain $$i created at: $(shell pwd)/tmp/hyperlane-validator-signatures-$(spoke_chain_name_common)$$i"; \
		done; \
	fi
	@echo "Run 'source .validator_signatures.env' to load the environment variables."

rewrite-hyperlane-agent-configs:
	@python update_hyperlane_agent_configs.py $(num_spoke_chains)

run-validator-hub:
	@echo "Running hub validator..."
	cd external/hyperlane-monorepo/rust/main && \
	export CONFIG_FILES=$$(realpath ../../../../configs/agent-config.json) && \
	echo "CONFIG_FILES set to: $$CONFIG_FILES" && \
	cargo run --release --bin validator -- \
		--db ./hyperlane_db_validator_$(hub_chain_name) \
		--originChainName $(hub_chain_name) \
		--checkpointSyncer.type localStorage \
		--checkpointSyncer.path $(VALIDATOR_SIGNATURES_DIR_HUB) \
		--validator.key $(VALIDATOR_KEY)

run-validator-hub-daemon:
	@echo "Running hub validator..."; 
	@docker pull --platform linux/amd64 gcr.io/abacus-labs-dev/hyperlane-agent:agents-v1.1.0; 
	@source .validator_signatures.env && validator_key=$$(bash -c "source .env.dev && echo \$$VALIDATOR_KEY") && echo "Validator key: $$validator_key" && docker run --platform linux/amd64 \
	    --net arcadia-local-network \
		-d --rm \
		--mount type=bind,source=$$(realpath ./configs/daemon-config.json),target=/config/agent-config.json,readonly \
		-v $$(realpath ./tmp/hyperlane-validator-signatures-$(hub_chain_name)):/validator_signatures \
		--name hyperlane-validator-hub \
		-e CONFIG_FILES=/config/agent-config.json \
		gcr.io/abacus-labs-dev/hyperlane-agent:agents-v1.1.0 \
		./validator \
		--db ./hyperlane_db_validator_$(hub_chain_name) \
		--reorgPeriod 1 \
		--originChainName $(hub_chain_name) \
		--checkpointSyncer.type localStorage \
		--checkpointSyncer.path /validator_signatures \
		--validator.key $$validator_key

stop-validator-hub-daemon:
	@if [ "$$(docker ps -q -f name=hyperlane-validator-hub)" ]; then \
		docker stop hyperlane-validator-hub; \
	else \
		echo "Validator hub daemon is not running"; \
	fi

run-validator-spoke:
	@echo "Running spoke validators..."
	@if [ -z "$(strip $(num_spoke_chains))" ]; then \
	    echo "No spoke chain count set."; \
	else \
		cd external/hyperlane-monorepo/rust/main && \
		export CONFIG_FILES=$$(realpath ../../../../configs/agent-config.json) && \
		echo "CONFIG_FILES set to: $$CONFIG_FILES" && \
	    for i in $(shell seq 1 $(num_spoke_chains)); do \
	        echo "Running validator for $(spoke_chain_name_common)$$i..."; \
	        cargo run --release --bin validator -- \
	            --db ./hyperlane_db_validator_$(spoke_chain_name_common)$$i \
	            --originChainName $(spoke_chain_name_common)$$i \
	            --checkpointSyncer.type localStorage \
	            --checkpointSyncer.path $$(eval echo $$VALIDATOR_SIGNATURES_DIR_SPOKE$$i) \
	            --validator.key $(VALIDATOR_KEY) \
				--metrics-port 9092; \
	    done; \
	fi

run-validator-spoke-daemons:
	@echo "Running spoke validators..."
	@docker pull --platform linux/amd64 gcr.io/abacus-labs-dev/hyperlane-agent:agents-v1.1.0; 
	@for i in $(shell seq 1 $(num_spoke_chains)); do \
		spoke_dir=$$(bash -c "source .validator_signatures.env && echo \$$VALIDATOR_SIGNATURES_DIR_SPOKE$$i"); \
		validator_key=$$(bash -c "source .env.dev && echo \$$VALIDATOR_KEY"); \
		spoke_chain_name=$(spoke_chain_name_common)$$i; \
		spoke_chain_port=$$(($(spoke_chain_port_start) + $$i)); \
		spoke_chain_id=$$(($(spoke_chain_id_start) + $$i)); \
		docker run --platform linux/amd64 \
			--net arcadia-local-network \
			-d --rm \
			-v $$(realpath ./tmp/hyperlane-validator-signatures-$$spoke_chain_name):/validator_signatures \
			--mount type=bind,source=$$(realpath ./configs/daemon-config.json),target=/config/agent-config.json,readonly \
			--name hyperlane-validator-spoke$$i \
			-e CONFIG_FILES=/config/agent-config.json \
			-e HYP_VALIDATOR_SIGNATURES_DIR=/validator_signatures \
		gcr.io/abacus-labs-dev/hyperlane-agent:agents-v1.1.0 \
		./validator \
		--db ./hyperlane_db_validator_$(spoke_chain_name) \
		--reorgPeriod 1 \
		--originChainName $$spoke_chain_name \
		--checkpointSyncer.type localStorage \
		--checkpointSyncer.path /validator_signatures \
		--validator.key $$validator_key ;\
	done; \

stop-validator-spoke-daemons:
	@for i in $(shell seq 1 $(num_spoke_chains)); do \
		if [ "$$(docker ps -q -f name=hyperlane-validator-spoke$$i)" ]; then \
			docker stop hyperlane-validator-spoke$$i; \
		else \
			echo "Validator spoke daemon $$i is not running"; \
		fi; \
	done

run-relayer-hub:
	@echo "Running relayer for hub chain: $(hub_chain_name)"
	@if [ -z "$(strip $(num_spoke_chains))" ]; then \
	    echo "No spoke chain count set."; \
	else \
		cd external/hyperlane-monorepo/rust/main && \
		export CONFIG_FILES=$$(realpath ../../../../configs/agent-config.json) && \
		echo "CONFIG_FILES set to: $$CONFIG_FILES" && \
		relay_chains="$(hub_chain_name)"; \
	    for i in $(shell seq 1 $(num_spoke_chains)); do \
	        relay_chains="$${relay_chains},$(spoke_chain_name_common)$$i"; \
	    done; \
	    echo "Running relayer with --relayChains=$${relay_chains}"; \
	    cargo run --release --bin relayer -- \
	        --db ./hyperlane_db_relayer_$(hub_chain_name) \
	        --relayChains $${relay_chains} \
	        --allowLocalCheckpointSyncers true \
	        --defaultSigner.key $(HYP_DEFAULTSIGNER_KEY) \
	        --metrics-port 9091; \
	fi

run-relayer-hub-daemon:
	@echo "Running relayer for hub chain: $(hub_chain_name)"
	@docker pull --platform linux/amd64 gcr.io/abacus-labs-dev/hyperlane-agent:agents-v1.1.0; 
	@if [ -z "$(strip $(num_spoke_chains))" ]; then \
		echo "No spoke chain count set."; \
	else \
		relay_chains="$(hub_chain_name)"; \
		for i in $(shell seq 1 $(num_spoke_chains)); do \
			relay_chains="$${relay_chains},$(spoke_chain_name_common)$$i"; \
		done; \
		echo "Running relayer with --relayChains=$${relay_chains}"; \
		user_key=$$(bash -c "source .env.dev && echo \$$HYP_DEFAULTSIGNER_KEY"); \
		docker run --platform linux/amd64 \
			--net arcadia-local-network \
			-d --rm \
			--mount type=bind,source=$$(realpath ./configs/daemon-config.json),target=/config/agent-config.json,readonly \
			-v $$(realpath ./tmp):/validator_signatures \
			--name hyperlane-relayer-hub \
			-e CONFIG_FILES=/config/agent-config.json \
			-e HYP_VALIDATOR_SIGNATURES_DIR=/validator_signatures \
			gcr.io/abacus-labs-dev/hyperlane-agent:agents-v1.1.0 \
			./relayer \
			--db ./hyperlane_db_relayer_$(hub_chain_name) \
			--relayChains $${relay_chains} \
			--allowLocalCheckpointSyncers true \
			--defaultSigner.key $$user_key; \
	fi

stop-relayer-hub-daemon:
	@if [ "$$(docker ps -q -f name=hyperlane-relayer-hub)" ]; then \
		docker stop hyperlane-relayer-hub; \
	else \
		echo "Relayer hub daemon is not running"; \
	fi

run-relayer-spoke:
	@echo "Running relayer for spoke chains..."
	@cd external/hyperlane-monorepo/rust/main && \
	export CONFIG_FILES=$$(realpath ../../../../configs/agent-config.json) && \
	echo "CONFIG_FILES set to: $$CONFIG_FILES" && \
	if [ -z "$(strip $(num_spoke_chains))" ]; then \
	    echo "No num_spoke_chains defined; running for a single spoke: $(spoke_chain_name_common)"; \
	    source .env.dev && cargo run --release --bin relayer -- \
	         --db ./hyperlane_db_relayer_$(spoke_chain_name_common) \
	         --relayChains $(spoke_chain_name_common),$(hub_chain_name) \
	         --allowLocalCheckpointSyncers true \
	         --defaultSigner.key $(HYP_DEFAULTSIGNER_KEY) \
	         --metrics-port 9094; \
	else \
	    agentChains="$(hub_chain_name)"; \
	    for i in $(shell seq 1 $(num_spoke_chains)); do \
	        if [ "$$i" -eq "1" ]; then \
	            agentChains="$(spoke_chain_name_common)$$i"; \
	        else \
	            agentChains="$$agentChains,$(spoke_chain_name_common)$$i"; \
	        fi; \
	    done; \
	    echo "Using spoke chains: $$agentChains"; \
	    cargo run --release --bin relayer -- \
	         --db ./hyperlane_db_relayer_$(spoke_chain_name_common) \
	         --relayChains $$agentChains \
	         --allowLocalCheckpointSyncers true \
	         --defaultSigner.key $(HYP_DEFAULTSIGNER_KEY) \
	         --metrics-port 9094; \
	fi

run-relayer-spoke-daemons:
	@echo "Running relayer for spoke chains..."
	@docker pull --platform linux/amd64 gcr.io/abacus-labs-dev/hyperlane-agent:agents-v1.1.0; 
	@if [ -z "$(strip $(num_spoke_chains))" ]; then \
		echo "No spoke chain count set."; \
	else \
		agentChains="$(hub_chain_name)"; \
		for i in $(shell seq 1 $(num_spoke_chains)); do \
	        if [ "$$i" -eq "1" ]; then \
	            agentChains="$(spoke_chain_name_common)$$i"; \
	        else \
	            agentChains="$$agentChains,$(spoke_chain_name_common)$$i"; \
	        fi; \
	    done; \
		echo "Using spoke chains: $$agentChains"; \
		user_key=$$(bash -c "source .env.dev && echo \$$HYP_DEFAULTSIGNER_KEY"); \
		docker run --platform linux/amd64 \
			--net arcadia-local-network \
			-d --rm \
			--mount type=bind,source=$$(realpath ./configs/daemon-config.json),target=/config/agent-config.json,readonly \
			-v $$(realpath ./tmp):/validator_signatures \
			--name hyperlane-relayer-spoke \
			-e CONFIG_FILES=/config/agent-config.json \
			-e HYP_VALIDATOR_SIGNATURES_DIR=/validator_signatures \
			gcr.io/abacus-labs-dev/hyperlane-agent:agents-v1.1.0 \
			./relayer \
			--db ./hyperlane_db_relayer_spoke \
			--relayChains $$agentChains \
			--allowLocalCheckpointSyncers true \
			--defaultSigner.key $$user_key; \
	fi

stop-relayer-spoke-daemons:
	@if [ "$$(docker ps -q -f name=hyperlane-relayer-spoke)" ]; then \
		docker stop hyperlane-relayer-spoke; \
	else \
		echo "Relayer spoke daemon is not running"; \
	fi


build-permit2:
	cd ./external/permit2 && forge build

deploy-permit2: build-permit2
	@if [ -z "$(strip $(num_spoke_chains))" ]; then \
		cd ./external/permit2 && forge script ./script/DeployPermit2.s.sol:DeployPermit2 --private-key $(hyp_key) --rpc-url $(SPOKE_RPC_URL) --broadcast; \
	else \
		cd ./external/permit2 && \
		for i in $(shell seq 1 $(num_spoke_chains)); do \
			spoke_chain_port=$$(($(spoke_chain_port_start) + $$i)); \
			spoke_chain_url=http://127.0.0.1:$$spoke_chain_port; \
			forge script ./script/DeployPermit2.s.sol:DeployPermit2 --private-key $(hyp_key) --rpc-url $$spoke_chain_url --broadcast; \
		done; \
	fi

rewrite-hyperlane-addresses:
	@python update_hyperlane_info.py $(num_spoke_chains)

rewrite-aip-addresses:
	@python update_aip_info.py $(num_spoke_chains)

deploy-hub-contracts:
	cd external/arcadia-core-contracts && HUB_DEPLOYER=$(hub_deployer) \
	HUB_DEPLOYER_KEY=$(hub_deployer_key) \
	HUB_MAILBOX=$(hub_mailbox) \
	SPOKE_CHAIN_EVENT_VERIFIER=$(spoke_chain_event_verifier) \
	SPOKE_CHAIN_ID=$(spoke_chain_id) \
	HUB_CHAIN_ID=$(hub_chain_id) \
	forge script ./scripts/DeploymentHub.s.sol:DeploymentHub --private-key $(hyp_key) --rpc-url http://localhost:8545 --broadcast

deploy-spoke-contracts-initial:
	cd external/arcadia-core-contracts && SPOKE_DEPLOYER=$(spoke_deployer) \
	SPOKE_DEPLOYER_KEY=$(spoke_deployer_key) \
	SPOKE_MAILBOX=$(spoke_mailbox) \
	SPOKE_CHAIN_ID=$(spoke_chain_id) \
	HUB_CHAIN_ID=$(hub_chain_id) \
	PERMIT2_ADDRESS=$(permit2_address) \
	forge script ./scripts/DeploymentSpokeInitial.sol:DeploymentSpokeInitial --private-key $(hyp_key) --rpc-url http://localhost:8546 --broadcast

deploy-spoke-contracts:
	cd external/arcadia-core-contracts && SPOKE_DEPLOYER=$(spoke_deployer) \
	SPOKE_DEPLOYER_KEY=$(spoke_deployer_key) \
	SPOKE_MAILBOX=$(spoke_mailbox) \
	SPOKE_CHAIN_ID=$(spoke_chain_id) \
	HUB_CHAIN_ID=$(hub_chain_id) \
	PERMIT2_ADDRESS=$(permit2_address) \
	SPOKE_CHAIN_EVENT_VERIFIER=$(spoke_chain_event_verifier) \
	HUB_CHAIN_EVENT_VERIFIER=$(hub_chain_event_verifier) \
	SPOKE_PUBLISHER=$(spoke_publisher) \
	SPOKE_HANDLER=$(spoke_handler) \
	forge script ./scripts/DeploymentSpoke.s.sol:DeploymentSpoke --private-key $(hyp_key) --rpc-url http://localhost:8546 --broadcast

deploy-hub-core:
	source .env.core.hub && cd external/arcadia-core-contracts && forge script ./scripts/DeploymentHubCore.s.sol:DeploymentHubCore --private-key $(hyp_key) --rpc-url http://localhost:8545 --broadcast

deploy-spoke-integration-initial:
	source .env.core.hub && cd external/arcadia-core-contracts && forge script  ./scripts/DeploymentSpoke.s.sol:DeploymentSpoke --private-key $(hyp_key) --rpc-url http://localhost:8546 --broadcast

deploy-hub-side-spoke-integration:
	source .env.core.hub && cd external/arcadia-core-contracts && forge script ./scripts/DeploySpokeIntegrationOnHub.s.sol:DeploySpokeIntegrationOnHub --private-key $(hyp_key) --rpc-url http://localhost:8545 --broadcast

## ────────────────────────────────────────────────────────────────────────
## Deploy Core
## ────────────────────────────────────────────────────────────────────────
hub-core:
	source .env.dev && \
	cd external/arcadia-core-contracts && \
	DEV_CHAIN_ID=$(HUB_CHAIN_ID) \
	forge script ./scripts/HubDeployCoreProtocol.s.sol:HubDeployCoreProtocol \
	    --rpc-url $(HUB_RPC) \
	    --private-key $(PRIVATE_KEY) --broadcast

spoke-core:
	cd external/arcadia-core-contracts && \
	for i in $$(seq 1 $(NUM_SPOKE_CHAINS)); do \
	  spoke_chain_url=http://127.0.0.1:$$(($(spoke_chain_port_start) + $$i)); \
	  echo "Deploying spoke core on $$spoke_chain_url"; \
	  spoke_chain_id=$$(($(spoke_chain_id_start) + $$i)); \
	  mailbox_var="SPOKE_MAILBOX_$$spoke_chain_id"; \
	  SPOKE_MAILBOX="$${!mailbox_var}"; \
	  DEV_CHAIN_ID=$$spoke_chain_id \
	  HUB_CHAIN_ID=$(HUB_CHAIN_ID) \
	  SPOKE_MAILBOX=$$SPOKE_MAILBOX \
	  forge script ./scripts/SpokeDeployCoreProtocol.s.sol:SpokeDeployCoreProtocol \
	      --rpc-url $$spoke_chain_url \
	      --private-key $(PRIVATE_KEY) --broadcast; \
	done

## ────────────────────────────────────────────────────────────────────────
## Deploy Bridge Adapters
## ────────────────────────────────────────────────────────────────────────

hub-bridge:
	source .env.core.hub && \
	cd external/arcadia-core-contracts && \
	echo "Deploying hub adapter for spoke chain $(SPOKE_CHAIN_ID)"; \
	DEV_CHAIN_ID=$(HUB_CHAIN_ID) \
	SPOKE_CHAIN_ID=$(SPOKE_CHAIN_ID) \
	forge script ./scripts/HubDeployHyperFlowBridge.s.sol:HubDeployHyperFlowBridge \
	    --rpc-url $(HUB_RPC) \
	    --private-key $(PRIVATE_KEY) --broadcast

spoke-bridge:
	cd external/arcadia-core-contracts && \
	for i in $$(seq 1 $(NUM_SPOKE_CHAINS)); do \
	  spoke_chain_url=http://127.0.0.1:$$(($(spoke_chain_port_start) + $$i)); \
	  echo "Deploying spoke bridge on $$spoke_chain_url"; \
	  spoke_chain_id=$$(($(spoke_chain_id_start) + $$i)); \
	  DEV_CHAIN_ID=$$spoke_chain_id \
	  HUB_CHAIN_ID=$(HUB_CHAIN_ID) \
	  SPOKE_CHAIN_ID=$$spoke_chain_id \
	  forge script ./scripts/SpokeDeployHyperFlowBridge.s.sol:SpokeDeployHyperFlowBridge \
	      --rpc-url $$spoke_chain_url \
	      --private-key $(PRIVATE_KEY) --broadcast; \
	done

## ────────────────────────────────────────────────────────────────────────
## Wire Provers ↔ Verifiers
## ────────────────────────────────────────────────────────────────────────
hub-connect:
	cd external/arcadia-core-contracts && \
	for i in $$(seq 1 $(NUM_SPOKE_CHAINS)); do \
	  spoke_chain_id=$$(( $(spoke_chain_id_start) + $$i )); \
	  echo "Rotating hub prover for spoke $$spoke_chain_id"; \
	  SPOKE_CHAIN_ID=$$spoke_chain_id \
	  DEV_CHAIN_ID=$(HUB_CHAIN_ID) \
	  SPOKE_MAILBOX=$(HUB_MAILBOX) \
	  forge script \
	    ./scripts/HubConnectProverToVerifier.s.sol:HubConnectProverToVerifier \
	    --rpc-url $(HUB_RPC) \
	    --private-key $(PRIVATE_KEY) \
	    --broadcast; \
	done

spoke-connect:
	cd external/arcadia-core-contracts && \
	for i in $$(seq 1 $(NUM_SPOKE_CHAINS)); do \
	  spoke_chain_id=$$(( $(spoke_chain_id_start) + $$i )); \
	  spoke_chain_url="http://127.0.0.1:$$(($(spoke_chain_port_start) + $$i))"; \
	  echo "Rotating spoke prover on chain $$spoke_chain_id at $$spoke_chain_url"; \
	  mailbox_var="SPOKE_MAILBOX_$$spoke_chain_id"; \
	  SPOKE_MAILBOX="$${!mailbox_var}"; \
	  SPOKE_CHAIN_ID=$$spoke_chain_id \
	  DEV_CHAIN_ID=$$spoke_chain_id \
	  EVENT_PROVER=$(EVENT_PROVER) \
	  SPOKE_MAILBOX=$$SPOKE_MAILBOX \
	  forge script \
	    ./scripts/SpokeConnectProverToVerifier.s.sol:SpokeConnectProverToVerifier \
	    --rpc-url $$spoke_chain_url \
	    --private-key $(PRIVATE_KEY) \
	    --broadcast; \
	done

## ────────────────────────────────────────────────────────────────────────
## Connect Remote Provers
## ────────────────────────────────────────────────────────────────────────
hub-connect-remote-prover:
	cd external/arcadia-core-contracts && \
	echo "Rotating hub prover"; \
	DEV_CHAIN_ID=$(HUB_CHAIN_ID) \
	forge script ./scripts/HubConnectRemoteProver.s.sol:HubConnectRemoteProver \
	    --rpc-url $(HUB_RPC) \
	    --private-key $(PRIVATE_KEY) --broadcast;

spoke-connect-remote-prover:
	cd external/arcadia-core-contracts && \
	for i in $$(seq 1 $(NUM_SPOKE_CHAINS)); do \
	  spoke_chain_url=http://127.0.0.1:$$(($(spoke_chain_port_start) + $$i)); \
	  echo "Rotating spoke prover on $$spoke_chain_url"; \
	  DEV_CHAIN_ID=$$(( $(spoke_chain_id_start) + $$i)) \
	  forge script ./scripts/SpokeConnectRemoteProver.s.sol:SpokeConnectRemoteProver \
	      --rpc-url $$spoke_chain_url \
	      --private-key $(PRIVATE_KEY) --broadcast; \
	done

## ────────────────────────────────────────────────────────────────────────
## Register Spoke Bridge Event
## ────────────────────────────────────────────────────────────────────────
spoke-bridge-event-registration:
	cd external/arcadia-core-contracts && \
	for i in $$(seq 1 $(NUM_SPOKE_CHAINS)); do \
	  spoke_chain_url=http://127.0.0.1:$$(($(spoke_chain_port_start) + $$i)); \
	  spoke_chain_id=$$(( $(spoke_chain_id_start) + $$i)); \
	  echo "Wiring spoke withdrawal on $$spoke_chain_url (chain $$spoke_chain_id)"; \
	  DEV_CHAIN_ID=$$spoke_chain_id \
	  HUB_CHAIN_ID=$(HUB_CHAIN_ID) \
	  SPOKE_CHAIN_ID=$$spoke_chain_id \
	  forge script ./scripts/SpokeBridgeEventRegistration.s.sol:SpokeBridgeEventRegistration \
	    --rpc-url $$spoke_chain_url \
	    --private-key $(PRIVATE_KEY) --broadcast; \
	done

hub-bridge-event-registration:
	source .env.core.hub && \
	cd external/arcadia-core-contracts && \
	for i in $$(seq 1 $(NUM_SPOKE_CHAINS)); do \
	  spoke_chain_id=$$(( $(spoke_chain_id_start) + $$i)); \
	  echo "Wiring hub deposit for spoke chain $$spoke_chain_id"; \
	  DEV_CHAIN_ID=$(HUB_CHAIN_ID) \
	  SPOKE_CHAIN_ID=$$spoke_chain_id \
	  forge script ./scripts/HubBridgeEventRegistration.s.sol:HubBridgeEventRegistration \
	    --rpc-url $(HUB_RPC) \
	    --private-key $(PRIVATE_KEY) --broadcast; \
	done

## ────────────────────────────────────────────────────────────────────────
## Set default gas amount
## ────────────────────────────────────────────────────────────────────────
spoke-set-default-gas:
	cd external/arcadia-core-contracts && \
	for i in $$(seq 1 $(NUM_SPOKE_CHAINS)); do \
	  spoke_chain_url=http://127.0.0.1:$$(($(spoke_chain_port_start) + $$i)); \
	  spoke_chain_id=$$(( $(spoke_chain_id_start) + $$i)); \
	  echo "Setting default gas for spoke chain $$i at $$spoke_chain_url"; \
	  DEV_CHAIN_ID=$$spoke_chain_id \
	  HUB_CHAIN_ID=$(HUB_CHAIN_ID) \
	  SPOKE_CHAIN_ID=$$spoke_chain_id \
	  forge script ./scripts/SpokeSetGasAmount.s.sol:SpokeSetGasAmount \
	    --rpc-url $$spoke_chain_url \
	    --private-key $(PRIVATE_KEY) --broadcast; \
	done

hub-set-default-gas:
	cd external/arcadia-core-contracts && \
	for i in $$(seq 1 $(NUM_SPOKE_CHAINS)); do \
	  spoke_chain_id=$$(( $(spoke_chain_id_start) + $$i)); \
	  echo "Setting default gas for hub chain for spoke chain $$spoke_chain_id"; \
	  DEV_CHAIN_ID=$(HUB_CHAIN_ID) \
	  SPOKE_CHAIN_ID=$$spoke_chain_id \
	  forge script ./scripts/HubSetGasAmount.s.sol:HubSetGasAmount \
	    --rpc-url $(HUB_RPC) \
	    --private-key $(PRIVATE_KEY) --broadcast; \
	done

## ────────────────────────────────────────────────────────────────────────
## One‑shot full dev‑stack
## ────────────────────────────────────────────────────────────────────────
deploy-aip-contracts: hub-core spoke-core hub-bridge spoke-bridge wire-deposit wire-withdrawal hub-connect spoke-connect hub-connect-remote-prover spoke-connect-remote-prover
	@echo "All contracts deployed and wired on hub + $(NUM_SPOKE_CHAINS) spokes"

show-hyperlane-hub-addresses:
	cat ~/.hyperlane/chains/arcadialocal/addresses.yaml

show-hyperlane-spoke-addresses:
	@if [ -z "$(strip $(num_spoke_chains))" ]; then \
		cat ~/.hyperlane/chains/spokelocal/addresses.yaml; \
	else \
		for i in $(shell seq 1 $(num_spoke_chains)); do \
			spoke_chain_name=$(spoke_chain_name_common)$$i; \
			echo "$$spoke_chain_name"; \
			cat ~/.hyperlane/chains/$$spoke_chain_name/addresses.yaml; \
			echo "--------------------------------"; \
		done; \
	fi

add-spoke-token:
	@source .env.dev && cd external/arcadia-core-contracts && { \
		if [ -z "$(strip $(num_spoke_chains))" ]; then \
			echo "make sure to set env variables for NAME, SYMBOL"; \
			forge script ./scripts/event_system_new/DeploySpokeToken.s.sol --private-key $(PRIVATE_KEY) --rpc-url $(SPOKE_RPC_URL) --broadcast; \
		else \
			for i in $(shell seq 1 $(num_spoke_chains)); do \
				spoke_chain_url=http://127.0.0.1:$$(($(spoke_chain_port_start) + $$i)); \
				spoke_chain_name=$(spoke_chain_name_common)$$i; \
				spoke_chain_id=$$(($(spoke_chain_id_start) + $$i)); \
				env DEV_CHAIN_ID=$$spoke_chain_id NAME="token$$spoke_chain_name" SYMBOL="t$$spoke_chain_id" \
				forge script ./scripts/event_system_new/DeploySpokeToken.s.sol:DeploySpokeToken --private-key $(PRIVATE_KEY) --rpc-url $$spoke_chain_url --broadcast; \
			done; \
		fi; \
	}

add-m-token-to-hub:
	@source .env.dev && cd external/arcadia-core-contracts && { \
		if [ -z "$(strip $(num_spoke_chains))" ]; then \
			echo "make sure to set env variables for CHAIN_ID, NAME, SYMBOL, SPOKE_TOKEN"; \
			forge script ./scripts/event_system_new/AddMTokenToHub.s.sol --private-key $(PRIVATE_KEY) --rpc-url $(HUB_RPC) --broadcast; \
		else \
			for i in $(shell seq 1 $(num_spoke_chains)); do \
				spoke_chain_id=$$(($(spoke_chain_id_start) + $$i)); \
				spoke_chain_name=$(spoke_chain_name_common)$$i; \
				spoke_token=$$(python3 ../../utils.py get_spoke_token_address $$spoke_chain_id); \
				echo "$$spoke_token"; \
				env DEV_CHAIN_ID=$$spoke_chain_id NAME="mtoken$$spoke_chain_name" SYMBOL="m$$spoke_chain_id" SPOKE_TOKEN=$$spoke_token \
				forge script ./scripts/event_system_new/AddMTokenToHub.s.sol:AddMTokenToHub --private-key $(PRIVATE_KEY) --rpc-url $(HUB_RPC) --broadcast; \
			done; \
		fi; \
	}

check-spoke-system:
	source .env.dev && cd external/arcadia-core-contracts && forge script ./scripts/event_system_new/CheckSpokeSystem.s.sol --private-key $(PRIVATE_KEY) --rpc-url $(SPOKE_RPC_URL)

build-medusa:
	@cd external/medusa-api-server && cargo build --release --all
	
build-medusa-image:
	@docker build --build-arg BUILDKIT_INLINE_CACHE=1 -t medusa-api-server:local-latest ./external/medusa-api-server

start-medusa:
	@cd external/medusa-api-server && RUST_BACKTRACE=1 ./target/release/medusa-service ./config.toml --reset

# this old dev branch is built to the medusa binary. This is the feature branches should use start-medusa
start-medusa-baseline:
	@cd external/medusa-api-server && RUST_BACKTRACE=1 ./target/release/medusa ./config.toml --reset

start-medusa-daemon:
	@docker run -d -p 8001:8001 -p 8002:8002 --net arcadia-local-network -v $(PWD)/external/medusa-api-server/daemon-config.toml:/app/config.toml -v $(PWD)/external/medusa-api-server/free-space:/app/free-space -v $(PWD)/external/arcadia-core-contracts:/app/contracts/arcadia-core-contracts --name medusa-api-server medusa-api-server:local-latest /bin/sh -c "/app/medusa /app/config.toml --reset"

stop-medusa-daemon:
	@if [ "$$(docker ps -q -f name=medusa-api-server)" ]; then \
		docker stop medusa-api-server; \
	else \
		echo "Container medusa-api-server is not running"; \
	fi

register-solver:
	@curl --location 'http://127.0.0.1:8001' \
	--header 'Content-Type: application/json' \
	--data '{ \
		"jsonrpc": "2.0", \
		"id": 1, \
		"method": "requestAddSolver", \
		"params": [ \
			{ \
				"payload": { \
					"address": "0x63fac9201494f0bd17b9892b9fae4d52fe3bd377", \
					"nonce": 37, \
					"chain_id": 31337 \
				}, \
				"signature": { \
					"r": "0x800fb83ee3525c4589a0da762544e067fc01ce6095a41a88444900585e77fb4c", \
					"s": "0x341d63d47f325d82f041a7bce43a55caad9cf20360c93b05e0dc1312c291b543", \
					"yParity": "0x0" \
				} \
			} \
		] \
	}'

start-solver:
	@cd external/medusa-api-server && cargo run --release -p arcadia-solver ./crates/solver/config.toml

start-solver-daemon:
	@docker run --rm -d --net arcadia-local-network -v $(PWD)/external/medusa-api-server/crates/solver/daemon-config.toml:/app/daemon-config.toml --name arcadia-solver medusa-api-server:local-latest /bin/sh -c  "/app/arcadia-solver /app/daemon-config.toml"

stop-solver-daemon:
	@if [ "$$(docker ps -q -f name=arcadia-solver)" ]; then \
		docker stop arcadia-solver; \
	else \
		echo "Container arcadia-solver is not running"; \
	fi

build-refunder:
	@cd external/arcadia-agents && cargo build --release
	@docker build --build-arg BUILDKIT_INLINE_CACHE=1 -t arcadia-agents:local-latest ./external/arcadia-agents

start-refunder:
	@cd external/arcadia-agents && ./target/release/refunder-agent ./config.toml ./chain_config.toml

start-refunder-daemon:
	@docker run --rm -d -v $(PWD)/external/arcadia-agents/daemon-config.toml:/app/config.toml -v $(PWD)/external/arcadia-agents/daemon-chain-config.toml:/app/chain_config.toml --net arcadia-local-network --name arcadia-agents arcadia-agents:local-latest /bin/sh -c "/app/refunder-agent /app/config.toml /app/chain_config.toml"

stop-refunder-daemon:
	@if [ "$$(docker ps -q -f name=arcadia-agents)" ]; then \
		docker stop arcadia-agents; \
	else \
		echo "Container arcadia-agents is not running"; \
	fi

deploy-gas-oracle:
	source .env.dev && cd external/gas-oracle-service && cargo run --release

run-provide-liquidity:
	cd external/khalani-sdk && yarn test -- provideLiquidity.devenv --testPathIgnorePatterns dist 

run-bridge:
	cd external/khalani-sdk && yarn test -- bridge.devenv --testPathIgnorePatterns dist

stop-all-daemons: stop-medusa-daemon stop-refunder-daemon stop-solver-daemon stop-validator-hub-daemon stop-validator-spoke-daemons stop-relayer-hub-daemon stop-relayer-spoke-daemons
	@if [ "$$(docker ps -q -f name=$(hub_chain_name))" ]; then \
		docker stop $(hub_chain_name); \
		echo "Stopped $(hub_chain_name) container"; \
	else \
		echo "Container $(hub_chain_name) is not running"; \
	fi
	@for i in $(shell seq 1 $(num_spoke_chains)); do \
		spoke_chain_name=$(spoke_chain_name_common)$$i; \
		if [ "$$(docker ps -q -f name=$(spoke_chain_name))" ]; then \
			docker stop $$spoke_chain_name; \
			echo "Stopped $$spoke_chain_name container"; \
		else \
			echo "Container $$spoke_chain_name is not running"; \
		fi \
	done
	@if [ "$$(docker network ls -q -f name=arcadia-local-network)" ]; then \
		echo "Stopping arcadia-local-network..."; \
		docker network rm arcadia-local-network; \
		echo "Stopped arcadia-local-network"; \
	else \
		echo "Network arcadia-local-network does not exist"; \
	fi

clean: stop-all-daemons
	@rm -r ./hyp-local/configs* 2>/dev/null || true
	@rm -rf $(hub_chain_dir) 2>/dev/null || true
	@rm -rf $(hyperlane_dir)/chains/ 2>/dev/null || true

clean-local-chains:
	rm -rf $(hub_chain_dir)
	rm -rf $(spoke_chain_dir)
	rm -rf $(another_spoke_chain_dir)
