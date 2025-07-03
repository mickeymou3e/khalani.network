# Development only: handy command to display the values and k8s objects without deploying them.
preview-funding-bot:
	helm install --debug --dry-run -n applications funding-bot --values .config/addresses.yaml --values .config/rpc-urls.yaml --values .config/prometheus-pushgateway-url.yaml .

# Command to deploy the wallet balance monitor.
# Change the following files for your needs:
# 1) `.config/addresses.yaml` — addresses and corresponding chains to be monitored (mounted as `ConfigMap`)
# 2) `.config/rpc-urls.yaml` — RPC URLs of chains
# 3) `.config/prometheus-pushgateway-url.yaml` — URL of the Prometheus Pushgateway.
install-funding-bot:
	helm install funding-bot -n applications --values .config/addresses.yaml --values .config/rpc-urls.yaml --values .config/prometheus-pushgateway-url.yaml .

upgrade-funding-bot:
	helm upgrade funding-bot -n applications --values .config/addresses.yaml --values .config/rpc-urls.yaml --values .config/prometheus-pushgateway-url.yaml .

# Command to uninstall the wallet balance monitor.
uninstall-funding-bot:
	helm uninstall funding-bot -n applications