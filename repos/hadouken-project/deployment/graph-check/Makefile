STACK_NAME_BALANCER_GODWOKEN_MAINNET=graphCheck-swap-godwoken-prod
STACK_NAME_BALANCER_GODWOKEN_TESTNET=graphCheck-swap-godwoken-dev
STACK_NAME_BALANCER_ZKSYNC_TESTNET=graphCheck-swap-zksync-dev
STACK_NAME_BALANCER_MANTLE_TESTNET=graphCheck-swap-mantle-dev


STACK_NAME_LENDING_GODWOKEN_MAINNET=graphCheck-lending-godwoken-prod
STACK_NAME_LENDING_GODWOKEN_TESTNET=graphCheck-lending-godwoken-dev
STACK_NAME_LENDING_ZKSYNC_TESTNET=graphCheck-lending-zksync-dev
STACK_NAME_LENDING_MANTLE_TESTNET=graphCheck-lending-mantle-dev


REGION=eu-central-1
CAPABILITIES=CAPABILITY_IAM CAPABILITY_AUTO_EXPAND

remove-zip:
	rm -f entry.zip

build-code:
	yarn && yarn build

zip-code: remove-zip build-code
	zip -r entry.zip dist node_modules

.deploy: 
	export PARAMETERS="$$(cat $(PARAMETERS_FILE) | jqn 'get("Parameters") | entries | map(x => x[0] + "=" + x[1]) | join(" ")')" && \
	sam deploy --template-file $(TEMPLATE_NAME) --stack-name $(STACK_NAME) --capabilities $(CAPABILITIES) --region $(REGION) --resolve-s3 --parameter-overrides $$PARAMETERS

.PHONY: deploy-godwoken-balancer-mainnet
deploy-godwoken-balancer-mainnet: TEMPLATE_NAME=graph-check.yml
deploy-godwoken-balancer-mainnet: PARAMETERS_FILE=${STACK_NAME_BALANCER_GODWOKEN_MAINNET}.json
deploy-godwoken-balancer-mainnet: STACK_NAME=${STACK_NAME_BALANCER_GODWOKEN_MAINNET}
deploy-godwoken-balancer-mainnet: zip-code entry.zip .deploy

.PHONY: deploy-godwoken-balancer-testnet
deploy-godwoken-balancer-testnet: TEMPLATE_NAME=graph-check.yml
deploy-godwoken-balancer-testnet: PARAMETERS_FILE=${STACK_NAME_BALANCER_GODWOKEN_TESTNET}.json
deploy-godwoken-balancer-testnet: STACK_NAME=${STACK_NAME_BALANCER_GODWOKEN_TESTNET}
deploy-godwoken-balancer-testnet: zip-code entry.zip .deploy

.PHONY: deploy-zksync-balancer-testnet
deploy-zksync-balancer-testnet: TEMPLATE_NAME=graph-check.yml
deploy-zksync-balancer-testnet: PARAMETERS_FILE=${STACK_NAME_BALANCER_ZKSYNC_TESTNET}.json
deploy-zksync-balancer-testnet: STACK_NAME=${STACK_NAME_BALANCER_ZKSYNC_TESTNET}
deploy-zksync-balancer-testnet: zip-code entry.zip .deploy

.PHONY: deploy-godwoken-lending-mainnet
deploy-godwoken-lending-mainnet: TEMPLATE_NAME=graph-check.yml
deploy-godwoken-lending-mainnet: PARAMETERS_FILE=${STACK_NAME_LENDING_GODWOKEN_MAINNET}.json
deploy-godwoken-lending-mainnet: STACK_NAME=${STACK_NAME_LENDING_GODWOKEN_MAINNET}
deploy-godwoken-lending-mainnet: zip-code entry.zip .deploy

.PHONY: deploy-godwoken-lending-testnet
deploy-godwoken-lending-testnet: TEMPLATE_NAME=graph-check.yml
deploy-godwoken-lending-testnet: PARAMETERS_FILE=${STACK_NAME_LENDING_GODWOKEN_TESTNET}.json
deploy-godwoken-lending-testnet: STACK_NAME=${STACK_NAME_LENDING_GODWOKEN_TESTNET}
deploy-godwoken-lending-testnet: zip-code entry.zip .deploy

.PHONY: deploy-zksync-lending-testnet
deploy-zksync-lending-testnet: TEMPLATE_NAME=graph-check.yml
deploy-zksync-lending-testnet: PARAMETERS_FILE=${STACK_NAME_LENDING_ZKSYNC_TESTNET}.json
deploy-zksync-lending-testnet: STACK_NAME=${STACK_NAME_LENDING_ZKSYNC_TESTNET}
deploy-zksync-lending-testnet: zip-code entry.zip .deploy

.PHONY: deploy-mantle-balancer-testnet
deploy-mantle-balancer-testnet: TEMPLATE_NAME=graph-check.yml
deploy-mantle-balancer-testnet: PARAMETERS_FILE=${STACK_NAME_BALANCER_MANTLE_TESTNET}.json
deploy-mantle-balancer-testnet: STACK_NAME=${STACK_NAME_BALANCER_MANTLE_TESTNET}
deploy-mantle-balancer-testnet: zip-code entry.zip .deploy

.PHONY: deploy-mantle-lending-testnet
deploy-mantle-lending-testnet: TEMPLATE_NAME=graph-check.yml
deploy-mantle-lending-testnet: PARAMETERS_FILE=${STACK_NAME_LENDING_MANTLE_TESTNET}.json
deploy-mantle-lending-testnet: STACK_NAME=${STACK_NAME_LENDING_MANTLE_TESTNET}
deploy-mantle-lending-testnet: zip-code entry.zip .deploy

destroy-godwoken-balancer-mainnet:
	aws cloudformation delete-stack --stack-name $(STACK_NAME_BALANCER_GODWOKEN_MAINNET) --region $(REGION)

destroy-godwoken-balancer-testnet:
	aws cloudformation delete-stack --stack-name $(STACK_NAME_BALANCER_GODWOKEN_TESTNET) --region $(REGION)

destroy-zksync-balancer-testnet:
	aws cloudformation delete-stack --stack-name $(STACK_NAME_BALANCER_ZKSYNC_TESTNET) --region $(REGION)

destroy-godwoken-lending-mainnet:
	aws cloudformation delete-stack --stack-name $(STACK_NAME_LENDING_GODWOKEN_MAINNET) --region $(REGION)

destroy-godwoken-lending-testnet:
	aws cloudformation delete-stack --stack-name $(STACK_NAME_LENDING_GODWOKEN_TESTNET) --region $(REGION)

destroy-zksync-lending-testnet:
	aws cloudformation delete-stack --stack-name $(STACK_NAME_LENDING_ZKSYNC_TESTNET) --region $(REGION)

destroy-mantle-lending-testnet:
	aws cloudformation delete-stack --stack-name $(STACK_NAME_LENDING_MANTLE_TESTNET) --region $(REGION)

destroy-mantle-balancer-testnet:
	aws cloudformation delete-stack --stack-name $(STACK_NAME_BALANCER_MANTLE_TESTNET) --region $(REGION)

destroy-graph-check-lending-mainnet:
	aws cloudformation delete-stack --stack-name $(STACK_NAME_LENDING_MAINNET) --region $(REGION)