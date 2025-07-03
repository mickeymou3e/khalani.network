import prompts from 'prompts';

import { WETH__factory } from '@balancer-labs/typechain';
import { BigNumber } from 'ethers';
import { Cli } from '../types';

const wEthCli: Cli = async (cliProps) => {
  const { action } = await prompts({
    type: 'select',
    name: 'action',
    message: 'Select action',
    choices: [{ title: 'deposit', value: 'deposit' }],
  });

  switch (action) {
    case 'deposit': {
      const wEth = WETH__factory.connect('0x20b28B1e4665FFf290650586ad76E977EAb90c5D', cliProps.environment.deployer);
      const { amount } = await prompts({
        type: 'text',
        name: 'amount',
        message: 'Amount',
      });

      // console.log('amount');

      const result = await wEth.deposit({ value: BigNumber.from(amount) });
      await result.wait();

      break;
    }
  }
};

export default wEthCli;
