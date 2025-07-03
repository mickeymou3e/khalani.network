import { BigNumber } from 'ethers';
import prompts from 'prompts';

import { connectToContractsRuntime } from '@scripts/connect';
import { ScriptRunEnvironment } from '@src/types';
import { getContractsConfigInstant } from '@src/utils';

const transferNativeScript = async (
  amount: BigNumber,
  to: string,
  environment: ScriptRunEnvironment
) => {
  const {
    deployer,
    transactionOverrides: { gasLimit, gasPrice },
  } = environment;

  const tx = {
    from: deployer.address,
    to,
    value: amount.mul(BigNumber.from(10).pow(18)),
    gasLimit: gasLimit,
    gasPrice: gasPrice,
  };

  const receipt = await deployer.sendTransaction(tx);
  await receipt.wait();
  console.log(`send ${amount.toString()} CKB from ${deployer.address} to ${to}`);
};

export const transferCli = async (environment: ScriptRunEnvironment) => {
  const { env, chainId } = environment;
  const config = getContractsConfigInstant(chainId, env, true);

  if (config) {
    const erc20Indexed = Object.keys(config.tokens).map((symbol, index) => ({
      symbol,
      address: config.tokens[symbol].address,
      index,
    }));

    const { index } = await prompts({
      type: 'select',
      name: 'index',
      message: 'Select deploy',
      choices: [
        ...erc20Indexed.map(({ index, ...erc20 }) => ({
          value: index,
          title: `${erc20.address} (${erc20.symbol})`,
        })),
        { value: 'native', title: 'native' },
      ],
    });

    switch (index) {
      case 'native': {
        const { value } = await prompts({
          type: 'number',
          name: 'value',
          message: 'Type amount',
        });
        const { to } = await prompts({
          type: 'text',
          name: 'to',
          message: 'Type receiver address',
        });
        await transferNativeScript(BigNumber.from(value), to, environment);
        break;
      }
      default: {
        const erc = connectToContractsRuntime(environment).token(erc20Indexed[index].address);
        const userBalance = await erc.balanceOf(environment.address);

        const { value } = await prompts({
          type: 'number',
          name: 'value',
          message: `Type amount (MAX: ${userBalance})`,
        });
        const { to } = await prompts({
          type: 'text',
          name: 'to',
          message: 'Type receiver address',
        });

        const transaction = await erc.transfer(to, BigNumber.from(value));
        await transaction.wait();
      }
    }
  }
};
