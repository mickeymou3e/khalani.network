import { defaultAbiCoder } from "ethers/lib/utils";
import prompts from "prompts";

import {
  IBalancerHelpers__factory,
  IBasePool__factory,
  IVault__factory,
} from "../../../../src/contracts/godwoken";
import { getConfig, getContractsConfig } from "../../../config";
import { Cli } from "../../../types";
import { BigNumberToFloat } from "../../../utils";
import { selectAmountCli } from "../../utils";

export const queryExitCli: Cli = async ({ environment }) => {
  const config = getConfig(environment.env);
  const contracts = getContractsConfig(environment.env);

  const pool = IBasePool__factory.connect(
    config.contracts.swap.triCryptoPool,
    environment.deployer
  );

  const vault = IVault__factory.connect(
    config.contracts.swap.vault,
    environment.deployer
  );

  const poolId = await pool.getPoolId();

  const tokensOrder = await vault.getPoolTokens(poolId);

  const tokens = ["LinearCkb", "LinearEth", "BoostedUSD"];

  const tokensWithOrder = [
    ...tokens
      .map((symbol) => ({
        value: config.contracts.tokens[symbol].address,
        title: `(${symbol})`,
      }))
      .sort((tokenA, tokenB) => {
        const tokenIndexA = tokensOrder.tokens
          .map((token) => token.toLowerCase())
          .indexOf(tokenA.value);

        const tokenIndexB = tokensOrder.tokens
          .map((token) => token.toLowerCase())
          .indexOf(tokenB.value);

        if (tokenIndexA > tokenIndexB) return 1;
        else if (tokenIndexA < tokenIndexB) return -1;

        return 0;
      }),
  ];

  const { address } = await prompts({
    type: "select",
    name: "address",
    message: "select token to exit with (Linear pool token)",
    choices: tokensWithOrder,
  });

  const tokWithOrder = tokensWithOrder.find((token) => token.value === address);

  if (!tokWithOrder) throw Error("tokWithOrder not found");

  const exitIndex = tokensWithOrder.indexOf(tokWithOrder);

  const { bigNumberAmount } = await selectAmountCli(
    18,
    undefined,
    "TriCrypto token amount"
  );

  const balancerHelper = IBalancerHelpers__factory.connect(
    config.contracts.swap.balancerHelpers,
    environment.deployer
  );

  const data = defaultAbiCoder.encode(
    ["uint256", "uint256", "uint256"],
    [0, bigNumberAmount, exitIndex]
  );

  const exitResult = await balancerHelper.callStatic.queryExit(
    poolId,
    contracts.backstop,
    contracts.backstop,
    {
      assets: tokensOrder.tokens,
      minAmountsOut: tokensOrder.tokens.map((_token) => 0),
      toInternalBalance: false,
      userData: data,
    }
  );

  console.log("result in tokens", BigNumberToFloat(exitResult.bptIn, 18));
  console.log(
    "result outTokens",
    exitResult.amountsOut.map((amount) => BigNumberToFloat(amount, 18))
  );
};
