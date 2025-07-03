deploy: deploy-secrets

deploy-secrets: deploy-secrets-to-hyperlane deploy-secrets-to-monitoring deploy-secrets-to-applications

deploy-secrets-to-hyperlane:
	helm -n hyperlane-trial install universal-secrets ./secrets

deploy-secrets-to-monitoring:
	helm -n monitoring install universal-secrets ./secrets

deploy-secrets-to-applications:
	helm -n applications install universal-secrets ./secrets

uninstall-secrets:
	helm uninstall universal-secrets -n applications
	helm uninstall universal-secrets -n hyperlane
	helm uninstall universal-secrets -n monitoring

upgrade-secrets:
	helm upgrade universal-secrets ./secrets -n applications
	helm upgrade universal-secrets ./secrets -n hyperlane
	helm upgrade universal-secrets ./secrets -n monitoring
	