include .env
export $(shell sed 's/=.*//' .env)

hyp_key=$(HYP_KEY)
hyperlane_dir=$(HOME)/.hyperlane
hub_chain_port=8545
hub_chain_id=31337
hub_chain_block_time=1
spoke_chain_port=8546
spoke_chain_id=31338
spoke_chain_block_time=1

hub_chain_name=arcadialocal
spoke_chain_name=spokelocal

hub_chain_dir=$(hyperlane_dir)/chains/$(hub_chain_name)
hub_chain_metadata_file=$(hub_chain_dir)/metadata.yaml
hub_chain_addresses_file=$(hub_chain_dir)/addresses.yaml

spoke_chain_dir=$(hyperlane_dir)/chains/$(spoke_chain_name)
spoke_chain_metadata_file=$(spoke_chain_dir)/metadata.yaml
spoke_chain_addresses_file=$(spoke_chain_dir)/addresses.yaml

spoke_deployer=$(SPOKE_DEPLOYER)
spoke_deployer_key=$(SPOKE_DEPLOYER_KEY)
spoke_mailbox=$(SPOKE_MAILBOX)
hub_deployer=$(HUB_DEPLOYER)
hub_deployer_key=$(HUB_DEPLOYER_KEY)
hub_mailbox=$(HUB_MAILBOX)
permit2_address=$(PERMIT2_ADDRESS)
gas_oracle=$(GAS_ORACLE_ADDRESS)
spoke_chain_event_verifier=$(SPOKE_CHAIN_EVENT_VERIFIER)
hub_chain_event_verifier=$(HUB_CHAIN_EVENT_VERIFIER)
spoke_publisher=$(SPOKE_PUBLISHER)
spoke_handler=$(SPOKE_HANDLER)

show:
	@echo $(hyp_key)
	@echo $(hyperlane_dir)
	@echo $(hub_chain_dir)
	@echo $(spoke_chain_addresses_file)
	@echo $(hub_deployer)


deps:
	npm install -g @hyperlane-xyz/cli



registry-hub:
	if [ -s $(hub_chain_metadata_file) ]; then \
		echo "spoke chain metadata exists"; \
	else \
		mkdir -p $(hub_chain_dir); \
		cp ./arcadialocal/metadata.yaml $(hub_chain_dir); \
	fi

registry-spoke:
	if [ -s $(spoke_chain_metadata_file) ]; then \
		echo "spoke chain metadata exists"; \
	else \
		mkdir -p $(spoke_chain_dir); \
		cp ./spokelocal/metadata.yaml $(spoke_chain_dir); \
	fi

registry: registry-hub registry-spoke

start-spoke:
	anvil --port $(spoke_chain_port) --chain-id $(spoke_chain_id) --block-time $(spoke_chain_block_time)

start-hub:
	anvil --port $(hub_chain_port) --chain-id $(hub_chain_id) --block-time $(hub_chain_block_time)

core-init:
	cd ./hyp-local && hyperlane core init -k $(hyp_key)

hub-core-deploy: core-init
	cd ./hyp-local && hyperlane core deploy -k $(hyp_key) --chain $(hub_chain_name)

spoke-core-deploy:
	cd ./hyp-local && hyperlane core deploy -k $(hyp_key) --chain $(spoke_chain_name)

deploy: hub-core-deploy spoke-core-deploy

build-permit2:
	cd ./ext-contracts/permit2 && forge build

deploy-permit2: build-permit2
	cd ./ext-contracts/permit2 && forge script ./script/DeployPermit2.s.sol:DeployPermit2 --private-key $(hyp_key) --rpc-url http://localhost:8546 --broadcast

deploy-hub-contracts:
	cd ../ && HUB_DEPLOYER=$(hub_deployer) \
	HUB_DEPLOYER_KEY=$(hub_deployer_key) \
	HUB_MAILBOX=$(hub_mailbox) \
	SPOKE_CHAIN_EVENT_VERIFIER=$(spoke_chain_event_verifier) \
	SPOKE_CHAIN_ID=$(spoke_chain_id) \
	HUB_CHAIN_ID=$(hub_chain_id) \
	forge script ./scripts/DeploymentHub.s.sol:DeploymentHub --private-key $(hyp_key) --rpc-url http://localhost:8545 --broadcast

deploy-spoke-contracts-initial:
	cd ../ && SPOKE_DEPLOYER=$(spoke_deployer) \
	SPOKE_DEPLOYER_KEY=$(spoke_deployer_key) \
	SPOKE_MAILBOX=$(spoke_mailbox) \
	SPOKE_CHAIN_ID=$(spoke_chain_id) \
	HUB_CHAIN_ID=$(hub_chain_id) \
	PERMIT2_ADDRESS=$(permit2_address) \
	forge script ./scripts/DeploymentSpokeInitial.sol:DeploymentSpokeInitial --private-key $(hyp_key) --rpc-url http://localhost:8546 --broadcast

deploy-spoke-contracts:
	cd .. && SPOKE_DEPLOYER=$(spoke_deployer) \
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

clean:
	rm -r ./hyp-local/configs*
	rm -rf $(hub_chain_dir)
	rm -rf $(spoke_chain_dir)
	
clean-local-chains:
	rm -rf $(hub_chain_dir)
	rm -rf $(spoke_chain_dir)