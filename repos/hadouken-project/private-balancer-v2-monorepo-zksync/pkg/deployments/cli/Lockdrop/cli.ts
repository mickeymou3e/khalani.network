import prompts from 'prompts';

import { Cli } from '../types';

import createGetterMethodsCli from '../utils/createGetterMethodsCli';
import { createSetterMethodsCli } from '../utils/createSetterMethodsCli';
import abi from '../../../typechain/abi/HadoukenLockdrop.json';
import { finalizePhaseOne } from './finalizePhaseOne';
import { finalizePhaseTwo } from './finalizePhaseTwo';
import { getParticipationRate } from './getParticipationRate';
import { getDeploymentAddressCli } from '../../src/utils';

export const lockdropCli: Cli = async (cliProps) => {
  const { action } = await prompts({
    type: 'select',
    name: 'action',
    message: 'Select action',
    choices: [
      { title: 'getters', value: 'getters' },
      { title: 'setters', value: 'setters' },
      { title: 'Finalize Phase One', value: 'phaseOneFinalization' },
      { title: 'Finalize Phase Two', value: 'phaseTwoFinalization' },
      { title: 'Participation Rate', value: 'participationRate' },
    ],
  });

  switch (action) {
    case 'getters': {
      const { HadoukenLockdrop } = getDeploymentAddressCli(cliProps.environment.network);
      const getterMethodsCli = createGetterMethodsCli(abi);
      await getterMethodsCli(HadoukenLockdrop, cliProps);

      break;
    }
    case 'setters': {
      const { HadoukenLockdrop } = getDeploymentAddressCli(cliProps.environment.network);
      const setterMethodsCli = createSetterMethodsCli(abi);
      await setterMethodsCli(HadoukenLockdrop, cliProps);

      break;
    }
    case 'phaseOneFinalization': {
      await finalizePhaseOne(cliProps.environment);

      break;
    }
    case 'phaseTwoFinalization': {
      await finalizePhaseTwo(cliProps.environment);

      break;
    }
    case 'participationRate': {
      await getParticipationRate(cliProps.environment);

      break;
    }
  }
};
