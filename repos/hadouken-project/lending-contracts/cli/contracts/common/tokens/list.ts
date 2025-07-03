import { ScriptRunEnvironment } from '@src/types';
import { getContractsConfigInstant } from '@src/utils';

export const list = async (environment: ScriptRunEnvironment) => {
  const config = getContractsConfigInstant(environment.chainId, environment.env, true);

  if (config) {
    Object.keys(config.tokens).map((symbol) => {
      const erc20Address = config.tokens[symbol].address;
      console.log(erc20Address, `(${symbol})`);
    });
  }
};
