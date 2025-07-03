import { BigNumber, ethers } from "ethers";
import prompts from "prompts";
import { getConfig } from "../../config";
import { Environments } from "../../types";
import { FloatToBigNumber } from "../../utils";

export const selectTokenCli = async (
  environment: Environments,
  message?: string
): Promise<string> => {
  const config = getConfig(environment);

  const symbols = Object.keys(config.contracts.tokens);
  const { address } = await prompts({
    type: "select",
    name: "address",
    message: message ?? "select token",
    choices: [
      ...symbols.map((symbol) => ({
        value: config.contracts.tokens[symbol].address,
        title: `(${symbol})`,
      })),
    ],
  });

  return address;
};

export const selectAmountCli = async (
  decimals: number,
  limit?: number,
  message?: string,
  init?: number | string
): Promise<{
  amount: number;
  bigNumberAmount: BigNumber;
}> => {
  const { amount } = await prompts({
    type: "text",
    name: "amount",
    message: message ?? `Amount (float amount):`,
    limit: limit,
    initial: init,
  });

  const bigNumberAmount = FloatToBigNumber(amount, decimals);

  return {
    bigNumberAmount,
    amount: Number(amount),
  };
};

export const selectAddressCli = async (message?: string): Promise<string> => {
  const { address } = await prompts({
    type: "text",
    name: "address",
    message: message ?? `Address`,
  });

  if (!ethers.utils.isAddress(address)) {
    throw Error(`${address} is not an address`);
  }

  return address;
};
