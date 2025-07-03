import yargs from 'yargs';
import { AddressesConfig, RpcUrlsConfig } from './config';
import { JOB_NAME, walletBalanceGauge, walletBalanceMonitorMetricsRegister } from './metrics';
import { error, log } from './log';
import { pushPrometheusMetricsViaPushgateway } from './pushgateway';
import { getEthBalance } from './eth';

export async function main(cliArgs: string[]) {
  const args = await yargs(cliArgs)
    .config("addresses-file", 'Path to a JSON file containing { addresses: { name, chain, address }[] } objects for each address to monitor balance for. `name` is used for naming the Prometheus balance metrics, `chain` is name of the chain, and `address` is a 0x encoded ETH address')
    .demandOption("addresses-file")

    .config("rpc-urls-file", 'Path to a JSON file containing { rpcUrls: { chain, url }[] } objects for each chain. `chain` is the chain name, there must be a chain RPC defined for each address. `url` is an HTTPS URL to RPC provided node')
    .demandOption("rpc-urls-file")

    .number("interval")
    .describe("interval", "Interval in seconds how often to monitor the balances")
    .demandOption("interval")

    .string("prometheus-pushgateway-url")
    .describe("prometheus-pushgateway-url", "Prometheus Pushgateway HTTP URL to push metrics to, for example http://prometheus-stack-pushgateway-prometheus-pushgateway.monitoring.svc.cluster.local:9091")
    .argv;

  const addressesConfig = args as unknown as AddressesConfig;
  const rpcConfig = args as unknown as RpcUrlsConfig;
  const interval = args.interval;
  const prometheusPushgatewayUrl = args.prometheusPushgatewayUrl;

  const undefinedChains = addressesConfig.addresses.map(({ chain }) => chain)
    .filter((chain) => !rpcConfig.rpcUrls.some(({ chain: chainName }) => chain === chainName));
  if (undefinedChains.length) {
    throw new Error(`Some chains mentioned in addresses are not defined in RPC URLs: ${undefinedChains.join(", ")}`);
  }

  log(`Will be monitoring the following addresses ${
    addressesConfig.addresses.map(({ name, chain, address }) => `'${name}:${chain}:${address}'`).join(", ")
  }`);

  if (!prometheusPushgatewayUrl) {
    log("Prometheus Pushgateway is not specified, we will be only logging balances to stdout");
  }

  const job = async () => {
    await fetchBalancesAndUpdateGauges(addressesConfig, rpcConfig);

    if (prometheusPushgatewayUrl) {
      pushPrometheusMetricsViaPushgateway(walletBalanceMonitorMetricsRegister, prometheusPushgatewayUrl, JOB_NAME)
        .then(() => log('Prometheus metrics have been pushed'))
        .catch((e) => error(`Failed to push Prometheus metrics`, e));
    }
  };

  if (process.env.NODE_ENV === 'test') {
    await job();
  } else {
    setInterval(job, interval * 1000);
  }
}

async function fetchBalancesAndUpdateGauges(
  addressesConfig: AddressesConfig,
  rpcConfig: RpcUrlsConfig
) {
  const promises = [];
  for (const { name, chain, address } of addressesConfig.addresses) {
    const rpcUrl = rpcConfig.rpcUrls.find(({ chain: chainName }) => chainName === chain)?.url!;
    const promise = fetchBalanceAndUpdateGauge(chain, rpcUrl, name, address)
      .catch((e) => error(`Monitor for ${name} (${address}) on chain ${chain} has failed`, e));
    promises.push(promise);
  }
  await Promise.allSettled(promises);
}

async function fetchBalanceAndUpdateGauge(
  chain: string,
  rpcUrl: string,
  name: string,
  address: string
) {
  const balanceEth = await getEthBalance(address, rpcUrl);
  log(`Balance of wallet '${name}' (${address}) on chain '${chain}' is ${balanceEth} ETH`);
  walletBalanceGauge
    .labels({
      chain,
      wallet_name: name,
      wallet_address: address
    })
    .set(balanceEth);
}

if (process.env.NODE_ENV !== 'test') {
  main(process.argv.slice(2)).catch((e) => {
    error('Fund monitor has failed', e);
  })
}