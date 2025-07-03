TEMPLATE=serverless.yaml
S3_BUCKET=lockdrop-backend
OUTPUT=lambda.yaml

## to deploy first build then deploy-testnet or deploy-mainnet

.PHONY: build
build: 
	rm -rf node_modules
	yarn --prod
	sam package --template-file ${TEMPLATE} --s3-bucket ${S3_BUCKET} --output-template-file ${OUTPUT}
	rm -rf node_modules
	yarn

.PHONY: deploy
deploy:
	export PARAMETERS="$$(cat $(PARAMETERS_FILE) | jqn 'get("Parameters") | entries | map(x => x[0] + "=" + x[1]) | join(" ")')" && \
	sam deploy --template-file ${OUTPUT} --stack-name ${STACK_NAME} --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND --parameter-overrides $$PARAMETERS

.PHONY: deploy-testnet
deploy-testnet: STACK_NAME=lockdrop-lambda-testnet
deploy-testnet: PARAMETERS_FILE=config/testnet.json
deploy-testnet: deploy

.PHONY: deploy-mainnet
deploy-mainnet: STACK_NAME=lockdrop-lambda-mainnet
deploy-mainnet: PARAMETERS_FILE=config/mainnet.json
deploy-mainnet: deploy