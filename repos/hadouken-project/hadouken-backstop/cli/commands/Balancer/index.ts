import prompts from "prompts";
import { BalancerActions, Cli } from "../../types";
import { checkInternalBalanceCli } from "./checkInternalBalance/checkInternalBalance";
import { getPoolTokensCli } from "./getPoolTokens/getPoolTokens";
import { queryExitCli } from "./queryExit/queryExit";
import { queryJoinCli } from "./queryJoin/queryJoin";
import { querySwapCli } from "./querySwap/querySwap";

export const BalancerCli: Cli = async ({ environment, parentCli }) => {
  const { action } = await prompts(
    {
      type: "select",
      name: "action",
      message: "Select Balancer action",
      choices: [
        {
          title: "check internal balances",
          value: BalancerActions.checkInternalBalances,
        },
        {
          title: "Get pool tokens",
          value: BalancerActions.getPoolTokens,
        },
        { title: "query swap", value: BalancerActions.querySwap },
        { title: "query join", value: BalancerActions.queryJoin },
        { title: "query exit", value: BalancerActions.queryExit },
      ],
    },
    {
      onCancel: () => {
        return parentCli ? parentCli({ environment }) : process.exit(0);
      },
    }
  );
  try {
    switch (action) {
      case BalancerActions.checkInternalBalances:
        await checkInternalBalanceCli({ environment, parentCli });
        break;
      case BalancerActions.getPoolTokens:
        await getPoolTokensCli({ environment, parentCli });
        break;
      case BalancerActions.querySwap:
        await querySwapCli({ environment, parentCli });
        break;
      case BalancerActions.queryJoin:
        await queryJoinCli({ environment, parentCli });
        break;
      case BalancerActions.queryExit:
        await queryExitCli({ environment, parentCli });
        break;
    }
  } catch (e) {
    console.error(e);
    return BalancerCli({ environment, parentCli });
  }
};
