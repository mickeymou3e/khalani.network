CAPABILITIES=CAPABILITY_IAM CAPABILITY_AUTO_EXPAND
REGION=us-east-1

admin-dashboard-godwoken-mainnet: export STACK_NAME=admin-dashboard-godwoken-mainnet
admin-dashboard-godwoken-mainnet: export PARAMETERS_FILE=${STACK_NAME}.json
admin-dashboard-godwoken-mainnet: export PARAMETERS=$(shell cat $(PARAMETERS_FILE) | jqn 'get("Parameters") | entries | map(x => x[0] + "=" + x[1]) | join(" ")')
admin-dashboard-godwoken-mainnet:
	sam deploy --template-file ../template.yml --stack-name $(STACK_NAME) --capabilities $(CAPABILITIES)  --region $(REGION) --parameter-overrides $(PARAMETERS)

admin-dashboard-godwoken-testnet: export STACK_NAME=admin-dashboard-godwoken-testnet
admin-dashboard-godwoken-testnet: export PARAMETERS_FILE=${STACK_NAME}.json
admin-dashboard-godwoken-testnet: export PARAMETERS=$(shell cat $(PARAMETERS_FILE) | jqn 'get("Parameters") | entries | map(x => x[0] + "=" + x[1]) | join(" ")')
admin-dashboard-godwoken-testnet:
	sam deploy --template-file ../template.yml --stack-name $(STACK_NAME) --capabilities $(CAPABILITIES)  --region $(REGION) --parameter-overrides $(PARAMETERS)

admin-dashboard-zksync-testnet: export STACK_NAME=admin-dashboard-zksync-testnet
admin-dashboard-zksync-testnet: export PARAMETERS_FILE=${STACK_NAME}.json
admin-dashboard-zksync-testnet: export PARAMETERS=$(shell cat $(PARAMETERS_FILE) | jqn 'get("Parameters") | entries | map(x => x[0] + "=" + x[1]) | join(" ")')
admin-dashboard-zksync-testnet:
	sam deploy --template-file ../template.yml --stack-name $(STACK_NAME) --capabilities $(CAPABILITIES)  --region $(REGION) --parameter-overrides $(PARAMETERS)


admin-dashboard-mantle-testnet: export STACK_NAME=admin-dashboard-mantle-testnet
admin-dashboard-mantle-testnet: export PARAMETERS_FILE=${STACK_NAME}.json
admin-dashboard-mantle-testnet: export PARAMETERS=$(shell cat $(PARAMETERS_FILE) | jqn 'get("Parameters") | entries | map(x => x[0] + "=" + x[1]) | join(" ")')
admin-dashboard-mantle-testnet:
	sam deploy --template-file ../template.yml --stack-name $(STACK_NAME) --capabilities $(CAPABILITIES)  --region $(REGION) --parameter-overrides $(PARAMETERS)


