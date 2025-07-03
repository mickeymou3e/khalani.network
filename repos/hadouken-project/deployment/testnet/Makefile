CAPABILITIES=CAPABILITY_IAM CAPABILITY_AUTO_EXPAND
REGION=us-east-1

# Landing
landing-testnet: export STACK_NAME=hadouken-landing-testnet
landing-testnet: export PARAMETERS_FILE=testnet/config/template-config.landing.json
landing-testnet: export PARAMETERS=$(shell cat $(PARAMETERS_FILE) | jqn 'get("Parameters") | entries | map(x => x[0] + "=" + x[1]) | join(" ")')
landing-testnet:
	sam deploy --template-file template.yml --stack-name $(STACK_NAME) --capabilities $(CAPABILITIES)  --region $(REGION) --parameter-overrides $(PARAMETERS)


# Multi Applications testnet-app.hadouken.finance domain
applications-testnet: export STACK_NAME=hadouken-applications-testnet
applications-testnet: export PARAMETERS_FILE=testnet/config/template-config.applications.json
applications-testnet: export PARAMETERS=$(shell cat $(PARAMETERS_FILE) | jqn 'get("Parameters") | entries | map(x => x[0] + "=" + x[1]) | join(" ")')
applications-testnet:
	sam deploy --template-file applications.yml --stack-name $(STACK_NAME) --capabilities $(CAPABILITIES)  --region $(REGION) --parameter-overrides $(PARAMETERS)
