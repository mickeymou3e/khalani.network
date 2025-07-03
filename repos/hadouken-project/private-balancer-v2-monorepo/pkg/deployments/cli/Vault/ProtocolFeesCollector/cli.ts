import prompts from 'prompts';

import { CliProps } from '../../types';
import createGetterMethodsCli from '../../utils/createGetterMethodsCli';

import { ProtocolFeesCollector__factory } from '@hadouken-project/typechain';

const protocolFeesCollectorCli = async (protocolFeesCollectorAddress: string, cliProps: CliProps): Promise<void> => {
  const { action } = await prompts({
    type: 'select',
    name: 'action',
    message: 'Select action',
    choices: [{ title: 'getter methods', value: 'getters' }],
  });

  switch (action) {
    case 'getters': {
      const getterMethodsCli = createGetterMethodsCli(ProtocolFeesCollector__factory.abi);
      await getterMethodsCli(protocolFeesCollectorAddress, cliProps);

      break;
    }
  }
};

export default protocolFeesCollectorCli;
