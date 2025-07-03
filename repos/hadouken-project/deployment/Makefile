TVL_ID=803035318642

ACCOUNT_ID=$(shell aws sts get-caller-identity | jqn 'get("Account")')

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

.PHONY: landing-testnet
landing-testnet: check-aws-account-id-env
	make -f testnet/Makefile landing-testnet

.PHONY: landing-mainnet
landing-mainnet: check-aws-account-id-env
	make -f mainnet/Makefile landing

.PHONY: swap-v0-mainnet
swap-v0-mainnet: check-aws-account-id-env
swap-v0-mainnet:
	make -f mainnet/Makefile swap-v0

.PHONY: swap-v1-beta-mainnet
swap-v1-beta-mainnet: check-aws-account-id-env
	make -f mainnet/Makefile swap-v1-beta

.PHONY: admin-dashboard-mainnet
admin-dashboard-mainnet: check-aws-account-id-env
	make -f mainnet/Makefile admin-dashboard

.PHONY: applications-mainnet
applications-mainnet: check-aws-account-id-env
	make -f mainnet/Makefile applications

.PHONY: applications-testnet
applications-testnet: check-aws-account-id-env
	make -f testnet/Makefile applications-testnet
