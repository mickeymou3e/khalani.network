import { PoolFilter, Sor, SwapOptions, SwapTypes } from "@hadouken-project/sdk";
import { BigNumber } from "ethers";

import { ERC20__factory } from "../../../../src/contracts/godwoken";
import { getConfig } from "../../../config";
import { Cli } from "../../../types";
import { BigNumberToFloat } from "../../../utils";
import { selectAmountCli, selectTokenCli } from "../../utils";

export const querySwapCli: Cli = async ({ environment }) => {
  const config = getConfig(environment.env);
  const addressIn = await selectTokenCli(environment.env, "Select token in");
  const addressOut = await selectTokenCli(environment.env, "Select token out");

  const tokenIn = ERC20__factory.connect(addressIn, environment.deployer);
  const tokenOut = ERC20__factory.connect(addressOut, environment.deployer);

  const tokenInDecimals = await tokenIn.decimals();
  const tokenOutDecimals = await tokenOut.decimals();

  const { bigNumberAmount: amountInBigNumber } = await selectAmountCli(
    tokenInDecimals,
    undefined,
    "Amount in (float amount):"
  );

  const timestampSeconds = Math.floor(Date.now() / 1000);

  const swapOptions: SwapOptions = {
    maxPools: 10,
    gasPrice: BigNumber.from(10).pow(11),
    swapGas: BigNumber.from(10).pow(5),
    poolTypeFilter: PoolFilter.All,
    timestamp: timestampSeconds,
    forceRefresh: false,
  };

  const sor = new Sor({
    network: Number(config.chainId),
    rpcUrl: config.rpcUrl,
    customSubgraphUrl: config.subgraphAddress,
    sor: {
      tokenPriceService: {
        async getNativeAssetPriceInToken(_tokenAddress: string) {
          return "1";
        },
      },
    },
  });

  await sor.fetchPools();

  const res = await sor.getSwaps(
    addressIn,
    addressOut,
    SwapTypes.SwapExactIn,
    amountInBigNumber,
    swapOptions
  );

  console.log("sor result", res);
  console.log(
    "Return amount",
    res.returnAmount.toString(),
    res.returnAmountConsideringFees.toString(),
    BigNumberToFloat(res.returnAmount, tokenOutDecimals)
  );
};
