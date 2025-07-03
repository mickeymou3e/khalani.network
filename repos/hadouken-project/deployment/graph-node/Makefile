TVL_ID=803035318642
CAPABILITIES=CAPABILITY_IAM CAPABILITY_AUTO_EXPAND
REGION=us-east-1
TEMPLATE_FILE=main.yaml
VERSION=current
ARTIFACT_NAME=main.zip
ACCOUNT_ID=$(shell aws sts get-caller-identity | jqn 'get("Account")')

STACK_NAME_MAINNET=hadouken-graph-node-multichain-mainnet
PARAMETERS_FILE_MAINNET=template-config-mainnet.json
PARAMETERS_MAINNET=$(shell cat $(PARAMETERS_FILE_MAINNET) | jqn 'get("Parameters") | entries | map(x => x[0] + "=" + x[1]) | join(" ")')
## REMEMBER TO CREATE BUCKET IN AWS
ARTIFACTS_BUCKET_NAME_MAINNET=artifacts.multichain.graph-node-mainnet-hadouken
ARTIFACTS_S3_PREFIX_MAINNET=hadouken/graph-node-multichain-mainnet

STACK_NAME_TESTNET=hadouken-graph-node-multichain-testnet
PARAMETERS_FILE_TESTNET=template-config-testnet.json
PARAMETERS_TESTNET=$(shell cat $(PARAMETERS_FILE_TESTNET) | jqn 'get("Parameters") | entries | map(x => x[0] + "=" + x[1]) | join(" ")')
## REMEMBER TO CREATE BUCKET IN AWS
ARTIFACTS_BUCKET_NAME_TESTNET=artifacts.multichain.graph-node-testnet-hadouken
ARTIFACTS_S3_PREFIX_TESTNET=hadouken/graph-node-multichain-testnet

.PHONY: build
build:
	sam build

.PHONY: check-aws-account-id-env
check-aws-account-id-env:
	@if [ -z "$(ACCOUNT_ID)" ]; then \
		echo "Set proper AWS config"; \
	else \
		if [ "$(ACCOUNT_ID)" = "$(TVL_ID)" ]; then \
			echo "TVL Account: ${ACCOUNT_ID}"; \
			while [ -z "$$CONTINUE" ]; do \
				read -r -p "Procced with this account?[y/CTRL-C to abort]: " CONTINUE; \
			done ; \
		fi \
	fi


.PHONY: upload-artifact-mainnet
upload-artifact-mainnet: build
	sam package --output-template-file $(TEMPLATE_FILE) --s3-bucket $(ARTIFACTS_BUCKET_NAME_MAINNET) --s3-prefix $(ARTIFACTS_S3_PREFIX_MAINNET)/$(VERSION) --region $(REGION)
	zip $(ARTIFACT_NAME) $(TEMPLATE_FILE) $(PARAMETERS_FILE_MAINNET) Makefile
	aws s3 cp $(ARTIFACT_NAME) s3://$(ARTIFACTS_BUCKET_NAME_MAINNET)/$(ARTIFACTS_S3_PREFIX_MAINNET)/$(VERSION)/ --region $(REGION)

.PHONY: upload-artifact-testnet
upload-artifact-testnet: build
	sam package --output-template-file $(TEMPLATE_FILE) --s3-bucket $(ARTIFACTS_BUCKET_NAME_TESTNET) --s3-prefix $(ARTIFACTS_S3_PREFIX_TESTNET)/$(VERSION) --region $(REGION)
	zip $(ARTIFACT_NAME) $(TEMPLATE_FILE) $(PARAMETERS_FILE_TESTNET) Makefile
	aws s3 cp $(ARTIFACT_NAME) s3://$(ARTIFACTS_BUCKET_NAME_TESTNET)/$(ARTIFACTS_S3_PREFIX_TESTNET)/$(VERSION)/ --region $(REGION)

.PHONY: deploy-mainnet
deploy-mainnet: check-aws-account-id-env
	$(MAKE) upload-artifact-mainnet
	sam deploy --template-file $(TEMPLATE_FILE) --stack-name $(STACK_NAME_MAINNET) --capabilities $(CAPABILITIES)  --region $(REGION) --parameter-overrides $(PARAMETERS_MAINNET)

.PHONY: deploy-testnet
deploy-testnet: check-aws-account-id-env
	$(MAKE) upload-artifact-testnet
	sam deploy --template-file $(TEMPLATE_FILE) --stack-name $(STACK_NAME_TESTNET) --capabilities $(CAPABILITIES)  --region $(REGION) --parameter-overrides $(PARAMETERS_TESTNET)
