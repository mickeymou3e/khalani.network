import prompts from 'prompts';

import { Authorizer__factory } from '@balancer-labs/typechain';
import { ethers } from 'ethers';
import { getDeploymentsByRuntimeEnv } from '../../../config/src/deployments';
import { Cli } from '../types';

const AuthorizerCli: Cli = async (cliProps) => {
  const { action } = await prompts({
    type: 'select',
    name: 'action',
    message: 'Select action',
    choices: [{ title: 'grantRoles', value: 'grantRoles' }],
  });

  const config = getDeploymentsByRuntimeEnv(cliProps.environment.network);

  switch (action) {
    case 'grantRoles': {
      const authorizer = Authorizer__factory.connect(config.Authorizer, cliProps.environment.deployer);
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

export default AuthorizerCli;
