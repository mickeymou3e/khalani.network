CAPABILITIES=CAPABILITY_IAM CAPABILITY_AUTO_EXPAND
REGION=us-east-1

# Landing
landing: export STACK_NAME=hadouken-landing
landing: export PARAMETERS_FILE=mainnet/config/template-config.landing.json
landing: export PARAMETERS=$(shell cat $(PARAMETERS_FILE) | jqn 'get("Parameters") | entries | map(x => x[0] + "=" + x[1]) | join(" ")')
landing:
	sam deploy --template-file template.yml --stack-name $(STACK_NAME) --capabilities $(CAPABILITIES)  --region $(REGION) --parameter-overrides $(PARAMETERS)

# Landing Beta
swap-v1-beta: export STACK_NAME=hadouken-swap-v1-beta
swap-v1-beta: export PARAMETERS_FILE=mainnet/config/template-config.swap-v1-beta.json
swap-v1-beta: export PARAMETERS=$(shell cat $(PARAMETERS_FILE) | jqn 'get("Parameters") | entries | map(x => x[0] + "=" + x[1]) | join(" ")')
swap-v1-beta:
	sam deploy --template-file template.yml --stack-name $(STACK_NAME) --capabilities $(CAPABILITIES)  --region $(REGION) --parameter-overrides $(PARAMETERS)

# Swap v0
swap-v0: export STACK_NAME=hadouken-swap-v0
swap-v0: export PARAMETERS_FILE=mainnet/config/template-config.swap-v0.json
swap-v0: export PARAMETERS=$(shell cat $(PARAMETERS_FILE) | jqn 'get("Parameters") | entries | map(x => x[0] + "=" + x[1]) | join(" ")')
swap-v0:
	sam deploy --template-file template.yml --stack-name $(STACK_NAME) --capabilities $(CAPABILITIES)  --region $(REGION) --parameter-overrides $(PARAMETERS)

# CKB Rpc proxy
ckb-rpc-proxy: export STACK_NAME=hadouken-ckb-rpc-proxy
ckb-rpc-proxy: export PARAMETERS_FILE=mainnet/config/template-config.ckb-rpc-proxy.json
ckb-rpc-proxy: export PARAMETERS=$(shell cat $(PARAMETERS_FILE) | jqn 'get("Parameters") | entries | map(x => x[0] + "=" + x[1]) | join(" ")')
ckb-rpc-proxy:
	sam deploy --template-file https-proxy.yml --stack-name $(STACK_NAME) --capabilities $(CAPABILITIES)  --region $(REGION) --parameter-overrides $(PARAMETERS)

# Lending administration dashboard
admin-dashboard: export STACK_NAME=admin-dashboard
admin-dashboard: export PARAMETERS_FILE=mainnet/config/template-config.admin-dashboard.json
admin-dashboard: export PARAMETERS=$(shell cat $(PARAMETERS_FILE) | jqn 'get("Parameters") | entries | map(x => x[0] + "=" + x[1]) | join(" ")')
admin-dashboard:
	sam deploy --template-file template.yml --stack-name $(STACK_NAME) --capabilities $(CAPABILITIES)  --region $(REGION) --parameter-overrides $(PARAMETERS)


# Multi Applications app.hadouken.finance domain
applications: export STACK_NAME=hadouken-applications
applications: export PARAMETERS_FILE=mainnet/config/template-config.applications.json
applications: export PARAMETERS=$(shell cat $(PARAMETERS_FILE) | jqn 'get("Parameters") | entries | map(x => x[0] + "=" + x[1]) | join(" ")')
applications:
	sam deploy --template-file applications.yml --stack-name $(STACK_NAME) --capabilities $(CAPABILITIES)  --region $(REGION) --parameter-overrides $(PARAMETERS)
