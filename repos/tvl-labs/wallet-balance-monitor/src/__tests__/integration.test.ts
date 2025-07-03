import { main } from '../index';
import { walletBalanceGauge } from '../metrics';

describe('Integration test', () => {
  it('parse arguments and monitor balances of addresses', async () => {
    const cliArgs = [
      "--addresses-file",
      "src/__tests__/assets/addresses.json",
      "--rpc-urls-file",
      "src/__tests__/assets/rpc-urls.json",
      "--interval",
      "1"
    ];
    await main(cliArgs);

    const metric = await walletBalanceGauge.get();
    expect(metric.values.length).toBe(2);
    const mainnet = metric.values.find((m) => m.labels.chain === 'mainnet')!;
    expect(mainnet.labels).toStrictEqual({
      chain: "mainnet",
      wallet_name: "example-mainnet",
      wallet_address: "0x2a3a3c823adf8a55ee012ffbdffdc1ff03235a8b"
    });
    expect(mainnet.value).toBeGreaterThan(0);

    const goerli = metric.values.find((m) => m.labels.chain === 'goerli')!;
    expect(goerli.labels).toStrictEqual({
      chain: "goerli",
      wallet_name: "example-goerli",
      wallet_address: "0xc55f47caBBda19cA5907710D553596e62598f534"
    });
    expect(goerli.value).toBeGreaterThan(0);
  });
});