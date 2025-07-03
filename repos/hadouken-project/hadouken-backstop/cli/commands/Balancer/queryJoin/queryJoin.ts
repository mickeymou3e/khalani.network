import { BigNumber } from "ethers";
import { defaultAbiCoder } from "ethers/lib/utils";
import prompts from "prompts";

import {
  ERC20__factory,
  IBalancerHelpers__factory,
  IBasePool__factory,
  IVault__factory,
} from "../../../../src/contracts/godwoken";
import { getConfig, getContractsConfig } from "../../../config";
import { Cli } from "../../../types";
import { BigNumberToFloat } from "../../../utils";
import { selectAmountCli } from "../../utils";

export const queryJoinCli: Cli = async ({ environment }) => {
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
        if (Number(tokenA.value) > Number(tokenB.value)) return 1;
        else if (Number(tokenA.value) < Number(tokenB.value)) return -1;

        return 0;
      }),
  ];

  const { joinTokenAddress } = await prompts({
    type: "select",
    name: "joinTokenAddress",
    message: "select token to join with (Linear pool token)",
    choices: tokensWithOrder,
  });

  const joinTokenDecimals = await ERC20__factory.connect(
    joinTokenAddress,
    environment.deployer
  ).decimals();

  const tokWithOrder = tokensWithOrder.find(
    (token) => token.value === joinTokenAddress
  );

  if (!tokWithOrder) throw Error("tokWithOrder not found");

  const { bigNumberAmount: jointAmount } = await selectAmountCli(
    joinTokenDecimals,
    undefined,
    `${tokWithOrder.title} token amount`
  );

  const balancerHelper = IBalancerHelpers__factory.connect(
    config.contracts.swap.balancerHelpers,
    environment.deployer
  );

  const joinAmounts = tokensWithOrder.map((token) => {
    if (token.value === joinTokenAddress) {
      return jointAmount;
    }

    return BigNumber.from(0);
  });

  const data = defaultAbiCoder.encode(
    ["uint256", "uint256[]", "uint256"],
    [1, joinAmounts, 0]
  );

  const joinResult = await balancerHelper.callStatic.queryJoin(
    poolId,
    contracts.backstop,
    contracts.backstop,
    {
      assets: tokensWithOrder.map((token) => token.value),
      maxAmountsIn: joinAmounts,
      userData: data,
      fromInternalBalance: false,
    }
  );

  console.log("Join result, bptOut", BigNumberToFloat(joinResult.bptOut, 18));
  console.log(
    "Join result, amountsIn",
    joinResult.amountsIn.map((amount) => amount.toString())
  );
};
