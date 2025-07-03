# Helm Chart for deploying the Wallet Balance Monitor
Source code of the bot: https://github.com/tvl-labs/wallet-balance-monitor

# Deployment
- Configure [addresses.yaml](.config%2Faddresses.yaml) with a list of addresses, chains and names.
This file will be mounted as a `ConfigMap` into the running bot.
The addresses' names will be used to name the Gauge metrics published to Prometheus.
- Configure [rpc-urls.yaml](.config%2Frpc-urls.yaml) with a list of RPC URLs of the chains specified in the `addresses.yaml`.
This file will be mounted as a `Secret` into the running bot.
- Configure [prometheus-url.yaml](.config%2Fprometheus-url.yaml) with a URL of the Prometheus server, which should be accessible from the pod.
- Run `make install-wallet-balance-monitor`