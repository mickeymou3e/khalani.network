CAPABILITIES=CAPABILITY_IAM CAPABILITY_AUTO_EXPAND

.PHONY: deploy-staging

../dist/src/lambdaEntrypoint.js: ${shell git ls-files --full-name '../src' | sed 's/^/..\//'}
	(cd .. && npm run build)

trading-bot.zip: ../dist/src/lambdaEntrypoint.js
	(cd .. && rm -f infra/trading-bot.zip && infra/node_modules/.bin/node-lambda zip -A . -x infra src && mv ./trading-bot.zip infra/trading-bot.zip)

.deploy: 
	export PARAMETERS="$$(cat $(PARAMETERS_FILE) | jqn 'get("Parameters") | entries | map(x => x[0] + "=" + x[1]) | join(" ")')" && \
	sam deploy --template-file $(TEMPLATE_NAME) --stack-name $(STACK_NAME) --capabilities $(CAPABILITIES)  --region $(REGION) --s3-bucket $(ARTIFACTS_BUCKET) --parameter-overrides $$PARAMETERS

deploy-binance: STACK_NAME=binance-bot
deploy-binance: REGION=eu-central-1
deploy-binance: PARAMETERS_FILE=template-config.binance.json
deploy-binance: TEMPLATE_NAME=binance.yml
deploy-binance: ARTIFACTS_BUCKET=trading-bot-artifacts-eu.hadouken.finance
deploy-binance: trading-bot.zip .deploy

deploy-yokai: STACK_NAME=arbitrage-bot
deploy-yokai: REGION=us-east-1
deploy-yokai: PARAMETERS_FILE=template-config.yokai.json
deploy-yokai: TEMPLATE_NAME=template.yml
deploy-yokai: ARTIFACTS_BUCKET=trading-bot-artifacts.hadouken.finance
deploy-yokai: trading-bot.zip .deploy

deploy-liquidation: STACK_NAME=liquidation-bot
deploy-liquidation: REGION=us-east-1
deploy-liquidation: PARAMETERS_FILE=template-config.liquidation.json
deploy-liquidation: TEMPLATE_NAME=liquidation.yml
deploy-liquidation: ARTIFACTS_BUCKET=trading-bot-artifacts.hadouken.finance
deploy-liquidation: trading-bot.zip .deploy

destroy:
	aws cloudformation delete-stack --stack-name $(STACK_NAME)   --region $(REGION)