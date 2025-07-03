import { main } from "../index";
import { walletBalanceGauge } from "../metrics";

describe("Integration test", () => {
  it("parse arguments and monitor balances of addresses", async () => {
    const cliArgs = [
      "--addresses-file",
      "src/__tests__/assets/addresses.json",
      "--rpc-urls-file",
      "src/__tests__/assets/rpc-urls.json",
      "--interval",
      "1",
    ];
    await main(cliArgs);

    const metric = await walletBalanceGauge.get();
    expect(metric.values.length).toBe(8);
    const mainnet = metric.values.find((m) => m.labels.chain === "MUMBAI")!;
    expect(mainnet.labels).toStrictEqual({
      chain: "MUMBAI",
      wallet_name: "relayer-mumbai",
      wallet_address: "0x988c0cdaffaf785eb4fc6c183317e147560da4e6",
    });
    expect(mainnet.value).toBeGreaterThan(0);

    const goerli = metric.values.find((m) => m.labels.chain === "SEPOLIA")!;
    expect(goerli.labels).toStrictEqual({
      chain: "SEPOLIA",
      wallet_name: "relayer-sepolia",
      wallet_address: "0x509409230b3e1c1b335d5e1c77cea7a594174db5",
    });
    expect(goerli.value).toBeGreaterThan(0);
  });
});
