CAPABILITIES=CAPABILITY_IAM CAPABILITY_AUTO_EXPAND
REGION=us-east-1

STACK_NAME=hadouken-liquidation
PARAMETERS_FILE=config/template-config.json
PARAMETERS=$(shell cat $(PARAMETERS_FILE) | jqn 'get("Parameters") | entries | map(x => x[0] + "=" + x[1]) | join(" ")')

ARTIFACTS_BUCKET_NAME=artifacts.mainnet.hadouken-liquidation
ARTIFACTS_S3_PREFIX=hadouken-liquidation/mainnet

TEMPLATE_FILE=main.yaml

VERSION=current
ARTIFACT_NAME=main.zip

.PHONY: build-mainnet
build-mainnet:
	sam build

.PHONY: upload-artifact-mainnet
upload-artifact-mainnet: build-mainnet
	sam package --output-template-file $(TEMPLATE_FILE) --s3-bucket $(ARTIFACTS_BUCKET_NAME) --s3-prefix $(ARTIFACTS_S3_PREFIX)/$(VERSION) --region $(REGION)
	zip $(ARTIFACT_NAME) $(TEMPLATE_FILE) $(PARAMETERS_FILE) Makefile
	aws s3 cp $(ARTIFACT_NAME) s3://$(ARTIFACTS_BUCKET_NAME)/$(ARTIFACTS_S3_PREFIX)/$(VERSION)/ --region $(REGION)

.PHONY: deploy-mainnet
deploy-mainnet: upload-artifact-mainnet
	sam deploy --template-file $(TEMPLATE_FILE) --stack-name $(STACK_NAME) --capabilities $(CAPABILITIES)  --region $(REGION) --parameter-overrides $(PARAMETERS)


destroy-deploy-mainnet:
	aws cloudformation delete-stack --stack-name $(STACK_NAME) --region $(REGION)