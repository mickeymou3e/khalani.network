import yargs from "yargs";
import { AddressesConfig, RpcUrlsConfig } from "./config";
import { error, log } from "./log";
import { getEthBalance } from "./eth";
import { EPromiseFulfilledStatus, IBalances } from "./types";

import { pushPrometheusMetricsViaPushgateway } from "./pushgateway";
import {
  JOB_NAME,
  walletBalanceGauge,
  walletBalanceMonitorMetricsRegister,
} from "./metrics";
import { sendFunds, ChainId } from "@tvl-labs/fund-wallet-script";
import dotenv from "dotenv";

dotenv.config();

export async function main(cliArgs: string[]) {
  const args = await yargs(cliArgs)
    .config(
      "addresses-file",
      "Path to a JSON file containing { addresses: { name, chain, address }[] } objects for each address to monitor balance for. `name` is used for naming the Prometheus balance metrics, `chain` is name of the chain, and `address` is a 0x encoded ETH address"
    )
    .demandOption("addresses-file")

    .config(
      "rpc-urls-file",
      "Path to a JSON file containing { rpcUrls: { chain, url }[] } objects for each chain. `chain` is the chain name, there must be a chain RPC defined for each address. `url` is an HTTPS URL to RPC provided node"
    )
    .demandOption("rpc-urls-file")

    .number("interval")
    .describe(
      "interval",
      "Interval in seconds how often to monitor the balances"
    )
    .demandOption("interval")

    .number("minimum-balance")
    .describe(
      "minimum-balance",
      "minimum balance that needs to be maintained on each monitored wallet"
    )
    .demandOption("minimum-balance")

    .string("prometheus-pushgateway-url")
    .describe(
      "prometheus-pushgateway-url",
      "Prometheus Pushgateway HTTP URL to push metrics to, for example http://prometheus-stack-pushgateway-prometheus-pushgateway.monitoring.svc.cluster.local:9091"
    ).argv;

  const addressesConfig = args as unknown as AddressesConfig;
  const rpcConfig = args as unknown as RpcUrlsConfig;
  const interval = args.interval;
  const prometheusPushgatewayUrl = args.prometheusPushgatewayUrl;
  const minimumBalance = args.minimumBalance;

  const undefinedChains = addressesConfig.addresses
    .map(({ chain }) => chain)
    .filter(
      (chain) =>
        !rpcConfig.rpcUrls.some(({ chain: chainName }) => chain === chainName)
    );
  if (undefinedChains.length) {
    throw new Error(
      `Some chains mentioned in addresses are not defined in RPC URLs: ${undefinedChains.join(
        ", "
      )}`
    );
  }

  log(
    `Will be monitoring the following addresses ${addressesConfig.addresses
      .map(({ chain, address }) => `${chain}:${address}`)
      .join(", ")}`
  );

  if (!prometheusPushgatewayUrl) {
    log(
      "Prometheus Pushgateway is not specified, we will be only logging balances to stdout"
    );
  }

  const job = async () => {
    const balances = await fetchBalancesAndUpdateGauges(
      addressesConfig,
      rpcConfig
    );
    if (prometheusPushgatewayUrl) {
      pushPrometheusMetricsViaPushgateway(
        walletBalanceMonitorMetricsRegister,
        prometheusPushgatewayUrl,
        JOB_NAME
      )
        .then(() => log("Prometheus metrics have been pushed"))
        .catch((e) => error(`Failed to push Prometheus metrics`, e));
    }
    handleSendFunds(balances, minimumBalance);
  };

  if (process.env.NODE_ENV === "test") {
    await job();
  } else {
    setInterval(job, interval * 1000);
  }
}

async function fetchBalancesAndUpdateGauges(
  addressesConfig: AddressesConfig,
  rpcConfig: RpcUrlsConfig
): Promise<PromiseSettledResult<IBalances>[]> {
  const promises = [];
  for (const { name, chain, address } of addressesConfig.addresses) {
    const rpcUrl = rpcConfig.rpcUrls.find(
      ({ chain: chainName }) => chainName === chain
    )?.url!;
    const promise = fetchBalanceAndUpdateGauge(
      chain,
      rpcUrl,
      name,
      address
    ).catch((e) => {
      throw {
        message: `Monitor for ${name} (${address}) on chain ${chain} has failed`,
        e,
      };
    });

    promises.push(promise);
  }
  const balances = await Promise.allSettled(promises);
  return balances;
}

async function fetchBalanceAndUpdateGauge(
  chain: ChainId,
  rpcUrl: string,
  name: string,
  address: string
): Promise<IBalances> {
  const balanceEth = await getEthBalance(address, rpcUrl);
  log(
    `Balance of wallet '${name}' (${address}) on chain '${chain}' is ${balanceEth} ETH`
  );
  walletBalanceGauge
    .labels({
      chain,
      wallet_name: name,
      wallet_address: address,
    })
    .set(balanceEth);
  return { address, chain, balance: balanceEth, rpcUrl };
}

async function handleSendFunds(
  balances: PromiseSettledResult<IBalances>[],
  minimumBalance: number
) {
  const awsRegion = process.env.AWS_REGION as string;
  const kmsKeyId = process.env.AWS_KMS_KEY_ID as string;
  const amount = parseFloat(process.env.FUNDED_AMOUNT as string);

  balances.map(async (result) => {
    if (result.status === EPromiseFulfilledStatus.FULFILLED) {
      const { chain, address, balance, rpcUrl } = result.value;
      if (balance < minimumBalance) {
        log(
          `Account balance is less than ${minimumBalance} ETH, sending funds to ${chain}:${address}`
        );
        await sendFunds(
          address,
          rpcUrl,
          chain,
          awsRegion,
          kmsKeyId,
          amount
        ).catch((e) =>
          error(`Send funds has failed for ${chain}:${address}`, e)
        );
      }
    } else {
      const { message, e } = result.reason;
      error(message, e);
    }
  });
}

if (process.env.NODE_ENV !== "test") {
  main(process.argv.slice(2)).catch((e) => {
    error("Fund monitor has failed", e);
  });
}
