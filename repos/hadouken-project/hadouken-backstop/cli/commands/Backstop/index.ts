import prompts from "prompts";

import { BackstopActions, Cli } from "../../types";
import { withdrawCli } from "../withdraw/withdraw";

import { canLiquidateCli } from "./canLiquidate/canLiquidate";
import { depositCli } from "./deposit/deposit";
import { getLiquidationCli } from "./getLiquidation/getLiquidation";
import { getLiquidationParamsCli } from "./getLiquidationParams/getLiquidationParams";
import { getOwnerCli } from "./getOwner/getOwner";
import { liquidateCli } from "./liquidate/liquidate";
import { setLiquidationCli } from "./setLiquidation/setLiquidation";
import { setOwnerCli } from "./setOwner/setOwner";

export const BackstopCli: Cli = async ({ environment, parentCli }) => {
  try {
    const { action } = await prompts(
      {
        type: "select",
        name: "action",
        message: "Select BAMM action",
        choices: [
          { title: "deposit", value: BackstopActions.deposit },
          { title: "withdraw", value: BackstopActions.withdraw },
          { title: "canLiquidate", value: BackstopActions.canLiquidate },
          { title: "liquidate", value: BackstopActions.liquidate },
          { title: "setLiquidation", value: BackstopActions.setLiquidation },
          { title: "getLiquidation", value: BackstopActions.getLiquidation },
          { title: "getOwner", value: BackstopActions.getOwner },
          { title: "setOwner", value: BackstopActions.setOwner },
          {
            title: "getLiquidationParams",
            value: BackstopActions.getLiquidationParams,
          },
        ],
      },
      {
        onCancel: () => {
          return parentCli ? parentCli({ environment }) : process.exit(0);
        },
      }
    );

    switch (action) {
      case BackstopActions.deposit:
        await depositCli({ environment, parentCli });
        break;
      case BackstopActions.withdraw:
        await withdrawCli({ environment, parentCli });
        break;
      case BackstopActions.canLiquidate:
        await canLiquidateCli({ environment, parentCli });
        break;
      case BackstopActions.liquidate:
        await liquidateCli({ environment, parentCli });
        break;
      case BackstopActions.setLiquidation:
        await setLiquidationCli({ environment, parentCli });
        break;
      case BackstopActions.getLiquidation:
        await getLiquidationCli({ environment, parentCli });
        break;
      case BackstopActions.getOwner:
        await getOwnerCli({ environment, parentCli });
        break;
      case BackstopActions.setOwner:
        await setOwnerCli({ environment, parentCli });
        break;

      case BackstopActions.getLiquidationParams:
        await getLiquidationParamsCli({ environment, parentCli });
        break;
    }
  } catch (e) {
    console.error(e);
  }

  return BackstopCli({ environment, parentCli });
};
