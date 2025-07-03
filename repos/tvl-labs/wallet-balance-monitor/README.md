# wallet-balance-monitor
Wallet Balance Monitor is a simple background bot that monitors ETH balance of a list of wallets on multiple chains, 
and pushes the current balances to a [Prometheus Pushgateway](https://prometheus.io/docs/instrumenting/pushing/) metrics relayer,
which is being scraped by the main Prometheus server.

An [alternative approach](https://prometheus.io/docs/practices/pushing/#should-i-be-using-the-pushgateway) to Prometheus Pushgateway 
would be to set up an HTTP endpoint on the bot service that would be scraped by a regular Prometheus job.
This is slightly different in configuration — the bot will need to be discoverable by the Prometheus service.
We may consider it later, if we find configuration of the Pushgateway complicated. 

## Input
#### `--addresses-file`
Path to a JSON file containing `{ addresses: { name, chain, address }[] }` objects for each address to monitor balance for.
- `name` is used for naming the Prometheus balance metrics
- `chain` is name of the chain,
- `address` is a 0x encoded ETH address
```
{
  "addresses": [
    {
      "name": "relayer-goerli",
      "chain": "goerli",
      "address": "0x4cCBCD42BA51E4CD96Dd91A54DfACFBa9b27BE34"
    }
  ]
}
```

#### `--rpc-urls-file`
Path to a JSON file containing `{ rpcUrls: { chain, url }[] }` objects for each chain.
- `chain` is the chain name, there must be a chain RPC defined for each address.
- `url` is an HTTPS URL to RPC provided node
```
{
  "rpcUrls": [
    {
      "chain": "goerli",
      "url": "https://goerli.infura.io/v3/abcdefg"
    }
  ]
}
```

#### `interval`
Interval in seconds how often to monitor the balances

#### `--prometheus-pushgateway-url`
[Prometheus Pushgateway](https://prometheus.io/docs/instrumenting/pushing/) HTTP URL to push metrics to, for example `http://prometheus-stack-pushgateway-prometheus-pushgateway.monitoring.svc.cluster.local:9091`.

### Implementation
For each specified chain address periodically (once per `interval` seconds) request the ETH balance using the Web3.js [getBalance](https://web3js.readthedocs.io/en/v1.8.2/web3-eth.html#getbalance).

Build Prometheus Gauge metric object with a predefined name (`${name}-${chain}-balance`) and the current balance (in ETH) and push to Prometheus server specified with `--prometheus-url`.
