import prompts from 'prompts';
import { REGISTRY_CONTRACTS_DIR } from '../../../../scripts/godwoken/registry/constants';
import { RegistryDeploymentData } from '../../../../scripts/godwoken/registry/types';

import { getPools as getPoolsScript } from '../../../../scripts/godwoken/registry/methods/registry/getPools'

import { getData, getDeploymentDataPath } from '../../../../scripts/godwoken/utils';

import { ScriptRunEnvironment } from '../../../types';

import { registryPoolCli } from './pool'

export const registryPoolsCli = async ({
    network,
    address: walletAddress,
    provider,
    wallet,
    transactionOverrides,
}: ScriptRunEnvironment) => {
    const registryDeploymentDataPath = getDeploymentDataPath(REGISTRY_CONTRACTS_DIR, network)
    const registryDeploymentData = getData<RegistryDeploymentData>(registryDeploymentDataPath)

    if (registryDeploymentData) {
      const registryAddress = registryDeploymentData.Registry

      const pools = await getPoolsScript(registryAddress, wallet, transactionOverrides)

      const { address: poolAddress } = await prompts({
          type: 'select',
          name: 'address',
          message: 'Select pool',
          choices: [
              ...(pools.map(({ name, address }) => ({
                  value: address,
                  title: `${address} (${name})`,
              }))),
              { value: 'all', title: 'all' }
          ],
      });


    switch(poolAddress) {
      case 'all':
          console.log('all pools')
          break;
      default:
          await registryPoolCli(registryAddress as string, poolAddress as string, {
            network,
            address: walletAddress,
            provider,
            wallet,
            transactionOverrides,
          })
          break;
    }
  }
}