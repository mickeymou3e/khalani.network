create-namespace:
	kubectl create namespace hyperlane-trial

delete-namespace:
	kubectl delete namespace hyperlane-trial

create-config:
	kubectl create configmap config-json --from-file=config.json -n hyperlane-trial

delete-config:
	kubectl delete configmap config-json -n hyperlane-trial

install-khalani-testnet-hyperlane-validators:
	helm -n hyperlane-trial install khalani-hyperlane-validator-0 ./hyperlane-validator --values ./khalani-testnet-validators/validator-values-0.yaml --skip-crds
	# helm -n hyperlane-trial install khalani-hyperlane-validator-1 ./hyperlane-validator --values ./khalani-testnet-validators/validator-values-1.yaml
	# helm -n hyperlane-trial install khalani-hyperlane-validator-2 ./hyperlane-validator --values ./khalani-testnet-validators/validator-values-2.yaml

upgrade-khalani-testnet-hyperlane-validators:
	helm -n hyperlane-trial upgrade khalani-hyperlane-validator-0 ./hyperlane-validator --values ./khalani-testnet-validators/validator-values-0.yaml --skip-crds
	# helm -n hyperlane upgrade khalani-hyperlane-validator-1 ./hyperlane-validator --values ./khalani-testnet-validators/validator-values-1.yaml
	# helm -n hyperlane upgrade khalani-hyperlane-validator-2 ./hyperlane-validator --values ./khalani-testnet-validators/validator-values-2.yaml

install-validators: install-khalani-testnet-hyperlane-validators

upgrade-validators: upgrade-khalani-testnet-hyperlane-validators

uninstall-validators:
	helm -n hyperlane-trial uninstall khalani-hyperlane-validator-0
	# helm -n hyperlane-trial uninstall khalani-hyperlane-validator-1
	# helm -n hyperlane-trial uninstall khalani-hyperlane-validator-2

install-all: create-config install-validators install-relayers

install-relayers:
	helm -n hyperlane-trial install khalani-hyperlane-relayer-khalani-testnet ./hyperlane-relayer --values ./khalani-testnet-relayers/khalani-relayer-values.yaml --skip-crds
	helm -n hyperlane-trial install khalani-hyperlane-relayer-sepolia ./hyperlane-relayer --values ./khalani-testnet-relayers/sepolia-relayer-values.yaml --skip-crds
	helm -n hyperlane-trial install khalani-hyperlane-relayer-fuji ./hyperlane-relayer --values ./khalani-testnet-relayers/fuji-relayer-values.yaml --skip-crds

upgrade-relayers:
	helm -n hyperlane-trial upgrade khalani-hyperlane-relayer-khalani-testnet ./hyperlane-relayer --values ./khalani-testnet-relayers/khalani-relayer-values.yaml
	helm -n hyperlane-trial upgrade khalani-hyperlane-relayer-sepolia ./hyperlane-relayer --values ./khalani-testnet-relayers/sepolia-relayer-values.yaml
	helm -n hyperlane-trial upgrade khalani-hyperlane-relayer-fuji ./hyperlane-relayer --values ./khalani-testnet-relayers/fuji-relayer-values.yaml

uninstall-relayers:
	helm -n hyperlane-trial uninstall khalani-hyperlane-relayer-khalani-testnet
	helm -n hyperlane-trial uninstall khalani-hyperlane-relayer-sepolia
	helm -n hyperlane-trial uninstall khalani-hyperlane-relayer-fuji

uninstall-all: uninstall-validators uninstall-relayers delete-config