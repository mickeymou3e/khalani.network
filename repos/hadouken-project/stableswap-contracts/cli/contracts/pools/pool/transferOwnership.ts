import fs from 'fs';
import prompts from 'prompts';
import { POOLS_CONTRACTS_DIR } from '../../../../scripts/godwoken/pools/constants';

import { transferOwnershipAll as transferOwnershipAllScript } from '../../../../scripts/godwoken/pools/batch.godwoken'
import { transferOwnership as transferOwnershipScript } from '../../../../scripts/godwoken/pools/methods/transferOwnership'

import { ScriptRunEnvironment } from '../../../types';

export const transferOwnership = async (poolName: string, {
    network,
    address: walletAddress,
    wallet,
    provider,
    transactionOverrides,
}: ScriptRunEnvironment) => {
  console.log('walletAddress', walletAddress)
  const { newAdminAddress } = await prompts({
    type: 'text',
    name: 'newAdminAddress',
    message: 'Type new admin address',
  });

  switch(poolName) {
      case 'all':
          await transferOwnershipAllScript(
            newAdminAddress,
            network,
            wallet,
            transactionOverrides
          )
          break
      default: {
          await transferOwnershipScript(poolName, newAdminAddress, network, wallet, transactionOverrides)
      }
  }
}