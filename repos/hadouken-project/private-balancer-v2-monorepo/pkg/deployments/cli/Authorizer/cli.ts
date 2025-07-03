import prompts from 'prompts';

import { Authorizer__factory } from '@hadouken-project/typechain';
import { ethers } from 'ethers';
import { Cli } from '../types';
import { getDeploymentsAddresses } from '../config.command';

export const authorizerCli: Cli = async (cliProps) => {
  const { action } = await prompts({
    type: 'select',
    name: 'action',
    message: 'Select action',
    choices: [{ title: 'grantRoles', value: 'grantRoles' }],
  });

  const { Authorizer } = getDeploymentsAddresses(cliProps.environment.network);

  switch (action) {
    case 'grantRoles': {
      const authorizer = Authorizer__factory.connect(Authorizer, cliProps.environment.deployer);
      const { actionIds } = await prompts({
        type: 'list',
        name: 'actionIds',
        message: 'Give action ids (put "," between)  ',
      });

      console.log('actionIds', actionIds);

      const { address } = await prompts({
        type: 'text',
        name: 'address',
        message: 'Give address of element that will grant permission',
      });

      if (!ethers.utils.isAddress(address)) {
        throw Error('wrong address');
      }

      const transaction = await authorizer.grantRoles(actionIds, address);

      await transaction.wait();

      break;
    }
  }
};
