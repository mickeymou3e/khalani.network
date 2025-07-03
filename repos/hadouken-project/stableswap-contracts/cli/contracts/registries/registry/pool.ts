import prompts from 'prompts';

import { ScriptRunEnvironment } from '../../../types';
import { removePool } from '../../../../scripts/godwoken/registry/methods/registry/removePool';

export const registryPoolCli = async (registry: string, pool: string, {
    wallet,
    transactionOverrides,
}: ScriptRunEnvironment) => {
  const { action } = await prompts({
      type: 'select',
      name: 'action',
      message: 'Select action',
      choices: [
          { value: 'remove', title: 'remove' }
      ],
  });

  switch(action) {
    case 'remove':
        await removePool(pool, registry, wallet, transactionOverrides)
        break;
    default:
        console.log('action')
        break;
  }
}
