# This Makefile contains useful commands to deploy Prometheus stack to Kubernetes
# using Helm charts defined at https://github.com/prometheus-community/helm-charts.

# Adds a repo of the Prometheus community Helm charts.
add-helm-repo:
	helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
	helm repo update

# Create a Secret named "alertmanager-config" having the only key "alertmanager.yaml" used to configure the Alertmanager.
# It loads the secret value for Discord's channel "alerts" from AWS Secrets Manager object "tvl/discord/alerts-web-hook-url" (TVL_DISCORD_ALERTS_WEB_HOOK_URL).
# This secret is referenced in the Alertmanager configuration of the prometheus-stack.
install-alertmanager-config-secret:
	discordWebHookUrl=$$(aws secretsmanager get-secret-value --secret-id tvl/discord/alerts-web-hook-url | jq -r .SecretString | jq -r .TVL_DISCORD_ALERTS_WEB_HOOK_URL); \
	discordConfigFile=$$(mktemp); \
	sed 's|https://discord.com/api/webhooks/<WEB_HOOK>/<WEB_HOOK>|'$$discordWebHookUrl'|' .config/alertmanager-config.yaml > $$discordConfigFile; \
	kubectl create secret generic alertmanager-config --namespace=monitoring --from-file=alertmanager.yaml=$$discordConfigFile --from-file=templates.tmpl=.config/alertmanager-templates.tmpl ;

# Recreate the "alertmanager-config" secret.
upgrade-alertmanager-config-secret:
	kubectl delete secret alertmanager-config --namespace=monitoring
	$(MAKE) install-alertmanager-config-secret

# Install kube-prometheus-stack https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack
# disable Kubernetes nodes exporter.
install-prometheus-stack: add-helm-repo install-alertmanager-config-secret
	helm install prometheus-stack prometheus-community/kube-prometheus-stack --version 45.26.0 --namespace monitoring --values .config/prometheus-stack-values.yaml

uninstall-prometheus-stack:
	helm uninstall prometheus-stack --namespace monitoring

# Update the deployed `prometheus-stack` Helm chart.
# Before running this command update the values specified in the `.config/prometheus-stack-values.yaml`.
upgrade-prometheus-stack: upgrade-alertmanager-config-secret
	helm upgrade prometheus-stack prometheus-community/kube-prometheus-stack --version 45.26.0 --namespace monitoring --values .config/prometheus-stack-values.yaml

# Install Prometheus Pushgateway https://github.com/prometheus-community/helm-charts/tree/main/charts/prometheus-pushgateway
# and make it automatically discoverable by Prometheus Operator.
install-prometheus-pushgateway: add-helm-repo
	helm install prometheus-stack-pushgateway prometheus-community/prometheus-pushgateway --version 2.1.3 --namespace monitoring --values .config/prometheus-pushgateway-values.yaml

# Update the deployed `prometheus-pushgateway` Helm chart.
# Before running this command update the values specified in the `.config/prometheus-pushgateway-values.yaml`.
upgrade-prometheus-pushgateway: add-helm-repo
	helm upgrade prometheus-stack-pushgateway prometheus-community/prometheus-pushgateway --version 2.1.3 --namespace monitoring --values .config/prometheus-pushgateway-values.yaml

uninstall-prometheus-pushgateway:
	helm uninstall prometheus-stack-pushgateway --namespace monitoring