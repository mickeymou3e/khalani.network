import prompts from "prompts";

import { Cli, Contract } from "../types";

import { BackstopCli } from "./Backstop";
import { BalancerCli } from "./Balancer";

export const contractsCli: Cli = async ({ environment }): Promise<void> => {
  const { contract } = await prompts(
    {
      type: "select",
      name: "contract",
      message: "Select contract",
      choices: [
        { title: "Backstop", value: Contract.Backstop },
        { title: "Balancer", value: Contract.Balancer },
      ],
    },
    {
      onCancel: () => {
        process.exit(0);
      },
    }
  );
  try {
    switch (contract) {
      case Contract.Backstop:
        await BackstopCli({ environment, parentCli: contractsCli });
        break;
      case Contract.Balancer:
        await BalancerCli({ environment, parentCli: contractsCli });
        break;
    }
  } catch (e) {}

  return contractsCli({ environment });
};
