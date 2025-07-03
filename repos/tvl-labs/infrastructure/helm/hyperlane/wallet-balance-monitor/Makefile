# Development only: handy command to display the values and k8s objects without deploying them.
preview-wallet-balance-monitor:
	helm install --debug --dry-run -n monitoring wallet-balance-monitor --values .config/addresses.yaml --values .config/rpc-urls.yaml --values .config/prometheus-pushgateway-url.yaml .

# Command to deploy the wallet balance monitor.
# Change the following files for your needs:
# 1) `.config/addresses.yaml` — addresses and corresponding chains to be monitored (mounted as `ConfigMap`)
# 2) `.config/rpc-urls.yaml` — RPC URLs of chains
# 3) `.config/prometheus-pushgateway-url.yaml` — URL of the Prometheus Pushgateway.
install-wallet-balance-monitor:
	helm install wallet-balance-monitor -n monitoring --values .config/addresses.yaml --values .config/rpc-urls.yaml --values .config/prometheus-pushgateway-url.yaml .

upgrade-wallet-balance-monitor:
	helm upgrade wallet-balance-monitor -n monitoring --values .config/addresses.yaml --values .config/rpc-urls.yaml --values .config/prometheus-pushgateway-url.yaml .

# Command to uninstall the wallet balance monitor.
uninstall-wallet-balance-monitor:
	helm uninstall wallet-balance-monitor -n monitoring